import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, FileText, History } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Analyze = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jobDesc, setJobDesc] = useState("");

  // Temporary static history (later fetch from backend)
  const history = [
    {
      id: "1",
      title: "Job Description Match",
      feedback: "Good alignment with software engineer role. Improve cover letter.",
      date: "Aug 20, 2025",
    },
    {
      id: "2",
      title: "Resume Scan",
      feedback: "Strong technical skills. Missing project outcomes.",
      date: "Aug 15, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center p-8">
      
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl mb-6"
      >
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-5xl"
      >
        <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white">
          <CardHeader className="flex flex-col items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="p-4 bg-blue-100 rounded-full"
            >
              <FileText className="h-10 w-10 text-blue-600" />
            </motion.div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Analyze Resume
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-lg font-medium text-gray-700"
            >
              Resume ID: <span className="font-bold text-blue-600">{id}</span>
            </motion.h1>

        
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="text-sm font-medium text-gray-600">
                Paste Job Description
              </label>
              <Textarea
                placeholder="Enter job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="min-h-[120px]"
              />
            </motion.div>

           
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full flex justify-center"
            >
              <Button className="px-6 py-2 rounded-xl text-lg"
              disabled={jobDesc.length < 10}
              >
                Start Analysis
              </Button>
            </motion.div>

            {/* History */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-700">
                  Previous Analysis
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.feedback}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analyze;
