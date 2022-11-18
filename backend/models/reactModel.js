import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const reactSchema = new mongoose.Schema({
  react: {
    type: String,
    enum: ["like", "love", "haha", "sad", "angry", "wow"],
    required: true,
  },
  postRef: {
    type: ObjectId,
    ref: "Post",
  },
  reactBy: {
    type: ObjectId,
    ref: "User",
  },
});

export default mongoose.model("React", reactSchema);
