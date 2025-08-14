import fetch from "node-fetch";
import { groq_Key } from "../config/process.env";

const GROQ_API_KEY = groq_Key;

async function askGroq(resumeContent: string, jobDescription?:string) {


const prompt: string = `
You are an Applicant Tracking System (ATS) and professional resume coach.
Analyze the resume and job description.
Return ONLY valid JSON — no explanation, no extra text :

Your tasks:
1. Evaluate the following resume against the provided job description.
2. Give an **ATS compatibility score from 0 to 100** based on:
   - Keyword match
   - Relevant skills
   - Experience alignment
   - Formatting suitability for ATS parsing (no tables, columns, or images)
3. List **5–10 missing or weak keywords** that should be added for better match.
4. Suggest **3–5 improvements** in bullet points to make the resume more ATS-friendly.
5. Rewrite **2–3 weak bullet points** from the resume to be more impactful and results-focused.

Format your output as:
{
  "ATS_Score": [score]/100,
  "missingKeywords": ["string", "string",...],
  "improvements": ["string", "string",...],
  "improvedBulletPoints": [
    { "old": "string", "new": "string" },
    { "old": "string", "new": "string" }
  ]
}

Resume Text:
${resumeContent}

Job Description:
${jobDescription}
`


// const prompt = `
// Analyze the resume and job description.
// Return ONLY valid JSON — no explanation, no extra text — in this format:
// {
//   "score": number,
//   "missingKeywords": ["string", "string"],
//   "improvements": ["string", "string"],
//   "improvedBulletPoints": [
//     { "old": "string", "new": "string" },
//     { "old": "string", "new": "string" }
//   ]
// }

// Resume:
// ${resumeContent}

// Job Description:
// ${jobDescription}
// `;



  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama3-70b-8192", // high-quality, free
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })
  });

  const data = await res.json();
 return data.choices[0].message.content
}



export default askGroq;