import { useState } from "react"
import { register } from "../services/api"
import { useNavigate } from "react-router-dom"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const res = await register({ name, email, password, confirmpassword: password })
            localStorage.setItem("token", res.data.token)
            navigate("/dashboard")
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed")
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Register</h2>
                <p className="subtitle">Create an account to start managing projects.</p>
                <form className="auth-form" onSubmit={handleRegister}>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button className="btn-primary" type="submit">Register</button>
                </form>
                <p className="auth-footer">Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    )
}

export default Register