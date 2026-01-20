import UserRoles from "../../models/user-models/Roles.js";

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
