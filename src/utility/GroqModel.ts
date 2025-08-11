import fetch from "node-fetch";
import { groq_Key } from "../config/process.env";

const GROQ_API_KEY = groq_Key;

async function askGroq(resumeContent: string, jobDescription?:string) {


const prompt: string = `

You are an Applicant Tracking System (ATS) and professional resume coach.

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

ATS Score: [score]/100

Missing Keywords:
- keyword1
- keyword2
...

Improvements:
- improvement1
- improvement2
...

Improved Bullet Points:
- old: "..."
  new: "..."
- old: "..."
  new: "..."

Resume Text:
${resumeContent}

Job Description:
${jobDescription}
`



  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama3-70b-8192", // high-quality, free
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
 return data.choices[0].message.content
}



export default askGroq;