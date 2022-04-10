import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IconContext } from "react-icons/lib";
import Cookies from "universal-cookie";
import EditUser from "../editUser/EditUser";

const UserInfo = ({ user }) => {
  const [isEdit, setIsEdit] = useState(false);
  const cookies = new Cookies();

  const currentUserId = cookies.get("sessionId");
  return (
    <div className="user-info-container">
      {currentUserId === user.id ? (
        <div className="edited-user" style={{ display: isEdit && "none" }}>
          <IconContext.Provider value={{ className: "edit-user" }}>
            <span
              data="edit"
              className="tooltip"
              onClick={() => setIsEdit(true)}
            >
              <FiEdit />
            </span>
          </IconContext.Provider>
        </div>
      ) : (
        ""
      )}
      {isEdit ? (
        <EditUser setIsEdit={setIsEdit} user={user} />
      ) : (
        <>
          <div className="user-info">
            <div className="user-info-name">
              <span>User Name: {user.name}</span>
            </div>
            <div className="user-info-email">
              <span>Email: {user.email}</span>
            </div>
            <div className="user-info-blogs">
              <span>Total Blogs: {user.BlogList.length}</span>
            </div>
          </div>
          <div
            className="user-info-img"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80")`,
            }}
          />
        </>
      )}
    </div>
  );
};

export default UserInfo;
