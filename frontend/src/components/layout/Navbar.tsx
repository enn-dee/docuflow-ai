
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Link } from "react-scroll";

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
            <h1 className="text-2xl font-bold text-indigo-600" onClick={() => navigate("/")}>AI Resume</h1>
            {isAuth ?
                undefined
                :
                <>
                    <nav className="space-x-6 hidden md:flex">

                        <li>
                            <Link
                                to="features"
                                smooth={true}
                                duration={600}
                                offset={-70}
                                className="cursor-pointer hover:text-blue-600 transition"
                            >
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="how-it-works"
                                smooth={true}
                                duration={600}
                                offset={-70}
                                className="cursor-pointer hover:text-blue-600 transition"
                            >
                                How it Works
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="cta"
                                smooth={true}
                                duration={600}
                                offset={-70}
                                className="cursor-pointer hover:text-blue-600 transition"
                            >
                                About
                            </Link>
                        </li>
                    </nav>
                </>}
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                onClick={handleClick}>
                {isAuth ? "Logout" : "SignUp"}
            </button>

        </header>


    )
}

export default Navbar