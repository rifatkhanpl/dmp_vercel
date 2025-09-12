import React, { useState, useEffect } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Stethoscope,
  Calendar,
  Edit,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Shield,
  Award,
  Building,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ProviderData {
  id: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  credential: string;
  profession: string;
  specialty: string;
  subspecialty?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  graduationYear: string;
  medicalSchool: string;
  residencyProgram: string;
  fellowshipProgram?: string;
  boardCertifications: string;
  licenseNumber: string;
  licenseState: string;
  npiNumber: string;
  availability: string;
  experience: string;
  createdAt: string;
  lastUpdated: string;
}

export function ProviderProfile() {
  const { addBookmark, bookmarks } = useBookmarks();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const isBookmarked = bookmarks.some(b => b.url === window.location.pathname + window.location.search);

  useEffect(() => {
    // Get provider ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get('id');

    // Mock data - in real app, this would fetch from API
    const mockProviders: { [key: string]: ProviderData } = {
      '1': {
        id: '1',
        firstName: 'Sarah',
        middleInitial: 'M',
        lastName: 'Johnson',
        credential: 'MD',
        profession: 'Physician',
        specialty: 'Cardiology',
        subspecialty: 'Interventional Cardiology',
        email: 'sarah.johnson@hospital.com',
        phone: '(555) 123-4567',
        address: '123 Medical Center Drive',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        graduationYear: '2010',
        medicalSchool: 'Harvard Medical School',
        residencyProgram: 'Massachusetts General Hospital - Internal Medicine',
        fellowshipProgram: 'Mayo Clinic - Cardiology Fellowship',
        boardCertifications: 'Internal Medicine, Cardiovascular Disease, Interventional Cardiology',
        licenseNumber: 'NY123456789',
        licenseState: 'NY',
        npiNumber: '1234567890',
        availability: 'Available',
        experience: '15 years',
        createdAt: '2024-01-15',
        lastUpdated: '2024-12-20'
      },
      '2': {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        credential: 'MD',
        profession: 'Physician',
        specialty: 'Emergency Medicine',
        email: 'michael.chen@hospital.com',
        phone: '(555) 234-5678',
        address: '456 Emergency Way',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        graduationYear: '2015',
        medicalSchool: 'UCLA School of Medicine',
        residencyProgram: 'Cedars-Sinai Medical Center - Emergency Medicine',
        boardCertifications: 'Emergency Medicine',
        licenseNumber: 'CA789012345',
        licenseState: 'CA',
        npiNumber: '0987654321',
        availability: 'Available',
        experience: '8 years',
        createdAt: '2024-02-10',
        lastUpdated: '2024-12-18'
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      if (providerId && mockProviders[providerId]) {
        setProviderData(mockProviders[providerId]);
      }
      setLoading(false);
    }, 500);
  }, []);

  const handleBookmark = () => {
    if (!isBookmarked && providerData) {
      const fullName = `${providerData.firstName}${providerData.middleInitial ? ' ' + providerData.middleInitial + '.' : ''} ${providerData.lastName}`;
      addBookmark(`${fullName} - Profile`, window.location.pathname + window.location.search, 'Provider Profiles');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <Layout breadcrumbs={[{ label: 'Loading...' }]}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading provider profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!providerData) {
    return (
      <Layout breadcrumbs={[{ label: 'Provider Not Found' }]}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h2>
            <p className="text-gray-600 mb-6">The requested healthcare provider could not be found.</p>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const fullName = `${providerData.firstName}${providerData.middleInitial ? ' ' + providerData.middleInitial + '.' : ''} ${providerData.lastName}`;

  return (
    <Layout breadcrumbs={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Provider Profiles', href: '/search' },
      { label: fullName }
    ]}>
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                <p className="text-lg text-gray-600">{providerData.credential} - {providerData.specialty}</p>
                {providerData.subspecialty && (
                  <p className="text-md text-gray-500">{providerData.subspecialty}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBookmark}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  isBookmarked
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
                disabled={isBookmarked}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </span>
              </button>
              <button 
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status and Metadata */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                providerData.availability === 'Available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {providerData.availability === 'Available' ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-1" />
              )}
              {providerData.availability}
            </span>
            <span className="text-sm text-gray-500">
              Experience: {providerData.experience}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            <div>Created: {new Date(providerData.createdAt).toLocaleDateString()}</div>
            <div>Last Updated: {new Date(providerData.lastUpdated).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <p className="text-gray-900">{providerData.firstName}</p>
                </div>
                {providerData.middleInitial && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Initial</label>
                    <p className="text-gray-900">{providerData.middleInitial}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <p className="text-gray-900">{providerData.lastName}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credential</label>
                  <p className="text-gray-900">{providerData.credential}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <p className="text-gray-900">{providerData.profession}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <p className="text-gray-900">{providerData.specialty}</p>
                </div>
                {providerData.subspecialty && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subspecialty</label>
                    <p className="text-gray-900">{providerData.subspecialty}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <p className="text-gray-900">{providerData.experience}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <p className="text-gray-900">{providerData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <p className="text-gray-900">{providerData.phone}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Address Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <p className="text-gray-900">{providerData.address}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <p className="text-gray-900">{providerData.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <p className="text-gray-900">{providerData.state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <p className="text-gray-900">{providerData.zipCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Training */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                Education & Training
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical School</label>
                    <p className="text-gray-900">{providerData.medicalSchool}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                    <p className="text-gray-900">{providerData.graduationYear}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residency Program</label>
                  <p className="text-gray-900">{providerData.residencyProgram}</p>
                </div>
                {providerData.fellowshipProgram && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fellowship Program</label>
                    <p className="text-gray-900">{providerData.fellowshipProgram}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Licensing & Certification */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Licensing & Certification
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <p className="text-gray-900 font-mono text-sm">{providerData.licenseNumber}</p>
                  <p className="text-sm text-gray-500">State: {providerData.licenseState}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NPI Number</label>
                  <p className="text-gray-900 font-mono text-sm">{providerData.npiNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Board Certifications</label>
                  <div className="space-y-1">
                    {providerData.boardCertifications.split(',').map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-900 text-sm">{cert.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <Building className="w-4 h-4 mr-2" />
                  View Opportunities
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Profile Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="text-sm font-medium text-gray-900">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-medium text-gray-900">2 days ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Completeness</span>
                  <span className="text-sm font-medium text-green-600">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}