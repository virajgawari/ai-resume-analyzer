# AI-Driven Resume Analyzer

A modern web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Tailwind CSS that provides AI-powered resume analysis and insights.

## 🚀 Features

- **AI-Powered Analysis**: Intelligent extraction and analysis of resume content
- **Skill Detection**: Automatically identifies technical skills and competencies
- **Experience Analysis**: Extracts and highlights work experience
- **Contact Information**: Detects and displays contact details
- **Scoring System**: Provides overall resume score with detailed breakdown
- **Improvement Suggestions**: AI-generated recommendations for resume enhancement
- **Modern UI**: Clean, calm, and navigable design with Tailwind CSS
- **User Authentication**: Secure JWT-based authentication system
- **File Upload**: Support for PDF, DOC, and DOCX files
- **Real-time Processing**: Background analysis with status updates

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Natural** - NLP processing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Dropzone** - File upload component
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit the .env file with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if using local installation)
   mongod
   
   # Or use MongoDB Atlas (update MONGODB_URI in .env)
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   # Terminal 1 - Server
   npm run server
   
   # Terminal 2 - Client
   cd client && npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/resume-analyzer

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./server/uploads
```

### MongoDB Setup

1. **Local Installation**:
   - Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Start the MongoDB service
   - The application will automatically create the database

2. **MongoDB Atlas** (Cloud):
   - Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string and update `MONGODB_URI` in `.env`

## 📖 Usage

1. **Register/Login**: Create an account or sign in to access the dashboard
2. **Upload Resume**: Drag and drop or click to upload your resume (PDF, DOC, DOCX)
3. **Wait for Analysis**: The AI will process your resume in the background
4. **View Results**: Check the detailed analysis including:
   - Skills detected
   - Experience highlights
   - Contact information
   - Overall score
   - Improvement suggestions

## 🏗️ Project Structure

```
resume-analyzer/
├── server/
│   ├── index.js              # Main server file
│   ├── models/               # MongoDB models
│   │   ├── Resume.js
│   │   └── User.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   └── resume.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js
│   ├── utils/               # Utility functions
│   │   └── resumeAnalyzer.js
│   └── uploads/             # File upload directory
├── client/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── package.json
└── README.md
```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Resume Management
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/:id` - Get specific resume analysis
- `DELETE /api/resume/:id` - Delete resume

## 🎨 Design Features

- **Calm Color Palette**: Soft blues and grays for a professional look
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Navigation**: Easy-to-use interface with clear navigation
- **Loading States**: Smooth loading animations and progress indicators
- **Error Handling**: User-friendly error messages and validation
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **File Validation**: Strict file type and size validation
- **Input Sanitization**: Protection against malicious input
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🚀 Deployment

### Heroku Deployment

1. **Prepare for deployment**:
   ```bash
   # Build the React app
   cd client
   npm run build
   cd ..
   ```

2. **Set up Heroku**:
   ```bash
   # Install Heroku CLI
   # Create Heroku app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   
   # Deploy
   git push heroku main
   ```

### Vercel Deployment

1. **Connect to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/resume-analyzer/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- **Advanced AI Integration**: Integration with OpenAI GPT for enhanced analysis
- **Resume Templates**: Pre-built resume templates
- **Export Features**: Export analysis results to PDF
- **Collaboration**: Share resumes with team members
- **Analytics Dashboard**: Detailed usage analytics
- **Multi-language Support**: Support for multiple languages
- **Mobile App**: Native mobile application

---

**Built with ❤️ using the MERN stack and Tailwind CSS**
