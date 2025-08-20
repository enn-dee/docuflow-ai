import { Routes, Route } from "react-router-dom"
import Signup from "./components/pages/Signup"
import Homepage from "./components/pages/Homepage"
import { Toaster } from "react-hot-toast"
import SignIn from "./components/pages/Signin"
function App() {

  return (
   <div className="min-h-screen bg-[#dee2e6]">
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<SignIn/>} />
    </Routes>
   </div>
  )
}

export default App
