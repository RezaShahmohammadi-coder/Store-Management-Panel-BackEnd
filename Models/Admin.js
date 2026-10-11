import mongoose from "mongoose"

const AdminSchema= new mongoose.Schema({
    name:{
        type:String,
        required: true,
        maxlength:55,
        minlength:5
    },
    username:{
        type:String,
        required: true,
        maxlength:20,
        minlength:3
    },
    email:{
         type:String,
        required: true,
    },
    password:{
         type:String,
        required: true,
    },
    available:{
          type:String,
        required: true,
    }
})

export const PanelAdmin= mongoose.model("PanelAdmin",AdminSchema )