/** @format */

const user = require('../models/user');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const { OAuth2Client } = require("google-auth-library");
// const fetch = require('node-fetch');
// const mailgun = require("mailgun-js");
// const DOMAIN = 'sandbox8f097314e0454f61babd1b52952defab.mailgun.org';
// const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });
const nodemailer = require("nodemailer");
const { response } = require("express");
const bodyParser = require("body-parser");

const client = new OAuth2Client(
  "800480683042-qdqo4a9hi5dboglr97e4tvmvab0er1lu.apps.googleusercontent.com"
);
const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        error: "User already registered",
      });  

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const {  _id, firstName, lastName, email, role, fullName } = user;

        return res.status(201).json({
          token,
          user: {  _id, firstName, lastName, email, role, fullName },
        });
      }
    });
  });
};

 
exports.googlelogin = (req, res) => {
  const { email, name, imageUrl, googleId } = req.body.profileInform;

  User.findOne({ email }).exec(async (error, user) => {
    if (user) {
      console.log("user exist");
      if (user.role === "user") {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
          message: "user exist",
        });
      } else {
        return res.status(400).json({
          message: "account not user",
        });
      }
    }

    const firstNameFunct = (name) => {
      arrName = name.split(" ");
      if (arrName.length === 1) {
        return arrName[0];
      } else {
        result = arrName.slice(0, -1).join(" ");
        return result;
      }
    };

    const firstName = firstNameFunct(name);

    console.log(firstName);
    console.log("lastName");

    const lastNameFunct = (name) => {
      arrName = name.split(" ");
      if (arrName.length === 1) {
        return "";
      } else {
        result = arrName.slice(-1).join(" ");
        return result;
      }
    };

    const lastName = lastNameFunct(name);

    const hash_password = await bcrypt.hash(googleId, 10);

    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
    });

    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      if (user) {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
          message: "user created",
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    console.log(token);
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User dont exits with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "priyaranjan@grapsnextsocial.com",
          pass: "fsshvmmpiqhdjzqg",
        },
      });
      user.save().then(() => {
        transporter.sendMail({
          to: user.email,
          from: "priyaranjan@grapsnextsocial.com",
          subject: "password reset 123",
          html: `
                  <p>You requested for password reset.</p>
                  <h5>Click in this <a href="http://localhost:3000/reset-password/${user._id}/${token}">link</a> to reset password</h5>
                  `,
        });
        res.json({ message: "check your email" });
      });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) {
      return res.status(400).json({ message: "User not found..." });
    }
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1d" }
        // );
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({
          message: "password wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

// exports.resetPasswordController = (req, res) => {
//   const { resetPasswordLink, newPassword } = req.body;

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     const firstError = errors.array().map(error => error.msg)[0];
//     return res.status(422).json({
//       errors: firstError
//     });
//   } else {
//     if (resetPasswordLink) {
//       jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
//         err,
//         decoded
//       ) {
//         if (err) {
//           return res.status(400).json({
//             error: 'Expired link. Try again'
//           });
//         }

//         User.findOne(
//           {
//             resetPasswordLink
//           },
//           (err, user) => {
//             if (err || !user) {
//               return res.status(400).json({
//                 error: 'Something went wrong. Try later'
//               });
//             }

//             const updatedFields = {
//               password: newPassword,
//               resetPasswordLink: ''
//             };

//             user = _.extend(user, updatedFields);

//             user.save((err, result) => {
//               if (err) {
//                 return res.status(400).json({
//                   error: 'Error resetting user password'
//                 });
//               }
//               res.json({
//                 message: `Great! Now you can login with your new password`
//               });
//             });
//           }
//         );
//       });
//     }
//   }
// };

exports.facebookController = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};
