# Resume Analyzer - Vercel Deployment Guide

## Overview
This guide will help you deploy your Resume Analyzer application to Vercel. Since this is a MERN stack application, we'll deploy the frontend to Vercel and host the backend separately.

## Prerequisites
- Node.js installed
- Git repository set up
- Vercel account (free at vercel.com)

## Step 1: Deploy Backend (Choose One)

### Option A: Deploy to Render (Recommended)
1. Go to [render.com](https://render.com) and create an account
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Root Directory**: Leave empty (or set to `/` if needed)
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`
6. Deploy and note the URL (e.g., `https://your-app.onrender.com`)

### Option B: Deploy to Railway
1. Go to [railway.app](https://railway.app) and create an account
2. Connect your GitHub repository
3. Add the same environment variables as above
4. Deploy and note the URL

### Option C: Deploy to Heroku
1. Go to [heroku.com](https://heroku.com) and create an account
2. Install Heroku CLI
3. Run:
   ```bash
   heroku create your-app-name
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

## Step 2: Deploy Frontend to Vercel

### Method 1: Using Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project root:
   ```bash
   cd /path/to/your/resume-analyzer
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Link to existing project or create new
   - Set build command: `cd client && npm install && npm run build`
   - Set output directory: `client/build`
   - Set install command: `npm install`

### Method 2: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and create an account
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`

## Step 3: Configure Environment Variables

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-app.onrender.com`)

## Step 4: Update API URLs

Make sure your frontend is using the correct backend URL. The AuthContext has been updated to use environment variables.

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test the registration/login functionality
3. Test the resume upload feature
4. Verify all features work correctly

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend allows requests from your Vercel domain
2. **API Connection Issues**: Verify the `REACT_APP_API_URL` environment variable is set correctly
3. **Build Failures**: Check that all dependencies are properly installed

### Environment Variables Checklist:
- Backend: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`
- Frontend: `REACT_APP_API_URL`

## Final Notes

- Your frontend will be available at: `https://your-app.vercel.app`
- Your backend will be available at: `https://your-backend-url.com`
- Make sure to update the `REACT_APP_API_URL` in Vercel whenever you redeploy your backend

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Test your backend API endpoints directly
4. Check browser console for any errors
