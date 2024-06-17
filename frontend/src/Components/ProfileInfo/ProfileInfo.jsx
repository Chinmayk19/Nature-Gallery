import React from "react";
import "./ProfileInfo.css";
import { Link } from "react-router-dom";
const ProfileInfo = (props) => {
  return (
    <div className="profile-info">
      <div className="profile-photo">
        <p>{props.username.charAt(0).toUpperCase()}</p>
      </div>
      <div className="profile-name">
        <p>{props.username}</p>
      </div>
      <div className="followers-following">
        <Link to={"/Followers"} className="followers" >
          <p>{props.followers}</p>
          <p>Followers</p>
        </Link>
        <Link to={"/Following"} className="following">
          <p>{props.following}</p>
          <p>Following</p>
        </Link>
      </div>
    </div>
  );
};

export default ProfileInfo;
