import React, { useContext } from "react";
import "./Navbar.css";
import naturelogo from "../Assests/naturelogo.png"
import {Link, useNavigate} from "react-router-dom";
import { ImageContext } from "../../Context/ImageContext";

const Navbar = () => {
  const {All_Users}=useContext(ImageContext);
  const authToken=localStorage.getItem("auth-token");
  const userWithToken=All_Users.find(item=>item.token===authToken);
  const Navigate=useNavigate();

  // const user=All_Users.find((user)=> user.username ===)
  
  function Upload(){
    if(localStorage.getItem("auth-token")){
      Navigate("/upload");
    }
    else{
      alert("Please Login to Upload");
    Navigate("/login");
    }
  }
  function myProfile(){
   window.location.replace("/My-Profile")
  }
  const Home=()=>{
    window.location.reload();
     window.location.replace("/");
  }
  return (
    <div className="navbar">
      <img src={naturelogo} alt="Website Logo" className="logo" onClick={()=>{Home()}} style={{cursor:"pointer"}} />
    <div className="buttons-container">
      <button className="upload-button" onClick={()=>{Upload()}}>Upload</button>
      {localStorage.getItem("auth-token")?<><button className="login-button" onClick={()=>{localStorage.removeItem("auth-token");window.location.replace("/")}}>LogOut</button></>:<><button className="login-button"><Link to="/login">Login</Link></button></>}
      {userWithToken?<Link to="My-Profile" className="my-profile"><p className="profile" onClick={()=>{myProfile()}}>{userWithToken.username.charAt(0).toUpperCase()}</p></Link>:""}
    </div>
  </div>
  );
};

export default Navbar;
