import {
  Button,
  TextField,
  ThemeProvider,
  createTheme,
  IconButton,
} from "@material-ui/core";
import { FiMoreVertical } from "react-icons/fi";
import { deepOrange } from "@material-ui/core/colors";
import React, { useState } from "react";
import UploadUserImg from "../uploadImg/UploadUserImg";
import "./editUser.css";

const EditUser = ({ user, setIsEdit }) => {
  const [uploadMenu, setUploadMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const theme = createTheme({
    palette: {
      primary: deepOrange,
    },
  });

  // crop img file
  // const CropObj = async (tag, obj) => {
  //   const canvasImgFile = await getCroppedImgFile(
  //     tag,
  //     obj,
  //     "userProfileImg.jpeg"
  //   );
  //   // setBlog({ ...blog, blogCover: canvasImgFile });
  // };

  return (
    <div className="user-edit-container">
      <div className="user-edit-detail">
        <ThemeProvider theme={theme}>
          <TextField
            defaultValue={user.name}
            variant="outlined"
            label="Name"
            type="text"
          />
          <TextField
            variant="outlined"
            defaultValue={user.email}
            label="Email"
            type="email"
            disabled
          />
          <TextField variant="outlined" label="Old Password" type="password" />
          <TextField variant="outlined" label="New Password" type="password" />
          <TextField
            variant="outlined"
            label="Confirm Password"
            type="password"
          />
        </ThemeProvider>
      </div>
      <div
        className="user-edit-img"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80")`,
        }}
      >
        <IconButton
          data="upload image"
          className="tooltip"
          id="user-upload-img"
          onClick={() => setUploadMenu(true)}
        >
          <FiMoreVertical />
        </IconButton>
        {uploadMenu && (
          <div className="upload-menu">
            <UploadUserImg />
          </div>
        )}
      </div>
      <div className="user-edit-btn">
        <Button
          variant="contained"
          style={{
            marginRight: "15px",
            backgroundColor: " #ff1a1a",
            color: "#fff",
          }}
          onClick={() => setIsEdit(false)}
        >
          cancel
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: "#ff751a", color: "#fff" }}
        >
          edit
        </Button>
      </div>
    </div>
  );
};

export default EditUser;
