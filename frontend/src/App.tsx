import { Routes, Route, useNavigate } from "react-router-dom"
import Signup from "./components/pages/Signup"
import Homepage from "./components/pages/Homepage"
import { Toaster } from "react-hot-toast"
import SignIn from "./components/pages/Signin"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ProtectedRoute from "./components/pages/ProtectedRoute"
import Navbar from "./components/layout/Navbar"
import Dashboard from "./components/pages/Dashboard"
import Analyze from "./components/pages/Analyze"
import { useEffect } from "react"

function App() {
  const navigate = useNavigate()

  const queryClient = new QueryClient()
  useEffect(() => {
    const expiry = localStorage.getItem("expiry")
    if (expiry && Date.now() > Number(expiry)) {
      logoutUser()
    }
  }, [])

  function logoutUser() {
    localStorage.removeItem("token")
    localStorage.removeItem("expiry")
    navigate("/")
  }
  return (
    <QueryClientProvider client={queryClient}>

      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-[#dee2e6]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          />

          <Route path="/pdf/:id" element={
            <ProtectedRoute>
              <Analyze />
            </ProtectedRoute>
          } />
        </Routes>
      </div>

    </QueryClientProvider>
  )
}

export default App
