import { useState } from "react"
import { login } from "../services/api"
import { useNavigate } from "react-router-dom"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await login({ email, password })
            localStorage.setItem("token", res.data.token)
            navigate("/dashboard")
        } catch (error) {
            alert(error.response?.data?.message || "Login failed")
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <p className="subtitle">Welcome back! Access your workspaces.</p>
                <form className="auth-form" onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button className="btn-primary" type="submit">Login</button>
                </form>
                <p className="auth-footer">No account? <a href="/register">Register</a></p>
            </div>
        </div>
    )
}

export default Login