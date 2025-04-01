const express=require("express");
const app=express();
const cors=require("cors"); 
require("dotenv").config();
require("./connections/connection");
const user=require("./routes/user");
const books=require("./routes/book");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart");
const order = require("./routes/order");
//routes

app.use(cors());
app.use(express.json());
app.use("/api/v1",user);
app.use("/api/v1",cart);
app.use("/api/v1",books);
app.use("/api/v1",favourite);
app.use("/api/v1",order);

app.listen(process.env.PORT,()=>{
    console.log(`app is listening on port ${process.env.PORT}`);
});