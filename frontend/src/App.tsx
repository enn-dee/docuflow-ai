import { Routes, Route } from "react-router-dom"
import Signup from "./components/pages/Signup"
import Homepage from "./components/pages/Homepage"
function App() {

  return (
   <div className="min-h-screen bg-[#dee2e6]">
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/signup" element={<Signup/>}/>
    </Routes>
   </div>
  )
}

export default App
