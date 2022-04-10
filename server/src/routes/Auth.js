/** @format */

const express = require("express");
const UsersModel = require("../model/Users");
const { auth, signUpAuth } = require("../middleware/Auth");
const jwt = require("jsonwebtoken");

const routes = express.Router();

//signup user
routes.post("/signup", signUpAuth, async (req, res) => {
  try {
    const user = await UsersModel(req.body);

    user.save(async function (err, data) {
      if (err)
        return res.status(400).json({ status: false, message: err.message });
      if (data) {
        const { refreshToken, accessToken } = await user.generateAuthToken();
        return res.status(201).json({
          status: true,
          refreshToken,
          accessToken,
          sessionId: user.id,
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Sever Error",
    });
  }
});

//login user
routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findByCredentials(email, password);
    if (!user) {
      return res.status(404).send({
        status: false,
        message: "No user found",
      });
    }
    const { refreshToken, accessToken } = await user.generateAuthToken();
    return res.json({
      status: true,
      refreshToken,
      accessToken,
      sessionId: user.id,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Sever Error",
    });
  }
});

//making refresh tokens
routes.post("/refreshtoken", async (req, res) => {
  const token = req.body.token;
  const hasRefreshToken = await UsersModel.findOne({
    "tokens.refreshToken": token,
  });
  if (!hasRefreshToken) return res.status(403).json({ message: "login first" });
  const makeToken = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
  if (!makeToken) return res.status(403).json({ message: "login first" });
  const accessToken = jwt.sign(
    { _id: makeToken._id.toString() },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "10m" }
  );
  res.json({ accessToken });
});

//logout user
routes.post("/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    const token = req.body.token;

    if (!token)
      return res
        .status(400)
        .send({ status: false, message: "send refresh token" });
    user.tokens = user.tokens.filter((t) => t.refreshToken !== token);
    await user.save();
    res.json({ status: true, message: "user is logout" });
  } catch (err) {
    res.status(400).send();
  }
});

module.exports = routes;
