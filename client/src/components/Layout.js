import React from 'react';
import { Outlet } from "react-router-dom";
import Header from './Header';
import './Layout.css'; // Your CSS file for layout

const Layout = ({isAuthenticated}) => {
  return (
    <>
      <Header isAuthenticated={isAuthenticated}/>
      <main>
        <Outlet /> {/* This is where the nested route's components will be rendered */}
      </main>
    </>
  );
};

export default Layout;