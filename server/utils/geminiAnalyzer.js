const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function analyzeResumeWithGemini(resumeText) {
  try {
    const prompt = `
    Analyze this resume and provide a comprehensive analysis in JSON format. 
    Please structure your response as a valid JSON object with the following fields:
    
    {
      "summary": "A brief 2-3 sentence summary of the candidate",
      "skills": {
        "technical": ["list of technical skills"],
        "soft": ["list of soft skills"],
        "tools": ["list of tools and technologies"]
      },
      "experience": {
        "years": "estimated years of experience",
        "level": "junior/mid/senior/lead/executive",
        "highlights": ["key achievements and responsibilities"]
      },
      "education": {
        "degree": "highest degree obtained",
        "field": "field of study",
        "institution": "institution name"
      },
      "strengths": ["list of candidate's key strengths"],
      "areas_for_improvement": ["suggestions for resume improvement"],
      "score": "numerical score from 1-100",
      "recommendations": ["specific recommendations for the candidate"]
    }
    
    Resume text:
    ${resumeText}
    
    Please ensure the response is valid JSON and focuses on providing actionable insights.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    try {
      const analysis = JSON.parse(text);
      return analysis;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback to basic analysis if JSON parsing fails
      return {
        summary: "AI analysis completed but response format was unexpected",
        skills: { technical: [], soft: [], tools: [] },
        experience: { years: "Unknown", level: "Unknown", highlights: [] },
        education: { degree: "Unknown", field: "Unknown", institution: "Unknown" },
        strengths: [],
        areas_for_improvement: [],
        score: 50,
        recommendations: ["Consider using a more structured resume format"]
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to analyze resume with AI');
  }
}

async function generateResumeSuggestions(resumeText) {
  try {
    const prompt = `
    Provide specific, actionable suggestions to improve this resume. 
    Focus on:
    1. Content improvements
    2. Formatting suggestions
    3. Skills to highlight
    4. Experience descriptions
    5. Overall presentation
    
    Resume text:
    ${resumeText}
    
    Please provide 5-7 specific suggestions in a clear, actionable format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini suggestions error:', error);
    return "Unable to generate AI suggestions at this time.";
  }
}

async function compareResumeToJob(resumeText, jobDescription) {
  try {
    const prompt = `
    Compare this resume against the job description and provide a detailed analysis.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Please provide analysis in JSON format:
    {
      "match_score": "percentage match (1-100)",
      "matching_skills": ["skills that match the job requirements"],
      "missing_skills": ["skills mentioned in job but not in resume"],
      "strengths": ["what makes this candidate a good fit"],
      "concerns": ["potential concerns or gaps"],
      "recommendations": ["specific recommendations to improve fit"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing job comparison response:', parseError);
      return {
        match_score: 50,
        matching_skills: [],
        missing_skills: [],
        strengths: [],
        concerns: [],
        recommendations: []
      };
    }
  } catch (error) {
    console.error('Job comparison error:', error);
    throw new Error('Failed to compare resume with job description');
  }
}

module.exports = {
  analyzeResumeWithGemini,
  generateResumeSuggestions,
  compareResumeToJob
};
