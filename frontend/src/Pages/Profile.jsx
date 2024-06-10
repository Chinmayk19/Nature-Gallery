import React, { useContext, useEffect, useState } from 'react';
import "./CSS/Profile.css";
import { ImageContext } from '../Context/ImageContext';
import { useParams } from 'react-router-dom';
import ProfileInfo from '../Components/ProfileInfo/ProfileInfo';
import Gallery from '../Components/Gallery/Gallery'

const Profile = () => { // Access history from props
    const { All_Users } = useContext(ImageContext);
    const { username } = useParams();
    const [text,setText]=useState("Follow");

    // Find user by username
    const user = All_Users.find((user) => user.username === username);
    const token=localStorage.getItem("auth-token");
    const loggeduser=All_Users.find((e)=>e.token===token);
    const isFollowed=loggeduser && loggeduser.following.some((e)=>e.username===username);
   useEffect(()=>{
    if(isFollowed){
      setText("Unfollow")
    }else{
      setText("Follow");
    }
   },[isFollowed])

    if (!user) {
        return <div style={{textAlign:"center"}}>Loading...</div>; // Handle case where user is not found
    }
    const Follow=async()=>{
      const token=localStorage.getItem("auth-token");
      const username=user.username;  
      if(text==="Follow"){
        try {
          const response=await fetch(`https://nature-gallery-z1us.onrender.com/follow`,{
          method:"POST",
          headers:{
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body:JSON.stringify({token,username}),
        })
        const data=await response.json();
        if(data.success){
          setText("Unfollow");
          window.location.reload();
        }else{
          setText("Follow");
          window.location.reload();
        }
        } catch (error) {
          console.log(error);
        }
      }else{
        try {
          const response=await fetch(`https://nature-gallery-z1us.onrender.com/unfollow`,{
          method:"POST",
          headers:{
            Accept: "application/form-data",
            "Content-Type": "application/json",
          },
          body:JSON.stringify({token,username}),
        })
        const data=await response.json();
        if(data.success){
          setText("Follow");
          window.location.reload();
        }else{
          console.log(data.message);
          setText("Unfollow");
          window.location.reload();
        }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return (
      <>
      <ProfileInfo username={user.username} followers={user.followers.length} following={user.following.length}/>
      <div className="follow-btn">
        <button onClick={()=>{Follow()}}>{text}</button>
      </div>
      <hr />
      <div className='gallery-container'>
      {
        user.userimg.map((e)=>{
          return <Gallery key={e} image={e.image} category={e.category} user={user.username} text="Profile"/>
        })
      }
      </div>
      </>
    );
};

export default Profile;
