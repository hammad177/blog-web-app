/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { generatePath, useHistory, useParams } from "react-router";
import BlogNavbar from "../../components/blogNavbar/BlogNavbar";
import "./readBlog.css";
import Cookies from "universal-cookie";
import { FiEdit } from "react-icons/fi";
import { IconContext } from "react-icons/lib";

const ReadBlog = () => {
  const [blog, setBlog] = useState(null);
  const param = useParams();
  const history = useHistory();
  const BASE_API = process.env.REACT_APP_API_URL;
  const cookies = new Cookies();

  const currentUserId = cookies.get("sessionId");
  useEffect(() => {
    const getBlogById = async () => {
      try {
        const blog = await axios.get(`${BASE_API}blog/${param.id}`);
        setBlog(blog.data);
      } catch (err) {
        history.push("/");
      }
    };
    getBlogById();
  }, []);

  const gotoUserProfile = () => {
    const userProfile = generatePath("/profile/:id", {
      id: blog.createdBy.id,
    });
    history.push(userProfile);
  };

  const handelEditBlog = () => {
    history.push({
      pathname: "/create_blog",
      state: blog,
    });
  };
  return (
    <>
      <BlogNavbar />
      <div className="read-blog-container">
        {blog && (
          <>
            <div
              className="blog-cover-img"
              style={{
                backgroundImage: `url(${
                  "https://drive.google.com/uc?id=" + blog.blogCover
                })`,
              }}
            ></div>
            <div className="blog-wrapper">
              {currentUserId && currentUserId === blog.createdBy.id && (
                <div className="edited-blog">
                  <IconContext.Provider value={{ className: "edit-blog" }}>
                    <span
                      data="edit"
                      className="tooltip"
                      onClick={handelEditBlog}
                    >
                      <FiEdit />
                    </span>
                  </IconContext.Provider>
                </div>
              )}
              <div className="blog-user-detail">
                <div
                  onClick={gotoUserProfile}
                  className="user-img"
                  style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80")`,
                  }}
                />
                <p onClick={gotoUserProfile}>{blog.createdBy.name}</p>
              </div>
              <h1>{blog.title}</h1>
              <div className="blog-content">
                <p>{blog.content}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReadBlog;
