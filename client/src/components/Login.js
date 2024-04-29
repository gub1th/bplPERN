import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const Login = ({setAuth}) => {
    const navigate = useNavigate(); // Use the useNavigate hook to access the navigate function

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    }) 

    const { email, password } = inputs

    const onSubmitForm = async (e) => {
        e.preventDefault()

        const body = { email, password }

        try {
            const response = await fetch("http://localhost:4000/auth/login", {
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
            console.log(err)
        }

    }

    const onChange = e => {
        setInputs({...inputs, [e.target.name] : e.target.value})
    }

    const handleGoogleCallback = async () => {      
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
      
          if (token) {
            localStorage.setItem('token', token);
            setAuth(true);
            navigate('/dashboard'); // Navigate to the dashboard route
          } else {
            setAuth(false);
          }
        } catch (error) {
          console.error(error);
        }
    };

    useEffect(() => {
        handleGoogleCallback();
      }, []);

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={onSubmitForm}>
                <label>Email</label>
                <input type="email" name="email" placeholder="email" value={email} onChange={onChange}/>
                <label>Password</label>
                <input type="password" name="password" placeholder="password" value={password} onChange={onChange}/>

                <button type="submit">Submit</button>
            </form>
            <a href="http://localhost:4000/oauth/google/redirect">Login With Google</a>
            <Link to="/register">Register</Link>
        </>
    )
}

export default Login;