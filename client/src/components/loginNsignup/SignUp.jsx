/** @format */

import {
  Button,
  TextField,
  ThemeProvider,
  createTheme,
  InputAdornment,
} from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import axios from "axios";
import Cookies from "universal-cookie";
import "./login.css";

const SignUp = () => {
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
      const signUpUser = await axios.post(`${BASE_API}auth/signup`, user);
      const { accessToken, refreshToken, sessionId } = signUpUser.data;
      cookies.set("accessToken", accessToken);
      cookies.set("refreshToken", refreshToken);
      cookies.set("sessionId", sessionId);
      window.location.reload(true);
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
        SignUp
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <form
          method="post"
          className="login-container"
          onChange={handelChange}
          onSubmit={handelSubmit}
        >
          <span className="close-modal-btn" onClick={closeModal}>
            <AiOutlineClose className="close-icon" />
          </span>
          <h2>Sign Up</h2>
          <ThemeProvider theme={theme}>
            <TextField
              fullWidth={true}
              name="name"
              label="Full Name"
              placeholder="display name"
              variant="outlined"
            />
            <TextField
              fullWidth={true}
              name="email"
              label="Email"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">@blog.com</InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth={true}
              name="password"
              label="Password"
              type="password"
              placeholder="password atleast 7 characters"
              variant="outlined"
            />
            <TextField
              fullWidth={true}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
            />
          </ThemeProvider>
          <Button
            type="submit"
            variant="contained"
            size="large"
            style={{
              backgroundColor: "#ff5533",
              color: "whitesmoke",
            }}
          >
            Sign Up
          </Button>
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
    minHeight: "400px",
    height: "450px",
    maxHeigth: "500px",
    overflow: "hidden",
    padding: "0",
    backgroundColor: "#f5f5f5",
  },
  overlay: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: "10" },
};

export default SignUp;
