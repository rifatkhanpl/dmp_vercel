import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { errorService } from '../../services/errorService';
import { SecurityUtils } from '../../utils/security';
import { UserProfileUpdate } from '../../types/user';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building,
  Edit,
  Save,
  X,
  Camera,
  Calendar,
  Shield,
  Settings,
  Activity,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';

export function UserProfile() {
  const { user, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [profileData, setProfileData] = useState<UserProfileUpdate>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    title: user?.title || 'Provider Relations Coordinator',
    bio: user?.bio || 'Healthcare professional specializing in provider relations and data management.',
    location: user?.location || ''
  });

  const [originalData, setOriginalData] = useState(profileData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = SecurityUtils.sanitizeText(value);
    
    setProfileData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfileData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  const validateForm = (): boolean => {
    if (!profileData.firstName?.trim()) {
      setMessage({ type: 'error', text: 'First name is required' });
      return false;
    }
    if (!profileData.lastName?.trim()) {
      setMessage({ type: 'error', text: 'Last name is required' });
      return false;
    }
    if (profileData.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(profileData.phone)) {
      setMessage({ type: 'error', text: 'Phone must be in format (555) 123-4567' });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalData(profileData);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setMessage(null);
  };

  const mockStats = {
    providersRegistered: 247,
    bulkImports: 12,
    profileUpdates: 89,
    dataQualityScore: 98,
    lastActivity: '2 hours ago',
    accountAge: Math.floor((Date.now() - new Date(user?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
  };

  const recentActivity = [
    { type: 'registration', description: 'Registered Dr. Sarah Johnson, MD - Internal Medicine', time: '2 hours ago', icon: 'plus' },
    { type: 'import', description: 'Completed bulk import of 45 providers', time: '1 day ago', icon: 'upload' },
    { type: 'update', description: 'Updated Dr. Michael Chen profile', time: '3 days ago', icon: 'edit' },
    { type: 'validation', description: 'Validated 15 provider profiles', time: '1 week ago', icon: 'check' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration': return <User className="h-4 w-4" />;
      case 'import': return <FileText className="h-4 w-4" />;
      case 'update': return <Edit className="h-4 w-4" />;
      case 'validation': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'registration': return 'text-blue-600 bg-blue-100';
      case 'import': return 'text-green-600 bg-green-100';
      case 'update': return 'text-purple-600 bg-purple-100';
      case 'validation': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout breadcrumbs={[{ label: 'My Profile' }]}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Messages */}
        {message && (
          <div className={`p-4 rounded-md flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            {isEditing && (
              <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="px-6 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                {/* Profile Picture */}
                <div className="relative -mt-16">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {/* Basic Info */}
                <div className="pt-4 flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="First Name"
                            maxLength={50}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Last Name"
                            maxLength={50}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                          type="text"
                          name="title"
                          value={profileData.title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Job Title"
                          maxLength={100}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {profileData.firstName} {profileData.lastName}
                      </h1>
                      <p className="text-gray-600 mt-1">{profileData.title}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {user?.department || 'Provider Relations'}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {profileData.location || 'Not specified'}
                        </div>
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-1" />
                          {user?.role === 'administrator' ? 'Administrator' : 'Coordinator'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                {isAdmin && (
                  <a
                    href="/admin/user-settings"
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin Settings</span>
                  </a>
                )}
                <a
                  href="/user-settings"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </a>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{profileData.bio?.length || 0}/500 characters</p>
                </div>
              ) : (
                <p className="text-gray-600">{profileData.bio || 'No bio provided'}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{user?.email}</span>
                    {user?.isEmailVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" title="Email verified" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" title="Email not verified" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(555) 123-4567"
                      maxLength={14}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{profileData.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City, State"
                      maxLength={100}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{profileData.location || 'Not specified'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{user?.department || 'Provider Relations'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                  <p className="text-sm text-gray-900">{user?.employeeId || 'PL-' + user?.id?.slice(-6)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                  <p className="text-sm text-gray-900">
                    {user?.startDate ? new Date(user.startDate).toLocaleDateString() : new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Manager</label>
                  <p className="text-sm text-gray-900">{user?.manager || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Account Age</label>
                  <p className="text-sm text-gray-900">{mockStats.accountAge} days</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.status === 'active' ? 'bg-green-100 text-green-800' :
                    user?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user?.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {user?.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {user?.status === 'suspended' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {user?.status || 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isAdmin ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                    {user?.role === 'administrator' ? 'Administrator' : 'Coordinator'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span className={`text-sm font-medium ${user?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.isEmailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm text-gray-900">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Providers Registered</span>
                  <span className="text-sm font-medium text-gray-900">{mockStats.providersRegistered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bulk Imports</span>
                  <span className="text-sm font-medium text-gray-900">{mockStats.bulkImports}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Updates</span>
                  <span className="text-sm font-medium text-gray-900">{mockStats.profileUpdates}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Quality Score</span>
                  <span className="text-sm font-medium text-green-600">{mockStats.dataQualityScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-sm text-gray-900">{mockStats.lastActivity}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/hcp-registration"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Register Provider</p>
                    <p className="text-xs text-gray-500">Add new healthcare provider</p>
                  </div>
                </a>
                <a
                  href="/bulk-import"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bulk Import</p>
                    <p className="text-xs text-gray-500">Import multiple providers</p>
                  </div>
                </a>
                <a
                  href="/search"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <Activity className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Search Providers</p>
                    <p className="text-xs text-gray-500">Find and manage providers</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}