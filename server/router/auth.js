const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

require('../conn');
const User = require('../schema');
const otp = require('../otp');

router.get('/', (req,res) =>{
    res.send('Hello World from server router');
});

router.post('/register', async(req, res) =>{
    
    //console.log(req.body)
    const { username, email, password } = req.body;

    if (!username || !email || !password){
        return res.status(422).json({error:"Fill all the details"});
    }
    try{
        const userExist = await User.findOne({email: email});

        if (userExist){
            return res.status(422).json({error:"User Exists"});
        }

        const user = new User({username, email, password});

        const userRegister = await user.save();

        if(userRegister){
            const token = await userRegister.generateAuthToken();
            res.cookie("jwtoken", token, {
                //Cookie Expires in 30 days
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });
            res.status(201).json({message:"User Registered successfully"});
        }
        else{
            res.status(500).json({error:"Failed to Register user"});
        }
    }
    catch(err){
        console.log(err);
    }
});

//Login Route
router.post('/signin', async (req,res) =>{
    try{
        //Check if details not empty
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({error: 'Fill Details'})
        }
        
        //Check if Email exists
        const userLogin = await User.findOne({ email: email });

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAuthToken();
            console.log("My JWT Token is:", token);

            res.cookie("jwtoken", token, {
                //Cookie Expires in 30 days
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if(!isMatch){
                res.status(400).json({error:"Invalid Credentials"});
            } 
            else{
                res.json({message:"Login Successful"});
            }
        }
        else{
            res.status(400).json({error:"Invalid Credentials"});
        }
    }
    catch(err){
        console.log(err);
    }
});

//Welcome Page
router.get('/welcome',authenticate, (req,res) => {
    console.log("Hello"+ req.email);
    res.json({data: req.username});
});

router.get('/logout', (req,res) => {
    console.log("Hello Logout page");
    res.clearCookie('jwtoken');
    res.status(200).send('User logged out');
});

//Route to send otp via Email
router.post('/emailsend', async (req, res) => {
    let data = await User.findOne({email:req.body.email});
    //console.log(data);
    const responseType = {};
    if(data){
        let otpCode = Math.floor((Math.random()*10000)+1);
        let otpData = new otp({
            email: req.body.email,
            code: otpCode,
            expiresIn: new Date().getTime() + 300*1000
        })
        let otpResponse = await otpData.save();
        responseType.statusText = "Success";
        //let email = req.body.email
        //mailer(email, otpCode)
        responseType.message = "Otp sent successfully. Check mail"
    }
    else{
        responseType.statusText = "Error";
        responseType.message = "Email doesn't exist"
    }
    res.status(200).json(responseType);
});

//Route to change password
router.post('/changepwd' , async(req, res) => {
    let data = await otp.find({email:req.body.email, code:req.body.otpCode});
    const response = {}
    if(data){
        let currentTime = new Date().getTime();
        let diff = data.expiresIn - currentTime;
        if (diff < 0){
            response.message = "OTP Expired";
            response.statusText = "Error";
        }
        else{
            let user = await User.findOne({email:req.body.email})
            user.password = req.body.newpswd;
            user.save();
            response.message = "Password Updated Successfully";
            response.statusText = "OK";
        }
    }
    else{
        response.message = "Invalid OTP";
        response.statusText = "Error";
        }
    res.status(200).json(response);
});

const mailer = (email, otp) => {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user:'',
            pass:''
        }
    });

    var mailOptions ={
        from: '',
        to: email,
        subject: 'Nodemailer generated mail',
        text: "Your OTP Code is: " + otp
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
        }
        else{
            console.log("Email sent: "+ info.response);
        }
    });
}

module.exports = router;