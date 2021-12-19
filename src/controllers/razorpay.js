const razorpay = require('../models/razorpay');

exports.showRazorpay = (req, res) => {
    razorpay.findOne({user: req.user._id})
    .exec((error, cardPay) => {
        if(error){
            return res.status(400).json(error);
        }
        if(wish){
            return res.status(200).json({
                message: "Pay by Credit/Debit Card"
            })
        }
    })
    
}