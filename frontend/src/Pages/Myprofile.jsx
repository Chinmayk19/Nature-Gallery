import React, { useContext, useState } from "react";
import "./CSS/Myprofile.css";
import ProfileInfo from "../Components/ProfileInfo/ProfileInfo";
import { ImageContext } from "../Context/ImageContext";
import Gallery from "../Components/Gallery/Gallery";

function Myprofile() {
  const { All_Users } = useContext(ImageContext);
  const [text, setText] = useState("");
  const token = localStorage.getItem("auth-token");

  if (!All_Users) {
    return <div>Loading...</div>;
  }

  const user = All_Users.find((e) => e.token === token);

  if (!user || !user.userimg) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ProfileInfo
        username={user.username}
        followers={user.followers.length}
        following={user.following.length}
      />
      <div className="select">
        <p
          className={`select-options ${text === "" ? "selected" : ""}`}
          onClick={() => {
            setText("");
          }}
        >
          Gallery
        </p>
        <p
          className={`select-options ${
            text === "likedImages" ? "selected" : ""
          }`}
          onClick={() => {
            setText("likedImages");
          }}
        >
          Liked Images
        </p>
        <p
          className={`select-options ${
            text === "MyFavourites" ? "selected" : ""
          }`}
          onClick={() => {
            setText("MyFavourites");
          }}
        >
          My Favourites
        </p>
      </div>
      <hr className="hr" />
      <div>
        <div className="gallery-container-1">
          {text === "" ? (
            user.userimg.map((e, index) => (
              <Gallery
                key={index}
                image={e.image}
                category={e.category}
                text={text}
              />
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="gallery-container-1">
          {text === "likedImages" ? (
            user.likedimg.map((e, index) => (
              <Gallery
                key={index}
                image={e.imagename}
                user={e.Username}
                text={text}
              />
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="gallery-container-1">
          {text === "MyFavourites" ? (
            user.favourite.map((e, index) => (
              <Gallery
                key={index}
                image={e.image}
                user={e.Username}
                text={text}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Myprofile;
