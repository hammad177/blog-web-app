/** @format */

const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "blog title is required"],
      validate: (value) => {
        if (/[^A-Za-z 0-9]/g.test(value)) {
          throw new Error("Title don not contain any special character");
        }
      },
    },
    blogCover: {
      type: String,
      required: [true, "blog cover image is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "createdBy field is required"],
      ref: "users",
    },
    content: {
      type: String,
      required: [true, "blog content is required"],
      minlength: [20, "minimum 20 character is required"],
    },
  },
  { timestamps: true }
);

//set public send data for all user
BlogSchema.methods.toJSON = function () {
  const profile = this;
  const publicProfileData = profile.toObject();

  delete publicProfileData.createdBy.password;
  delete publicProfileData.createdBy.tokens;
  delete publicProfileData.createdBy._id;

  return publicProfileData;
};

const BlogModel = mongoose.model("blogs", BlogSchema);

module.exports = BlogModel;
