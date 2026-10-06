import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowLeft, FileText, History } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import toast from "react-hot-toast";

interface HistoryEntry {
    id: number;
    AnalysedAt: string;
    history: {
        ATS_Score: number;
        improvements: string[];
        missingKeywords: string[];
        improvedBulletPoints: { old: string; new: string }[];
    } | null;
    jobDescription?: string | null;
}

const Analyze = () => {
    const token = localStorage.getItem("token");
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [jobDescription, setJobDesc] = useState("");

    const queryClient = useQueryClient();

    const processResumeMutate = useMutation({
        mutationFn: async ({ jobDescription }: { jobDescription: string }) => {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}pdf/${id}`, {
                method: "POST",
                body: JSON.stringify({ jobDescription }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to process resume");
            }

            const data = await res.json();
            if (data?.message && data.message.status === false) {
                throw new Error(data.message.message || "Processing failed");
            }
            return data;
        },
        onSuccess: () => {
            setJobDesc("");
            toast.success("Resume processed ✅");
            queryClient.invalidateQueries({ queryKey: ["history", id] });
        },
        onError: (err: Error) => {
            toast.error(err.message || "Something went wrong");
        },
    });


    const fetchHistory = async () => {
        const res = await fetch(import.meta.env.VITE_BASE_URL + `history/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            const { data } = await res.json();
            return data;
        }
        throw new Error("Failed to fetch history");
    };

    const { data, isLoading } = useQuery({
        queryKey: ["history", id],
        queryFn: fetchHistory,
    });

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8">

            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl mb-6"
            >
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5"
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
                <Card className="bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl text-slate-100">
                    <CardHeader className="flex flex-col items-center gap-3">
                        <motion.div
                            initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-full"
                        >
                            <FileText className="h-10 w-10 text-indigo-400" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-slate-100">
                            Analyze Resume
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">

                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center text-lg font-medium text-slate-400"
                        >
                            Resume ID: <span className="font-bold text-indigo-400">{id}</span>
                        </motion.h1>


                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-3"
                        >
                            <label className="text-sm font-medium text-slate-500">
                                Paste Job Description
                            </label>
                            <Textarea
                                placeholder="Enter job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDesc(e.target.value)}
                                className="min-h-[120px] bg-slate-800/60 border-white/10 text-slate-100 placeholder:text-slate-600"
                            />
                        </motion.div>


                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="w-full flex justify-center"
                        >
                            <Button
                                className="px-6 py-2.5 rounded-xl text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                disabled={jobDescription.length < 10 || processResumeMutate.isPending}
                                onClick={() => {
                                    toast.loading("Analyzing...", { id: "analyze" });
                                    processResumeMutate.mutate({ jobDescription }, {
                                        onSettled: () => toast.dismiss("analyze"),
                                    });
                                }}

                            >
                                Start Analysis
                            </Button>
                        </motion.div>


                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-10"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <History className="h-5 w-5 text-slate-500" />
                                <h2 className="text-lg font-semibold text-slate-200">
                                    Previous Analysis
                                </h2>
                            </div>

                            {isLoading ? (
                                <p className="text-slate-600">Loading history...</p>
                            ) : data?.length ? (
                                <Accordion type="single" collapsible className="w-full space-y-3">
                                    {data.map((entry: HistoryEntry) => {
                                        if (!entry.history) return null;

                                        return (
                                            <AccordionItem key={entry.id} value={`entry-${entry.id}`} className="bg-slate-900/60 border border-white/5 rounded-xl px-4">
                                                <AccordionTrigger className="text-sm font-medium flex justify-between w-full">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-white text-xs ${entry.history.ATS_Score >= 70
                                                                ? "bg-emerald-600"
                                                                : "bg-red-600"
                                                                }`}
                                                        >
                                                            {entry.history.ATS_Score}%
                                                        </span>
                                                        <span className="text-slate-400">
                                                            Analyzed at{" "}
                                                            {new Date(entry.AnalysedAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="p-4 rounded-xl bg-slate-800/50 border border-white/5 space-y-4"
                                                    >

                                                        {entry.jobDescription && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-slate-300">Job Description:</h4>
                                                                <p className="text-sm text-slate-500 mt-1 line-clamp-3">{entry.jobDescription}</p>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-slate-300">
                                                                Suggested Improvements:
                                                            </h4>
                                                            <ul className="list-disc list-inside text-sm text-slate-400 mt-1">
                                                                {entry.history.improvements.map(
                                                                    (imp: string, i: number) => (
                                                                        <li key={i}>{imp}</li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>


                                                        <div>
                                                            <h4 className="text-sm font-semibold text-slate-300">
                                                                Missing Keywords:
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {entry.history.missingKeywords.map(
                                                                    (kw: string, i: number) => (
                                                                        <span
                                                                            key={i}
                                                                            className="px-2 py-1 text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-md"
                                                                        >
                                                                            {kw}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>


                                                        <div>
                                                            <h4 className="text-sm font-semibold text-slate-300">
                                                                Improved Bullet Points:
                                                            </h4>
                                                            <div className="space-y-3 mt-2">
                                                                {entry.history.improvedBulletPoints.map(
                                                                    (bp: { old: string; new: string }, i: number) => (
                                                                        <div
                                                                            key={i}
                                                                            className="grid grid-cols-2 gap-4 text-sm"
                                                                        >
                                                                            <div className="p-3 rounded-md bg-red-500/5 border border-red-500/20">
                                                                                <p className="text-slate-300 font-medium">
                                                                                    Old:
                                                                                </p>
                                                                                <p className="text-slate-400">{bp.old}</p>
                                                                            </div>
                                                                            <div className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/20">
                                                                                <p className="text-slate-300 font-medium">
                                                                                    New:
                                                                                </p>
                                                                                <p className="text-slate-400">{bp.new}</p>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    })}

                                </Accordion>

                            ) : (
                                <p className="text-slate-600">No history available.</p>
                            )}
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Analyze;
