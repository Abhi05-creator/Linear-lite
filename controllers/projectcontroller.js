const Project = require("../models/Projectmodel.js")


const createproject = async (req, res) => {
    const { name, workspaceId } = req.body;
    try {
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Please provide a project name"
            });
        }

        const wsId = workspaceId || req.workspace._id;
        const createProject = await Project.create({
            project_name: name,
            project_workspace_id: wsId,
            project_owner: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "project created successfully",
            createProject
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProject = async (req, res) => {
    try {
        const wsId = req.workspace._id;
        const getproj = await Project.find({
            project_workspace_id: wsId
        }).populate("project_owner", "name");

        res.status(200).json({
            success: true,
            message: "projects fetched successfully",
            getproj
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createproject, getProject }

