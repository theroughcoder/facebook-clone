import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Code from "../models/codeModel.js";
import expressAsyncHandler from "express-async-handler";
// import { generateToken, isAdmin, isAuth } from '../utils.js';
import {
  validateEmail,
  validateLength,
  validateUsername,
} from "../helpers/validation.js";
import { generateToken } from "../helpers/tokens.js";
import { sendResetCode, sendVerificationEmail } from "../helpers/mailer.js";
import jwt from "jsonwebtoken";
import {authUser} from "../middlewares/auth.js"
import generateCode from "../helpers/generateCode.js";
import mongoose from "mongoose";


const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello bol re la hai");
});
router.post("/register", expressAsyncHandler(async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const check = await User.findOne({ email });
    if (check) {
      return res.status(401).send({
        message:
          "This email address already exists, try with a different email address",
      }); 
    }
    if (!validateLength(first_name, 3, 30)) {
      return res
        .status(400)
        .json({
          message:
            "First name should contain atleast 3 and atmost 30 characters",
        });
    }
    if (!validateLength(last_name, 3, 30)) {
      return res
        .status(400)
        .json({
          message:
            "Last name should contain atleast 3 and atmost 30 characters",
        });
    } 
    if (!validateLength(password, 6, 40)) { 
      return res
        .status(400)
        .json({ message: "Password should be of atleast 6 characters" });
    }
    const cryptedPassword = bcrypt.hashSync(req.body.password, 12);
    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);

    const capitalize = s => s[0].toUpperCase() + s.slice(1)

    const user = new User({
      first_name: capitalize(first_name), 
      last_name: capitalize(last_name),
      email,
      password: cryptedPassword,
      username: newUsername, 
      bYear,
      bMonth,
      bDay,
      gender,  
    });
    await user.save(); 
    const emailVerificationToken = generateToken({id: user._id.toString()}, "30m")
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    // sendVerificationEmail(user.email, user.first_name, url)    
    res.send({
      id: user._id, 
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: generateToken({id: user._id.toString()}, "7d"),
      verified: user.verified,
      message: "Register success! Please activate your email to start"
    }); 
  } catch (error) {  
    res.status(500).json({ message: error.message });
  } 
})); 
router.post('/activate', authUser, async(req, res)=> {
  const validUser = req.user.id;
  try{

    const {token} = req.body;
    const user = jwt.verify(token, process.env.JWT_SECRET); 
    const check = await User.findById(user.id);
    if (validUser !== user.id) {
      return res.status(400).json({
        message: "You don't have the authorization to complete this operation.",
      });
    }
    if(check.verified == true){
      return res.status(400).json({message: "this email is already activated"})
    } else {
      await User.findByIdAndUpdate(user.id, {verified: true});
      return res.status(200).json({message: "Account has been activated successfully"})
    }
  } catch(error){
    res.status(500).json({message: error.message})
  }
})
router.post('/login', async(req, res)=> {
  try{
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
      return res.status(400).json({message: "Email address you entered is not found"}) 
    }
    if(bcrypt.compareSync(password, user.password)) {
   
        return res.send({
          id: user._id,
          username: user.username,
          picture: user.picture,
          first_name: user.first_name,
          last_name: user.last_name,
          token: generateToken({id: user._id.toString()}, "7d"),
          verified: user.verified,
        });
        
    }else {
      return res.status(400).json({message: "Invalid credentials. Please try again."})
    }
      

  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
})

