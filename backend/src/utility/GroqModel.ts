import fetch from "node-fetch";
import { groq_Key } from "../config/process.env";

const GROQ_API_KEY = groq_Key;

async function askGroq(resumeContent: string, jobDescription?: string) {
const prompt: string = `
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
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

    const data: any = await res.json();

    if (!data?.choices?.[0]?.message?.content) {
      console.error("Unexpected response from Groq API:", JSON.stringify(data, null, 2));
      return null;
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("Error calling Groq API:", err);
    return null;
  }
}

export default askGroq;
