const mongoose = require('mongoose');


const homeBannerSchema = new mongoose.Schema({
  
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    banners: [
        {
            img: { type: String },
           
        }
    ],
 
 
    
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}

}, {timestamps: true});

module.exports = mongoose.model('HomeBanner', homeBannerSchema);