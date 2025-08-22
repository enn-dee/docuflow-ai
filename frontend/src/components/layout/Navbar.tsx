
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
const Navbar = () => {
    const isAuth = localStorage.getItem("token")
    const navigate = useNavigate()

    const handleClick = () => {
        if (isAuth) {
            toast.success("Logged out")
            localStorage.removeItem("token")
            navigate("/signup")
            return
        }
        navigate("/signup")
    }

    return (

        <header className="flex justify-between items-center px-8 py-4 shadow-sm">
            <h1 className="text-2xl font-bold text-indigo-600">AI Resume</h1>
            <nav className="space-x-6 hidden md:flex">
                <a href="#" className="hover:text-indigo-600">Features</a>
                <a href="#" className="hover:text-indigo-600">How it Works</a>
                <a href="#" className="hover:text-indigo-600">About</a>
            </nav>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                onClick={handleClick}>
                {isAuth ? "Logout" : "SignUp"}
            </button>
        </header>


    )
}

export default Navbar