const mongoose =require("mongoose");
const validator=require("validator");
const bcrypt =require("bcrypt")


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"invalid email"]
    

    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
    

})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){   
        return
    }
    this.password= await bcrypt.hash(this.password,10)
})

const User=mongoose.model("User",userSchema);
module.exports=User

