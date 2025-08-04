// Imagebox.jsx
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import "./Imagebox.css";
import { Link } from "react-router-dom";
import { ImageContext } from "../../Context/ImageContext";
import { CiHeart, CiStar } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { HiStar } from "react-icons/hi2";

const Imagebox = ({ id, image, likes, user: imageOwner }) => {
  const { All_Users } = useContext(ImageContext);
  const token = localStorage.getItem("auth-token");

  // Memoize user lookups so they don't rerun unnecessarily
  const currentUser = useMemo(
    () => All_Users?.find((u) => u.token === token) || null,
    [All_Users, token]
  );

  const isUser = useMemo(() => {
    if (!All_Users || !imageOwner) return false;
    return !!All_Users.find(
      (e) => e.token === token && e.username === imageOwner
    );
  }, [All_Users, token, imageOwner]);

  const isLiked = useMemo(
    () =>
      currentUser &&
      currentUser.likedimg?.some(
        (item) => item.imagename === image && item.Username === imageOwner
      ),
    [currentUser, image, imageOwner]
  );

  const isFav = useMemo(
    () =>
      currentUser &&
      currentUser.favourite?.some(
        (item) => item.image === image && item.Username === imageOwner
      ),
    [currentUser, image, imageOwner]
  );

  // UI state
  const [like, setLike] = useState("like");
  const [fav, setFav] = useState("add");

  // Lazy load logic
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLiked) setLike("Liked");
    else setLike("like");

    if (isFav) setFav("Added");
    else setFav("add");
  }, [isLiked, isFav]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(containerRef.current);
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const DownloadImg = async (imageSrc, imageName) => {
    if (!localStorage.getItem("auth-token")) {
      alert("Please Login to download the Image");
      window.location.replace("/login");
      return;
    }
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imageName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error during image download:", error);
    }
  };

  const ImgLike = async (img, userParam) => {
    const token = localStorage.getItem("auth-token");
    if (like.toLowerCase() === "like") {
      try {
        const response = await fetch(
          `https://nature-gallery-z1us.onrender.com/like-img`,
          {
            method: "POST",
            headers: {
              Accept: "application/form-data",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, image: img, imguser: userParam }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setLike("Liked");
        } else {
          setLike("like");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await fetch(
          `https://nature-gallery-z1us.onrender.com/unlike-img`,
          {
            method: "POST",
            headers: {
              Accept: "application/form-data",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, image: img, imguser: userParam }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setLike("like");
        } else {
          setLike("Liked");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const FavImg = async (img, userParam) => {
    const token = localStorage.getItem("auth-token");
    if (fav.toLowerCase() === "add") {
      try {
        const response = await fetch(
          `https://nature-gallery-z1us.onrender.com/add-fav`,
          {
            method: "POST",
            headers: {
              Accept: "application/form-data",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, image: img, imguser: userParam }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setFav("Added");
        } else {
          setFav("add");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await fetch(
          `https://nature-gallery-z1us.onrender.com/remove-fav`,
          {
            method: "POST",
            headers: {
              Accept: "application/form-data",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, image: img, imguser: userParam }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setFav("add");
        } else {
          setFav("Added");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      className="Images"
      key={id}
      ref={containerRef}
      // hover effects like show/hide can be achieved in CSS with :hover to simplify
    >
      <div className="like-fav-section">
        <div
          className="fav-section"
          onClick={() => {
            FavImg(image, imageOwner);
          }}
        >
          {fav.toLowerCase() === "add" ? (
            <CiStar />
          ) : (
            <HiStar style={{ color: "goldenrod" }} />
          )}
        </div>
        <div
          className="like-section"
          onClick={() => {
            ImgLike(image, imageOwner);
          }}
        >
          {like.toLowerCase() === "like" ? (
            <CiHeart />
          ) : (
            <IoMdHeart style={{ color: "red" }} />
          )}
        </div>
      </div>

      {visible ? (
        <img
          src={image}
          alt={`by ${imageOwner}`}
          loading="lazy"
          className="natureimg"
        />
      ) : (
        <div className="placeholder" aria-label="image placeholder">
          {/* optional skeleton / spinner */}
        </div>
      )}

      <div className="name-downloadbtn">
        <Link to={isUser ? "My-Profile" : `/profile/${imageOwner}`}>
          <h4>
            <span className="initial">
              {imageOwner?.charAt(0).toUpperCase()}
            </span>
            {imageOwner}
          </h4>
        </Link>
        <button
          className="download-btn"
          onClick={() => DownloadImg(image, "Image")}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default Imagebox;
