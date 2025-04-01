const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

//add book to favourite

router.put("/add-to-favourite",authenticateToken,async(req,res)=>{
    try{
        const bookid= req.headers.bookid;
        const id=req.headers.id;
        const userData = await User.findById(id);
        const isBookFavourite= userData.favourites.includes(bookid);
        if(isBookFavourite){return res.status(200).json({message:"book already in favourire"});}
        await User.findByIdAndUpdate(id,{$push:{favourites:bookid}});
        return res.status(200).json({message:"Book added to favourite"});
        
    }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
});

//delete book from favourite

router.put("/delete-book-from-favourite",authenticateToken,async(req,res)=>{
    try{
        const {bookid,id} = req.headers;
        const userData = await User.findById(id);
        if(!userData){return res.status(500).json({message:"book not available"});}
        await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}});
        return res.status(200).json({message:"book deleted successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server error"});
    }
});

//get-books

router.get("/get-favourite-books",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const userdata = await User.findById(id).populate("favourites");
        const favouriteBooks = userdata.favourites;
        return res.status(200).json({
            status:"success",
            data:favouriteBooks
        })
    }catch(error){
        console.log(error);
        res.status(500).json({message:"An error occoured"});
    }
});



module.exports=router;