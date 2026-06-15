const express = require("express");
const commentcontroller = require("../controllers/commentcontroller.js");
const protect = require("../controllers/authcontroller.js").protect;

const router = express.Router();

router.route('/:issueId/add-comment').post(protect, commentcontroller.createComment);
router.route('/:issueId/get-comments').get(protect, commentcontroller.getComments);

module.exports = router;
