import React, { useContext, useEffect, useState } from "react";
import "./Gallery.css";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { HiStar } from "react-icons/hi2";

import { ImageContext } from "../../Context/ImageContext";

const Gallery = (props) => {
  const { All_Users } = useContext(ImageContext);
  const token = localStorage.getItem("auth-token");
  const user = All_Users.find((e) => e.token === token);

  const [effect, setEffect] = useState("1");
  const [display, setDisplay] = useState("none");
  const [like, setLike] = useState("like");
  const [fav, setFav] = useState("add");
  const isLiked =
    user &&
    user.likedimg.some(
      (item) => item.imagename === props.image && item.Username === props.user
    );
  useEffect(() => {
    if (isLiked) {
      setLike("Liked");
    } else {
      setLike("like");
    }
  }, [isLiked]);
  const isFav =
    user &&
    user.favourite.some(
      (item) => item.image === props.image && item.Username === props.user
    );
  useEffect(() => {
    if (isFav) {
      setFav("Added");
    } else {
      setFav("add");
    }
  }, [isFav]);

  function MouseIn() {
    setEffect("0.8");
    setDisplay("flex");
  }
  function MouseOut() {
    setEffect("1");
    setDisplay("none");
  }
  const deletepost = async (img) => {
    let confirmDelete = window.confirm("Are you sure to delete the Post?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("auth-token");
        const image = img;
        let response = await fetch(`http://localhost:3001/deleteimg`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image }),
        });
        let data = await response.json();
        if (data.success) {
          window.location.reload();
          alert(data.message);
        } else {
          alert(data.message);
        }
      } catch (error) {}
    }
  };
  const ImgLike = async (img, user) => {
    let token = localStorage.getItem("auth-token");
    const image = img;
    const imguser = user;
    if (like === "like") {
      try {
        const response = await fetch(`http://localhost:3001/like-img`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image, imguser }),
        });
        const data = await response.json();
        if (data.success) {
          setLike("liked");
          console.log(data.message);
        } else {
          setLike("like");
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:3001/unlike-img`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image, imguser }),
        });
        const data = await response.json();
        if (data.success) {
          setLike("like");
          // window.location.reload();
          console.log(data.message);
        } else {
          setLike("liked");
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const FavImg = async (img, user) => {
    console.log(setFav);
    const token = localStorage.getItem("auth-token");
    const image = img;
    const imguser = user;
    if (fav === "add") {
      try {
        const response = await fetch(`http://localhost:3001/add-fav`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image, imguser }),
        });

        const data = await response.json();
        if (data.success) {
          console.log(data.message);
          setFav("added");
        } else {
          setFav("add");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:3001/remove-fav`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image, imguser }),
        });

        const data = await response.json();
        if (data.success) {
          console.log(data.message);
          setFav("add");
        } else {
          setFav("added");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      onMouseEnter={() => {
        MouseIn();
      }}
      className="Images-1"
      onMouseLeave={() => {
        MouseOut();
      }}
    >
      {props.text === "" ? (
        <>
          <div className="deletebtn" style={{ display: display }}>
            <div
              onClick={() => {
                deletepost(props.image);
              }}
            >
              <RiDeleteBin6Fill
                style={{ color: "red", height: "20px", width: "20px" }}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {props.text === "likedImages" ? (
        <div className="likesection">
          <div
            className="like"
            onClick={() => {
              ImgLike(props.image, props.user);
            }}
          >
            {like === "like" ? (
              <CiHeart />
            ) : (
              <IoMdHeart style={{ color: "red" }} />
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      {props.text === "MyFavourites" ? (
        <div className="likesection">
          <div
            className="fav"
            onClick={() => {
              FavImg(props.image, props.user);
            }}
          >
            {fav === "add" ? (
              <CiStar />
            ) : (
              <HiStar style={{ color: "goldenrod" }} />
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      {props.text === "Profile" ? (
        <div className="likesection">
          <div
            className="fav"
            onClick={() => {
              FavImg(props.image, props.user);
            }}
          >
            {fav === "add" ? (
              <CiStar />
            ) : (
              <HiStar style={{ color: "goldenrod" }} />
            )}
          </div>
          <div
            className="like"
            onClick={() => {
              ImgLike(props.image, props.user);
            }}
          >
            {like === "like" ? (
              <CiHeart />
            ) : (
              <IoMdHeart style={{ color: "red" }} />
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      <img
        src={props.image}
        alt=""
        style={{ opacity: effect }}
        className="nature-img"
      />
      <div className="category">
        {props.category ? (
          <div className="gallery-category">
            <p style={{margin:"0%"}}>Category-{props.category}</p>
          </div>
        ) : (
          <div className="Liked-Favourite" style={{display:display}}>
            <p className="profile-pic">{props.user.charAt(0)}</p>
            <p className="name">{props.user}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
