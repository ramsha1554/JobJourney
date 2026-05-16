const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes a resume against a job description using Gemini 1.5 Flash.
 * Returns structured JSON data.
 */
exports.analyzeMatch = async (resumeText, jobDescription) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
        You are an expert ATS (Applicant Tracking System) and Career Coach. 
        Analyze the following Resume against the Job Description.
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}
        
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
        throw new Error('Could not parse AI response');
    } catch (error) {
        console.error('AI Analysis Error:', error);
        throw error;
    }
};

/**
 * Generates interview questions based on role and company.
 */
exports.generateInterviewQuestions = async (jobTitle, company, jobDescription) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
        throw new Error('Could not parse AI response');
    } catch (error) {
        console.error('AI Question Gen Error:', error);
        throw error;
    }
};
