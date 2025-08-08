const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Resume = require('../models/Resume');
const { authenticateToken } = require('../middleware/auth');
const { analyzeResume } = require('../utils/resumeAnalyzer');
const { generateResumeSuggestions, compareResumeToJob } = require('../utils/geminiAnalyzer');

// Configure multer for memory storage (to store in MongoDB)
const maxUploadBytes = Number(process.env.MAX_FILE_SIZE || 4.5 * 1024 * 1024);
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  },
  limits: {
    fileSize: maxUploadBytes
  }
});

// Upload and analyze resume
router.post('/upload', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create new resume document with file data stored in MongoDB
    const resume = new Resume({
      userId: req.user.id,
      originalFileName: req.file.originalname,
      fileData: req.file.buffer,
      fileType: req.file.mimetype,
      extractedText: '', // Will be filled after analysis
      status: 'processing'
    });

    await resume.save();

    // Analyze resume in background
    analyzeResume(resume._id, req.file.buffer)
      .then(async (analysisResult) => {
        resume.extractedText = analysisResult.text;
        resume.analysis = analysisResult.analysis;
        resume.status = 'completed';
        await resume.save();
      })
      .catch(async (error) => {
        console.error('Analysis error:', error);
        resume.status = 'failed';
        await resume.save();
      });

    res.json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      status: 'processing'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading resume' });
  }
});

// Get all resumes for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-fileData -extractedText'); // Don't send file data in list
    
    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Error fetching resumes' });
  }
});

// Get specific resume with analysis
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).select('-fileData'); // Don't send file data in analysis view

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Error fetching resume' });
  }
});

// Download resume file
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.set({
      'Content-Type': resume.fileType,
      'Content-Disposition': `attachment; filename="${resume.originalFileName}"`,
      'Content-Length': resume.fileData.length
    });

    res.send(resume.fileData);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ message: 'Error downloading resume' });
  }
});

// Delete resume
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
});

// Get AI suggestions for resume improvement
router.post('/:id/suggestions', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!resume.extractedText) {
      return res.status(400).json({ message: 'Resume text not available for analysis' });
    }

    const suggestions = await generateResumeSuggestions(resume.extractedText);
    
    res.json({
      suggestions,
      resumeId: resume._id
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Error generating suggestions' });
  }
});

// Compare resume with job description
router.post('/:id/compare', authenticateToken, async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (!resume.extractedText) {
      return res.status(400).json({ message: 'Resume text not available for analysis' });
    }

    const comparison = await compareResumeToJob(resume.extractedText, jobDescription);
    
    res.json({
      comparison,
      resumeId: resume._id
    });
  } catch (error) {
    console.error('Compare resume error:', error);
    res.status(500).json({ message: 'Error comparing resume with job description' });
  }
});

module.exports = router;
