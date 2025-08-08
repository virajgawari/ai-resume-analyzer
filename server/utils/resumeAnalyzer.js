const pdfParse = require('pdf-parse');
const natural = require('natural');
const { analyzeResumeWithGemini, generateResumeSuggestions, compareResumeToJob } = require('./geminiAnalyzer');

// Common skills and keywords for analysis
const skillKeywords = {
  programming: ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel'],
  databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'dynamodb', 'cassandra'],
  cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'gitlab', 'github actions'],
  tools: ['git', 'jira', 'confluence', 'slack', 'trello', 'figma', 'adobe', 'photoshop', 'illustrator'],
  frameworks: ['react', 'angular', 'vue', 'bootstrap', 'tailwind', 'material-ui', 'ant design', 'jquery'],
  methodologies: ['agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd', 'tdd', 'bdd']
};

const experienceKeywords = [
  'experience', 'work', 'employment', 'job', 'position', 'role', 'responsibilities',
  'managed', 'led', 'developed', 'created', 'implemented', 'designed', 'built',
  'years', 'months', 'senior', 'junior', 'lead', 'manager', 'director', 'vp'
];

const educationKeywords = [
  'education', 'degree', 'bachelor', 'master', 'phd', 'university', 'college',
  'school', 'graduated', 'gpa', 'major', 'minor', 'certificate', 'diploma'
];

const contactKeywords = {
  email: ['email', 'e-mail', '@'],
  phone: ['phone', 'mobile', 'cell', 'tel', 'contact'],
  location: ['location', 'address', 'city', 'state', 'country', 'based in']
};

function extractTextFromPDF(fileBuffer) {
  return new Promise((resolve, reject) => {
    pdfParse(fileBuffer)
      .then(data => {
        resolve(data.text);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function extractSkills(text) {
  const skills = [];
  const lowerText = text.toLowerCase();
  
  // Extract programming languages and technologies
  Object.values(skillKeywords).flat().forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });
  
  return [...new Set(skills)]; // Remove duplicates
}

function extractExperience(text) {
  const sentences = text.split(/[.!?]+/);
  const experienceSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return experienceKeywords.some(keyword => lowerSentence.includes(keyword));
  });
  
  return experienceSentences.slice(0, 5); // Return top 5 experience sentences
}

function extractEducation(text) {
  const sentences = text.split(/[.!?]+/);
  const educationSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return educationKeywords.some(keyword => lowerSentence.includes(keyword));
  });
  
  return educationSentences.slice(0, 3); // Return top 3 education sentences
}

function extractContactInfo(text) {
  const contact = {
    email: '',
    phone: '',
    location: ''
  };
  
  const lines = text.split('\n');
  
  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }
  
  // Extract phone
  const phoneRegex = /(\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    contact.phone = phoneMatch[0];
  }
  
  // Extract location (basic approach)
  const locationLines = lines.filter(line => 
    line.toLowerCase().includes('location') || 
    line.toLowerCase().includes('based') ||
    line.toLowerCase().includes('address')
  );
  if (locationLines.length > 0) {
    contact.location = locationLines[0].trim();
  }
  
  return contact;
}

function generateSummary(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const summarySentences = sentences.slice(0, 3);
  return summarySentences.join('. ') + '.';
}

function calculateScore(analysis) {
  let score = 0;
  
  // Score based on skills
  score += analysis.skills.length * 5;
  
  // Score based on experience
  score += analysis.experience.length * 3;
  
  // Score based on education
  score += analysis.education.length * 2;
  
  // Score based on contact info completeness
  const contactFields = Object.values(analysis.contact).filter(field => field).length;
  score += contactFields * 5;
  
  return Math.min(score, 100); // Cap at 100
}

function generateSuggestions(analysis) {
  const suggestions = [];
  
  if (analysis.skills.length < 5) {
    suggestions.push('Consider adding more technical skills to your resume');
  }
  
  if (analysis.experience.length < 3) {
    suggestions.push('Include more detailed work experience descriptions');
  }
  
  if (!analysis.contact.email) {
    suggestions.push('Add your email address to the resume');
  }
  
  if (!analysis.contact.phone) {
    suggestions.push('Include your phone number for better contact');
  }
  
  if (analysis.score < 50) {
    suggestions.push('Consider restructuring your resume for better impact');
  }
  
  return suggestions;
}

async function analyzeResume(resumeId, fileBuffer) {
  try {
    // Extract text from PDF buffer
    const text = await extractTextFromPDF(fileBuffer);
    
    // Use Gemini API for advanced analysis
    let geminiAnalysis = null;
    try {
      geminiAnalysis = await analyzeResumeWithGemini(text);
    } catch (geminiError) {
      console.error('Gemini analysis failed, falling back to basic analysis:', geminiError);
    }
    
    // Fallback to basic analysis if Gemini fails
    if (!geminiAnalysis) {
      const skills = extractSkills(text);
      const experience = extractExperience(text);
      const education = extractEducation(text);
      const contact = extractContactInfo(text);
      const summary = generateSummary(text);
      
      const analysis = {
        skills,
        experience,
        education,
        contact,
        summary,
        score: 0,
        suggestions: []
      };
      
      // Calculate score and generate suggestions
      analysis.score = calculateScore(analysis);
      analysis.suggestions = generateSuggestions(analysis);
      
      return {
        text,
        analysis
      };
    }
    
    // Use Gemini analysis with fallback data
    const contact = extractContactInfo(text);
    const basicSkills = extractSkills(text);
    
    // Merge Gemini analysis with basic contact info
    const analysis = {
      ...geminiAnalysis,
      contact,
      // Ensure skills are properly structured
      skills: {
        technical: geminiAnalysis.skills?.technical || basicSkills,
        soft: geminiAnalysis.skills?.soft || [],
        tools: geminiAnalysis.skills?.tools || []
      },
      // Convert score to number if it's a string
      score: typeof geminiAnalysis.score === 'string' ? parseInt(geminiAnalysis.score) : geminiAnalysis.score
    };
    
    return {
      text,
      analysis
    };
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw error;
  }
}

module.exports = {
  analyzeResume
};
