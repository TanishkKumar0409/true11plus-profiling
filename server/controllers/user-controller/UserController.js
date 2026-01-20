import { UserMainImageMover } from "../../helper/FileMovers/UserFileMover.js";
import UserAssets from "../../models/user-models/UserAssets.js";
import UserLocation from "../../models/user-models/UserLocation.js";
import User from "../../models/user-models/UserModel.js";
import { getUploadedFilePaths, normalizePhone } from "../../utils/Callbacks.js";
import { deleteFile } from "../../utils/FileOperations.js";
import { getDataFromToken } from "../../utils/getDataFromToken.js";
import mongoose from "mongoose";

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const userDoc = await User.findOne({ username });
    const user = userDoc.toObject();

    const location = await UserLocation.findOne({
      userId: user?._id,
    }).lean();
    const userassets = await UserAssets.findOne({ userId: user?._id });

    const finalData = {
      ...user,
      ...(location && {
        address: location.address,
        pincode: location.pincode,
        city: location.city,
        state: location.state,
        country: location.country,
      }),
      ...(userassets && {
        avatar: userassets?.avatar,
        banner: userassets?.banner,
        website: userassets?.website,
      }),
    };

    return res.status(200).json(finalData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. please try again." });
  }
};

export const UserAvatarChange = async (req, res) => {
  try {
    const { userId } = req.params;

    const avatarPaths = await getUploadedFilePaths(req, "avatar");

    if (!avatarPaths || avatarPaths.length === 0) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = await UserAssets.findOneAndUpdate(
      { userId },
      { avatar: avatarPaths },
      { new: true, upsert: true }
    );

    if (user?.avatar?.length > 0)
      user?.avatar.map(async (item) => await deleteFile(`../media/${item}`));

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await UserMainImageMover(req, res, userId, "avatar");

    return res
      .status(200)
      .json({ message: "Profile image updated successfully" });
  } catch (error) {
    console.error("ProfileAvatarChange Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const DeleteUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ error: "UserId is required" });

    const user = await UserAssets.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = await UserAssets.findOneAndUpdate(
      { userId },
      { $unset: { avatar: "" } }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    if (updatedUser)
      user?.avatar.map(async (item) => await deleteFile(`../media/${item}`));

    return res
      .status(200)
      .json({ message: "Your avatar deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UserBannerChange = async (req, res) => {
  try {
    const { userId } = req.params;

    const bannerPaths = await getUploadedFilePaths(req, "banner");

    if (!bannerPaths || bannerPaths.length === 0) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const user = await UserAssets.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = await UserAssets.findOneAndUpdate(
      { userId },
      { banner: bannerPaths },
      { new: true, upsert: true }
    );

    if (user?.banner?.length > 0)
      user?.banner.map(async (item) => await deleteFile(`../media/${item}`));

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await UserMainImageMover(req, res, userId, "banner");

    return res
      .status(200)
      .json({ message: "Profile image updated successfully" });
  } catch (error) {
    console.error("ProfileAvatarChange Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const DeleteUserBanner = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ error: "UserId is required" });

    const user = await UserAssets.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedUser = await UserAssets.findOneAndUpdate(
      { userId },
      { $unset: { banner: "" } }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    if (updatedUser)
      user?.banner.map(async (item) => await deleteFile(`../media/${item}`));

    return res
      .status(200)
      .json({ message: "Your avatar deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ error: "User ID is required." });

    let { name, username, mobile_no, website } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const normalizedMobile = normalizePhone(mobile_no || user.mobile_no);

    if (mobile_no && (await User.findOne({ mobile_no, _id: { $ne: userId } })))
      return res
        .status(400)
        .json({ error: "Mobile is already in use by another user." });

    if (username && (await User.findOne({ username, _id: { $ne: userId } })))
      return res
        .status(400)
        .json({ error: "Username is already in use by another user." });

    const updatedFields = {
      username: username || user.username,
      name: name || user.name,
      mobile_no: normalizedMobile,
    };

    await User.findByIdAndUpdate(userId, { $set: updatedFields });
    await UserAssets.findOneAndUpdate(
      { userId },
      { $set: { website } },
      { upsert: true }
    );

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateUserLocation = async (req, res) => {
  try {
    const { userId, address, pincode, city, state, country } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required." });

    const updatedLocation = await UserLocation.findOneAndUpdate(
      { userId },
      { $set: { address, pincode, city, state, country } },
      { new: true, upsert: true }
    );

    if (!updatedLocation)
      return res
        .status(400)
        .json({ error: "Something Went Wrong. Please Try Again Later" });

    return res
      .status(200)
      .json({ message: "Profile location saved successfully." });
  } catch (error) {
    console.error("Error saving profile location:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRandomUsersWithDetails = async (req, res) => {
  try {
    const limitRaw = Number(req.query.limit);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 10;
    const safeLimit = Math.min(limit, 50);

    const authUserId = await getDataFromToken(req);
    const paramUserId = req.params.userId;

    const excludeIds = [];

    if (mongoose.Types.ObjectId.isValid(authUserId)) {
      excludeIds.push(new mongoose.Types.ObjectId(authUserId));
    }

    if (mongoose.Types.ObjectId.isValid(paramUserId)) {
      excludeIds.push(new mongoose.Types.ObjectId(paramUserId));
    }

    const pipeline = [];

    if (excludeIds.length > 0) {
      pipeline.push({ $match: { _id: { $nin: excludeIds } } });
    }

    pipeline.push(
      { $sample: { size: safeLimit } },
      {
        $project: {
          password: 0,
          __v: 0,
        },
      }
    );

    const users = await User.aggregate(pipeline);

    if (!users?.length) {
      return res.status(200).json([]);
    }

    const userIds = users.map((u) => u._id);

    const locations = await UserLocation.find({ userId: { $in: userIds } })
      .lean()
      .select("userId address pincode city state country");

    const assets = await UserAssets.find({ userId: { $in: userIds } })
      .lean()
      .select("userId avatar banner website");

    const locationMap = new Map(
      locations.map((loc) => [String(loc.userId), loc])
    );

    const assetsMap = new Map(
      assets.map((ast) => [String(ast.userId), ast])
    );

    const finalData = users.map((user) => {
      const loc = locationMap.get(String(user._id));
      const ast = assetsMap.get(String(user._id));

      return {
        ...user,
        ...(loc && {
          address: loc.address,
          pincode: loc.pincode,
          city: loc.city,
          state: loc.state,
          country: loc.country,
        }),
        ...(ast && {
          avatar: ast.avatar,
          banner: ast.banner,
          website: ast.website,
        }),
      };
    });

    return res.status(200).json(finalData);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. please try again." });
  }
};
