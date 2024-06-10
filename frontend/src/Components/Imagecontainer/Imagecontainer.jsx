import React, { useState } from 'react'
import "./Imagecontainer.css"
import { useContext } from 'react'
import { ImageContext } from '../../Context/ImageContext'
import Imagebox from '../Imagebox/Imagebox'


const Imagecontainer = () => {
    const{All_Images}=useContext(ImageContext);
    const[text,setText]=useState("")
    function ChangeText(event){
      const changedtext=event.target.value.charAt(0).toUpperCase()+event.target.value.slice(1).toLowerCase();
        setText(changedtext);
        console.log(text);
    }
    function Searchimg(){
        setText(text);
        console.log(text);
    }
  return (
    <div className='Image-container'>
        <h2>Nature Images</h2>
        <div className="search-bar">
        <input type="text" value={text}  placeholder="Eg.Forest" onChange={ChangeText} className='search' required />
        <button onClick={Searchimg} className='searchbtn'>Search</button>
      </div>
        <div id="image-block">
           {All_Images.map((item,e)=>{
            if(item.category.includes(text)){
              return <Imagebox key={e} id={e} image={item.image} likes={item.likes}  user={item.user}/>
            }
            else{
              return <p>Loading....</p>;
            }
           })}
        </div>
    </div>
  )
}

export default Imagecontainer