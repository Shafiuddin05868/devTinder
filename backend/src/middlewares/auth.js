import jwt from "jsonwebtoken"
import { User } from "../models/user.js";
export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token){
        res.status(401).send("unauthorized")
    }
    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=>{
        if (err){
            res.status(401).send("unauthorized")
        }else{
            const {id} = decoded
            const user = await User.findById(id).select("-password")
            if(!user){
                res.status(401).send("unauthorized")
            }
            req.user = user
            next()
        }
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};
