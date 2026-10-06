import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { motion } from "motion/react"
import toast from "react-hot-toast"
import { useNavigate, Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

function SignIn() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const tokenExpireIn = 3600 * 1000;

    const mutation = useMutation({
        mutationFn: async ({ username, password }: { username: string; password: string }) => {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Sign in failed")
            localStorage.setItem("token", data.token)
            localStorage.setItem("expiry", String(Date.now() + tokenExpireIn))
            return data
        },
        onSuccess: () => {
            toast.success("Welcome back 👋")
            queryClient.invalidateQueries({ queryKey: ["users"] })
            navigate("/home")
        },
        onError: (err: Error) => {
            toast.error(err.message || "Something went wrong")
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!username.trim() || !password.trim()) return toast.error("Fields required")

        try {
            await mutation.mutateAsync({ username, password })
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setPassword("")
        }
    }

    return (
        <motion.section
            className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10 relative">

                <motion.div
                    className="flex flex-1 flex-col text-white text-center md:text-left space-y-6"
                    initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <img src="/sign-in.svg" alt="Sign In Illustration" className="hidden md:block w-2/3 mx-auto md:mx-0" />
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                        Welcome Back, <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Continue Your Journey</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md">
                        Log in to access your personalized dashboard, AI resume tools, and job-matching insights.
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="flex-1 w-full bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6"
                    initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-2xl font-bold text-slate-100 text-center">Sign In</h2>
                    <p className="text-center text-slate-500 text-sm">Good to see you again 👋</p>

                    <div className="space-y-1.5">
                        <Label htmlFor="username" className="text-slate-300 font-medium">Username</Label>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Enter your username"
                            className="w-full bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="••••••••"
                            className="w-full bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500" />
                    </div>

                    <button type="submit" disabled={mutation.isPending}
                        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-white font-semibold transition shadow-lg shadow-indigo-500/25 disabled:opacity-50">
                        {mutation.isPending ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-center text-slate-500 text-sm">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
                    </p>
                </motion.form>
            </div>
        </motion.section>
    )
}

export default SignIn
