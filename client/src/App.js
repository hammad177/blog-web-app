/** @format */

import ReadBlog from "./container/readBlog/ReadBlog";
import Home from "./container/home/Home";
import CreateBlog from "./container/createBlog/CreateBlog";
import UserProfile from "./container/profile/UserProfile";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import ProtectedRoute from "./container/ProtectedRoute";

const cookies = new Cookies();
const refreshToken = cookies.get("refreshToken");

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest) => {
  const token = await axios.post(
    `${process.env.REACT_APP_API_URL}auth/refreshtoken`,
    {
      token: refreshToken,
    }
  );
  cookies.set("accessToken", token.data.accessToken);
  failedRequest.response.config.headers[
    "Authorization"
  ] = `Bearer ${token.data.accessToken}`;
  return Promise.resolve();
};

// Instantiate the interceptor
createAuthRefreshInterceptor(axios, refreshAuthLogic);

// Get access token
const getAccessToken = () => {
  return cookies.get("accessToken");
};

// Use interceptor to inject the token to requests
axios.interceptors.request.use((request) => {
  request.headers["Authorization"] = `Bearer ${getAccessToken()}`;
  return request;
});

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/read_blog/:id" component={ReadBlog} />
        <Route exact path="/profile/:id" component={UserProfile} />
        <ProtectedRoute exact path="/create_blog" component={CreateBlog} />
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}

export default App;
