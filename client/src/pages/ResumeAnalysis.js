import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Star, 
  Lightbulb, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Calendar,
  Award,
  Target,
  Download,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';

const ResumeAnalysis = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    fetchResumeAnalysis();
  }, [id]);

  const fetchResumeAnalysis = async () => {
    try {
      const response = await axios.get(`/api/resume/${id}`);
      setResume(response.data);
    } catch (error) {
      toast.error('Failed to fetch resume analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
    if (score >= 60) return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200';
    return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <Award className="w-6 h-6 text-green-600" />;
    if (score >= 60) return <Target className="w-6 h-6 text-yellow-600" />;
    return <AlertCircle className="w-6 h-6 text-red-600" />;
  };

  const downloadResume = async () => {
    try {
      const response = await axios.get(`/api/resume/${id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resume.originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="mb-8">
          <FileText className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Resume not found
          </h2>
          <p className="text-secondary-600 mb-8">
            The resume you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Link to="/dashboard" className="btn-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadResume}
              className="btn-secondary"
              title="Download original resume"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="btn-secondary"
              title="Toggle raw text view"
            >
              {showRawText ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              Raw Text
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Resume Analysis
              </h1>
              <p className="text-secondary-600 mb-2">
                {resume.originalFileName}
              </p>
              <p className="text-sm text-secondary-500">
                Analyzed on {new Date(resume.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-secondary-600 mb-1">Status</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                resume.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : resume.status === 'processing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {resume.status === 'completed' && <CheckCircle className="w-4 h-4 mr-1" />}
                {resume.status === 'processing' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-1"></div>}
                {resume.status === 'failed' && <AlertCircle className="w-4 h-4 mr-1" />}
                {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Section */}
      {resume.analysis?.score && (
        <div className={`card border-2 ${getScoreBgColor(resume.analysis.score)} mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                {getScoreIcon(resume.analysis.score)}
                <div className="ml-3">
                  <h2 className="text-2xl font-bold text-secondary-900">
                    Overall Score
                  </h2>
                  <p className="text-secondary-600">
                    {getScoreLabel(resume.analysis.score)} • Based on skills, experience, and content quality
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-secondary-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    resume.analysis.score >= 80 ? 'bg-green-500' :
                    resume.analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${resume.analysis.score}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center ml-8">
              <div className={`text-5xl font-bold ${getScoreColor(resume.analysis.score)} mb-2`}>
                {resume.analysis.score}
              </div>
              <div className="text-sm text-secondary-600">out of 100</div>
              <div className="flex items-center justify-center mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(resume.analysis.score / 20)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Skills Section */}
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Skills Detected
              </h2>
              <p className="text-sm text-secondary-600">
                {resume.analysis?.skills?.length || 0} skills found
              </p>
            </div>
          </div>
          {resume.analysis?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resume.analysis.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-lg text-sm font-medium border border-primary-200 hover:from-primary-100 hover:to-primary-200 transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-600">No skills detected in this resume.</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Contact Information
              </h2>
              <p className="text-sm text-secondary-600">
                Extracted contact details
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {resume.analysis?.contact?.email && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Mail className="w-4 h-4 text-blue-600 mr-3" />
                <span className="text-secondary-700 font-medium">{resume.analysis.contact.email}</span>
              </div>
            )}
            {resume.analysis?.contact?.phone && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Phone className="w-4 h-4 text-green-600 mr-3" />
                <span className="text-secondary-700 font-medium">{resume.analysis.contact.phone}</span>
              </div>
            )}
            {resume.analysis?.contact?.location && (
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <MapPin className="w-4 h-4 text-purple-600 mr-3" />
                <span className="text-secondary-700 font-medium">{resume.analysis.contact.location}</span>
              </div>
            )}
            {!resume.analysis?.contact?.email && !resume.analysis?.contact?.phone && !resume.analysis?.contact?.location && (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                <p className="text-secondary-600">No contact information detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Quick Stats
              </h2>
              <p className="text-sm text-secondary-600">
                Resume insights
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-secondary-600">Experience Points</span>
              <span className="font-bold text-green-600">{resume.analysis?.experience?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-secondary-600">Education Points</span>
              <span className="font-bold text-blue-600">{resume.analysis?.education?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-secondary-600">Suggestions</span>
              <span className="font-bold text-purple-600">{resume.analysis?.suggestions?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      {resume.analysis?.experience?.length > 0 && (
        <div className="card mt-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Experience Highlights
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {resume.analysis.experience.map((exp, index) => (
              <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-secondary-700 leading-relaxed">{exp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {resume.analysis?.education?.length > 0 && (
        <div className="card mt-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Education Highlights
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {resume.analysis.education.map((edu, index) => (
              <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-secondary-700 leading-relaxed">{edu}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Section */}
      {resume.analysis?.summary && (
        <div className="card mt-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Resume Summary
            </h2>
          </div>
          <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
            <p className="text-secondary-700 leading-relaxed text-lg">
              {resume.analysis.summary}
            </p>
          </div>
        </div>
      )}

      {/* Suggestions Section */}
      {resume.analysis?.suggestions?.length > 0 && (
        <div className="card mt-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Improvement Suggestions
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {resume.analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                <p className="text-secondary-700 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Text Section */}
      {resume.extractedText && showRawText && (
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-secondary-600" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-900">
                Extracted Text
              </h2>
            </div>
            <button
              onClick={() => setShowRawText(false)}
              className="text-secondary-600 hover:text-secondary-900"
            >
              <EyeOff className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200 max-h-96 overflow-y-auto">
            <pre className="text-sm text-secondary-700 whitespace-pre-wrap font-sans leading-relaxed">
              {resume.extractedText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;
