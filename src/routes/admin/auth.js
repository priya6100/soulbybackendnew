const express = require('express');
const { requireSignin } = require('../../common-middleware');
const { signup, signin, signout } = require('../../controllers/admin/auth');
const { validateRequest, isRequestValidated, validateSigninRequest } = require('../../validator/auth');
const router = express.Router();

router.post('/admin/signup', validateRequest, isRequestValidated, signup);
router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signout', signout);
router.post('/profile', requireSignin, (req, res)=>{
    const uname = req.user._id;
    console.log(uname);
    res.status(200).json({user: uname})
});

module.exports = router;