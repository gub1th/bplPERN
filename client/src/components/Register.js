import React, { useState } from "react"
import { Link } from "react-router-dom"
import './Register.css';

const Register = ({setAuth}) => {
    const [inputs, setInputs] = useState({
        first_name: "",
        last_name: "",
        nickname: "",
        email: "",
        password: "",
        active: true,
    })

    const { first_name, last_name, nickname, email, password } = inputs

    const onSubmitForm = async (e) => {
        e.preventDefault()

        const body = { email, password, nickname, first_name, last_name }

        try {
            const response = await fetch("http://localhost:4000/auth/register", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(body)
            })

            const parseRes = await response.json()

            if (parseRes.token) {   
                localStorage.setItem("token", parseRes.token)
                setAuth(true)
            } else {
                setAuth(false)
            }
            

        } catch (err) {
            console.log(err.message)
        }
    }

    const onChange = e => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={onSubmitForm}>
                <label>First Name</label>
                <input
                    type="text"
                    name="first_name"
                    placeholder="first Name"
                    value={first_name}
                    onChange={onChange}
                />
                <label>Last Name</label>
                <input
                    type="text"
                    name="last_name"
                    placeholder="last Name"
                    value={last_name}
                    onChange={onChange}
                />
                <label>Nickname</label>
                <input
                    type="text"
                    name="nickname"
                    placeholder="nickname"
                    value={nickname}
                    onChange={onChange}
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={email}
                    onChange={onChange}
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={onChange}
                />
                <button type="submit">Register</button>
            </form>
            <Link to="/login">Login</Link>
        </>
    )
}

export default Register;