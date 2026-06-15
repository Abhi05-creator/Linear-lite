import axios from "axios"

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1"
})

// automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const register = (data) => API.post("/register", data)
export const login = (data) => API.post("/login", data)
export const getWorkspaces = () => API.get("/get-workspace")
export const createWorkspace = (data) => API.post("/create-workspace", data)
export const getProjects = (workspaceId) => API.get(`/workspaces/${workspaceId}/get-projects`)
export const createProject = (workspaceId, data) => API.post(`/workspaces/${workspaceId}/create-project`, data)
export const setAdminPass = (workspaceId, data) => API.post(`/workspaces/${workspaceId}/set-admin-pass`, data)
export const getIssues = (workspaceId, projectId) => API.get(`/workspaces/${workspaceId}/${projectId}/get-issues`)
export const createIssue = (workspaceId, projectId, data) => API.post(`/workspaces/${workspaceId}/${projectId}/create-issue`, data)
export const updateIssue = (workspaceId, projectId, issueId, data) => API.put(`/workspaces/${workspaceId}/${projectId}/${issueId}/update-issue`, data)
export const generateDescription = (data) => API.post("/ai/generate-description", data)
