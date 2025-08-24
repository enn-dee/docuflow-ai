import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { motion } from "motion/react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

function Signup() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await fetch(import.meta.env.VITE_BASE_URL+"signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")
      return data
    },
    onSuccess: () => {
      toast.success("🎉 Registered Successfully")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      navigate("/signin")
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong")
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return toast.error("Fields required")
    if (password.length < 6) return toast.error("Password must be at least 6 characters")
    mutation.mutate({ username, password })
  }

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600
        px-6 py-12"
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10">

        {/*  Illustration + tagline */}
        <motion.div
          className="flex-1 text-white text-center md:text-left space-y-6"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <img src="/career-progress.svg" alt="Career Growth" className="w-2/3 mx-auto md:mx-0 hidden md:flex" />
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Unlock Your Future <br />
            <span className="text-yellow-300">With Smarter Resumes</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-md">
            Join our platform today and get access to AI-powered tools that help you land your dream job.
          </p>
        </motion.div>

        {/* Signup form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>
          <p className="text-center text-gray-500">Start building smarter resumes today 🚀</p>

          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              placeholder="Choose a username"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500">Must be at least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || !username || password.length < 6}
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 
              px-4 py-2 text-white font-medium transition disabled:opacity-50"
          >
            {mutation.isPending ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-indigo-600 underline hover:text-indigo-800">Signin</a>
          </p>
        </motion.form>
      </div>
    </motion.section>
  )
}

export default Signup
