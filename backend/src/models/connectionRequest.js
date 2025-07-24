import mongoose, { model, Schema } from "mongoose";

const connectionRequestionSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestionSchema.index({ senderId: 1, receiverId:1}, {unique: true})

connectionRequestionSchema.pre("save", async function(next){
  if (this.senderId.equals(this.receiverId)){
    throw new Error("Sender and receiver cannot be the same")
  }
  next()
})

export const connectionRequest = mongoose.model("connectionRequest", connectionRequestionSchema)
