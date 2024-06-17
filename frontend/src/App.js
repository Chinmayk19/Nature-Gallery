import {Routes,Route,BrowserRouter} from "react-router-dom";
import './App.css';
import Home from './Pages/Home';
import Navbar from "./Components/Navbar/Navbar";
import ConfirmationPage from "./Components/ConfirmationPage/ConfirmationPage";
import Userupload from "./Components/Userupload/Userupload";
import Profile from "./Pages/Profile";
import Myprofile from "./Pages/Myprofile";
import Followers from "./Pages/Followers";
import Following from "./Pages/Following";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<ConfirmationPage/>}/>
      <Route path="/My-Profile" element={<Myprofile/>}/>
      <Route path="/Followers" element={<Followers/>}/>
      <Route path="/Following" element={<Following/>}/>
      <Route path="/profile" element={<Profile/>}>
        <Route path=":username" element={<Profile/>}/>
      </Route>
      <Route path="/upload" element={localStorage.getItem("auth-token")?<Userupload/>:<ConfirmationPage/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
