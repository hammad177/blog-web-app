/** @format */

const jwt = require("jsonwebtoken");
const UsersModel = require("../model/Users");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const decoded_token = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const user = await UsersModel.findOne({
      _id: decoded_token._id,
    });
    if (!user) {
      res.status(403).send({ error: "please login first" });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "please login first" });
  }
};

const signUpAuth = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    delete req.body.confirmPassword;
    return next();
  }
  return res.status(400).send({ error: "password not match" });
};
module.exports = {
  auth,
  signUpAuth,
};
