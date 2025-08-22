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
    mutationFn: async () => {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Registered Successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/signin");
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      return toast.error("Fields required")
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    mutation.mutate()
  }

  return (
    <motion.section className="h-screen flex flex-col items-center justify-center 
      bg-gradient-to-bl from-[#1565c0]/50 to-[#051923]/80 p-6">
      <motion.h1
        className="text-center text-3xl font-semibold text-white/90 mb-6"
        initial={{ filter: "blur(20px)" }}
        whileInView={{ filter: "blur(0)", transition: { duration: 1 } }}
      >
        Signup
      </motion.h1>

      <div className="w-screen h-screen flex flex-col md:flex-row justify-center items-center space-y-1.5 md:space-x-1.5 ">
        {/* Left: Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-96 md:w-1/2 space-y-4 p-6 rounded-xl 
            bg-white/20 backdrop-blur-md border border-white/30 shadow-xl shadow-black/20"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="username" className="font-mono text-lg text-white/90">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              placeholder="Enter your username"
              className="w-full rounded-md border border-white/40 bg-white/20 
                px-3 py-2 text-white placeholder:text-white/60 
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-mono text-lg text-white/90">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-white/40 bg-white/20 
                px-3 py-2 text-white placeholder:text-white/60 
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md bg-indigo-500/80 hover:bg-indigo-500 
              px-4 py-2 text-white font-medium transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "Signing up..." : "Sign Up"}
          </button>

          <div className="text-center text-white/80 space-y-1.5">
            <hr />
            <p>Already have an account ? <a href="/signin" className="underline">Signin</a></p>
          </div>
        </motion.form>

        {/* Right: Illustration */}
        <motion.div
          className="md:h-80 max-w-96 md:w-1/2 flex flex-col items-center justify-center bg-[#0c1821]/60 text-white p-10 rounded-md"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{
            x: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
        >
          <img src="/sign-up.svg" alt="Signup illustration" className="w-1/2" />
          <h2 className="text-3xl font-bold">Join Us Today</h2>
          <p className="text-lg text-gray-300 mt-2">Start your journey with our amazing community</p>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Signup
