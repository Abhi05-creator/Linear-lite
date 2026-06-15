const axios = require("axios")

const BASE = "http://localhost:3000/api/v1"
let token1, token2, workspaceId, projectId, issueId

const test = async () => {
    try {
        // 1. Register User 1
        console.log("1. Registering User 1...")
        const reg1 = await axios.post(`${BASE}/auth/register`, {
            name: "Abhijit", email: "abhijit@test.com", password: "123456", confirmPassword: "123456"
        })
        token1 = reg1.data.token
        console.log("✅ User 1 registered")

        // 2. Register User 2
        console.log("2. Registering User 2...")
        const reg2 = await axios.post(`${BASE}/auth/register`, {
            name: "Rohan", email: "rohan@test.com", password: "123456", confirmPassword: "123456"
        })
        token2 = reg2.data.token
        console.log("✅ User 2 registered")

        // 3. User 1 creates workspace
        console.log("3. Creating workspace...")
        const ws = await axios.post(`${BASE}/workspaces`, { workspace_name: "Test Workspace" }, {
            headers: { Authorization: `Bearer ${token1}` }
        })
        workspaceId = ws.data.workspace._id
        console.log("✅ Workspace created:", workspaceId)

        // 4. User 2 tries to create project (should fail - not a member)
        console.log("4. User 2 tries to create project (should fail)...")
        try {
            await axios.post(`${BASE}/workspaces/${workspaceId}/create-project`, { name: "Test Project" }, {
                headers: { Authorization: `Bearer ${token2}` }
            })
            console.log("❌ Should have failed")
        } catch (err) {
            console.log("✅ Correctly blocked:", err.response.data.message)
        }

        // 5. User 1 creates project
        console.log("5. User 1 creates project...")
        const proj = await axios.post(`${BASE}/workspaces/${workspaceId}/create-project`, { name: "Test Project" }, {
            headers: { Authorization: `Bearer ${token1}` }
        })
        projectId = proj.data.createProject._id
        console.log("✅ Project created:", projectId)

        // 6. Create issue
        console.log("6. Creating issue...")
        const issue = await axios.post(`${BASE}/workspaces/${workspaceId}/projects/${projectId}/issues`, {
            title: "Fix bug", issue_content: "This is a bug"
        }, { headers: { Authorization: `Bearer ${token1}` } })
        issueId = issue.data.issue._id
        console.log("✅ Issue created:", issueId)

        // 7. Update issue status
        console.log("7. Updating issue status to Done...")
        await axios.patch(`${BASE}/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}`, {
            status: "Done"
        }, { headers: { Authorization: `Bearer ${token1}` } })
        console.log("✅ Issue updated to Done")

        console.log("\n🎉 All tests passed!")

    } catch (err) {
        console.log("❌ Error:", err.response?.data || err.message)
    }
}

test()