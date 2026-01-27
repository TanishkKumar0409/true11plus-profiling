import UserPermissions from "../../models/user-models/Permissions.js";
import UserRoles from "../../models/user-models/Roles.js";
import User from "../../models/user-models/UserModel.js";

export const getAllroles = async (req, res) => {
  try {
    const roles = await UserRoles.find();
    return res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. please try again" });
  }
};

export const updateUserPermissions = async (req, res) => {
  try {
    const { objectId } = req.params;
    const { permissions } = req.body;

    await User.findByIdAndUpdate(objectId, { permissions });
    return res.json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. please try again" });
  }
};
export const createPermissions = async (req, res) => {
  try {
    const { title, roles, permissions } = req.body;

    if (
      !title ||
      typeof title !== "string" ||
      !Array.isArray(roles) ||
      roles.length === 0 ||
      !Array.isArray(permissions)
    ) {
      return res.status(400).json({ error: "Missing or invalid fields." });
    }

    const cleanTitle = title.trim().toLowerCase();
    if (!cleanTitle) {
      return res.status(400).json({ error: "Title is required." });
    }

    // Remove empty permission titles + unique by title
    const cleanedPermissions = permissions
      .filter((p) => p?.title && typeof p.title === "string" && p.title.trim() !== "")
      .map((p) => ({
        ...p,
        title: p.title.trim().toLowerCase(),
      }));

    const uniquePermissions = [
      ...new Map(cleanedPermissions.map((p) => [p.title, p])).values(),
    ];

    // Validate roles exist
    const existingRoles = await UserRoles.find({ _id: { $in: roles } }).select("_id");
    if (existingRoles.length !== roles.length) {
      return res.status(404).json({ error: "One or more roles do not exist." });
    }

    // UPSERT: update if exists, otherwise create
    const updated = await UserPermissions.findOneAndUpdate(
      { title: cleanTitle }, // stable match
      {
        $set: {
          title: cleanTitle,
          roles,
          permissions: uniquePermissions,
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Permissions saved successfully.",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong. please try again" });
  }
};
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await UserPermissions.find();
    return res.status(200).json(permissions);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. please try again" });
  }
};
