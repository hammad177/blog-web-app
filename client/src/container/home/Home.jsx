/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import Blogs from "../../components/blogs/Blogs";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./home.css";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const BASE_API = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const allBlogs = await axios.get(`${BASE_API}blog/all`);
        setBlogs(allBlogs.data);
      } catch (err) {
        console.log("get all blogs", err.response.status);
      }
    };
    getAllBlogs();
  }, []);
  return (
    <div>
      <Navbar />
      <Header />
      <h1 className="Blogs" id="Blogs">
        Blogs
      </h1>
      <div className="blogs-container">
        {blogs &&
          blogs.map((val) => {
            return <Blogs key={val._id} value={val} />;
          })}
      </div>
    </div>
  );
};

export default Home;
