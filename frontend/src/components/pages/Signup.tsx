import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { motion } from "motion/react"
import toast from "react-hot-toast"
import { useNavigate, Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

function Signup() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await fetch(import.meta.env.VITE_BASE_URL + "signup", {
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
    onError: (err: Error) => {
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
      className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10 relative">

        <motion.div
          className="flex-1 text-white text-center md:text-left space-y-6"
          initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <img src="/career-progress.svg" alt="Career Growth" className="w-2/3 mx-auto md:mx-0 hidden md:block" />
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Unlock Your Future <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">With Smarter Resumes</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md">
            Join today and get access to AI-powered tools that help you land your dream job.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 w-full bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6"
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-slate-100 text-center">Create Account</h2>
          <p className="text-center text-slate-500 text-sm">Start building smarter resumes today 🚀</p>

          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-slate-300 font-medium">Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Choose a username"
              className="w-full bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="••••••••"
              className="w-full bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500" />
            <p className="text-sm text-slate-600">Must be at least 6 characters</p>
          </div>

          <button type="submit" disabled={mutation.isPending || !username || password.length < 6}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-white font-semibold transition shadow-lg shadow-indigo-500/25 disabled:opacity-50">
            {mutation.isPending ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </motion.form>
      </div>
    </motion.section>
  )
}

export default Signup
