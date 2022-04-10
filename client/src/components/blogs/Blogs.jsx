/** @format */

import React from "react";
import { generatePath } from "react-router";
import { Link } from "react-router-dom";
import "./blogs.css";

const Blogs = ({ value, name }) => {
  const blogReadPath = generatePath("/read_blog/:id", {
    id: value._id,
  });
  return (
    <Link className="card-link" to={blogReadPath}>
      <div className="blog-card">
        <div
          className="blog-img"
          style={{
            backgroundImage: `url(${
              "https://drive.google.com/uc?id=" + value.blogCover
            })`,
          }}
        ></div>
        <div className="blog-title">
          <span>{value.title}</span>
        </div>
        <div className="blog-user">
          <div
            id="img"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80")`,
            }}
          />
          {value.createdBy ? <p>{value.createdBy.name}</p> : <p>{name}</p>}
        </div>
      </div>
    </Link>
  );
};

export default Blogs;
