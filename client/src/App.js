import React, { useState, useEffect } from 'react'
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import GuestHome from "./components/GuestHome"
import Layout from "./components/Layout"
import ProfilePage from "./components/ProfilePage"
import Rankings from "./components/Rankings"
import Tournaments from './components/Tournaments';
import TournamentDetails from './components/TournamentDetails';
import BracketDetails from './components/BracketDetails';
import MatchDetails from './components/MatchDetails';
import Players from './components/Players';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean)
  }

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:4000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token }
      })
      const parseRes = await response.json()
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false)

    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    isAuth()
  }, [])

  return (
    <>
      <Router>
        <div className="container">
        <Routes>
          <Route path="/" element={<Layout isAuthenticated={isAuthenticated}/>}> {/* Wrap the main components in Layout */}
            <Route index element={!isAuthenticated ? <GuestHome setAuth={setAuth}/> : <Navigate replace to="/dashboard" />} />
            <Route path="login" element={!isAuthenticated ? <Login setAuth={setAuth}/> : <Navigate replace to="/dashboard" />} />
            <Route path="register" element={!isAuthenticated ? <Register setAuth={setAuth}/> : <Navigate replace to="/dashboard" />} />
            <Route path="dashboard" element={isAuthenticated ? <Dashboard setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            <Route path="profile" element={isAuthenticated ? <ProfilePage setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            <Route path="rankings" element={isAuthenticated ? <Rankings setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            <Route path="players" element={isAuthenticated ? <Players setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            <Route path="tournaments" element={isAuthenticated ? <Tournaments setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            <Route path="tournaments/:tournamentId" element={isAuthenticated ? <TournamentDetails setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            <Route path="brackets/:bracketId" element={isAuthenticated ? <BracketDetails setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            <Route path="brackets/:bracketId/matches/:matchId" element={isAuthenticated ? <MatchDetails setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            {/* Add more routes here */}
          </Route>
        </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
