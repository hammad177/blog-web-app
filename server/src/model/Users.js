/** @format */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UsersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      trim: true,
      validate: (value) => {
        if (/[^a-zA-Z, ]/.test(value)) {
          throw new Error("enter aplhabets only");
        }
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email address is required"],
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("enter valid email address");
        }
      },
    },
    password: {
      type: String,
      required: [true, "password field is required"],
      trim: true,
      minlength: [7, "password must be atleast 7 characters"],
    },
    tokens: [
      {
        refreshToken: {
          type: String,
          required: [true, "refresh token is required"],
        },
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

//making virtual connection to blog table
UsersSchema.virtual("BlogList", {
  ref: "blogs",
  localField: "_id",
  foreignField: "createdBy",
});

// hashing password
UsersSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// user signup or not
UsersSchema.statics.findByCredentials = async (email, password) => {
  const userProfile = await UsersModel.findOne({ email });
  if (!userProfile) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, userProfile.password);
  if (!isMatch) {
    return null;
  }

  return userProfile;
};

// generate token
UsersSchema.methods.generateAuthToken = async function () {
  const profile = this;

  const refreshToken = jwt.sign(
    { _id: profile._id.toString() },
    process.env.JWT_REFRESH_TOKEN
  );

  const accessToken = jwt.sign(
    { _id: profile._id.toString() },
    process.env.JWT_ACCESS_TOKEN,
    {
      expiresIn: "10m",
    }
  );

  profile.tokens = profile.tokens.concat({ refreshToken });
  await profile.save();

  return { refreshToken, accessToken };
};

//set public send data
UsersSchema.methods.toJSON = function () {
  const profile = this;
  const publicProfileData = profile.toObject();

  delete publicProfileData.password;
  delete publicProfileData.tokens;
  delete publicProfileData._id;
  if (publicProfileData.hasOwnProperty("BlogList")) {
    publicProfileData.BlogList.map((val) => {
      delete val.createdBy;
    });
  }
  return publicProfileData;
};
const UsersModel = mongoose.model("users", UsersSchema);

module.exports = UsersModel;
