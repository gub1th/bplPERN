import React from 'react'
import { Link } from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = ({isAuthenticated}) => {

    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        <span className="link-text k2d-bold" id="logo-text">BPL</span>
                    </Link>
                </li>
                {isAuthenticated && (
                    <>
                        <li className="nav-item">
                            <Link to="/tournaments" className="nav-link">
                                <span className="link-text">TOURNAMENTS</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/players" className="nav-link">
                                <span className="link-text">PLAYERS</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/rankings" className="nav-link">
                                <span className="link-text">RANKINGS</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/profile" className="nav-link">
                                <span className="link-text">PROFILE</span>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Header;