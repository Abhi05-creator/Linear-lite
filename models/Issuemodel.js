const mongoose=require("mongoose")

const issueSchema=new mongoose.Schema({

    issue_title:{
        type:String,
        required:true
    },
    issue_content:{
        type:String,
        required:true
    },
    issue_created_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    issue_project_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    issue_assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:["Todo","In-progress","In-review","Done"],
        
    },
    completedAT:{
        type:Date,
        
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
    
})

const Issue=mongoose.model("Issue",issueSchema)
module.exports=Issue