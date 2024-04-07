import React, { useEffect, useState } from "react"

const Dashboard = ({setAuth}) => {
    const [name, setName] = useState("")

    async function getName() {
        try {
            const response = await fetch("http://localhost:4000/dash/", {
                method: "GET",
                headers: { token: localStorage.token }
            })

            const parseRes = await response.json()
            
            setName(parseRes.first_name)
        } catch (err) {
            console.log(err.message)
        }
    }

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        setAuth(false)
    }

    useEffect(() => {
        getName()
    }, [])
    
    return (
        <>
            <h1>Dashboard {name}</h1>
            <button onClick={e => logout(e)}>Logout</button>
        </>
    )
}

export default Dashboard;