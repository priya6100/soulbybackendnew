/** @format */

const User = require("../models/user");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const bcrypt = require("bcrypt");
const SMTPTransport = require("nodemailer/lib/smtp-transport");
require("dotenv").config();

const CLIENT_ID =
  "792524323676-9mcn63o6p1heftffd9cogef5atlrjb1a.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04XePBglgmsbnCgYIARAAGAQSNwF-L9Ir4GxjuvsFA6oQvP4Jgvf6OnzbpnNVWkkv4h4ZeTZ9K_9ewRmHOi42GlWbwjne0pU3RFY";

const oAuth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (otp, email) => {
  try {
    const token = await oAuth2.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        type: "OAuth2",
        user: "hpasc123@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: token,
      },
    });

    const mailOptions = {
      from: process.env.SENDEMAIL_EMAIL,
      to: email,
      subject: "soulByIndian Forgot Password Otp Code",
      text: `otp code = ${otp}`,
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    return error;
  }
};

exports.checkEmail = (req, res) => {
  const { email } = req.body;
  const Otp = randomstring.generate(6);
  const otp = Otp.toLowerCase();
  console.log(email);

  User.findOne({ email }).exec(async (error, user) => {
    if (user) {
      console.log(process.env.SENDEMAIL_EMAIL, " ", process.env.SENDEMAIL_PASS);

      sendEmail(otp, email)
        .then((result) => console.log("success", result))
        .catch((err) => console.log(err));

      return res.status(200).json({
        email,
        otp,
      });
    } else {
      console.log("notFound");
      return res.status(400).json({
        email,
      });
    }
  });
};

exports.changePassword = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec(async (err, user) => {
    if (user) {
      const hash_password = await bcrypt.hash(password, 10);
      user.hash_password = hash_password;
      user.save((err, user) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "something wrong updating password" });
        }
      });
      return res.status(200).json({ message: "success updating password" });
    }

    return res.status(400).json({ message: "email not found" });
  });
};
