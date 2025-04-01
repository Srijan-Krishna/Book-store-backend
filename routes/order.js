const router = require("express").Router();
const {authenticateToken} = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

//place order
router.post("/place-order",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const userData=await User.findById(id);
        const cartData=userData.cart;
        for(Data of cartData){
            const newOrder=new Order({
                user:id,
                book:Data,
                status:"order placed"
            });
            await newOrder.save();
            await User.findByIdAndUpdate(id,{$push:{order:newOrder._id}});
            await User.findByIdAndUpdate(id,{$pull:{cart:Data}});
        }

        return res.status(200).json({message:"Order placed successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
});

//get order history

router.get("/get-order-history",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
            path:"order",
            populate:{path:"book"}
        });

        const ordersData = userData.order.reverse();
        return res.status(200).json({
            status:"Success",
            data:ordersData
        });

    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
});

router.get("get-all-order",authenticateToken,async(req,res)=>{
    try{
        const userData = await Order.find().populate({
            path:"book",
        }).populate({
            path:"user",
        }).sort({createdAt:-1});
        return res.json({
            status:"success",
            data:userData
        })
    }catch{
        res.status(500).json({message:"internal server error"});
    }
});

//update order

router.put("update-status/:id",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.params;
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({
            status:"successful",
            message:"updated"
        })
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});

module.exports = router;