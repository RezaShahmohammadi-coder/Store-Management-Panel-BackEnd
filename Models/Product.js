import "dotenv/config";
import mongoose from "mongoose";
import connectDb from"../DataBase/Connect.js"



const ProductSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },

    description:String,

    image:{
        type: String,
    },

    category:{
      type: String,
        required: true,
        enum:["پیراهن", "شلوار", "لباس"]
    }
});
 export const Product= mongoose.model("Product",ProductSchema)


