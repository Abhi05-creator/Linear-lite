const mongoose = require("mongoose"); 

const commentSchema=mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    issueId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Issue",
        required:true
    }

})
  
const Comment=mongoose.model("Comment",commentSchema)
module.exports=Comment