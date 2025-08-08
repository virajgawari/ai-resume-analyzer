import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Save, Edit3, Lock, Shield, Download, Settings, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalResumes: 0,
    completedAnalysis: 0,
    averageScore: 0
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/resume');
      const resumes = response.data;
      const completed = resumes.filter(r => r.status === 'completed');
      const avgScore = completed.length > 0 
        ? Math.round(completed.reduce((sum, r) => sum + (r.analysis?.score || 0), 0) / completed.length)
        : 0;
      
      setStats({
        totalResumes: resumes.length,
        completedAnalysis: completed.length,
        averageScore: avgScore
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const getAccountAge = () => {
    if (!user?.createdAt) return 'N/A';
    const created = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-secondary-600">
          Manage your account and view your activity
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Account Information
                </h2>
                <p className="text-sm text-secondary-600 mt-1">
                  Update your personal details
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-secondary-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="input-field pl-10"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-secondary-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="input-field pl-10"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900">
                      {user?.name}
                    </h3>
                    <p className="text-secondary-600">{user?.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 border border-secondary-200 rounded-lg">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <p className="text-secondary-900 font-medium">{user?.name}</p>
                  </div>
                  <div className="p-4 border border-secondary-200 rounded-lg">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-secondary-900 font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Password Change */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Security Settings
                </h2>
                <p className="text-sm text-secondary-600 mt-1">
                  Change your password
                </p>
              </div>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="btn-secondary"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-secondary-400" />
                    </div>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      required
                      className="input-field pl-10 pr-10"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPassword.current ? (
                        <EyeOff className="h-5 w-5 text-secondary-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-secondary-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-secondary-400" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword.new ? "text" : "password"}
                        required
                        className="input-field pl-10 pr-10"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-5 w-5 text-secondary-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-secondary-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-secondary-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword.confirm ? "text" : "password"}
                        required
                        className="input-field pl-10 pr-10"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-5 w-5 text-secondary-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-secondary-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-900">Password Security</h3>
                    <p className="text-sm text-green-700">Your password is secure and up to date</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Your Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-sm text-secondary-600">Total Resumes</span>
                </div>
                <span className="text-lg font-bold text-primary-600">{stats.totalResumes}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-secondary-600">Completed</span>
                </div>
                <span className="text-lg font-bold text-green-600">{stats.completedAnalysis}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-secondary-600">Avg Score</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{stats.averageScore}/100</span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Account Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 border border-secondary-200 rounded-lg">
                <Calendar className="w-4 h-4 text-secondary-400 mr-3" />
                <div>
                  <p className="text-sm text-secondary-600">Member since</p>
                  <p className="text-secondary-900 font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 border border-secondary-200 rounded-lg">
                <Calendar className="w-4 h-4 text-secondary-400 mr-3" />
                <div>
                  <p className="text-sm text-secondary-600">Account age</p>
                  <p className="text-secondary-900 font-medium">{getAccountAge()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Security Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-secondary-600">Password</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  Secure
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-secondary-600 mr-2" />
                  <span className="text-sm text-secondary-600">Two-factor auth</span>
                </div>
                <span className="text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full font-medium">
                  Not enabled
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors duration-200 group">
                <div className="flex items-center">
                  <Download className="w-4 h-4 text-secondary-400 mr-3 group-hover:text-primary-600" />
                  <div>
                    <div className="font-medium text-secondary-900">Export Data</div>
                    <div className="text-sm text-secondary-600">Download your resume data</div>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors duration-200 group">
                <div className="flex items-center">
                  <Settings className="w-4 h-4 text-secondary-400 mr-3 group-hover:text-primary-600" />
                  <div>
                    <div className="font-medium text-secondary-900">Privacy Settings</div>
                    <div className="text-sm text-secondary-600">Manage your privacy</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
