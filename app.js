const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://127.0.0.1:27017/products", {useNewUrlParser:true, useUnifiedTopology:true}).then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log(err);
})

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json);

const productSchema = new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
})

const Product = new mongoose.model("Product", productSchema);

// API to create the product
app.post("api/v1/newproduct", async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
})

// API to get the products
app.get("api/v1/products", async (req, res) => {
    const products = await Product.find();

    res.status(200).json({
        success:true,
        products
    })
})

app.listen(5001, () => {
    console.log('server is working at port 5001');
})