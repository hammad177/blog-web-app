/** @format */

import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";

const AuthListener = () => {
  const cookies = new Cookies();
  const allCookies = cookies.getAll();
  // if no refresh token
  if (!allCookies.refreshToken) {
    return false;
  }
  // if refresh token expire
  const decoded = jwt_decode(allCookies.refreshToken);
  const currentDate = new Date();
  if (decoded.exp * 1000 < currentDate.getTime()) {
    cookies.remove("refreshToken");
    return false;
  }
  return true;
};

export default AuthListener;
