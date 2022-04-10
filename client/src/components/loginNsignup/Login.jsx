/** @format */

import {
  Button,
  TextField,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import React, { useState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import axios from "axios";
import Cookies from "universal-cookie";
import "./login.css";

const Login = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const BASE_API = process.env.REACT_APP_API_URL;
  const cookies = new Cookies();

  const handelChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const signUpUser = await axios.post(`${BASE_API}auth/login`, user);
      const { accessToken, refreshToken, sessionId } = signUpUser.data;

      if (signUpUser.status === 200) {
        cookies.set("accessToken", accessToken);
        cookies.set("refreshToken", refreshToken);
        cookies.set("sessionId", sessionId);
        window.location.reload(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <button className="link" onClick={openModal}>
        LogIn
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <form
          className="login-container"
          method="post"
          onChange={handelChange}
          onSubmit={handelSubmit}
        >
          <span className="close-modal-btn" onClick={closeModal}>
            <AiOutlineClose className="close-icon" />
          </span>
          <h2>Log In with</h2>
          <ThemeProvider theme={theme}>
            <TextField
              name="email"
              fullWidth={true}
              label="Email"
              placeholder="some@blog.com"
              variant="outlined"
            />
            <TextField
              type="password"
              name="password"
              fullWidth={true}
              label="Password"
              variant="outlined"
            />
          </ThemeProvider>
          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: "#ff6938",
              color: "whitesmoke",
              width: "150px",
              height: "40px",
            }}
          >
            Log In
          </Button>
          <div className="login-social-btn">
            <Button
              variant="contained"
              size="medium"
              color="primary"
              startIcon={<FaFacebookF />}
            >
              Facebook
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<FaGoogle />}
              style={{
                backgroundColor: "#ff2233",
                color: "whitesmoke",
                marginLeft: "10px",
              }}
            >
              Google
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const theme = createTheme({
  palette: {
    primary: deepOrange,
  },
});

const customStyles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    minWidth: "280px",
    width: "50vw",
    maxWidth: "450px",
    minHeight: "360px",
    height: "400px",
    maxHeigth: "430px",
    overflow: "hidden",
    padding: "0",
    backgroundColor: "#f5f5f5",
  },
  overlay: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: "10" },
};

export default Login;
