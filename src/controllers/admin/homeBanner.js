const HomeBanner = require("../../models/homeBanner");



exports.createHomePage = (req, res) =>{
  

    const {banners} = req.files;
   
     req.body.banners = banners.map((banner, index) => ({
            img: `${process.env.API}/public/${banner.filename}`,
           
        }));
    
   
  
    req.body.createdBy = req.user._id;
    const home = new HomeBanner(req.body);
    home.save((error, home) => {
      if (error) return res.status(400).json({ error });
      if (home) {
        return res.status(201).json({ home });
      }
    });
  };


  exports.getHomePage = (req, res) => {
   
    HomeBanner.find({})
    .exec((error, banners)=>{
        if(error){
            return res.status(400).json({error});
       }
          if(banners){
       
              return res.status(200).json({ banners });
          }
    });
    
  };

  exports.deleteBanner = (req, res) => {
    const { hid } = req.body;
    if (hid) {
      HomeBanner.deleteOne({ _id: hid }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          res.status(202).json({ result });
        }
      });
    } else {
      res.status(400).json({ error: "Params required" });
    }
  };


  exports.updateHomeBanner = async (req, res) =>{
    const {_id, title, description} = req.body;
    console.log(_id, ">>id");
    try{
     
      const result = await HomeBanner.findOneAndUpdate({_id}, 
       
       {
         $set:{
           title: req.body.title,
           description: req.body.description
         }
       },{
         new: true,
         useFindAndModify: false
       }
   
       );
       console.log(result);
    }catch(err){
      console.log(err);
    }

}