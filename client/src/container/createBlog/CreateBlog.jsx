/** @format */

import {
  TextField,
  ThemeProvider,
  createTheme,
  Button,
  IconButton,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { deepOrange } from "@material-ui/core/colors";
import BlogNavbar from "../../components/blogNavbar/BlogNavbar";
import CancelIcon from "@material-ui/icons/Cancel";
import UploadFile from "../../components/uploadImg/UploadFile";
import { getCroppedImgFile } from "../../components/uploadImg/getCroppedImg";
import { useLocation, Prompt, useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import "./createBlog.css";

const theme = createTheme({
  palette: {
    primary: deepOrange,
  },
});

const CreateBlog = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [stateCoverImg, setStateCoverImg] = useState(null);
  const [blog, setBlog] = useState({});
  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState( false )
  // const [errorMessage, setErrorMessage]=useState('')
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const location = useLocation();
  const { state } = location;
  const history = useHistory();
  const BASE_API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // window reload warning
    window.onbeforeunload = function () {
      return true;
    };
    // update blog default cover image
    if (state) {
      setStateCoverImg(state.blogCover);
    }
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  // new blog request
  const postNewBlog = async (formData) => {
    try {
      const postBlog = await axios.post(`${BASE_API}blog/post`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (postBlog.status === 201) {
        setIsFormSubmit(true);
        setLoading(false);
        history.push("/");
      }
    } catch (err) {
      console.log(err.reponse);
    }
  };

  // update blog request
  const updateBlog = async (formData) => {
    try {
      const updateBlog = await axios.patch(
        `${BASE_API}blog/myblog/${state._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (updateBlog.status === 200) {
        setIsFormSubmit(true);
        setLoading(false);
        history.push("/");
      }
    } catch (err) {
      console.log(err.response);
    }
  };

  // send save or update blog request
  const saveBlog = async () => {
    setLoading(true);
    const formData = new FormData();
    for (const key in blog) {
      formData.append(key, blog[key]);
    }
    // if blog updating request
    if (state) {
      // update blog request
      updateBlog(formData);
      return;
    }
    // new blog creating request
    postNewBlog(formData);
  };

  // crop img file
  const CropObj = async (tag, obj) => {
    const canvasImgFile = await getCroppedImgFile(
      tag,
      obj,
      "newBlogBackgroundImg.jpeg"
    );
    setBlog({ ...blog, blogCover: canvasImgFile });
  };

  // changes of blog form
  const handelChange = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  // cancel selected image
  const cancelImg = () => {
    setCoverImg(null);
    setStateCoverImg(null);
  };

  return (
    <div className="create-blog-container">
      <Prompt when={!isFormSubmit} message="Are you sure you want to leave?" />
      <BlogNavbar />
      <div className="create-blog-wrapper">
        <h1>Create Blog</h1>
        <div className="blog-bg-img">
          {coverImg || stateCoverImg ? (
            <>
              <IconButton className="cancle-img" onClick={cancelImg}>
                <CancelIcon fontSize="medium" style={{ color: "#ff5c26" }} />
              </IconButton>
              <img
                src={
                  !stateCoverImg
                    ? coverImg
                    : `https://drive.google.com/uc?id=${stateCoverImg}`
                }
                alt="blog-cover-img"
              />
            </>
          ) : (
            <UploadFile
              setCoverImg={setCoverImg}
              setStateCoverImg={setStateCoverImg}
              CropObj={CropObj}
            />
          )}
        </div>
        <ThemeProvider theme={theme}>
          <div className="create-input">
            <TextField
              fullWidth={true}
              id="create-title"
              label="Blog Title"
              placeholder="type here ..."
              variant="outlined"
              autoFocus={true}
              onChange={handelChange}
              name="title"
              defaultValue={state ? state.title : ""}
            />
          </div>
          <div className="create-textarea">
            <TextField
              id="create-blog"
              fullWidth={true}
              label="Blog Content"
              multiline
              maxRows={15}
              placeholder="type here ..."
              variant="outlined"
              onChange={handelChange}
              name="content"
              defaultValue={state ? state.content : ""}
            />
          </div>
        </ThemeProvider>
        <Button
          onClick={saveBlog}
          variant="contained"
          size="large"
          style={{
            color: "#fff",
            backgroundColor: "#fd784c",
            fontWeight: "bold",
            letterSpacing: "0.1rem",
          }}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default CreateBlog;
