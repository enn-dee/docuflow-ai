import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";

interface Resume {
    id: number;
    url: string;
    userId: number;
    uploadedAt: string;
    atsScore?: number;
}

const fetchResumes = async (): Promise<Resume[]> => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/pdf", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch resumes");
    const data = await res.json();
    return data.pdfs.message;
};

const Dashboard = () => {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data: resumes, isLoading } = useQuery({
        queryKey: ["resumes"],
        queryFn: fetchResumes,
    });

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!selectedFile) return;
            const formData = new FormData();
            formData.append("file-upload", selectedFile);

            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/upload", {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Upload failed");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Resume uploaded successfully!");
            setSelectedFile(null);
            queryClient.invalidateQueries({ queryKey: ["resumes"] });
        },
        onError: (err: any) => {
            toast.error(err.message || "Something went wrong");
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!selectedFile) return toast.error("Select a file first");
        uploadMutation.mutate();
    };

    return (
        <div className="min-h-screen px-6 md:px-12 py-12 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-10 text-center"
            >
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Your <span className="text-indigo-600">Dashboard</span>
                </h1>
                <p className="text-gray-500 mt-2">
                    Upload resumes, track ATS scores, and explore analysis.
                </p>
            </motion.div>

            {/* Upload  */}
            <motion.div
                className="bg-white/90 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mb-12 border border-gray-100"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Upload New Resume
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full md:flex-1 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 
                       file:py-2 file:text-white file:cursor-pointer hover:file:bg-indigo-700"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={uploadMutation.isPending}
                        className="w-full md:w-auto px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50"
                    >
                        {uploadMutation.isPending ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </motion.div>

            {/* Resume List */}

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {isLoading ? (
                    <p className="text-gray-500 col-span-full">Loading resumes...</p>
                ) : resumes?.length ? (
                    resumes.map((r) => (
                        <motion.div
                            key={r.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 w-full break-words"
                        >
                            <h3 className="font-semibold text-lg text-gray-800 truncate">
                                {r.url.split("/").pop()}
                            </h3>
                            <a href={r.url} target="blank">view Resume</a>
                            <p className="mt-3">
                                ATS Score:{" "}
                                <span
                                    className={`font-bold ${r.atsScore
                                            ? r.atsScore >= 70
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {r.atsScore ?? "Not processed"}
                                </span>
                            </p>
                            <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                                View Analysis
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full">No resumes uploaded yet.</p>
                )}
            </motion.div>

        </div>
    );
};

export default Dashboard;
