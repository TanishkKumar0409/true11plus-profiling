import express from "express";
import {
  getAllConnectionRequests,
  getConnectionRequestsForRequester,
  sendUserConnectionRequest,
} from "../controllers/connections-controller/ConnectionRequsetController.js";
import {
  getAllConnectionsIds,
  getAllMyConnections,
  handleConnectionRequest,
  removeUserConnection,
} from "../controllers/connections-controller/UserConnectionController.js";

const userConnectionRoutes = express.Router();

userConnectionRoutes.post(
  `/user/connect/request/:receiver`,
  sendUserConnectionRequest,
);
userConnectionRoutes.get(`/user/connect/requests`, getAllConnectionRequests);
userConnectionRoutes.get(
  `/user/connect/requester/request`,
  getConnectionRequestsForRequester,
);

userConnectionRoutes.get(`/user/connect/all`, getAllMyConnections);
userConnectionRoutes.post(
  `/user/connect/request/handle/:requestId`,
  handleConnectionRequest,
);
userConnectionRoutes.delete(
  `/user/connect/remove/:userId`,
  removeUserConnection,
);
userConnectionRoutes.get(`/user/connect/ids`, getAllConnectionsIds);

export default userConnectionRoutes;
