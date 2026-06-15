const bcrypt = require("bcrypt");
const Workspacemember = require("../models/WorkspaceMembers.js");
const Workspace = require("../models/Workspacemodel.js");

/**
 * checkrole middleware
 *
 * Enforces role-based access for privileged operations (e.g. create project).
 *
 * Rules:
 *  - Owner     → always allowed, no pass required.
 *  - Admin     → allowed only if workspace adminPass is not enabled,
 *                OR if the correct adminPass is supplied in req.body.adminPass.
 *  - Member    → always blocked (403).
 */
const checkrole = async (req, res, next) => {
    try {
        // 1. Find the user's membership record for this workspace
        const membership = await Workspacemember.findOne({
            workspace_user: req.user._id,
            workspace_id: req.workspace._id
        });

        if (!membership) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this workspace."
            });
        }

        const { role } = membership;
        req.role = role;

        // 2. Members are never allowed
        if (role === "Member") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only Owners and Admins can perform this action."
            });
        }

        // 3. Owners are always allowed — skip pass check
        if (role === "Owner") {
            return next();
        }

        // 4. Admin — check if workspace has admin pass protection enabled
        // Re-fetch workspace with adminPass field (excluded by default via select:false)
        const workspace = await Workspace.findById(req.workspace._id).select("+adminPass +adminPassEnabled");

        if (!workspace.adminPassEnabled) {
            // No admin pass set on this workspace — Admin may proceed freely
            return next();
        }

        // Admin pass is enabled — validate the supplied pass
        const { adminPass } = req.body;
        if (!adminPass) {
            return res.status(403).json({
                success: false,
                message: "This workspace requires an Admin Pass to perform this action."
            });
        }

        const isMatch = await bcrypt.compare(adminPass, workspace.adminPass);
        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: "Incorrect Admin Pass. Access denied."
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = checkrole;
