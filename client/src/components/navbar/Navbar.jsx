/** @format */

import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import Login from "../loginNsignup/Login";
import SignUp from "../loginNsignup/SignUp";
import AuthListener from "../loginNsignup/AuthListener";
import axios from "axios";
import Cookies from "universal-cookie";

const Navbar = () => {
  let isAuthenticated = AuthListener();
  const cookies = new Cookies();
  const refreshToken = cookies.get("refreshToken");
  const accessToken = cookies.get("accessToken");
  const sessionId = cookies.get("sessionId");
  const BASE_API = process.env.REACT_APP_API_URL;

  const logoutUser = async () => {
    try {
      const logout = await axios.post(
        `${BASE_API}auth/logout`,
        { token: refreshToken },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (logout.status === 200) {
        cookies.remove("accessToken");
        cookies.remove("refreshToken");
        cookies.remove("sessionId");
        window.location.reload(true);
      }
    } catch (err) {
      console.log("error logout", err);
    }
  };
  return (
    <nav>
      <h3 className="logo">devbyhammad</h3>
      <div className="nav-links">
        <Link className="link" to="/">
          Home
        </Link>
        <a className="link" href="#Blogs">
          Blog
        </a>
        {isAuthenticated ? (
          <>
            <Link className="link" to={`/profile/${sessionId}`}>
              My Profile
            </Link>
            <Link className="link" to="/create_blog">
              Create
            </Link>
            <button className="link" onClick={logoutUser}>
              Logout
            </button>
          </>
        ) : (
          <>
            <SignUp />
            <Login />
          </>
        )}
      </div>
      <div className="mob-nav">
        <input type="checkbox" />
        <span></span>
        <span></span>
        <span></span>
        <div className="menu-links">
          <Link className="link" to="/">
            Home
          </Link>
          <a className="link" href="#Blogs">
            Blog
          </a>
          {isAuthenticated ? (
            <>
              <Link className="link" to="/profile">
                My Profile
              </Link>
              <Link className="link" to="/create_blog">
                Create
              </Link>
              <button className="link" onClick={logoutUser}>
                Logout
              </button>
            </>
          ) : (
            <>
              <SignUp />
              <Login />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
