const user = require('../../models/user');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
exports.signup = (req, res) =>{
    User.findOne({email: req.body.email})
    .exec(async (error, user)=>{
        if(user) return res.status(400).json({
            message: 'Admin alredy exist'
        });
        const{

            firstName,
            lastName,
            email,
            password

        } = req.body;
        const hash_password = await bcrypt.hash(password, 10);
        const _user = new User({
            firstName, 
            lastName, 
            email, 
            hash_password, 
            username: shortid.generate(), 
            role: 'admin'
        
        });
        _user.save((error, data)=>{
          if(error){
              return res.send(400).json({
                  message:"something wrong"
              });
          }

          if(data){
              return res.status(201).json({
                  user: data,
                  message:"Admin signup successfully"
              })
          }
        });
    });
}


exports.signin = (req, res) =>{
    user.findOne({email: req.body.email})
    .exec(async (error, user) => {
          
        if(error) return res.status(400).json({error});

        if(user){
            console.log(user.authenticate(req.body.password));

            const isPassword = await user.authenticate(req.body.password);
            console.log(isPassword);

            if(isPassword  && user.role === 'admin'){

                const token = jwt.sign({_id:user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '2d'});

                const {_id, firstName, lastName, email, role, fullName} = user;
                res.cookie('token', token, {expiresIn: '2d'});
                res.status(200).json({
                    token,
                    user:{_id, firstName, lastName, email, role, fullName}
                })

            } else{
                return res.status(400).json({
                    message: "invalid password"
                })
            }

        }else{
            return res.status(400).json({message: "something went wrong"});
        }
    });
}

exports.signout= (req,res) =>{
 
     res.clearCookie('[token');
     res.status(200).json({message: 'signout successfully'})
}
