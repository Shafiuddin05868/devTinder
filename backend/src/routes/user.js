import express from "express";
import { connectionRequest } from "../models/connectionRequest.js";
import { userAuth } from "../middlewares/auth.js";
import { User } from "../models/user.js";
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

    res.status(200).json({
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
    const data = connections.map(
      (connection) => connection.senderId || connection.receiverId
    );

    res.status(200).json({
      message:
        connections.length > 0
          ? "Connections fetched successfully"
          : "No connection found",
      data,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "ERROR: " + error.message || "Unknown error" });
  }
});

//feed show all users except connections
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Validate page and limit
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid page or limit" });
    } else if (page > 100 || limit > 100) {
      return res.status(400).json({ message: "Page or limit exceeds maximum" });
    }
    // Find all connection requests where user is sender or receiver
    const connections = await connectionRequest.find({
      $or: [{ senderId: user.id }, { receiverId: user.id }],
    });

    // Extract the IDs of connected users (the other party in each connection)
    const connectedUserIds = connections.reduce((ids, connection) => {
      if (connection.senderId.toString() === user.id) {
        ids.add(connection.receiverId.toString());
      } else {
        ids.add(connection.senderId.toString());
      }
      return ids;
    }, new Set());

    // Also exclude the current user id
    connectedUserIds.add(user.id);

    // Find users excluding current user and connected users
    const requestUser = await User.find({
      _id: { $nin: Array.from(connectedUserIds) },
    })
      .select(user_public_fields.join(" "))
      .limit(limit)
      .skip((page - 1) * limit);
    res.status(200).json({
      message: "Feed fetched successfully",
      data: requestUser,
      pagination: {
        page,
        limit,
        total: requestUser.length,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "ERROR: " + err.message || "Unknown error" });
  }
});

export { userRouter };
