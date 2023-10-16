const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://127.0.0.1:27017/products", {useNewUrlParser:true, useUnifiedTopology:true}).then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log(err);
})

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

const productSchema = new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
})

const Product = new mongoose.model("Product", productSchema);

// API to create new product
app.post("/api/v1/newproduct", async (req, res) => {
    try 
    {
        const product = await Product.create(req.body);

        res.status(201).json({
            success:true,
            product
        })
    }
    catch(e)
    {
        console.log("error occured!");
        console.log(e);
    }
})

// API to get the products
app.get("/api/v1/products", async (req, res) => {
    try
    {
        const products = await Product.find();

        res.status(200).json({
            success:true,
            products
        })
    }
    catch(e)
    {
        console.log("error occured!");
        console.log(e);
    }
})
    

// API to update product
app.put("/api/v1/product/:id", async (req, res) => {
    try
    {
        let product = await Product.findById(req.params.id);

        product = await Product.findByIdAndUpdate(req.params.id,req.body, {new:true, useFindAndModify:true, runValidators:true})
        res.status(200).json({
            success:true,
            product
        })
    }
    catch(e)
    {
        console.log("error occured!");
        console.log(e);
    }
})

// API to delete product
app.delete("/api/v1/product/:id", async (req, res) => {
    try
    {
        const product = await Product.findById(req.params.id);
        
        if(!product)
        {
            return res.status(500).json({
                success:false,
                message:"product not found",
            })
        }

        await product.remove();

        res.status(200).json({
            success:true,
            message:"product deleted successfully",
        })
    }
    catch(e)
    {
        console.log("error occured!");
        console.log(e);
    }
})

app.listen(5001, () => {
    console.log('server is working at port 5001');
});