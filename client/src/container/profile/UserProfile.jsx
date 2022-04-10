/** @format */

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Blogs from "../../components/blogs/Blogs";
import { Box, Tab, Tabs, createTheme, ThemeProvider } from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";
import axios from "axios";
import "./userProfile.css";
import UserInfo from "../../components/userInfo/UserInfo";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [value, setValue] = useState(0);
  const param = useParams();
  const BASE_API = process.env.REACT_APP_API_URL;
  const history = useHistory();

  const theme = createTheme({
    palette: {
      primary: deepOrange,
    },
  });

  useEffect(() => {
    const getUserById = async () => {
      try {
        const userProfile = await axios.get(`${BASE_API}profile/${param.id}`);
        setUser(userProfile.data);
      } catch (err) {
        history.push("/");
      }
    };
    getUserById();
  }, [param.id]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Navbar />
      <Header />
      {user && (
        <>
          <h1 className="Blogs" id="Blogs">
            {user.name}
          </h1>
          <div className="user-info-tabs">
            <ThemeProvider theme={theme}>
              <Box sx={{ width: "100%" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  centered
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab style={{ fontWeight: "bold" }} label="Blogs" />
                  <Tab style={{ fontWeight: "bold" }} label="About" />
                </Tabs>
              </Box>
            </ThemeProvider>
          </div>
          {value === 0 ? (
            <div className="blogs-container">
              {user.BlogList &&
                user.BlogList.map((val) => {
                  return <Blogs key={val._id} value={val} name={user.name} />;
                })}
            </div>
          ) : (
            <UserInfo user={user} />
          )}
        </>
      )}
    </>
  );
};

export default UserProfile;
