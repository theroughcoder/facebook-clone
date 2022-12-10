const dotenv= require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer")
const {google} = require('googleapis')
const {OAuth2} = google.auth; 
const oauth_link = "https://developers.google.com/oauthplayground"
const { EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH } = process.env;
const auth = new OAuth2(MAILING_ID, MAILING_SECRET,  oauth_link);

 const sendVerificationEmail = (email, name, url) => {
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
 const sendResetCode = (email, name, code) => {
    auth.setCredentials({
      refresh_token: MAILING_REFRESH,
    });
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
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Reset facebook password",
      html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1645134414/logo_cs1si5.png" alt="" style="width:30px"><span>Action requise : Reset facebook account password</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently applied for your account password reset. To reset your facebookClone account password, use the code given below.</span></div><a  style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Code-${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">FacebookClone allows you to stay in touch with all your friends, once registered on facebookClone,you can share photos,organize events and much more.</span></div></div>`,
    };
    stmp.sendMail(mailOptions, (err, res) => {
      if (err) return err;
      return res;
    })  
}

module.exports = {sendVerificationEmail, sendResetCode}