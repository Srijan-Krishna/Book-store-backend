const router = require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");

//Sign Up

router.post("/sign-up",async(req,res)=>{
    try{
        const {username,email,password,address}=req.body;

        if(username.length<=4){return res.status(400).json({message:"Username should be greater than 4"});}
        //check uniqueness
        
        const existingUsername=await User.findOne({username:username});
        if(existingUsername){
            return res.status(400).json({message:"Username already existes"});
        }
        const existingEmail= await User.findOne({email:email});
        if(password.length<=5){res.status(400).json({message:"password length"});}
        const hashPass = await bcrypt.hash(password,10);
        const newUser=new User({username:username,password:hashPass,email:email,address:address});
        await newUser.save();
        return res.status(200).json({message:"signup successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});

//Sign-in

router.post("/sign-in",async(req,res)=>{
    try{
        const {username,password}=req.body;
        const existingUsername=await User.findOne({username:username});
        if(!existingUsername){res.status(500).json({message:"wrong credientials"});}
        await bcrypt.compare(password,existingUsername.password,(err,data)=>{
            if(data){
                const authClaims=[{
                    name:existingUsername.username
                },{role:existingUsername.role}]
                const token = jwt.sign({authClaims},"bookstore347",{
                    expiresIn:"30d"
                });
               return res.status(200).json({id:existingUsername._id,role:existingUsername.role,token:token});
            }else{
               return res.status(400).json({message:"Invalid Credentials"});
            }
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});

//get user-information

router.get("/get-user",authenticateToken,async(req,res)=>{
    try{
        const id = req.headers.id;
        const data = await User.findById(id);
        return res.status(200).json(data);
    }catch(error){
        res.status(500).json({message:"internal error"});
    }
});

//update

router.put("/update-address",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id,{address:address});
        return res.status(200).json({message:"Address updated"});
    }catch(error){

        console.log(error);
        res.status(500).json({message:"internal error"});
    }
});



module.exports=router;