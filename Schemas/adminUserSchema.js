const mongoose= require("mongoose")
const Schema = mongoose.Schema
let crypto = require("crypto")

const adminUserSchema = new Schema({
    username:{
        type:String,
        required:true,
        default:"Robertas"
    },
    admin:{
        type:Boolean,
        required:true
    },
   
   password:{
    type:String,
    requirted:true
   }
    
})



module.exports = mongoose.model("adminUserSchema", adminUserSchema)