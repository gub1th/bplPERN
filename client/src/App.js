import React, { useState, useEffect } from 'react'
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import Register from "./components/Register"


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
            <Route exact path="/login" element={!isAuthenticated ? <Login setAuth={setAuth}/> : <Navigate replace to="/dashboard" />} />
            <Route exact path="/register" element={!isAuthenticated ? <Register setAuth={setAuth}/> : <Navigate replace to="/login" />} />
            <Route exact path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setAuth}/> : <Navigate replace to="/login" />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
