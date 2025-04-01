const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

//put book to cart

router.put("/add-to-cart",authenticateToken,async(req,res)=>{
    try{
        const bookid = req.headers["bookid"];
        const id = req.headers["id"];
        const userData = await User.findById(id);
        const isBookInCart = userData.cart.includes(bookid);
        if(isBookInCart){
            return res.json({
                status:"Success",
                message:"book added to cart"
            });
        }
        await User.findByIdAndUpdate(id,{$push:{cart:bookid}});

        return res.status(200).json({message:"book added to cart"});
    }catch(error){
        res.status(500).json({message:"internal Server error"});
    }
});

//remove from cart

router.put("/remove-from-cart/:bookid",authenticateToken,async(req,res)=>{
    try{
        const id = req.headers.id;
        const {bookid} = req.params;
        await User.findByIdAndUpdate(id,{$pull:{cart:bookid}});
        return res.status(200).json({status:"success",message:"book removed from cart"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal Server error"});
    }
});

//show cart

router.get("/get-cart",authenticateToken,async(req,res)=>{
    try{
        const id = req.headers.id;
        const userData = await User.findById(id).populate("cart");
        const cartdata=userData.cart;
        return res.status(200).json({
            status:"success",
            data:cartdata
        });
    }catch(error){
        res.status(500).json({message:"internal Server error"});
    }
});

module.exports = router;
