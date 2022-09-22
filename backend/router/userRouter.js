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
import jwt from "jsonwebtoken";



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
    const url = `${process.env.BASE_URL}/api/users/activate/${emailVerificationToken}`;
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
router.post('/activate', async(req, res)=> {
  const {token} = req.body;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  const check = await User.findById(user.id);
  if(check.verified == true){
    return res.status(400).json({message: "this email is already activated"})
  } else {
    await User.findByIdAndUpdate(user.id, {verified: true});
    return res.status(200).json({message: "Account has been activated successfully"})
  }
})
router.post('/login', async(req, res)=> {
  try{
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
      return res.status(400).json({message: "this email address you entered is not found"}) 
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
          message: "Register success! Please activate your email to start"
        });
    }else {
      return res.status(400).json({message: "Invalid credentials. Please try again."})
    }
    

  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
})

export default router;
 