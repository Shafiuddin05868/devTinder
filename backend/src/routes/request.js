import express from "express"
import { userAuth } from "../middlewares/auth.js";
import { connectionRequest } from "../models/connectionRequest.js";

const requestRouter = express.Router()

requestRouter.post ('/request/send/:status/:receiverId', userAuth, async (req, res)=>{
    try {
        const senderId = req.user.id;
        const receiverId = req.params.receiverId;   
        const status = req.params.status;
        
        const connectionRequest  = new connectionRequest({
            senderId,
            receiverId,
            status
        })
        const data = await connectionRequest.save()
    } catch (err) {
        res.status(400).json({message: "ERROR: " + err.message})
    }
})



export {requestRouter}