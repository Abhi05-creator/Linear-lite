const Workspace = require("../models/Workspacemodel.js");

const resolveworkspace = async (req, res, next) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId) {
            return res.status(400).json({
                success: false,
                message: "Workspace ID is required"
            });
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found"
            });
        }

        req.workspace = workspace;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = resolveworkspace;
