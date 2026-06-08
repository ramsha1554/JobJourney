const Groq = require("groq-sdk");

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error(
    "GROQ_API_KEY is missing. Set it in server/.env or Render dashboard.",
  );
}

const groq = new Groq({ apiKey });

const MODEL = "llama-3.3-70b-versatile";

exports.analyzeMatch = async (resumeText, jobDescription) => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) and Career Coach.
    Analyze the following Resume against the Job Description.

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}

    Return ONLY a valid JSON object with no markdown, no extra text, no code fences.
    Use exactly this structure:
    {
      "matchScore": number (0-100),
      "missingKeywords": [string],
      "skillGaps": [string],
      "improvementSuggestions": string (max 3 sentences)
    }
  `;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch?.[0]) {
      return {
        matchScore: 0,
        missingKeywords: [],
        skillGaps: [],
        improvementSuggestions: "AI returned unexpected format. Please try again.",
        parseError: "No JSON object found in AI response",
      };
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      const cleaned = jsonMatch[0]
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .trim();
      try {
        return JSON.parse(cleaned);
      } catch {
        return {
          matchScore: 0,
          missingKeywords: [],
          skillGaps: [],
          improvementSuggestions: "AI returned invalid JSON. Please try again.",
          parseError: "JSON parse failed after cleanup.",
        };
      }
    }
  } catch (error) {
    console.error("AI Analysis Error:", {
      message: error?.message,
      stack: error?.stack,
    });
    return {
      matchScore: 0,
      missingKeywords: [],
      skillGaps: [],
      improvementSuggestions: "AI analysis failed. Please try again.",
      error: error?.message,
    };
  }
};

exports.generateInterviewQuestions = async (jobTitle, company, jobDescription) => {
  const prompt = `
    Generate 5 high-impact interview questions for the following role:
    Role: ${jobTitle}
    Company: ${company}
    Context: ${jobDescription}

    Include:
    - 2 Technical questions
    - 2 Behavioral questions
    - 1 Company-specific question

    Return ONLY a valid JSON array of strings. No markdown, no code fences, no extra text.
  `;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const text = completion.choices[0]?.message?.content || "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Could not parse AI response as JSON array.");
  } catch (error) {
    console.error("AI Question Gen Error:", {
      message: error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};