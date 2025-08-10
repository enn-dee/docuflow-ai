import fetch from "node-fetch";
import { groq_Key } from "./process.env";

const GROQ_API_KEY = groq_Key;

async function askGroq(prompt:string) {
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
  console.log(data.choices[0].message.content);
}

askGroq("Explain MERN stack in simple words.");
