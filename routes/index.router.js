const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const filecntrl=require('../controllers/userfile');
const admincntrl=require('../controllers/adminfile')

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.get('/getname/:email', ctrlUser.getname);
router.put('/rstpw',ctrlUser.puttoken);
router.get('/resetpassword/:token', ctrlUser.rstpw);
router.put('/savepassword',ctrlUser.savepassword);
router.get('/users', ctrlUser.users);
router.get('/readmsg/:file',ctrlUser.readmsg);

router.post('/upload/:id',filecntrl.savefile);
router.post('/updateprofilepic/:id',filecntrl.updateprofilepic);
router.get('/files/:id',filecntrl.files)
router.get('/file/:filename',filecntrl.file)
router.get('/adminfile/:filename',filecntrl.adminfile)

router.post('/upload/:id/:sid',admincntrl.savefile);
router.get('/rfiles/:id',admincntrl.files)
router.get('/userfiles',admincntrl.userfiles)
router.get('/admindoc',admincntrl.adminfiles)
router.get('/messages',admincntrl.messages)

router.post('/block',ctrlUser.block);
router.post('/unblock',ctrlUser.unblock);
router.post('/username',ctrlUser.username)
// router.get('/file/:filename',filecntrl.file)
module.exports = router;



