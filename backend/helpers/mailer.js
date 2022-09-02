import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer"
import {google} from 'googleapis'
const {OAuth2} = google.auth; 
const oauth_link = "https://developers.google.com/oauthplayground"
const { EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH } = process.env;
const auth = new OAuth2(MAILING_ID, MAILING_SECRET,  oauth_link);

export const sendVerificationEmail = (email, name, url) => {
    auth.setCredentials({
        refresh_token: MAILING_REFRESH
    })
    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: EMAIL,
            clientId: MAILING_ID,
            clientSecret: MAILING_SECRET,
            refreshToken: MAILING_REFRESH,
            accessToken,
        }
    })
    const mailOptions = {
        from: EMAIL, 
        to: email,
        subject: "Facebook email verification",
        text: "test email",
        html: `<div style=" padding: 2ch"> <h1 style="color: blue">facebookclone</h1> Action requise: Activate your facebook account </div> <div style="border-bottom: 1px solid; padding: 2ch"> <span>Hello ${name}</span> </div> <div style=" padding: 2ch"> <span >You recently created an account on Facebook. To complete your registration, pleace confirm your account.</span > </div> <div> <a href=${url} style=" margin: 1ch; width: 230px; padding: 10px 15px; background-color: rgb(45, 45, 203); border: 2px solid; display: block; font-size: large; color: aliceblue; border-radius: 2ch; " >Confirm your account</a > </div>`

    }
    stmp.sendMail(mailOptions,( err, res) =>{
        if(err) return err;
        return res;
    })  
}