router.post("/sendVerification",  authUser, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res.status(400).json({
        message: "This account is already activated.",
      });
    }
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.status(200).json({
      message: "Email verification link has been sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
)
router.post("/findUser", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "Account does not exists.",
      });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/sendResetPasswordCode", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedCode = await new Code({
      code,
      user: user._id,
    }).save();
    sendResetCode(user.email, user.first_name, code);
    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/validateResetCode", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/changePassword", async (req, res) => {
  const { email, password } = req.body;

  const cryptedPassword = await bcrypt.hash(password, 12);
  try {
    await User.findOneAndUpdate(
      { email },
      {
        password: cryptedPassword,
      }
    );
    return res.status(200).json({ message: "ok" });
   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/test",  authUser, (req, res)=>{
  res.json({message: req.user})
})
router.get("/getProfile/:username", authUser, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({_id: req.user.id})
    const profile = await User.findOne({ username }).select("-password");
     const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
    if (!profile) {
      return res.json({ ok: false });
    }
    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user.id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user.id)) {
      friendship.requestSent = true;
    }
    const posts = await Post.find({ user: profile._id })
      .populate("user")
      .sort({ createdAt: -1 })
      .populate("comments.commentBy", "first_name last_name username picture")

      await profile.populate('friends', 'first_name last_name username picture')
    res.json({ ...profile.toObject(), posts, friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/updateProfilePicture", authUser, async (req, res) => {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.json(url); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/updateCover", authUser, async (req, res) => {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/updateDetails", authUser, async (req, res) => {
  try {
    const { infos } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/addFriend/:id", authUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "friend request has been sent" });
      } else {
        return res.status(400).json({ message: "Already sent" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/cancelRequest/:id", authUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({ 
          $pull: { following: receiver._id },
        });
        res.json({ message: "you successfully canceled request" });
      } else {
        return res.status(400).json({ message: "Already Canceled" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't cancel a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/follow/:id", authUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });

        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "follow success" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/unfollow/:id", authUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });

        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "unfollow success" });
      } else {
        return res.status(400).json({ message: "Already not following" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/acceptRequest/:id", authUser,  async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $push: { friends: sender._id, following: sender._id },
        });
        await sender.update({
          $push: { friends: receiver._id, followers: receiver._id },
        });
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        res.json({ message: "friend request accepted" });
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You can't accept a request from  yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/unfriend/:id", authUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.update({
          $pull: {
            friends: sender._id,
            following: sender._id,
            followers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            friends: receiver._id,
            following: receiver._id,
            followers: receiver._id,
          },
        });

        res.json({ message: "unfriend request accepted" });
      } else {
        return res.status(400).json({ message: "Already not friends" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfriend yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/deleteRequest/:id", authUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.update({
          $pull: {
            requests: sender._id,
            followers: sender._id,
          },
        });
        await sender.update({
          $pull: {
            following: receiver._id,
          },
        });

        res.json({ message: "delete request accepted" });
      } else {
        return res.status(400).json({ message: "Already deleted" });
      }
    } else {
      return res.status(400).json({ message: "You can't delete yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const results = await User.find().select(
      "first_name last_name username picture"
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/search/:searchTerm", authUser, async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const results = await User.find({ $or: [ { first_name: { $regex: searchTerm, $options: 'i' } }, { last_name: { $regex: searchTerm, $options: 'i' } } ] }).select(
      "first_name last_name username picture"
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/addToSearchHistory", authUser, async (req, res) => {
  try {
    const { searchUser } = req.body;
    const search = {
      user: searchUser,
      createdAt: new Date(),
    };
    
    const user = await User.findById(req.user.id);
    const check = user.search.find((x) => x.user.toString() === searchUser.toString());
    if (check) {

      await User.updateOne(
        {
          _id: req.user.id,
          "search._id": check._id,
        },
        {
          $set: { "search.$.createdAt": new Date() },
        }
      );
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          search,
        },
      });
    }
    res.status(200).json({message: "ok"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/getSearchHistory", authUser, async (req, res) => {
  try {
    const results = await User.findById(req.user.id)
      .select("search")
      .populate("search.user", "first_name last_name username picture");
    res.json(results.search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/removeFromSearch", authUser, async (req, res) => {
  try {
    const { searchUser } = req.body;
    await User.updateOne(
      {
        _id: req.user.id,
      },
      { $pull: { search: { user: searchUser } } }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
});
router.get("/getFriendsPageInfos", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends requests")
      .populate("friends", "first_name last_name picture username")
      .populate("requests", "first_name last_name picture username");
    const sentRequests = await User.find({
      requests: mongoose.Types.ObjectId(req.user.id),
    }).select("first_name last_name picture username");
    res.json({
      friends: user.friends,
      requests: user.requests,
      sentRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
 