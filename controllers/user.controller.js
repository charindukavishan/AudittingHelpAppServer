const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const nodemailer=require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const Blog = require('../models/Post');
var connection = require('../models/db');


const User = mongoose.model('User');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });
module.exports.register = (req, res, next) => { 


    var user={
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
       "tel": req.body.tel,
        "nic": req.body.nic,
        "password" : req.body.password,
       "temptoken":"req.body.temptoken"
    }
    
    connection.query('INSERT INTO users SET ?',user, function (error, results, fields) {
        if (error) {console.log(error);
          res.json({
              status:false,
              message:'there are some error with query'
          })
        }else{
            res.json({
              status:true,
              data:results,
              message:'user registered sucessfully'
          })
        }
      });
  
  


}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user){
            console.log(user);
             return res.status(200).json({ "token": jwt.sign({ _id:user._id},
                process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXP
            }) ,"role":user.email});
        }
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
connection.query('SELECT * FROM users WHERE _id = ?',req._id, function (error, results, fields) {
       let user=results[0];
        if (!results)
        return res.status(404).json({ status: false, message: 'User record not found.' });
    else{
        // console.log('Im in backend');
        return res.status(200).json({ status: true, user});}
      });
  


}


module.exports.getname=(req,res,next)=>{
    User.findOne({email:req.params.email}).select().exec((err,user)=>{
        console.log(bcrypt.getRounds(user.password))
            if(!user){ console.log('svdjsdj')
                res.json({sucsess:false,message:'email was not found'})
            }
    
            else{ 
                var email={
                    from:'',
                    to:'',
                    subject:user.firstName,
                    text:bcrypt.getRounds(user.password)
                };
                transporter.sendMail(email, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                  return res.status(200).json({ status: true, user});
            }
        
        
    })
    
    
    

}

module.exports.puttoken=(req,res)=>{console.log(req.body.email)
    connection.query('SELECT * FROM users WHERE email= ?',req.body.email, function (error, results, fields) {
        if(error) throw error;
        if(!results){
            res.json({sucsess:false,message:'user was not found'})
        }
        else{ var user=results[0];
            let temptoken= jwt.sign({ _id:results[0]._id},
            process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        })
            // user.temptoken= user.generateJwt();
            connection.query('UPDATE users SET temptoken = ? WHERE _id = ?',[temptoken,results[0]._id], function (error, results, fields) {
                if(error){
                    res.json({sucsess:false,message:error})
                }
                else{console.log(results)
                    let email={
                        from:'parkheresl@gmail.com',
                        to:user.email,
                        subject:user.firstName,
                        text:'http://localhost:4200/newpassword/'+temptoken
                    };
                    // console.log(sendemail)
                    transporter.sendMail(email, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                          res.json({sucsess:true,message:'message was send to your email'})
                        }
                      });
                }
               });
           

        }
       });

}

module.exports.rstpw=(req,res)=>{

    connection.query('SELECT * FROM users WHERE temptoken = ?',req.params.token, function (error, results, fields) {
        if(error) throw error;
        var token=req.params.token;
        var user=results[0];
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                res.json({sucsess:false,message:'password link has expired'});
            }else{
                res.json({sucsess:true,user:user});

            }
        })
       });

}

module.exports.savepassword=(req,res)=>{console.log(req.body)
    if(req.body.newpassword==null||req.body.newpassword==''){
        res.json({sucsess:false,message:'Password not provided'});
    }   
    else{
        var password=req.body.newpassword;
        var temptoken='';
        connection.query('UPDATE users SET temptoken = ?,password=? WHERE email = ?',[temptoken,password,req.body.email], function (error, results, fields) {
            if(error){
                res.json({sucsess:false,message:error})
            }
            else{
                res.json({sucsess:true,message:'Password has been reset'});
            }
        })


}
}


var multer  =   require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
      console.log(file);
      callback(null, Date.now()+'-'+file.originalname)
    }
  });

  var upload = multer({storage: storage}).single('photo');


module.exports.savefile=(req,res)=>{console.log('save')
    upload(req,res,function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        //do all database record saving activity
        return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
    });
}

module.exports.users = (req, res, next) =>{
connection.query('SELECT * FROM users WHERE role="user"', function (error, results, fields) {console.log('users')
       let user=results;
       console.log(user)
        if (!results)
        return res.status(404).json({ status: false, message: 'User record not found.' });
    else{
        // console.log('Im in backend');
        return res.send( user);}
      });
  


}


module.exports.readmsg=(req,res)=>{console.log(req.params.file)
    
    connection.query('UPDATE files SET isRead = "yes" where filename = ?',req.params.file, function (error, results, fields) {
        if(error){
          return  res.json({sucsess:false,message:error})
        }
        else{
            return res.json({sucsess:true,message:'message read'});
        }
       });

}

