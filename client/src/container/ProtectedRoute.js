import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthListener from "../components/loginNsignup/AuthListener";

const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
  const isAuthenticated = AuthListener();
  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;
