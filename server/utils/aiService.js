const { GoogleGenerativeAI } = require("@google/generative-ai");

// Create a singleton genAI client, but validate env eagerly for clearer failures.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Throwing here makes the first request fail fast with an actionable message.
  // This avoids confusing 500s later.
  throw new Error(
    "GEMINI_API_KEY is missing. Set it in server/.env (or your environment variables).",
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Analyzes a resume against a job description using Gemini 1.5 Flash.
 * Returns structured JSON data.
 */
exports.analyzeMatch = async (resumeText, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an expert ATS (Applicant Tracking System) and Career Coach.
    Analyze the following Resume against the Job Description.

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}

    Return ONLY a JSON object with the following structure:
    {
      "matchScore": number (0-100),
      "missingKeywords": [string],
      "skillGaps": [string],
      "improvementSuggestions": string (max 3 sentences)
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Provide diagnostics to find parsing issues quickly.
    throw new Error(
      `Could not parse AI response as JSON. Response length=${text?.length ?? 0}. First200Chars=${(text ?? "").slice(0, 200)}`,
    );
  } catch (error) {
    console.error("AI Analysis Error:", {
      message: error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

/**
 * Generates interview questions based on role and company.
 */
exports.generateInterviewQuestions = async (
  jobTitle,
  company,
  jobDescription,
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate 5 high-impact interview questions for the following role:
    Role: ${jobTitle}
    Company: ${company}
    Context: ${jobDescription}

    Include:
    - 2 Technical questions
    - 2 Behavioral questions
    - 1 Company-specific question

    Return ONLY a JSON array of strings.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error(
      `Could not parse AI response as JSON array. Response length=${text?.length ?? 0}. First200Chars=${(text ?? "").slice(0, 200)}`,
    );
  } catch (error) {
    console.error("AI Question Gen Error:", {
      message: error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};
