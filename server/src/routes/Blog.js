/** @format */

const express = require("express");
const BlogModel = require("../model/Blogs");
const { auth } = require("../middleware/Auth");
const { uploadFile, deleteFile } = require("../imagesUpload/GoogleApi");
const formidable = require("formidable");

const routes = express.Router();

// post blog
routes.post("/post", auth, async (req, res) => {
  try {
    const form = formidable({ multiples: true, maxFileSize: 500000 });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json(err);
      }
      if (!Object.keys(files).length || !Object.keys(fields).length)
        return res.status(400).json({ error: "form incomplete" });
      if (!files.blogCover.type.match(/\/(jpg|png|jpeg)$/)) {
        return res.status(400).json({ error: "only accept jpg png jpeg" });
      }
      const { response } = await uploadFile(
        files.blogCover.path,
        files.blogCover.type
      );
      if (!response) {
        return res
          .status(500)
          .json({ error: "Server side error unable to upload the image" });
      }
      const blog = await BlogModel({
        ...fields,
        createdBy: req.user._id,
        blogCover: response.id,
      });
      await blog.save((err, data) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        return res.status(201).json(data);
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get all blogs
routes.get("/all", async (req, res) => {
  try {
    const blogs = await BlogModel.find({}).populate("createdBy").exec();
    if (!blogs.length)
      return res
        .status(404)
        .json({ status: false, message: "Blog list are empty" });
    return res.json(blogs);
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Sever Error",
    });
  }
});

//get blog by id
routes.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await BlogModel.findById(id).populate("createdBy").exec();
    if (!blog) return res.status(404).json();
    return res.json(blog);
  } catch (err) {
    res.status(400).json({ status: false, message: "No blog found" });
  }
});

//delete users blog
routes.delete("/myblog/:id", auth, async (req, res) => {
  try {
    const blog = await BlogModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!blog)
      return res.status(404).json({
        status: false,
        message: "Can not fulfill this request",
      });
    return res.json(blog);
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Sever Error",
    });
  }
});

//update users blog
routes.patch("/myblog/:id", auth, async (req, res) => {
  const form = formidable({ multiples: true, maxFileSize: 500000 });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json(err);
    }
    // update fields checks
    const modifiedBlog = Object.assign(fields, files);
    const fileldsToUpdate = Object.keys(modifiedBlog);
    const fieldsInModel = ["title", "content", "blogCover"];
    const isUpdateAllow = fileldsToUpdate.every((field) =>
      fieldsInModel.includes(field)
    );
    // fields not match
    if (!isUpdateAllow) {
      return res.status(400).json({ status: false, error: "Invalid field" });
    }
    try {
      const blog = await BlogModel.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
      });
      // blog not found
      if (!blog)
        return res.status(404).json({
          status: false,
          message: "no blog found to this particular identity",
        });
      // if blog cover image update
      if (modifiedBlog.blogCover) {
        if (!files.blogCover.type.match(/\/(jpg|png|jpeg)$/)) {
          return res.status(400).json({ error: "only accept jpg png jpeg" });
        }
        // delete old image
        const deleteSuccessfully = await deleteFile(blog.blogCover);
        if (!deleteSuccessfully) {
          return res.status(400).json({ error: "faild to upload new image" });
        }
        // new image upload
        const { response } = await uploadFile(
          files.blogCover.path,
          files.blogCover.type
        );
        if (!response) {
          return res
            .status(500)
            .json({ error: "Server side error unable to upload the image" });
        }
        modifiedBlog.blogCover = response.id;
      }
      Object.assign(blog, modifiedBlog);
      await blog.save();
      res.json(blog);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
});

module.exports = routes;
