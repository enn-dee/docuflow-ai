import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { motion } from "motion/react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

function SignIn() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({ username, password }: { username: string; password: string }) => {
            const res = await fetch("http://localhost:3000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
            if (!res.ok) throw new Error("Sign in failed")
            const data = await res.json()
            localStorage.setItem("token", data.token)
            return data
        },
        onSuccess: () => {
            toast.success("Welcome back 👋")
            queryClient.invalidateQueries({ queryKey: ["users"] })
            navigate("/home")
        },
        onError: (err: any) => {
            toast.error(err.message || "Something went wrong")
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!username.trim() || !password.trim()) return toast.error("Fields required")

        try {
            await mutation.mutateAsync({ username, password })
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setUsername("")
            setPassword("")
        }
    }

    return (
        <motion.section
            className="min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700
        px-6 py-12"
        >
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10">

                {/*  Illustration + tagline */}
                <motion.div
                    className="flex flex-1 flex-col text-white text-center md:text-left space-y-6"
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <img src="/sign-in.svg" alt="Sign In Illustration" className="hidden md:flex w-2/3 mx-auto md:mx-0" />
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Welcome Back, <br />
                        <span className="text-yellow-300">Let’s Continue Your Journey</span>
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md">
                        Log in to access your personalized dashboard, AI resume tools, and job-matching insights.
                    </p>
                </motion.div>

                {/* SignIn form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6"
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Sign In</h2>
                    <p className="text-center text-gray-500">Good to see you again 👋</p>

                    <div className="space-y-1.5">
                        <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            id="username"
                            placeholder="Enter your username"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 
              px-4 py-2 text-white font-medium transition disabled:opacity-50"
                    >
                        {mutation.isPending ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-center text-gray-600">
                        Don’t have an account?{" "}
                        <a href="/signup" className="text-indigo-600 underline hover:text-indigo-800">
                            Signup
                        </a>
                    </p>
                </motion.form>
            </div>
        </motion.section>
    )
}

export default SignIn
