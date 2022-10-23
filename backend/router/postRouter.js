import express from "express";
import Post from "../models/postModel.js";
import { authUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createPost", authUser, async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/:id", authUser, async (req, res)=> {
 
  try {
    const posts = await Post.find({user: req.params.id})
      .populate("user", "first_name last_name picture username gender")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})


export default router;

