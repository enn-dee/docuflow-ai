import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "react-scroll";

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const isAuth = Boolean(localStorage.getItem("token"))
    const isHome = location.pathname === "/"

    const handleClick = () => {
        if (isAuth) {
            toast.success("Logged out")
            localStorage.removeItem("token")
            localStorage.removeItem("expiry")
            navigate("/")
            return
        }
        navigate("/signup")
    }
    return (

        <header className="flex justify-between items-center px-8 py-4 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
            <h1 className="text-xl font-extrabold tracking-tight hover:cursor-pointer bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent" onClick={() => navigate("/")}>DocuFlow AI</h1>
            {!isAuth && isHome && (
                <nav className="space-x-6 hidden md:flex">
                    <ul className="flex space-x-6 text-sm text-slate-400">
                        <li><Link to="features" smooth duration={600} offset={-70} className="cursor-pointer hover:text-white transition">Features</Link></li>
                        <li><Link to="how-it-works" smooth duration={600} offset={-70} className="cursor-pointer hover:text-white transition">How it Works</Link></li>
                        <li><Link to="cta" smooth duration={600} offset={-70} className="cursor-pointer hover:text-white transition">About</Link></li>
                    </ul>
                </nav>
            )}
            <div className="flex items-center gap-3">
                {isAuth && (
                    <button className="px-4 py-2 text-slate-300 font-medium hover:text-white transition" onClick={() => navigate("/home")}>
                        Dashboard
                    </button>
                )}
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25" onClick={handleClick}>
                    {isAuth ? "Logout" : "Sign Up"}
                </button>
            </div>

        </header>


    )
}

export default Navbar
