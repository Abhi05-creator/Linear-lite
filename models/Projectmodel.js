const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: true
    },project_workspace_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
        

    },
    project_owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

}) 
const Project = mongoose.model("Project", projectSchema);
module.exports=Project
