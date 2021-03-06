var multer = require('multer');
var connection = require('../models/db');
var fs = require('fs');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
    //   cb(null, './uploads')
    const dir = './uploads/admin/'+req.params.sid;
    if (!fs.existsSync(dir))
    fs.mkdir(dir, err => cb(err, dir))
    else
    cb(null,dir)
    },
    filename: (req, file, cb) => {console.log(file.fieldname);
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage:storage}).single('photo');

/** API path that will upload the files */

module.exports.savefile=(req,res)=> {console.log()
    upload(req,res,function(err){
        if(err){console.log(err)
             res.json({error_code:1,err_desc:err});
             return;
        }console.log(req.file.path)
        var file={
            "userId": req.params.id,
            "originalname": req.file.originalname,
            "mimetype": req.file.mimetype,
           "filename": req.file.filename,
            "path": req.file.path,
            "sendto":req.params.sid,
            "time":Date.now()

        }
        
        connection.query('INSERT INTO adminfile SET ?',file, function (error, results, fields) {
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

        //  res.json({error_code:0,err_desc:null});
    });
}

module.exports.files=(req, res, next) => {
console.log(req.params.id)
    connection.query('SELECT * FROM adminfile WHERE sendto=?',req.params.id,function (error, results, fields) {
        console.log(results)
         if (!results)
         return res.status(404).json({ status: false, message: 'User record not found.' });
     else{
        //   return res.status(200).json({ status: true, results});

        
        return res.json(results);
        }
       });
   
}

module.exports.file=(req,res,next)=>{
    connection.query('SELECT * FROM adminfile WHERE to=?',req.params.id, function (error, results, fields) {
        // console.log(results[0].path)
         if (!results)
         return res.status(404).json({ status: false, message: 'User record not found.' });
     else{
        fs.readFile(results[0].path, function(err, items) {
            console.log(items);
       
        return res.send(items);
            
        });

        // return res.download(results[0].path,results[0].originalname)
        }
       });
}

module.exports.userfiles=(req, res, next) => {

    connection.query('SELECT * FROM files',function (error, results, fields) {
        console.log(results)
         if (!results)
         return res.status(404).json({ status: false, message: 'User record not found.' });
     else{
        //   return res.status(200).json({ status: true, results});

        
        return res.json(results);
        }
       });
   
}

module.exports.adminfiles=(req, res, next) => {

    connection.query('SELECT * FROM adminfile inner join users on adminfile.sendto=users._id',function (error, results, fields) {
        console.log(results)
         if (!results)
         return res.status(404).json({ status: false, message: 'User record not found.' });
     else{
        //   return res.status(200).json({ status: true, results});

        
        return res.json(results);
        }
       });
   
}

module.exports.messages=(req, res, next) => {

    connection.query('SELECT * FROM files where isRead="no"',function (error, results, fields) {
        // console.log(results)
         if (!results)
         return res.status(404).json({ status: false, message: 'User record not found.' });
     else{
        //   return res.status(200).json({ status: true, results});

        
        return res.json(results);
        }
       });
   
}



