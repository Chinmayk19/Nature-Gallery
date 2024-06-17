import React, { useContext } from 'react'
import { ImageContext } from '../Context/ImageContext';
import User from '../Components/User/User';

const Following = () => {
    const token=localStorage.getItem("auth-token");
    const {All_Users}=useContext(ImageContext);
    const user=All_Users.find((e)=>e.token===token);
    console.log(user);
    if(!user){
        <div>User not found</div>
    }
  return (
    <div>
        {user.following.map((e,index)=>(
            <User name={e.username}/>
        ))}
    </div>
  )
}

export default Following