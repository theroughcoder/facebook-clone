import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";
// import { generateToken, isAdmin, isAuth } from '../utils.js';
import {
  validateEmail,
  validateLength,
  validateUsername,
} from "../helpers/validation.js";
import { generateToken } from "../helpers/tokens.js";
import { sendVerificationEmail } from "../helpers/mailer.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello bol re la hai");
});
router.post("/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      username,
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
      return res.status(400).json({
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

    const user = new User({
      first_name,
      last_name,
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
    sendVerificationEmail(user.email, user.first_name, url)    
    res.json(user); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
