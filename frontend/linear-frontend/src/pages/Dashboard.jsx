import { useState, useEffect } from "react"
import { getWorkspaces, createWorkspace, getProjects, createProject, setAdminPass } from "../services/api"
import { useNavigate } from "react-router-dom"

const ROLE_COLORS = {
    Owner: "role-badge role-owner",
    Admin: "role-badge role-admin",
    Member: "role-badge role-member",
}

function AdminPassModal({ workspaceId, onClose, onConfirm }) {
    const [pass, setPass] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!pass) { setError("Please enter the Admin Pass."); return }
        setLoading(true)
        setError("")
        try {
            await onConfirm(pass)
        } catch (err) {
            setError(err?.response?.data?.message || "Incorrect Admin Pass.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h3 className="modal-title">🔐 Admin Pass Required</h3>
                <p className="modal-subtitle">
                    This workspace requires an Admin Pass to create projects. Enter it below.
                </p>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter Admin Pass"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        autoFocus
                    />
                    {error && <p className="modal-error">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Verifying…" : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function SetAdminPassPanel({ workspaceId, onSaved }) {
    const [pass, setPass] = useState("")
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus("")
        try {
            const res = await setAdminPass(workspaceId, { adminPass: pass })
            setStatus(res.data.message)
            setPass("")
            if (onSaved) onSaved()
        } catch (err) {
            setStatus(err?.response?.data?.message || "Failed to update Admin Pass.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-pass-panel">
            <h4 className="admin-pass-title">🛡️ Admin Pass Settings</h4>
            <p className="admin-pass-subtitle">
                Set a passphrase that Admins must enter to create projects. Leave blank to disable protection.
            </p>
            <form className="admin-pass-form" onSubmit={handleSave}>
                <input
                    type="password"
                    placeholder="New Admin Pass (leave blank to disable)"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                />
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Saving…" : "Save Admin Pass"}
                </button>
            </form>
            {status && <p className="admin-pass-status">{status}</p>}
        </div>
    )
}

function Dashboard() {
    const [workspaces, setWorkspaces] = useState([])
    const [projects, setProjects] = useState([])
    const [selectedWorkspace, setSelectedWorkspace] = useState(null)
    const [workspaceName, setWorkspaceName] = useState("")
    const [projectName, setProjectName] = useState("")
    const [showAdminModal, setShowAdminModal] = useState(false)
    const [pendingProjectName, setPendingProjectName] = useState("")
    const [createError, setCreateError] = useState("")
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    useEffect(() => {
        fetchWorkspaces()
    }, [])

    const fetchWorkspaces = async () => {
        const res = await getWorkspaces()
        setWorkspaces(res.data.workspacelist || [])
    }

    const handleCreateWorkspace = async () => {
        if (!workspaceName.trim()) return
        await createWorkspace({ workspacename: workspaceName })
        setWorkspaceName("")
        fetchWorkspaces()
    }

    const handleSelectWorkspace = async (workspace) => {
        setSelectedWorkspace(workspace)
        setCreateError("")
        const res = await getProjects(workspace._id)
        setProjects(res.data.getproj)
    }

    // Called when "Create Project" is clicked
    const handleCreateProjectClick = () => {
        if (!projectName.trim()) return
        setCreateError("")

        const role = selectedWorkspace?.role
        if (role === "Member") return  // guarded by UI, but safety check

        // If Admin, we need to show admin pass modal (backend will also validate)
        if (role === "Admin") {
            setPendingProjectName(projectName)
            setShowAdminModal(true)
            return
        }

        // Owner — proceed directly
        doCreateProject(projectName)
    }

    // Execute the actual project creation. adminPass optional (required for Admin if enabled)
    const doCreateProject = async (name, adminPass) => {
        try {
            const payload = { name }
            if (adminPass) payload.adminPass = adminPass
            await createProject(selectedWorkspace._id, payload)
            setProjectName("")
            setPendingProjectName("")
            setShowAdminModal(false)
            handleSelectWorkspace(selectedWorkspace)
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to create project."
            setCreateError(msg)
            throw err  // re-throw so modal can catch it
        }
    }

    const userRole = selectedWorkspace?.role
    const canCreateProject = userRole === "Owner" || userRole === "Admin"

    return (
        <div className="dashboard-container">
            {showAdminModal && (
                <AdminPassModal
                    workspaceId={selectedWorkspace?._id}
                    onClose={() => setShowAdminModal(false)}
                    onConfirm={(pass) => doCreateProject(pendingProjectName, pass)}
                />
            )}

            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="creation-box">
                <input
                    placeholder="Workspace name"
                    value={workspaceName}
                    onChange={e => setWorkspaceName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCreateWorkspace()}
                />
                <button className="btn-primary" onClick={handleCreateWorkspace}>Create Workspace</button>
            </div>

            <h3 className="section-title">Your Workspaces</h3>
            <div className="workspace-list">
                {workspaces.map(w => (
                    <div
                        key={w._id}
                        onClick={() => handleSelectWorkspace(w)}
                        className={`workspace-card ${selectedWorkspace?._id === w._id ? "active" : ""}`}
                    >
                        <h4>{w.workspace_name}</h4>
                        <div className="workspace-card-meta">
                            <span className={ROLE_COLORS[w.role] || "role-badge role-member"}>{w.role}</span>
                            <span>→</span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedWorkspace && (
                <div className="projects-section">
                    <div className="projects-header">
                        <h3 className="section-title">
                            Projects in <span className="workspace-name-highlight">{selectedWorkspace.workspace_name}</span>
                        </h3>
                        <span className={ROLE_COLORS[userRole] || "role-badge role-member"}>
                            Your role: {userRole}
                        </span>
                    </div>

                    {/* Project creation — only visible to Owner / Admin */}
                    {canCreateProject ? (
                        <div className="creation-box">
                            <input
                                placeholder="Project name"
                                value={projectName}
                                onChange={e => setProjectName(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleCreateProjectClick()}
                            />
                            <button className="btn-primary" onClick={handleCreateProjectClick}>
                                {userRole === "Admin" ? "🔐 Create Project" : "Create Project"}
                            </button>
                        </div>
                    ) : (
                        <div className="access-denied-banner">
                            🔒 You have <strong>Member</strong> access — only Owners and Admins can create projects.
                        </div>
                    )}

                    {createError && <p className="create-error">{createError}</p>}

                    {/* Owner-only: Admin Pass settings panel */}
                    {userRole === "Owner" && (
                        <SetAdminPassPanel
                            workspaceId={selectedWorkspace._id}
                            onSaved={() => handleSelectWorkspace(selectedWorkspace)}
                        />
                    )}

                    <div className="project-grid">
                        {projects.map(p => (
                            <div
                                key={p._id}
                                onClick={() => navigate(`/board/${selectedWorkspace._id}/${p._id}`)}
                                className="project-card"
                            >
                                <h4>{p.project_name}</h4>
                                <p>Open project board to view and manage issues.</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard