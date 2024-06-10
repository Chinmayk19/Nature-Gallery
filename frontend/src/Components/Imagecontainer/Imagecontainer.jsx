import React, { useState, useContext } from 'react';
import './Imagecontainer.css';
import { ImageContext } from '../../Context/ImageContext';
import Imagebox from '../Imagebox/Imagebox';

const Imagecontainer = () => {
  const { All_Images } = useContext(ImageContext);
  const [text, setText] = useState("");

  function ChangeText(event) {
    const changedtext = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1).toLowerCase();
    setText(changedtext);
  }

  function Searchimg() {
    console.log(text);
  }

  const filteredImages = All_Images.filter(item => item.category.includes(text));

  return (
    <div className='Image-container'>
      <h2>Nature Images</h2>
      <div className="search-bar">
        <input 
          type="text" 
          value={text} 
          placeholder="Eg. Forest" 
          onChange={ChangeText} 
          className='search' 
          required 
        />
        <button onClick={Searchimg} className='searchbtn'>Search</button>
      </div>
      <div id="image-block">
        {filteredImages.length > 0 ? (
          filteredImages.map((item, e) => (
            <Imagebox key={e} id={e} image={item.image} likes={item.likes} user={item.user} />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Imagecontainer;
