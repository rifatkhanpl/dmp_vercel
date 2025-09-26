import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { errorService } from '../../services/errorService';
import { SecurityUtils } from '../../utils/security';
import { AdminUserUpdate, UserRole, UserStatus } from '../../types/user';
import { Shield, User, Mail, Phone, Building, MapPin, Calendar, Settings, Save, X, AlertCircle, CheckCircle, Eye, EyeOff, RefreshCw, Ban, Unlock, UserCheck, Clock, Award, Activity, Trash2, CreditCard as Edit } from 'lucide-react';

export function AdminUserSettings() {
  const { user, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get('id');
  
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Mock users data - in real app this would come from API
  const mockUsers = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@practicelink.com',
      role: 'administrator' as UserRole,
      status: 'active' as UserStatus,
      phone: '(555) 123-4567',
      department: 'IT Administration',
      location: 'Los Angeles, CA',
      title: 'System Administrator',
      bio: 'Experienced system administrator with expertise in healthcare data management.',
      employeeId: 'PL-2023-001',
      manager: 'Sarah Johnson',
      startDate: '2023-01-15',
      isEmailVerified: true,
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-01-15T09:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@practicelink.com',
      role: 'provider-relations-coordinator' as UserRole,
      status: 'active' as UserStatus,
      phone: '(555) 234-5678',
      department: 'Provider Relations',
      location: 'San Francisco, CA',
      title: 'Senior Provider Relations Coordinator',
      bio: 'Healthcare professional specializing in provider relations and network management.',
      employeeId: 'PL-2023-002',
      manager: 'John Doe',
      startDate: '2023-02-01',
      isEmailVerified: true,
      lastLogin: '2024-01-14T16:45:00Z',
      createdAt: '2023-02-01T09:00:00Z',
      updatedAt: '2024-01-14T16:45:00Z'
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@practicelink.com',
      role: 'provider-relations-coordinator' as UserRole,
      status: 'pending' as UserStatus,
      phone: '(555) 345-6789',
      department: 'Provider Relations',
      location: 'Chicago, IL',
      title: 'Provider Relations Coordinator',
      bio: '',
      employeeId: 'PL-2024-003',
      manager: 'Jane Smith',
      startDate: '2024-01-10',
      isEmailVerified: false,
      lastLogin: null,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z'
    }
  ];

  // Set selected user from URL parameter on component mount
  React.useEffect(() => {
    if (userIdFromUrl && mockUsers.find(u => u.id === userIdFromUrl)) {
      setSelectedUserId(userIdFromUrl);
      setIsEditing(true); // Auto-enter edit mode when coming from user management
    }
  }, [userIdFromUrl]);

  const selectedUser = mockUsers.find(u => u.id === selectedUserId);

  const [userData, setUserData] = useState<AdminUserUpdate>({
    firstName: selectedUser?.firstName || '',
    lastName: selectedUser?.lastName || '',
    email: selectedUser?.email || '',
    phone: selectedUser?.phone || '',
    title: selectedUser?.title || '',
    bio: selectedUser?.bio || '',
    location: selectedUser?.location || '',
    role: selectedUser?.role || 'provider-relations-coordinator',
    status: selectedUser?.status || 'active',
    department: selectedUser?.department || '',
    employeeId: selectedUser?.employeeId || '',
    manager: selectedUser?.manager || '',
    isEmailVerified: selectedUser?.isEmailVerified || false
  });

  // Update form data when selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      setUserData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        phone: selectedUser.phone,
        title: selectedUser.title,
        bio: selectedUser.bio,
        location: selectedUser.location,
        role: selectedUser.role,
        status: selectedUser.status,
        department: selectedUser.department,
        employeeId: selectedUser.employeeId,
        manager: selectedUser.manager,
        isEmailVerified: selectedUser.isEmailVerified
      });
    }
  }, [selectedUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setUserData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      const sanitizedValue = SecurityUtils.sanitizeText(value);
      setUserData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
    }
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
    setUserData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  const validateForm = (): boolean => {
    if (!userData.firstName?.trim()) {
      setMessage({ type: 'error', text: 'First name is required' });
      return false;
    }
    if (!userData.lastName?.trim()) {
      setMessage({ type: 'error', text: 'Last name is required' });
      return false;
    }
    if (!userData.email?.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }
    if (!userData.email.endsWith('@practicelink.com')) {
      setMessage({ type: 'error', text: 'Email must be a @practicelink.com address' });
      return false;
    }
    if (userData.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(userData.phone)) {
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
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'User settings updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user settings. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (selectedUser) {
      setUserData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        phone: selectedUser.phone,
        title: selectedUser.title,
        bio: selectedUser.bio,
        location: selectedUser.location,
        role: selectedUser.role,
        status: selectedUser.status,
        department: selectedUser.department,
        employeeId: selectedUser.employeeId,
        manager: selectedUser.manager,
        isEmailVerified: selectedUser.isEmailVerified
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  const handleUserAction = async (action: string) => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (action) {
        case 'activate':
          // Update the user status in the mock data
          setUserData(prev => ({ ...prev, status: 'active' }));
          setMessage({ type: 'success', text: 'User activated successfully' });
          break;
        case 'suspend':
          setUserData(prev => ({ ...prev, status: 'suspended' }));
          setMessage({ type: 'success', text: 'User suspended successfully' });
          break;
        case 'reset-password':
          setMessage({ type: 'success', text: 'Password reset email sent to user' });
          break;
        case 'verify-email':
          setUserData(prev => ({ ...prev, isEmailVerified: true }));
          setMessage({ type: 'success', text: 'Email verification sent to user' });
          break;
        case 'delete-user':
          setMessage({ type: 'success', text: 'User deleted successfully' });
          // In a real app, this would redirect back to user management
          setTimeout(() => {
            window.location.href = '/user-management';
          }, 2000);
          break;
      }
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Action failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: UserRole) => {
    return role === 'administrator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <Layout breadcrumbs={[{ label: 'Unauthorized' }]}>
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access admin user settings.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin User Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage user accounts, roles, and system permissions
              </p>
            </div>
          </div>
        </div>

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


        {!selectedUser ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
            <p className="text-gray-600 mb-4">The requested user could not be found.</p>
            <a
              href="/user-management"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to User Management
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Selection (only show if no URL param) */}
            {!userIdFromUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select User</h2>
                <div className="space-y-3">
                  {mockUsers.map((mockUser) => (
                    <button
                      key={mockUser.id}
                      onClick={() => setSelectedUserId(mockUser.id)}
                      className={`w-full text-left p-3 border rounded-lg transition-colors ${
                        selectedUserId === mockUser.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {mockUser.firstName[0]}{mockUser.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {mockUser.firstName} {mockUser.lastName}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(mockUser.role)}`}>
                              {mockUser.role === 'administrator' ? 'Admin' : 'Coordinator'}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mockUser.status)}`}>
                              {mockUser.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* User Details & Settings */}
            <>
                {/* User Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xl font-medium text-blue-600">
                          {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h2>
                        <p className="text-gray-600">{selectedUser.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                            {selectedUser.role === 'administrator' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                            {selectedUser.role === 'administrator' ? 'Administrator' : 'Coordinator'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                            {selectedUser.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {selectedUser.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {selectedUser.status === 'suspended' && <Ban className="h-3 w-3 mr-1" />}
                            {selectedUser.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Save className="h-4 w-4" />
                            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
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
                          <span>Edit User</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={50}
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{selectedUser.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={50}
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{selectedUser.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedUser.email}</span>
                          {selectedUser.isEmailVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" title="Email verified" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" title="Email not verified" />
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone}
                          onChange={handlePhoneChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="(555) 123-4567"
                          maxLength={14}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedUser.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="title"
                          value={userData.title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={100}
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{selectedUser.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={userData.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="City, State"
                          maxLength={100}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedUser.location || 'Not specified'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description about the user..."
                        maxLength={500}
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{selectedUser.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>

                {/* Admin Controls */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Administrative Controls
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      {isEditing ? (
                        <select
                          name="role"
                          value={userData.role}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="provider-relations-coordinator">Provider Relations Coordinator</option>
                          <option value="administrator">Administrator</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                          {selectedUser.role === 'administrator' ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                          {selectedUser.role === 'administrator' ? 'Administrator' : 'Coordinator'}
                        </span>
                      )}
                      {isEditing && (
                        <p className="mt-1 text-xs text-gray-500">
                          Administrators have full system access including user management
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                      {isEditing ? (
                        <select
                          name="status"
                          value={userData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                          {selectedUser.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {selectedUser.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {selectedUser.status === 'suspended' && <Ban className="h-3 w-3 mr-1" />}
                          {selectedUser.status}
                        </span>
                      )}
                      {isEditing && (
                        <div className="mt-1 text-xs text-gray-500">
                          <p>• <strong>Active:</strong> Full access to the system</p>
                          <p>• <strong>Suspended:</strong> Account disabled, cannot log in</p>
                          <p>• <strong>Pending:</strong> Awaiting email verification</p>
                          <p>• <strong>Inactive:</strong> Account deactivated</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      {isEditing ? (
                        <select
                          name="department"
                          value={userData.department}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Department</option>
                          <option value="Provider Relations">Provider Relations</option>
                          <option value="Provider Relations & Development">Provider Relations & Development</option>
                          <option value="IT Administration">IT Administration</option>
                          <option value="Data Management">Data Management</option>
                          <option value="Quality Assurance">Quality Assurance</option>
                          <option value="Operations">Operations</option>
                          <option value="Management">Management</option>
                        </select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedUser.department}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="employeeId"
                          value={userData.employeeId}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={20}
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{selectedUser.employeeId}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="manager"
                          value={userData.manager}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={100}
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{selectedUser.manager}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="isEmailVerified"
                            checked={userData.isEmailVerified}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Email is verified</span>
                        </div>
                      ) : (
                        <span className={`text-sm font-medium ${selectedUser.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedUser.isEmailVerified ? 'Yes' : 'No'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                {!isEditing && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedUser.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction('suspend')}
                          disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                          <Ban className="h-4 w-4" />
                          <span>Suspend Account</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction('activate')}
                          disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>Activate Account</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleUserAction('reset-password')}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reset Password</span>
                      </button>
                      
                      {!selectedUser.isEmailVerified && (
                        <button
                          onClick={() => handleUserAction('verify-email')}
                          disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Mail className="h-4 w-4" />
                          <span>Send Verification</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`)) {
                            handleUserAction('delete-user');
                          }
                        }}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete User</span>
                      </button>
                      
                      <a
                        href={`/search?managedBy=${encodeURIComponent(selectedUser.firstName + ' ' + selectedUser.lastName)}`}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        <Activity className="h-4 w-4" />
                        <span>View User Activity</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedUser.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                      <p className="text-sm text-gray-900">
                        {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedUser.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Statistics */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    User Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-gray-600">Providers Registered</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-sm text-gray-600">Bulk Imports</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">89</div>
                      <div className="text-sm text-gray-600">Profile Updates</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">98%</div>
                      <div className="text-sm text-gray-600">Quality Score</div>
                    </div>
                  </div>
                </div>
              </>
          </div>
        )}
      </div>
    </Layout>
  );
}