/** @format */

const express = require("express");
require("./database/Mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AuthRoutes = require("./routes/Auth");
const BlogRoutes = require("./routes/Blog");
const ProfileRoutes = require("./routes/Profile");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", AuthRoutes);
app.use("/blog", BlogRoutes);
app.use("/profile", ProfileRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
