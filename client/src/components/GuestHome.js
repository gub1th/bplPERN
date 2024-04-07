import React from 'react'
import { Link, useNavigate } from "react-router-dom"

const GuestHome = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>WELCOME TO</h1>
            <h1>Beer Pong League</h1>

            <p>
                This is it. Your time to shine. To solidify your name in
                Phi Delt History. In this league, winners are born. 
                Losers are swept. Everyone else is ready, so are you?
            </p>

            <button onClick={() => navigate('/login')}>LOGIN</button>
            <button onClick={() => navigate('/register')}>REGISTER</button>
        </div>
    )
}

export default GuestHome;