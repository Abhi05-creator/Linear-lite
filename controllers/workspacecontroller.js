const bcrypt = require("bcrypt")
const Workspace = require("../models/Workspacemodel.js")
const Workspacemember = require("../models/WorkspaceMembers.js")
const createWorkspace = async (req, res) => {
    const workspacename = req.body.workspace_name || req.body.workspacename;
    try {
        const workspace = await Workspace.create({
            workspace_name: workspacename,
            workspace_owner: req.user._id,



        })
        const workspacemember = await Workspacemember.create({
            workspace_id: workspace._id,
            workspace_user: req.user._id,
            role: "Owner"


        })
        res.status(200).json({
            success: true,
            message: "workspace created successfully",
            workspace

        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

const getWorkspace = async (req, res) => {
    try {
        const wmember = await Workspacemember.find({ workspace_user: req.user._id }).populate("workspace_id")
        const workspacelist = wmember
            .map(m => {
                if (!m.workspace_id) return null;
                const workspaceObj = m.workspace_id.toObject();
                workspaceObj.role = m.role;
                return workspaceObj;
            })
            .filter(w => w !== null);

        console.log(workspacelist)
        res.status(200).json({
            success: true,
            message: "workspace fetched successfully",
            workspacelist
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

/**
 * setAdminPass  –  Owner-only
 * POST /api/v1/workspaces/:workspaceId/set-admin-pass
 * Body: { adminPass: "<new pass>" }  or { adminPass: "" } to disable
 */
const setAdminPass = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;

        // Verify requester is Owner
        const membership = await Workspacemember.findOne({
            workspace_user: req.user._id,
            workspace_id: workspaceId
        });

        if (!membership || membership.role !== "Owner") {
            return res.status(403).json({
                success: false,
                message: "Only the workspace Owner can set the Admin Pass."
            });
        }

        const { adminPass } = req.body;

        if (!adminPass || adminPass.trim() === "") {
            // Disable admin pass protection
            await Workspace.findByIdAndUpdate(workspaceId, {
                adminPass: null,
                adminPassEnabled: false
            });
            return res.status(200).json({
                success: true,
                message: "Admin Pass protection has been disabled."
            });
        }

        const hashed = await bcrypt.hash(adminPass, 12);
        await Workspace.findByIdAndUpdate(workspaceId, {
            adminPass: hashed,
            adminPassEnabled: true
        });

        return res.status(200).json({
            success: true,
            message: "Admin Pass has been set. Admins must now provide it to create projects."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createWorkspace, getWorkspace, setAdminPass };
