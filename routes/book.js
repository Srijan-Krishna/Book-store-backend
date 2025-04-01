const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");

//add book admin
router.post("/add-book",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const user = await User.findById(id);
        
        const book=new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
        });
        await book.save();
        res.status(200).json({message:"Book added successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
});

//update book

router.put("/update-book",authenticateToken,async(req,res)=>{
    try{
    const {bookid} = req.headers;
    await Book.findByIdAndUpdate(bookid,{
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
    });
    return res.status(200).json({message:"Book updated"});
}catch(error){
    res.status(500).json({message:"Internal server error"});
}
});

//delete book

router.delete("/delete-book",authenticateToken,async(req,res)=>{
    try{
        const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({message:"Book deleted"});
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});
 
//get all books

router.get("/get-books",async(req,res)=>{
    try{
        const books = await Book.find().sort({createdAt:-1});
        res.status(200).json({
            status:"success",
            data:books
        });
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});

router.get("/get-recent-books",async(req,res)=>{
    try{
        const books = await Book.find().sort({createdAt:-1}).limit(4);
        res.status(200).json({
            status:"success",
            data:books
        });
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});

//get book by id

router.get("/get-book-by-id/:bookid",async(req,res)=>{
    try{
        const {bookid} = req.params;
        const book = await Book.findById(bookid);
        res.status(200).json({
            status:"success",
            data:book
        });
    }catch(error){
        res.status(500).json({message:"internal server error"});
    }
});


module.exports=router;