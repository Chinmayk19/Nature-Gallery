// Imagebox.jsx
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import "./Imagebox.css";
import { Link } from "react-router-dom";
import { ImageContext } from "../../Context/ImageContext";
import { CiHeart, CiStar } from "react-icons/ci";
import { IoMdHeart } from "react-icons/io";
import { HiStar } from "react-icons/hi2";

const LazyImage = ({ src, alt, className }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="lazy-image-wrapper"
      aria-label="lazy-image-wrapper"
      style={{ position: "relative", width: "100%", minHeight: "150px" }}
    >
      {visible ? (
        <img src={src} alt={alt} loading="lazy" className={className} />
      ) : (
        <div className="placeholder" aria-label="image placeholder">
          {/* you can put a spinner or skeleton here */}
        </div>
      )}
    </div>
  );
};

const Imagebox = ({ id, image, user: imageOwner }) => {
  const { All_Users } = useContext(ImageContext);
  const token = localStorage.getItem("auth-token");

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

  const [like, setLike] = useState(isLiked ? "liked" : "like");
  const [fav, setFav] = useState(isFav ? "added" : "add");

  useEffect(() => {
    setLike(isLiked ? "liked" : "like");
    setFav(isFav ? "added" : "add");
  }, [isLiked, isFav]);

  const DownloadImg = useCallback(
    async (imageSrc, imageName) => {
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
    },
    []
  );

  const ImgLike = useCallback(
    async (img, userParam) => {
      const tokenLocal = localStorage.getItem("auth-token");
      if (like === "like") {
        try {
          const response = await fetch(
            `https://nature-gallery-z1us.onrender.com/like-img`,
            {
              method: "POST",
              headers: {
                Accept: "application/form-data",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: tokenLocal, image: img, imguser: userParam }),
            }
          );
          const data = await response.json();
          if (data.success) {
            setLike("liked");
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
              body: JSON.stringify({ token: tokenLocal, image: img, imguser: userParam }),
            }
          );
          const data = await response.json();
          if (data.success) {
            setLike("like");
          } else {
            setLike("liked");
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [like]
  );

  const FavImg = useCallback(
    async (img, userParam) => {
      const tokenLocal = localStorage.getItem("auth-token");
      if (fav === "add") {
        try {
          const response = await fetch(
            `https://nature-gallery-z1us.onrender.com/add-fav`,
            {
              method: "POST",
              headers: {
                Accept: "application/form-data",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: tokenLocal, image: img, imguser: userParam }),
            }
          );
          const data = await response.json();
          if (data.success) {
            setFav("added");
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
              body: JSON.stringify({ token: tokenLocal, image: img, imguser: userParam }),
            }
          );
          const data = await response.json();
          if (data.success) {
            setFav("add");
          } else {
            setFav("added");
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [fav]
  );

  return (
    <div className="Images" key={id}>
      <div className="like-fav-section">
        <div
          className="fav-section"
          onClick={() => {
            FavImg(image, imageOwner);
          }}
        >
          {fav === "add" ? <CiStar /> : <HiStar style={{ color: "goldenrod" }} />}
        </div>
        <div
          className="like-section"
          onClick={() => {
            ImgLike(image, imageOwner);
          }}
        >
          {like === "like" ? <CiHeart /> : <IoMdHeart style={{ color: "red" }} />}
        </div>
      </div>

      <LazyImage src={image} alt={`by ${imageOwner}`} className="natureimg" />

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
