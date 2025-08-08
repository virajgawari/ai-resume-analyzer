import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, FileText, Clock, CheckCircle, XCircle, Eye, Trash2, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resume');
      setResumes(response.data);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const response = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Resume uploaded successfully! Analysis in progress...');
      
      // Poll for status updates
      pollResumeStatus(response.data.resumeId);
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const pollResumeStatus = async (resumeId) => {
    const maxAttempts = 30; // 30 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await axios.get(`/api/resume/${resumeId}`);
        const resume = response.data;

        if (resume.status === 'completed') {
          toast.success('Analysis completed!');
          fetchResumes(); // Refresh the list
          return;
        } else if (resume.status === 'failed') {
          toast.error('Analysis failed. Please try again.');
          fetchResumes();
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000);
        } else {
          toast.error('Analysis is taking longer than expected. Please check back later.');
          fetchResumes();
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    setTimeout(poll, 1000);
  };

  const deleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await axios.delete(`/api/resume/${resumeId}`);
      toast.success('Resume deleted successfully');
      fetchResumes();
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  const downloadResume = async (resumeId, fileName) => {
    try {
      const response = await axios.get(`/api/resume/${resumeId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Resume Dashboard
        </h1>
        <p className="text-secondary-600">
          Upload and manage your resume analyses
        </p>
      </div>

      {/* Upload Section */}
      <div className="card mb-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            Upload New Resume
          </h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors duration-200 ${
              isDragActive
                ? 'border-primary-400 bg-primary-50'
                : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-secondary-400 mb-4" />
              {uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-2"></div>
                  <span className="text-secondary-600">Uploading and analyzing...</span>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium text-secondary-900 mb-2">
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                  </p>
                  <p className="text-secondary-600 mb-4">
                    or click to browse files
                  </p>
                  <p className="text-sm text-secondary-500">
                    Supports PDF, DOC, DOCX (max 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resumes List */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            Your Resumes
          </h2>
          <span className="text-sm text-secondary-600">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
          </span>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No resumes yet
            </h3>
            <p className="text-secondary-600 mb-4">
              Upload your first resume to get started with AI-powered analysis
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-900">
                        {resume.originalFileName}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(resume.status)}
                      <span className="text-sm text-secondary-600">
                        {getStatusText(resume.status)}
                      </span>
                    </div>

                    {resume.analysis?.score && (
                      <div className="text-sm">
                        <span className="font-medium text-secondary-900">
                          Score: {resume.analysis.score}/100
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadResume(resume._id, resume.originalFileName)}
                        className="p-2 text-secondary-600 hover:text-blue-600 transition-colors duration-200"
                        title="Download resume"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {resume.status === 'completed' && (
                        <Link
                          to={`/analysis/${resume._id}`}
                          className="p-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                          title="View analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        onClick={() => deleteResume(resume._id)}
                        className="p-2 text-secondary-600 hover:text-red-600 transition-colors duration-200"
                        title="Delete resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
