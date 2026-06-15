const express = require("express");
const workspacecontroller = require("../controllers/workspacecontroller.js");
const protect = require("../controllers/authcontroller.js").protect;

const router = express.Router();

router.route('/workspaces').post(protect, workspacecontroller.createWorkspace);
router.route('/workspaces').get(protect, workspacecontroller.getWorkspace);

// Owner-only: set/update/remove the Admin Pass for a workspace
router.route('/workspaces/:workspaceId/set-admin-pass').post(protect, workspacecontroller.setAdminPass);

module.exports = router;
