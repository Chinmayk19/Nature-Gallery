import React, { useState } from 'react'
import "./Searchbar.css"

const Searchbar = () => {
    const[text,setText]=useState("")
    function ChangeText(event){
      const changedtext=event.target.value.charAt(0).toUpperCase()+event.target.value.slice(1).toLowerCase();
        setText(changedtext);
    }
    function SearchStd(){
        let newText=text[0].toUpperCase() +text.slice(1).toLowerCase();
        setText(newText);
        console.log(newText);
    }
  
    return (
      <div className="search-bar">
        <input type="text" value={text}  placeholder="Eg.Mountains.." onChange={ChangeText} className='search' required />
        <button onClick={SearchStd} className='searchbtn'>Search</button>
      </div>
    );
  };
  

export default Searchbar