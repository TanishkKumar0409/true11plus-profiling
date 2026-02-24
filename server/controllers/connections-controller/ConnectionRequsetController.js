import UserConnectionRequest from "../../models/connections/ConnectionRequest.js";
import UserConnections from "../../models/connections/Connections.js";
import { getUserDataFromToken } from "../../utils/getDataFromToken.js";

export const sendUserConnectionRequest = async (req, res) => {
  try {
    const requester = await getUserDataFromToken(req);
    const { receiver } = req.params;

    if (requester?.toString() === receiver)
      return res.status(400).json({ error: "Cannot connect to self" });

    const exists = await UserConnections.findOne({
      users: { $all: [requester, receiver] },
    });
    if (exists) return res.status(400).json({ error: "Already connected" });

    const alreadyRequested = await UserConnectionRequest.findOne({
      requester,
      receiver,
    });
    if (alreadyRequested)
      return res.status(400).json({ error: "Already sent" });

    await UserConnectionRequest.create({ requester, receiver });

    return res.json({ message: "Request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllConnectionRequests = async (req, res) => {
  try {
    const userId = await getUserDataFromToken(req);

    const requests = await UserConnectionRequest.find({
      receiver: userId,
    })
      .populate("requester", "name email profile_image username")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getConnectionRequestsForRequester = async (req, res) => {
  try {
    const userId = await getUserDataFromToken(req);

    const requests = await UserConnectionRequest.find({
      requester: userId,
    })
      .populate("requester", "name email profile_image username")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
