import jwt from "jsonwebtoken"
import { User } from "../models/user.js";
export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token){
        throw new Error("unauthorized")
    }
    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=>{
        if (err){
            throw new Error("unauthorized")
        }else{
            const {id} = decoded
            const user = await User.findById(id)
            if(!user){
                throw new Error("unauthorized")
            }
            req.user = user
            next()
        }
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};
