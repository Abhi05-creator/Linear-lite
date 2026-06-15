const Comment = require("../models/Comments.js")

const createComment = async (req, res) => {
    const { content } = req.body
    try {
        const createcom = await Comment.create({
            content: content,
            userId: req.user._id,
            issueId: req.params.issueId


        })
        res.status(201).json({
            success: true,
            message: "Comment created",
            createcom
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const getComments = async (req, res) => {
    try {

        const getcom = await Comment.find({ issueId: req.params.issueId })

        res.status(200).json({
            success: true,
            message: "comments retrieved",
            getcom


        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message

        })
    }
}

module.exports = { createComment, getComments }