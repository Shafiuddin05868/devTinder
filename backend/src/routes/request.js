import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { connectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:receiverId",
  userAuth,
  async (req, res) => {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.receiverId;
      const status = req.params.status;

      //if the status is ignored or interested
      if (!["ignored", "interested"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be either 'ignored' or 'interested'" });
      }

      //is the receiver exists?
      const receiverExists = await User.findById(receiverId);
      if (!receiverExists) {
        return res.status(404).json({ message: "Receiver not found" });
      }

      //if the connection is already available
      const existingRequest = await connectionRequest.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }
      const newConnectionRequest = new connectionRequest({
        senderId,
        receiverId,
        status,
      });
      const data = await newConnectionRequest.save();
      res
        .status(201)
        .json({ message: "Connection request sent successfully", data });
    } catch (err) {
      res.status(400).json({ message: "ERROR: " + err.message });
    }
  }
);

requestRouter.patch(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //status validation
      if (!["accepted", "rejected"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be either 'accepted' or 'rejected'" });
      }
      //request validation
      const reqData = await connectionRequest.findOne({
        _id: requestId, //is sthe request available
        receiverId: loggedInUser.id, //is the user the receiver
        status: "interested", //because only interested user can be reviewed
      });
      if (!reqData) {
        return res.status(404).json({ message: "Request not found" });
      }
      //all goods here! so update request
      reqData.status = status;
      const updatedRequest = await reqData.save();
      res.status(200).json({message: "Request updated successfully", data: updatedRequest})
    } catch (err) {
      res.status(400).json({ message: "ERROR: " + err.message });
    }
  }
);

export { requestRouter };
