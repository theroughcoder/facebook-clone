import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
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
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url)    
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

export default router;
 