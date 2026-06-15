const express = require("express");
const projectcontroller = require("../controllers/projectcontroller.js");
const protect = require("../controllers/authcontroller.js").protect;
const resolveWorkspace = require("../middleware/resolveworkspace.js");
const checkrole = require("../middleware/checkrole.js");

const router = express.Router();

router.post('/:workspaceId/create-project', protect, resolveWorkspace, checkrole, projectcontroller.createproject);
router.get('/:workspaceId/get-projects', protect, resolveWorkspace, projectcontroller.getProject);

module.exports = router;
