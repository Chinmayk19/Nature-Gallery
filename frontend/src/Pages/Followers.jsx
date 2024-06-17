import React, { useContext } from 'react'
import { ImageContext } from '../Context/ImageContext';
import User from '../Components/User/User';

const Followers = () => {
    const token=localStorage.getItem("auth-token");
    const {All_Users}=useContext(ImageContext);
    const user=All_Users.find((e)=>e.token===token);
    console.log(user);
    if(!user){
        return <div>Cannot Find User</div>
    }

  return (
    <div>
        {user.followers.map((e,index)=>(
            <User name={e.username}/>
        ))}
    </div>
  )
}

export default Followers