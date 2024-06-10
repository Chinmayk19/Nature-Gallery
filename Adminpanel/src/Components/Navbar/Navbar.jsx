import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../Assets/naturelogo.png"

const Navbar = () => {
  return (
    <div>
      <div className="navbar">
        <img src={logo} alt="Website Logo" className="logo" />
        <nav>
          <Link to="/">Dashborad</Link>
          <Link to="/users">Users</Link>
          <Link to="/usersupload">Usersupload</Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
