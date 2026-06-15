const Issue = require("../models/Issuemodel.js")
const Project = require("../models/Projectmodel.js")
const Activity = require("../models/Activitylog.js")


const createIssue = async (req, res) => {
    const { title, content, assignedTo, status } = req.body
    // support both 'content' and 'issue_content' field names
    const issueContent = content || req.body.issue_content
    const issueTitle = title || req.body.issue_title
    const { projectId } = req.params
    try {
        const issue = await Issue.create({
            issue_title: issueTitle,
            issue_content: issueContent,
            issue_assignedTo: assignedTo,
            issue_project_id: projectId,
            issue_created_id: req.user._id,
            issue_status: status || "Todo",
        })
        return res.status(201).json({
            success: true,
            message: "issue created successfully",
            issue
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message

        })
    }
}


const getIssues = async (req, res) => {
    try {
        const issues = await Issue.find({
            issue_project_id: req.params.projectId
        })
        return res.status(200).json({
            success: true,
            message: issues.length ? "issues fetched successfully" : "no issues found",
            issues
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

const deleteIssue = async (req, res) => {
    const { projectId } = req.params
    const { issueId } = req.params
    try {
        const deleteissue = await Issue.findByIdAndDelete(issueId)
        if (!deleteissue) {
            return res.status(404).json({
                success: false,
                message: "issue not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "issue deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message

        })
    }

}

const updateIssue = async (req, res) => {
    const { issueId } = req.params
    const { title, content, assignedTo, status } = req.body
    const activity = req.body.activity
    const newupdate = {}
    
    try {
        if (title) {
            newupdate.issue_title = title
            await Activity.create({
                issueId,
                activityContent: `issue title changed to ${title}`,
                userId: req.user._id,
                projectId: req.params.projectId
            })
        }
        if (content) {
            newupdate.issue_content = content
            await Activity.create({
                issueId,
                activityContent: `issue content changed to ${content}`,
                userId: req.user._id,
                projectId: req.params.projectId
            })
        }
        if (assignedTo) {
            newupdate.issue_assignedTo = assignedTo
            await Activity.create({
                issueId,
                activityContent: `issue assigned to ${assignedTo}`,
                userId: req.user._id,
                projectId: req.params.projectId
            })
        }
        if (status) {
            newupdate.issue_status = status
            await Activity.create({
                issueId,
                activityContent: `issue status changed to ${status}`,
                userId: req.user._id,
                projectId: req.params.projectId
            })
        }

        if (newupdate.issue_status === 'Done') {
            newupdate.completedAt = Date.now()
        }

        const updateissue = await Issue.findByIdAndUpdate(issueId, newupdate, { new: true })
        return res.status(200).json({
            success: true,
            message: "issue updated successfully",
            updateissue
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



module.exports = { createIssue, getIssues, deleteIssue, updateIssue };
