import express from "express";
import { connectionRequest } from "../models/connectionRequest.js";
import { userAuth } from "../middlewares/auth.js";
const userRouter = express.Router();

const user_public_fields = ["name", "photoUrl", "age", "email"];

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await connectionRequest
      .find({
        receiverId: user.id,
        status: "interested",
      })
      .populate("senderId", user_public_fields);
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
      .populate("senderId", user_public_fields)
      .populate("receiverId", user_public_fields);
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
