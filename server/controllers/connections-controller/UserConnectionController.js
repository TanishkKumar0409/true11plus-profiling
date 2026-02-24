import mongoose from "mongoose";
import UserConnectionRequest from "../../models/connections/ConnectionRequest.js";
import UserConnections from "../../models/connections/Connections.js";
import { getDataFromToken } from "../../utils/getDataFromToken.js";
import UserAssets from "../../models/user-models/UserAssets.js";

export const handleConnectionRequest = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);
    const { requestId } = req.params;
    const { action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: "Invalid request id" });
    }

    const request = await UserConnectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }

    if (action === "accept") {
      const alreadyConnected = await UserConnections.findOne({
        users: { $all: [request.requester, request.receiver] },
      });

      if (!alreadyConnected) {
        const usersSorted = [
          request.requester.toString(),
          request.receiver.toString(),
        ].sort();

        await UserConnections.create({
          users: usersSorted,
          status: "accepted",
          acceptedAt: new Date(),
        });
      }

      await request.deleteOne();

      return res.json({ message: "Connection accepted" });
    }

    if (action === "reject") {
      await request.deleteOne();

      return res.json({ message: "Request rejected" });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllMyConnections = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);

    const connections = await UserConnections.find({
      users: userId,
      status: "accepted",
    })
      .populate("users", "name username _id")
      .sort({ acceptedAt: -1 })
      .lean();

    const otherUserIds = [];

    const mapped = connections.map((conn) => {
      const otherUser = conn.users.find(
        (u) => u._id.toString() !== userId.toString(),
      );

      if (otherUser) otherUserIds.push(otherUser._id.toString());

      return {
        connectionId: conn._id,
        connectedUser: otherUser,
        connectedSince: conn.acceptedAt,
      };
    });

    const assets = await UserAssets.find({
      userId: { $in: otherUserIds },
    }).lean();

    const assetMap = {};
    assets.forEach((a) => {
      assetMap[a.userId.toString()] = a;
    });

    const final = mapped.map((item) => {
      const user = item.connectedUser;
      const asset = assetMap[user?._id?.toString()];

      return {
        connectionId: item.connectionId,
        connectedSince: item.connectedSince,
        connectedUser: {
          _id: user?._id,
          name: user?.name,
          username: user?.username,
          avatar: asset?.avatar || null,
          about: asset?.about || null,
        },
      };
    });

    res.status(200).json({
      count: final.length,
      connections: final,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllConnectionsIds = async (req, res) => {
  try {
    const userId = await getDataFromToken(req);

    const connections = await UserConnections.find({
      users: userId,
      status: "accepted",
    })
      .sort({ acceptedAt: -1 })
      .lean();

    return res.status(200).json(connections);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong. Please Try Again Later.",
    });
  }
};

export const removeUserConnection = async (req, res) => {
  try {
    const currentUserId = await getDataFromToken(req);
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    if (currentUserId.toString() === userId) {
      return res.status(400).json({ error: "Cannot remove yourself" });
    }

    const deleted = await UserConnections.findOneAndDelete({
      users: { $all: [currentUserId, userId] },
      status: "accepted",
    });

    if (!deleted) {
      return res.status(404).json({ error: "Connection not found" });
    }

    return res.json({
      message: "Connection removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
