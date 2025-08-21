import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { motion } from "motion/react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { QueryClient, useMutation } from "@tanstack/react-query"

function SignIn() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const navigate = useNavigate()
    const queryClient = new QueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("http://localhost:3000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
            if (!res.ok) throw new Error("Sign in failed")
            const data = await res.json()
            console.log("res: ", data)
            localStorage.setItem("token", data.token)
            return data
        },
        onSuccess: () => {
            toast.success("Logged in")
            queryClient.invalidateQueries({ queryKey: ["users"] })
            navigate("/home")
        },
        onError: (err: any) => {
            toast.error(err.message || "Something went wrong")
        }
    })
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {

            if (!username.trim() || !password.trim()) {
                return toast.error("Fields required")
            }

            mutation.mutate()

        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setUsername("")
            setPassword("")
        }

    }

    return (
        <motion.section
            className="w-full h-screen flex flex-col items-center justify-center 
                 bg-gradient-to-bl from-[#1565c0]/50 to-[#2e294e]/80 p-6"
        >
            <motion.h1
                className="text-center text-3xl font-semibold text-[#e9ecef] mb-6"
                initial={{ filter: "blur(20px)" }}
                whileInView={{ filter: "blur(0)", transition: { duration: 1 } }}
            >
                Signin
            </motion.h1>
            <div className=" w-screen h-screen flex flex-col md:flex-row justify-center items-center space-y-1.5 md:space-x-1.5">

                <motion.form
                    onSubmit={handleSubmit}
                    className="max-w-96 md:w-1/2 space-y-4 p-6 rounded-xl 
                   bg-white/20 backdrop-blur-md border border-white/30
                   shadow-xl shadow-black/20 "
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.8, ease: 'easeInOut' },
                    }}
                >
                    {/* Username */}
                    <div className="space-y-1.5">
                        <Label htmlFor="username" className="font-mono text-lg text-white/90">
                            Username
                        </Label>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            id="username"
                            className="w-full rounded-md border border-white/40 bg-white/20 
                       px-3 py-2 text-white placeholder:text-white/60 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="font-mono text-lg text-white/90">
                            Password
                        </Label>
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type="password"
                            className="w-full rounded-md border border-white/40 bg-white/20 
                       px-3 py-2 text-white placeholder:text-white/60 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full rounded-md bg-indigo-500/80 hover:bg-indigo-500 
              px-4 py-2 text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {mutation.isPending ? "Signing in..." : "Sign in"}
                    </button>
                    <div className="text-center text-white/80 space-y-1.5">
                        <hr />
                        <p>Create new account ? <a href="/Signup" className="underline">Signup</a></p>
                    </div>
                </motion.form>



                {/* Right: Visual */}
                <motion.div className="md:h-80 max-w-96 md:w-1/2 flex flex-col items-center justify-center bg-[#0c1821]/60 text-white p-10 rounded-md "
                    initial={{ x: 100, opacity: 0 }}
                    whileInView={{
                        x: 0,
                        opacity: 1,
                        transition: { duration: 0.8, ease: 'easeInOut' },
                    }}
                >
                    <img src="/sign-in.svg" alt="signin illustration" className="w-1/2" />

                    <p className="text-lg text-gray-300 mt-2">Good to see you again! Let’s get started.</p>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default SignIn
