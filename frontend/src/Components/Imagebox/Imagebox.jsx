import React, { useContext, useEffect } from "react";
import "./Imagebox.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ImageContext } from "../../Context/ImageContext";
import { CiHeart } from "react-icons/ci";
import { CiStar } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { HiStar } from "react-icons/hi2";
const Imagebox = (props) => {
  const { All_Users } = useContext(ImageContext);
  const token = localStorage.getItem("auth-token");

  // let username=user.username;
  // console.log(user.username);

  const [hide, setHide] = useState("none");
  const [display, setDisplay] = useState("none");
  const [likefavsection, setLikeFavSection] = useState("none");
  const [like, setLike] = useState("like");
  const [fav, setFav] = useState("add");
  const [effect, setEffect] = useState("1");
  const user = All_Users.find((e) => e.token === token);
  const isUser = () => {
    if (!All_Users || !props.user) {
      return false;
    }
    const userFound = All_Users.find((e) => e.token === token && e.username === props.user);
    return !!userFound;
  };
  
  

const isLiked = user && user.likedimg.some(item => item.imagename === props.image && item.Username === props.user);


const isFav = user && user.favourite.some(item => item.image === props.image && item.Username === props.user);
  useEffect(() => {
    if (isLiked) {
      setLike("Liked");
    } else {
      setLike("like");
    }
    if(isFav){
      setFav("Added");
    }else{
      setFav("add");
    }
  }, [isLiked,isFav]);



  function Entermouse() {
    setHide("block");
    setDisplay("flex");
    setLikeFavSection("flex");
    setEffect("0.8");
  }
  function Mouseout() {
    setHide("none");
    setDisplay("none");
    setLikeFavSection("none");
    setEffect("1");
  }
  const DownloadImg = (imageSrc, imageName) => {
    if (localStorage.getItem("auth-token")) {
      try {
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = imageName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          });
      } catch (error) {
        console.error("Error during image download:", error);
      }
    } else {
      alert("Please Login to download the Image");
      window.location.replace("/login");
    }
  };
  const ImgLike = async (img,user) => {
    let token = localStorage.getItem("auth-token");
    const image = img;
    const imguser=user;
    if (like === "like") {
      try {
        const response = await fetch(`https://nature-gallery-z1us.onrender.com/like-img`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image,imguser }),
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
        const response = await fetch(`https://nature-gallery-z1us.onrender.com/unlike-img`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image,imguser }),
        });
        const data = await response.json();
        if (data.success) {
          setLike("like");
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
  const FavImg = async (img ,user) => {
    console.log(setFav);
    const token = localStorage.getItem("auth-token");
    const image = img;
    const imguser=user;
    if (fav === "add") {
      try {
        const response = await fetch(`https://nature-gallery-z1us.onrender.com/add-fav`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image ,imguser}),
        });

        const data = await response.json();
        if(data.success){
          console.log(data.message);
          setFav("added");
        }
        else{
          setFav("add");
        }
      } catch (error) {
        console.log(error);
      }
    }
    else{
      try {
        const response = await fetch(`https://nature-gallery-z1us.onrender.com/remove-fav`, {
          method: "POST",
          headers: {
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, image ,imguser}),
        });
        
        const data = await response.json();
        if(data.success){
          console.log(data.message);
          setFav("add");
        }
        else{
          setFav("added");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  function viewImg(imageSrc){
    window.open(imageSrc);
  }

  return (
    <>
      <div
        className="Images"
        key={props.id}
        onMouseEnter={() => {
          Entermouse();
        }}
        onMouseLeave={() => {
          Mouseout();
        }}
        // onClick={()=>{viewImg(props.image)}}
      >
        <div className="like-fav-section" style={{ display: likefavsection }}>
          <div
            className="fav-section"
            onClick={() => {
              FavImg(props.image,props.user);
            }}
          >
            {fav === "add" ? (
              <CiStar />
            ) : (
              <HiStar style={{ color: "goldenrod" }} />
            )}
          </div>
          <div
            className="like-section"
            onClick={() => {
              ImgLike(props.image,props.user);
            }}
          >
            {like === "like" ? (
              <CiHeart />
            ) : (
              <IoMdHeart style={{ color: "red" }} />
            )}
          </div>
        </div>
        <img
          src={props.image}
          alt=""
          style={{ opacity: effect }}
          className="natureimg"
          onClick={()=>{viewImg(props.image)}}
        />
        <div className="name-downloadbtn">
          <Link to={isUser()?"My-Profile":`/profile/${props.user}`}>
            <h4>
              <span style={{ display: display }}>
                {props.user.charAt(0).toUpperCase()}
              </span>
              {props.user}
            </h4>
          </Link>
          <button
            style={{ display: hide }}
            onClick={() => {
              DownloadImg(props.image, "Image");
            }}
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
};

export default Imagebox;
