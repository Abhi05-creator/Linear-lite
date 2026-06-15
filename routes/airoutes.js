const express = require("express")
const protect = require("../controllers/authcontroller.js").protect
const generativedescription = require("../controllers/ai.controller.js")
const router = express.Router()



router.route("/ai/generate-description").post(protect, generativedescription)

module.exports = router 
