# Gemini API Setup Guide

## Overview
This guide will help you set up Google's Gemini API for enhanced resume analysis in your Resume Analyzer application.

## Step 1: Get Your Gemini API Key

### Option A: Google AI Studio (Recommended)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Keep it secure - you'll need it for the next steps

### Option B: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gemini API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gemini API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated key

## Step 2: Configure Environment Variables

### For Local Development
1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your-actual-gemini-api-key-here
   ```

### For Production Deployment
When deploying to your backend platform (Render, Railway, Heroku, etc.), add the environment variable:
- **Variable Name**: `GEMINI_API_KEY`
- **Variable Value**: Your actual Gemini API key

## Step 3: Test the Integration

### Test the API Key
You can test if your API key is working by running:
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, how are you?"
      }]
    }]
  }'
```

### Test in Your Application
1. Start your server: `npm run server`
2. Upload a resume through your application
3. Check the console logs for any Gemini API errors
4. Verify that the analysis includes AI-generated insights

## Step 4: New Features Available

With Gemini API integration, your Resume Analyzer now includes:

### 1. Enhanced Resume Analysis
- **AI-powered summary**: Intelligent resume summaries
- **Skill categorization**: Technical, soft skills, and tools
- **Experience level assessment**: Junior, mid, senior, lead, executive
- **Education analysis**: Degree, field, and institution extraction
- **Strengths identification**: Key candidate strengths
- **Improvement suggestions**: Areas for resume enhancement

### 2. Resume Suggestions
- **Content improvements**: Specific suggestions for better content
- **Formatting advice**: Layout and presentation tips
- **Skill highlighting**: Which skills to emphasize
- **Experience descriptions**: How to better describe work experience

### 3. Job Comparison
- **Match scoring**: Percentage match with job requirements
- **Skill matching**: Skills that align with the job
- **Missing skills**: Skills mentioned in job but not in resume
- **Fit analysis**: Strengths and concerns for the position
- **Recommendations**: How to improve job fit

## Step 5: API Endpoints

### New Endpoints Available:

#### 1. Get AI Suggestions
```http
POST /api/resume/:id/suggestions
Authorization: Bearer <token>
```
Returns specific suggestions to improve the resume.

#### 2. Compare with Job Description
```http
POST /api/resume/:id/compare
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobDescription": "Your job description text here"
}
```
Returns detailed comparison between resume and job description.

## Step 6: Error Handling

The application includes robust error handling:

### Fallback Mechanism
- If Gemini API fails, the system falls back to basic analysis
- No interruption to user experience
- Graceful degradation of features

### Common Issues and Solutions

#### 1. API Key Issues
**Error**: "Failed to analyze resume with AI"
**Solution**: 
- Verify your API key is correct
- Check if the key has proper permissions
- Ensure the key is properly set in environment variables

#### 2. Rate Limiting
**Error**: "Quota exceeded" or similar
**Solution**:
- Check your Google AI Studio usage
- Consider upgrading your plan if needed
- Implement rate limiting in your application

#### 3. Network Issues
**Error**: "Network error" or timeout
**Solution**:
- Check your internet connection
- Verify firewall settings
- Try again later

## Step 7: Cost Management

### Free Tier Limits
- Google AI Studio provides free tier usage
- Monitor your usage in the Google AI Studio dashboard
- Set up billing alerts to avoid unexpected charges

### Usage Optimization
- Cache analysis results when possible
- Implement request throttling
- Consider batch processing for multiple resumes

## Step 8: Security Best Practices

### API Key Security
- Never commit API keys to version control
- Use environment variables for all API keys
- Rotate keys regularly
- Monitor for unauthorized usage

### Data Privacy
- Resume data is processed by Google's servers
- Ensure compliance with data protection regulations
- Consider data retention policies

## Troubleshooting

### Common Problems:

1. **"GEMINI_API_KEY is not defined"**
   - Check your `.env` file
   - Restart your server after adding the key
   - Verify the environment variable name

2. **"Failed to analyze resume with AI"**
   - Check your API key validity
   - Verify network connectivity
   - Check Google AI Studio for service status

3. **"Invalid API key"**
   - Regenerate your API key
   - Ensure you're using the correct key format
   - Check if the key has proper permissions

### Getting Help

If you encounter issues:
1. Check the server console logs
2. Verify your API key in Google AI Studio
3. Test the API key with a simple curl request
4. Check Google AI Studio documentation
5. Review the error messages for specific details

## Next Steps

After setting up Gemini API:

1. **Test the integration** with sample resumes
2. **Monitor usage** in Google AI Studio dashboard
3. **Customize prompts** in `geminiAnalyzer.js` for your specific needs
4. **Add more features** like interview preparation or career path suggestions
5. **Optimize performance** by caching results

## Support

For additional help:
- [Google AI Studio Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/gemini-api)
- [Google Cloud Console](https://console.cloud.google.com/)
