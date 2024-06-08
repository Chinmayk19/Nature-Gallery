import React, { createContext, useEffect, useState } from "react";
export const ImageContext=createContext(null);
const ImageContextProvider=(props)=>{
    const[All_Images,setAll_Images]=useState([]);
    const[All_Users,setAll_Users]=useState([]);
    useEffect(()=>{
         fetch(`http://localhost:3001/allimages`)
        .then((resp)=>resp.json())
        .then((data)=>setAll_Images(data));

         fetch(`http://localhost:3001/allusers`)
        .then((resp)=>resp.json())
        .then((data)=>setAll_Users(data));
    },[]);

    
    const contextValue={All_Images,All_Users};
    
    return(
        <ImageContext.Provider value={contextValue}>
            {props.children}
        </ImageContext.Provider>
    )
}

export default ImageContextProvider