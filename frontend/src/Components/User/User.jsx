import React from 'react'
import "./User.css"
import { Link } from 'react-router-dom'

const User = (props) => {
  return (
    <Link to={`/profile/${props.name}`} className='Name-container'><span>{props.name.charAt(0).toUpperCase()}</span><p>{props.name}</p></Link>
  )
}

export default User