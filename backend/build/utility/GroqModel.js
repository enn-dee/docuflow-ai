"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const process_env_1 = require("../config/process.env");
const GROQ_API_KEY = process_env_1.groq_Key;
function askGroq(resumeContent, jobDescription) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const prompt = `
You are an Applicant Tracking System (ATS) and professional resume coach.
Analyze the resume and job description.
Return ONLY valid JSON — no explanations, no extra text, no percentages, no fractions.

Your tasks:
1. Evaluate the resume against the job description.
2. Give an ATS compatibility score as an integer from 0 to 100.
3. List 5–10 missing or weak keywords.
4. Suggest 3–5 improvements.
5. Rewrite 2–3 weak bullet points.

Format your output as strict JSON:

{
  "ATS_Score": number,
  "missingKeywords": ["string", "string"],
  "improvements": ["string", "string"],
  "improvedBulletPoints": [
    { "old": "string", "new": "string" }
  ]
}

Resume Text:
${resumeContent}

Job Description:
${jobDescription || ""}
`;
        try {
            const res = yield (0, node_fetch_1.default)("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                })
            });
            const data = yield res.json();
            if (!((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content)) {
                console.error("Unexpected response from Groq API:", JSON.stringify(data, null, 2));
                return null;
            }
            return data.choices[0].message.content;
        }
        catch (err) {
            console.error("Error calling Groq API:", err);
            return null;
        }
    });
}
exports.default = askGroq;
