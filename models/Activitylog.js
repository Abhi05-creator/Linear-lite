const mongoose=require("mongoose")

const activitylogSchema=mongoose.Schema({ 
     issueId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Issue",
        required:true
     },
     createdAT:{
        type:Date,
        default:Date.now()
     },

     projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
     },
     activityContent:{
        type:String,
        required:true
     },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
     }
     
    
})

const Activitylog=mongoose.model("Activitylog",activitylogSchema);
module.exports=Activitylog;