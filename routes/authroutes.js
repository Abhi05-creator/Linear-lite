const express=require("express")

const router=express.Router()

const authcontroller=require("../controllers/authcontroller.js")

router.route("/register").post(authcontroller.register)
router.route("/login").post(authcontroller.login) 



module.exports=router