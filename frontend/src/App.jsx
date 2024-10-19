import {Routes, Route} from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LogInPage from "./pages/LogInPage"
import ProfilePage from "./pages/ProfilePage"
import Navbar from "./components/Navbar"

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
    <Navbar/>
    <Routes>
    < Route path="/" element = {<HomePage/>}/>
    < Route path="/signUpPage" element = {<SignUpPage/>}/>
    < Route path="/loginPage" element = {<LogInPage/>}/>
    < Route path="/profilePage" element = {<ProfilePage/>}/>

    </Routes>
    </div>
  )
}

export default App
