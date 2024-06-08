import React, { useContext, useState } from "react";
import "./Userupload.css";
import upload from "../Assests/Upload.png";
import { ImageContext } from "../../Context/ImageContext";

const Userupload = (props) => {
  const { All_Users } = useContext(ImageContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading,setLoading]=useState(false);
  const [imagedata, setImagedata] = useState({
    username: "",
    name: "",
    email: "",
    image: "",
    category: "",
  });

  const changeHandler = (e) => {
    setImagedata({ ...imagedata, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
   if(!loading){
    try {
      setLoading(true);
      const formData = new FormData();
      const foldername="naturegallery"
      formData.append("file", selectedImage);
      formData.append("upload_preset", "project");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/db5d081q6/image/upload?folder="+foldername,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data) {
        const result = { ...imagedata, image: data.secure_url };
        const token = localStorage.getItem("auth-token");
        All_Users.forEach((item) => {
          if (token === item.token) {
            result.name = item.name;
            result.email = item.email;
            result.username = item.username;
          }
        });

        const addImageResponse = await fetch(`http://localhost:3001/addimage`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });

        const addImageResponseData = await addImageResponse.json();

        if (addImageResponseData.success) {
          alert("Image Added");
        } else {
          alert("Failed to add image");
        }
      } else {
        alert("Failed to Upload Image");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload image");
    }
   }
  };

  return (
    <div className="add-image">
      <div className="addimage-itemfield">
        <p>Select Category:</p>
        <select
          name="category"
          value={imagedata.category}
          onChange={changeHandler}
          className="add-image-selector"
          style={{ cursor: "pointer" }}
        >
          <option value="Mountain">Mountain</option>
          <option value="River">River</option>
          <option value="Beach">Beach</option>
          <option value="Village">Village</option>
          <option value="Forest">Forest</option>
        </select>
      </div>
      <div className="upload-img-container">
        <label htmlFor="Image" className="Upload-Image">
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : upload}
            alt=""
            className="Addimage-thumbnail-img"
          />
        </label>
        <input
          type="file"
          onChange={imageHandler}
          id="Image"
          hidden
        />
      </div>
      <div className="addimage-btn-container">
        <button
          className="addimage-btn"
          onClick={handleImageUpload}
          style={{cursor:loading?"wait":"pointer"}}
        >
          {loading?"Uploading":"Upload Image"}
        </button>
      </div>
    </div>
  );
};

export default Userupload;
