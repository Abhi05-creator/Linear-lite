import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getIssues, createIssue, updateIssue, generateDescription } from "../services/api"
import { io } from "socket.io-client"

const socket = io("http://localhost:3000")
const COLUMNS = ["Todo", "In-progress", "In-review", "Done"]

function Board() {
    const { workspaceId, projectId } = useParams()
    const navigate = useNavigate()
    const [issues, setIssues] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        fetchIssues()
        socket.emit("joinWorkspace", workspaceId)

        socket.on("issueUpdated", (data) => {
            setIssues(prev => prev.map(issue =>
                issue._id === data.issueId ? { ...issue, issue_status: data.status } : issue
            ))
        })

        return () => socket.off("issueUpdated")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchIssues = async () => {
        const res = await getIssues(workspaceId, projectId)
        setIssues(res.data.getissue || [])
    }

    const handleCreateIssue = async () => {
        await createIssue(workspaceId, projectId, { title, content: description })
        setTitle("")
        setDescription("")
        fetchIssues()
    }

    const handleGenerateDescription = async () => {
        const res = await generateDescription({ title })
        setDescription(res.data.description)
    }

    const handleStatusChange = async (issueId, newStatus) => {
        await updateIssue(workspaceId, projectId, issueId, { status: newStatus })
        socket.emit("issueUpdated", { workspaceId, issueId, status: newStatus })
    }

    return (
        <div className="board-container">
            <div className="board-header">
                <h2>Kanban Board</h2>
                <button className="btn-secondary" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
            </div>

            <div className="issue-creator">
                <h3 className="section-title" style={{ marginBottom: 0 }}>Create New Issue</h3>
                <div className="row">
                    <input placeholder="Issue title" value={title} onChange={e => setTitle(e.target.value)} />
                    <button className="btn-secondary" onClick={handleGenerateDescription}>✨ Generate Description via AI</button>
                </div>
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <button className="btn-primary" onClick={handleCreateIssue} style={{ alignSelf: "flex-start" }}>Create Issue</button>
            </div>

            <div className="kanban-board">
                {COLUMNS.map(col => (
                    <div key={col} className="kanban-column">
                        <h3>
                            <span>{col}</span>
                            <span style={{ fontSize: "12px", background: "var(--bg-tertiary)", padding: "2px 8px", borderRadius: "10px" }}>
                                {issues.filter(i => i.issue_status === col || (!i.issue_status && col === "Todo")).length}
                            </span>
                        </h3>
                        <div className="issue-list">
                            {issues.filter(i => i.issue_status === col || (!i.issue_status && col === "Todo")).map(issue => (
                                <div key={issue._id} className="issue-card">
                                    <p className="issue-title">{issue.issue_title}</p>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>{issue.issue_content}</p>
                                    <select value={issue.issue_status || "Todo"} onChange={e => handleStatusChange(issue._id, e.target.value)}>
                                        {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board