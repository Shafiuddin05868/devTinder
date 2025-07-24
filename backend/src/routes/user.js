import express from "express";
import { connectionRequest } from "../models/connectionRequest.js";
import { userAuth } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await connectionRequest
      .find({
        receiverId: user.id,
        status: "interested",
      })
      .populate("senderId", "name photoUrl age");
    const data = requests.map((request) => ({
      requestId: request._id,
      senderId: request.senderId,
    }));

    res
      .status(200)
      .json({
        message:
          requests.length > 0
            ? "Requests fetched successfully"
            : "No request found",
        data,
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: "ERROR: " + error.message || "Unknown error" });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await connectionRequest
      .find({
        $or: [
          { senderId: user.id, status: "accepted" },
          { receiverId: user.id, status: "accepted" },
        ],
      })
      .populate("senderId", "name photoUrl age")
      .populate("receiverId", "name photoUrl age");
    const data = connections.map((connection) => connection.senderId || connection.receiverId);

    res.status(200).json({
        message:
          connections.length > 0
            ? "Connections fetched successfully"
            : "No connection found",
        data,
    })
  } catch (error) {
    res
      .status(400)
      .json({ message: "ERROR: " + error.message || "Unknown error" });
  }
});

export { userRouter };
