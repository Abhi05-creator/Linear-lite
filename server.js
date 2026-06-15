const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "./config.env" });
console.log(process.env.MONGODB_URI)
const authroutes = require("./routes/authroutes")
const workspaceroutes = require("./routes/workspaceroutes")
const issueroutes = require("./routes/issueroutes")
const commentsroute = require("./routes/commentsroute")
const projectroutes = require("./routes/projectroutes")
const airoutes = require("./routes/airoutes")

const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS allowed origin "*"
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Configure Socket.io connections
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinWorkspace", (workspaceId) => {
        socket.join(workspaceId);
        console.log(`User ${socket.id} joined workspace ${workspaceId}`);
    });

    socket.on("issueUpdated", (data) => {
        // Broadcast issueUpdated to everyone in workspace (except the sender or to all)
        socket.to(data.workspaceId).emit("issueUpdated", data);
        console.log(`Issue updated in workspace ${data.workspaceId}:`, data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://reddyabhijit2405_db_user1:QMBon4soFR2q9hOP@cluster0.rzolk1t.mongodb.net/linear-lite?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use(cors({
    origin: "*",
}))

app.use('/api/v1/auth', authroutes);
app.use('/api/v1', workspaceroutes);
app.use('/api/v1/workspaces', issueroutes);
app.use('/api/v1/', commentsroute);
app.use('/api/v1/workspaces', projectroutes);
app.use('/api/v1', airoutes);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
