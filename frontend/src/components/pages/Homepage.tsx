import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()

  const isAuth = localStorage.getItem("token")

  const takeHome = () => {
    isAuth ? navigate("/home") : navigate("/signin")
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white text-gray-800">

      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20" id="hero">
        <div className="max-w-xl" >
          <motion.h2 className="text-5xl font-extrabold leading-tight text-gray-900"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1, transition: { duration: .8, ease: "easeInOut" } }}
          >
            Smarter Resumes. <br /> <motion.span
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1, transition: { duration: .8, ease: "easeInOut", delay: .3 } }}
            > Better Careers.</motion.span>
          </motion.h2>
          <p className="mt-4 text-lg text-gray-600">
            Upload your resume and let AI optimize it for ATS, recruiters, and job success.
          </p>
          <motion.button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow"
            // initial={{ filter: "blur(14px)" }}
            // whileInView={{ filter: "blur(0)" }}
            // transition={{ duration: 1, ease: "easeInOut" }}
            onClick={takeHome}
          >
            {isAuth ? "Dashboard" : " Get Started Free"}
          </motion.button>
        </div>
        <motion.img
          src="/job-hunt.svg"
          alt="Resume Illustration"
          className="w-96 mt-10 md:mt-0"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1, transition: { duration: .8, ease: "easeInOut" } }}
        />
      </section>

      <section className="px-12 py-16 bg-indigo-50" id="features">
        <motion.h3 className="text-3xl font-bold text-center mb-10"
          initial={{ filter: "blur(20px)" }}
          whileInView={{ filter: "blur(0)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >Why Choose Us?</motion.h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow p-6 rounded-2xl text-center">
            <svg className="w-12 h-12 mx-auto text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>

            <h4 className="mt-4 font-semibold">AI-Powered Insights</h4>
            <p className="text-gray-600 mt-2">Get personalized recommendations for improving your resume.</p>
          </div>
          <div className="bg-white shadow p-6 rounded-2xl text-center">
            <svg className="w-12 h-12 mx-auto text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <h4 className="mt-4 font-semibold">ATS-Friendly Format</h4>
            <p className="text-gray-600 mt-2">Ensure your resume passes recruiter screening systems.</p>
          </div>
          <div className="bg-white shadow p-6 rounded-2xl text-center">
            <svg className="w-12 h-12 mx-auto text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8c-1.1 0-2 .9-2 2v6m4-6c0-1.1-.9-2-2-2z" />
            </svg>
            <h4 className="mt-4 font-semibold">Job Match Score</h4>
            <p className="text-gray-600 mt-2">Compare your resume against job descriptions instantly.</p>
          </div>
        </div>
      </section>

      <section className="px-12 py-20" id="how-it-works">
        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">1</span>
            </div>
            <h4 className="mt-4 font-semibold">Upload Resume</h4>
            <p className="text-gray-600">Start by uploading your existing resume.</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">2</span>
            </div>
            <h4 className="mt-4 font-semibold">AI Analysis</h4>
            <p className="text-gray-600">Our AI scans and scores your resume instantly.</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">3</span>
            </div>
            <h4 className="mt-4 font-semibold">Get Optimized</h4>
            <p className="text-gray-600">Receive suggestions to make your resume recruiter-ready.</p>
          </div>
        </div>
      </section>


      <section className="px-12 py-20 bg-indigo-600 text-white text-center" id="cta">
        <motion.h3 className="text-4xl font-bold"
          initial={{ skewX: 90, opacity: 0 }}
          whileInView={{ skewX: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.68, -0.55, 0.27, 1.55] }}
          viewport={{ once: true }}
        >Ready to Land Your Dream Job?</motion.h3>
        <p className="mt-4 text-lg">Let AI help you build the perfect resume today.</p>
        <button className="mt-6 px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100"
          onClick={takeHome}
        >
          Get Started
        </button>
      </section>

      <footer className="px-12 py-8 text-center text-gray-600 border-t mt-12">
        <p>&copy; {new Date().getFullYear()} AI Resume. Crafted with ❤️ by <a href="https://x.com/nadeems_twt" target="_blank">Nadeem</a>.</p>
      </footer>
    </div>
  );
}
