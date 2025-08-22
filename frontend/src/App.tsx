import { Routes, Route } from "react-router-dom"
import Signup from "./components/pages/Signup"
import Homepage from "./components/pages/Homepage"
import { Toaster } from "react-hot-toast"
import SignIn from "./components/pages/Signin"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ProtectedRoute from "./components/pages/ProtectedRoute"
import Navbar from "./components/layout/Navbar"
function App() {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>

      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-[#dee2e6]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

    </QueryClientProvider>
  )
}

export default App
