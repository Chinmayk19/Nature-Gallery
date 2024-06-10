import React, { useState } from "react";
import "./Dashboard.css";
import upload from "../Assets/Upload.png";

const Dashboard = () => {
  const [image, setImage] = useState(false);
  const [imagedata, setimagedata] = useState({
    name: "",
    image: "",
    category: "",
  });

  const changeHandler = (e) => {
    setimagedata({ ...imagedata, [e.target.name]: e.target.value });
  };
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const Add_Image = async () => {
    let responseData;
    let result = imagedata;

    let formData = new FormData();
    formData.append("result", image);
    await fetch("http://localhost:3001/Upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });
    if (responseData.success) {
      result.image = responseData.image_url;
      console.log(result);
        await fetch("http://localhost:3001/addimage",{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json",
        },
        body:JSON.stringify(result)
      }).then((resp)=>resp.json()).then((data)=>{
        data.success?alert("Image Added"):alert("Failed");
      })
      // await fetch("http://localhost:3001/addimage", {
      //   method: "POST",
      //   headers:{
      //     Accept:"application/json",
      //     "Content-Type":"application/json",
      //   },
      //   body:JSON.stringify(result),
      // })
      //   .then((response) => response.text()) // Handle the response as text
      //   .then((data) => {
      //     console.log("Server response:", data);
      //     // Process the text response as needed
      //   })
      //   .catch((error) => console.error("Error:", error));
    }
  };

  return (
    <div className="add-image">
      <div className="addimage-itemfield">
        <p>Name:</p>
        <input
          type="text"
          value={imagedata.name}
          onChange={changeHandler}
          name="name"
          placeholder="Enter Name"
        />
      </div>
      <div className="addimage-itemfield">
        <p>Select Category:</p>
        <select
          name="category"
          value={imagedata.category}
          onChange={changeHandler}
          id=""
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
            src={image ? URL.createObjectURL(image) : upload}
            alt=""
            className="Addimage-thumbnail-img"
          />
        </label>
        <input
          type="file"
          onChange={imageHandler}
          name="file"
          id="Image"
          hidden
        />
      </div>
      <div className="addimage-btn-container">
        <button
          className="addimage-btn"
          onClick={() => {
            Add_Image();
          }}
        >
          Add Image
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
