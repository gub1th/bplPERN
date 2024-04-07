import React from 'react'
import { Link } from "react-router-dom"

const Header = ({isAuthenticated}) => {

    return (
        <header>
            <nav>
                <Link to="/">BPL</Link>
                {isAuthenticated && (
                    <>
                        <Link to="/tournaments">TOURNAMENTS</Link>
                        <Link to="/players">PLAYERS</Link>
                        <Link to="/gallery">GALLERY</Link>
                        <Link to="/profile">PROFILE</Link>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header;