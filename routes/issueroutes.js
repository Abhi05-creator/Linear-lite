const express = require("express");
const issuecontroller = require("../controllers/issuecontroller.js");
const protect = require("../controllers/authcontroller.js").protect;
const resolveWorkspace = require("../middleware/resolveworkspace.js");

const router = express.Router();

// REST-style routes matching: /api/v1/workspaces/:workspaceId/projects/:projectId/issues
router.route('/:workspaceId/projects/:projectId/issues').post(protect, resolveWorkspace, issuecontroller.createIssue);
router.route('/:workspaceId/projects/:projectId/issues').get(protect, resolveWorkspace, issuecontroller.getIssues);
router.route('/:workspaceId/projects/:projectId/issues/:issueId').delete(protect, resolveWorkspace, issuecontroller.deleteIssue);
router.route('/:workspaceId/projects/:projectId/issues/:issueId').put(protect, resolveWorkspace, issuecontroller.updateIssue);
router.route('/:workspaceId/projects/:projectId/issues/:issueId').patch(protect, resolveWorkspace, issuecontroller.updateIssue);

module.exports = router;
