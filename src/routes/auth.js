const express = require('express');
require("dotenv").config();
const { signup, signin, googlelogin } = require('../controllers/auth');
const User = require('../models/user');
const { validateRequest, isRequestValidated, validateSigninRequest } = require('../validator/auth');
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
router.post('/signup', validateRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);

router.post('/googlelogin', googlelogin);

router.get('/forgot-password', (req, res, next) => {
    res.render("forgot-password")
});

router.get('/reset-password/:id/:token', (req, res, next) => {
    const {id, token} = req.params;
    console.log(req.params);

});

router.post('/forgot-password', (req, res, next) => {
    User.findOne({email: req.body.email}).exec((error, user) => {
        if(error) {
            return res.status(400).json({message: "User not found..."});
        }
        if (user) {
            const payload = {
                email: user.email,
                id: user._id
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
            const link = `http://localhost:3000/reset-password/${payload.id}/${token}`;
            console.log(link);
            res.send("Password reset link has been sent to your mail.");
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'priyaranjan@grapsnextsocial.com',
                pass: 'fsshvmmpiqhdjzqg'
                }
            });
            user.save().then(() => {
                transporter.sendMail({
                    to: user.email, 
                    from: "priyaranjan@grapsnextsocial.com", 
                    subject: "password reset 123",
                    html: `
                    <p>You requested for password reset.</p>
                    <h5>Click in this <a href="http://localhost:3000/reset-password/${payload.id}/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message: "check your email"});
            });
        }
    });

});

router.post('/reset-password', (req, res) => {
    res.send("Password has been reset");
});

module.exports = router;