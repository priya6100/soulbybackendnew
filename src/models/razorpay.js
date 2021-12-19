const mongoose = require('mongoose');


const razorpayScema = new mongoose.Schema({

 user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},

}, {timestamps: true});

module.exports = mongoose.model('Wishlist', razorpayScema);