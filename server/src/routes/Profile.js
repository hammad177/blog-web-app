/** @format */

const express = require("express");
const UsersModel = require("../model/Users");
const { auth } = require("../middleware/Auth");

const routes = express.Router();

//send user data by id
routes.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const profile = await UsersModel.findOne({
      _id: id,
    })
      .populate("BlogList")
      .exec();
    if (!profile)
      return res.status(404).json({ status: false, message: "No user found" });
    return res.json(profile);
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Sever Error",
    });
  }
});

//update current auth user profile
routes.patch("/myprofile", auth, async (req, res) => {
  const modifiedProfile = req.body;
  const fileldsToUpdate = Object.keys(modifiedProfile);
  const fieldsInModel = ["name", "email"];
  const isUpdateAllow = fileldsToUpdate.every((field) =>
    fieldsInModel.includes(field)
  );

  if (!isUpdateAllow) {
    return res.status(400).json({ status: false, error: "Invalid field" });
  }
  try {
    const profile = req.user;
    Object.assign(profile, modifiedProfile);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Sever Error" + err,
    });
  }
});

module.exports = routes;
