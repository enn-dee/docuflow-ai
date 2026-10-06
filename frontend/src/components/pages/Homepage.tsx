import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { Sparkles, CheckCircle2, Target } from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()
  const isAuth = localStorage.getItem("token")

  const takeHome = () => {
    if (isAuth) {
      navigate("/home")
    } else {
      navigate("/signin")
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">

      <section className="relative flex flex-col md:flex-row items-center justify-between px-12 py-24 overflow-hidden" id="hero">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="max-w-xl relative">
          <motion.p className="text-indigo-400 font-semibold mb-4 tracking-wide text-sm uppercase"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>AI-Powered Resume Intelligence</motion.p>
          <motion.h2 className="text-5xl font-extrabold leading-tight tracking-tight"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: .6 } }}>
            Smarter Resumes. <br /> <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Better Careers.</span>
          </motion.h2>
          <p className="mt-5 text-lg text-slate-400">
            Upload your resume and let AI optimize it for ATS, recruiters, and job success.
          </p>
          <motion.button className="mt-8 px-8 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition font-semibold"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={takeHome}>
            {isAuth ? "Go to Dashboard" : "Get Started Free"}
          </motion.button>
        </div>
        <motion.img src="/job-hunt.svg" alt="Resume Illustration" className="w-96 mt-10 md:mt-0 drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, transition: { duration: .7 } }} />
      </section>

      <section className="px-12 py-20 bg-slate-900/50 border-y border-white/5" id="features">
        <motion.h3 className="text-3xl font-bold text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
          viewport={{ once: true }}>Why Choose DocuFlow?</motion.h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: <Sparkles className="w-6 h-6 text-indigo-400" />, title: "AI-Powered Insights", desc: "Get personalized recommendations for improving your resume." },
            { icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />, title: "ATS-Friendly", desc: "Ensure your resume passes recruiter screening systems." },
            { icon: <Target className="w-6 h-6 text-violet-400" />, title: "Job Match Score", desc: "Compare your resume against job descriptions instantly." },
          ].map((f) => (
            <motion.div key={f.title} whileHover={{ y: -6 }} className="bg-slate-900 border border-white/5 shadow-xl p-7 rounded-2xl text-center">
              <div className="w-12 h-12 mx-auto bg-slate-800 rounded-xl flex items-center justify-center">{f.icon}</div>
              <h4 className="mt-4 font-semibold text-lg">{f.title}</h4>
              <p className="text-slate-400 mt-2 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-12 py-20" id="how-it-works">
        <h3 className="text-3xl font-bold text-center mb-14 tracking-tight">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
          {["Upload Resume", "AI Analysis", "Get Optimized"].map((t, i) => (
            <div key={t}>
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-xl">{i + 1}</span>
              </div>
              <h4 className="mt-5 font-semibold text-lg">{t}</h4>
              <p className="text-slate-400 mt-1 text-sm">{["Start by uploading your existing resume.", "Our AI scans and scores your resume instantly.", "Receive suggestions to make your resume recruiter-ready."][i]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-12 mb-16 rounded-3xl py-20 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center shadow-2xl shadow-indigo-500/20" id="cta">
        <motion.h3 className="text-4xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
          viewport={{ once: true }}>Ready to Land Your Dream Job?</motion.h3>
        <p className="mt-4 text-indigo-100">Let AI help you build the perfect resume today.</p>
        <button className="mt-8 px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition"
          onClick={takeHome}>Get Started</button>
      </section>

      <footer className="px-12 py-8 text-center text-slate-500 border-t border-white/5 text-sm">
        <p>&copy; {new Date().getFullYear()} DocuFlow AI. Crafted with care by <a href="https://x.com/nadeems_twt" target="_blank" className="text-indigo-400 hover:underline">Nadeem</a>.</p>
      </footer>
    </div>
  );
}
