import React from 'react';
import { Outlet } from "react-router-dom";
import Header from './Header';
import './Layout.css'; // Your CSS file for layout

const Layout = ({isAuthenticated}) => {
  return (
    <>
      <Header isAuthenticated={isAuthenticated}/>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;