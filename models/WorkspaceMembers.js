const mongoose = require("mongoose");

const workspacemembersSchema=new mongoose.Schema({
    workspace_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    workspace_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true

    },
    role:{
        type:String,
        enum:["Owner","Admin","Member"],
        default:"Member",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})




const WorkspaceMembers = mongoose.model("WorkspaceMembers", workspacemembersSchema);
module.exports=WorkspaceMembers