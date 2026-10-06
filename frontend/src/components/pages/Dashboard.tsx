import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FileText, UploadCloud, Trash2, Eye, User as UserIcon } from "lucide-react";

interface Resume {
    id: number;
    url: string;
    userId: number;
    createdAt: string;
    latestScore?: number | null;
}

const fetchResumes = async (): Promise<Resume[]> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}pdf`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch resumes");
    const data = await res.json();
    return data.pdfs.message;
};

const fetchMe = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return (await res.json()).user;
};

const Dashboard = () => {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const { data: resumes, isLoading } = useQuery({ queryKey: ["resumes"], queryFn: fetchResumes });
    const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!selectedFile) return;
            const formData = new FormData();
            formData.append("file-upload", selectedFile);
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}upload`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            return data;
        },
        onSuccess: () => {
            toast.success("Resume uploaded successfully!");
            setSelectedFile(null);
            queryClient.invalidateQueries({ queryKey: ["resumes"] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
        onError: (err: Error) => toast.error(err.message || "Something went wrong"),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}pdf/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Delete failed");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Resume deleted");
            queryClient.invalidateQueries({ queryKey: ["resumes"] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
        onError: (err: Error) => toast.error(err.message),
    });

    return (
        <div className="min-h-screen px-6 md:px-12 py-12 bg-slate-950">

            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-100">
                        Your <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Upload resumes, track ATS scores, and explore analysis.</p>
                </div>
                {me && (
                    <div className="flex items-center gap-3 bg-slate-900 border border-white/5 rounded-2xl px-5 py-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-200">{me.username}</p>
                            <p className="text-xs text-slate-500">{me._count?.pdfs ?? 0} resume(s)</p>
                        </div>
                    </div>
                )}
            </motion.div>

            <motion.div className="bg-slate-900/80 border border-white/5 p-6 rounded-2xl max-w-2xl mb-12"
                initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-indigo-400" /> Upload New Resume
                </h2>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl py-8 cursor-pointer transition text-slate-500">
                    <FileText className="w-8 h-8" />
                    <span className="text-sm">{selectedFile ? selectedFile.name : "Click to select a PDF (max 10MB)"}</span>
                    <input type="file" accept="application/pdf" className="hidden"
                        onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} />
                </label>
                <button onClick={() => { if (!selectedFile) return toast.error("Select a file first"); uploadMutation.mutate(); }}
                    disabled={uploadMutation.isPending}
                    className="mt-4 w-full px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-lg shadow-indigo-500/25 disabled:opacity-50">
                    {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
                </button>
            </motion.div>

            <h2 className="text-xl font-semibold text-slate-200 mb-5">Your Resumes</h2>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {isLoading ? (
                    <p className="text-slate-500 col-span-full">Loading resumes...</p>
                ) : resumes?.length ? (
                    resumes.map((r) => (
                        <motion.div key={r.id} whileHover={{ y: -5 }}
                            className="bg-slate-900 border border-white/5 p-5 rounded-2xl shadow-xl w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="font-semibold text-slate-200 truncate" title={r.url.split("/").pop()}>
                                    {r.url.split("/").pop()}
                                </h3>
                            </div>
                            <p className="text-xs text-slate-600 mt-3">{new Date(r.createdAt).toLocaleDateString()}</p>
                            <p className="mt-2 text-sm text-slate-400">
                                ATS Score:{" "}
                                <span className={`font-bold ${r.latestScore ? (r.latestScore >= 70 ? "text-emerald-400" : "text-amber-400") : "text-slate-600"}`}>
                                    {r.latestScore ?? "Not processed"}
                                </span>
                            </p>
                            <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-400 hover:underline">View PDF</a>
                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition flex items-center justify-center gap-2 text-sm font-medium"
                                    onClick={() => navigate(`/pdf/${r.id}`)}>
                                    <Eye className="w-4 h-4" /> Analyze
                                </button>
                                <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition"
                                    onClick={() => { if (confirm("Delete this resume?")) deleteMutation.mutate(r.id); }}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                        No resumes uploaded yet — upload your first one above.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Dashboard;
