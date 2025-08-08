import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Upload, BarChart3, Lightbulb, Shield, Zap, Star, CheckCircle, Users, Clock, TrendingUp, ArrowRight, Play, Pause } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Smart Upload',
      description: 'Drag & drop your resume',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'AI Analysis',
      description: 'Instant insights & scoring',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Smart Tips',
      description: 'Personalized suggestions',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure',
      description: 'Your data is protected',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    { number: '95%', label: 'Accuracy Rate', icon: <CheckCircle className="w-5 h-5" /> },
    { number: '10K+', label: 'Resumes Analyzed', icon: <Users className="w-5 h-5" /> },
    { number: '4.9★', label: 'User Rating', icon: <Star className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      text: "The AI analysis helped me identify missing skills and improve my resume significantly. Got 3 interviews in 2 weeks!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      company: "Digital Solutions",
      text: "Incredible insights! The suggestions were spot-on and helped me land my dream job. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "Creative Studio",
      text: "The resume analyzer is a game-changer. It highlighted areas I never thought about improving.",
      rating: 5
    }
  ];

  const steps = [
    { step: '1', title: 'Upload', desc: 'Drag & drop your resume', icon: <Upload className="w-6 h-6" /> },
    { step: '2', title: 'Analyze', desc: 'AI processes your content', icon: <BarChart3 className="w-6 h-6" /> },
    { step: '3', title: 'Results', desc: 'Get insights & suggestions', icon: <Lightbulb className="w-6 h-6" /> }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-secondary-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">AI-Powered Analysis</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Resume
              <span className="block text-primary-200">Analyzer</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Upload your resume and get instant AI-powered insights to boost your career
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {user ? (
                <Link to="/dashboard" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 inline-flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 inline-flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started Free
                  </Link>
                  <Link to="/login" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-200 inline-flex items-center">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center mb-2">
                    <div className="text-white/70 group-hover:text-white transition-colors duration-200">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-secondary-600">
              Advanced AI technology for better results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-secondary-600">
              Simple 3-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-300 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-secondary-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-secondary-600">
              Join thousands of satisfied professionals
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors duration-200"
                >
                  <ArrowRight className="w-5 h-5 text-secondary-600 rotate-180" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors duration-200"
                >
                  {isPlaying ? <Pause className="w-5 h-5 text-secondary-600" /> : <Play className="w-5 h-5 text-secondary-600" />}
                </button>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-secondary-700 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div>
                  <h4 className="font-semibold text-secondary-900">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-secondary-600">
                    {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentTestimonial ? 'bg-primary-600' : 'bg-secondary-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to improve your resume?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of professionals who trust our AI analysis
          </p>
          {user ? (
            <Link to="/dashboard" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-10 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Analyze Your Resume
            </Link>
          ) : (
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-10 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Start Free Analysis
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
