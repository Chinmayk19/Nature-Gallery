import React from 'react'
import {Routes,Route} from "react-router-dom"
import Dashboard from "../Components/Dashboard/Dashboard"
import Users from "../Components/Users/Users"
import Usersupload from "../Components/Usersupload/Usersupload"

const Admin = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Dashboard/>}></Route>
            <Route path='/users' element={<Users/>}></Route>
            <Route path='/usersupload' element={<Usersupload/>}></Route>
        </Routes>
    </div>
  )
}

export default Admin