const mongoose = require("mongoose");


const workspaceSchema = mongoose.Schema({
    workspace_name: {
        type: String,
        required: true
    },
    workspace_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // Hashed passphrase that Admins must supply to perform privileged actions (e.g. create project)
    adminPass: {
        type: String,
        default: null,
        select: false  // Never sent to client by default
    },
    adminPassEnabled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Workspace = mongoose.model("Workspace", workspaceSchema);
module.exports = Workspace