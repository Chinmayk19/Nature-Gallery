import React from "react";
import "./ProfileInfo.css";
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
        <div className="followers">
          <p>{props.followers}</p>
          <p>Followers</p>
        </div>
        <div className="following">
          <p>{props.following}</p>
          <p>Following</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
