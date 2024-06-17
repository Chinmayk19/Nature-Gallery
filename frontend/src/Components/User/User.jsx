import React from 'react'
import "./User.css"

const User = (props) => {
  return (
    <div className='Name-container'><span>{props.name.charAt(0).toUpperCase()}</span><p>{props.name}</p></div>
  )
}

export default User