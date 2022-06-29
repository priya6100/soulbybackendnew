const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addAddress, getAddress ,removeAddressList } = require('../controllers/address');
const router = express.Router();


router.post('/user/address/create', requireSignin, userMiddleware, addAddress);
router.post('/user/getAddress', requireSignin, userMiddleware, getAddress);
router.post(
    '/user/address/removeaddress', 
    requireSignin, 
    userMiddleware, 
    addAddress , 
    removeAddressList);

module.exports = router;