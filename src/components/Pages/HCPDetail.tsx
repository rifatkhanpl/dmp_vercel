import React, { useState, useEffect } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { Breadcrumb } from '../Layout/Breadcrumb';
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
  Building
} from 'lucide-react';

interface HCPData {
  id: string;
  name: string;
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
}

export function HCPDetail() {
  const { addBookmark, bookmarks } = useBookmarks();
  const [hcpData, setHcpData] = useState<HCPData | null>(null);
  const [loading, setLoading] = useState(true);

  const isBookmarked = bookmarks.some(b => b.url === window.location.pathname + window.location.search);

  useEffect(() => {
    // Get provider ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const providerId = urlParams.get('id');

    // Mock data - in real app, this would fetch from API
    const mockProviders: { [key: string]: HCPData } = {
      '1': {
        id: '1',
        name: 'Dr. Sarah Johnson',
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
        fellowshipProgram: 'Mayo Clinic - Cardiology',
        boardCertifications: 'Internal Medicine, Cardiovascular Disease',
        licenseNumber: 'NY123456',
        licenseState: 'NY',
        npiNumber: '1234567890',
        availability: 'Available',
        experience: '15 years'
      },
      '2': {
        id: '2',
        name: 'Dr. Michael Chen',
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
        licenseNumber: 'CA789012',
        licenseState: 'CA',
        npiNumber: '0987654321',
        availability: 'Available',
        experience: '8 years'
      },
      '3': {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        credential: 'MD',
        profession: 'Physician',
        specialty: 'Pediatrics',
        subspecialty: 'Pediatric Cardiology',
        email: 'emily.rodriguez@hospital.com',
        phone: '(555) 345-6789',
        address: '789 Children\'s Hospital Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        graduationYear: '2011',
        medicalSchool: 'Northwestern University Feinberg School of Medicine',
        residencyProgram: 'Children\'s Hospital of Chicago - Pediatrics',
        fellowshipProgram: 'Boston Children\'s Hospital - Pediatric Cardiology',
        boardCertifications: 'Pediatrics, Pediatric Cardiology',
        licenseNumber: 'IL345678',
        licenseState: 'IL',
        npiNumber: '1122334455',
        availability: 'Unavailable',
        experience: '12 years'
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      if (providerId && mockProviders[providerId]) {
        setHcpData(mockProviders[providerId]);
      }
      setLoading(false);
    }, 500);
  }, []);

  const handleBookmark = () => {
    if (!isBookmarked && hcpData) {
      addBookmark(`${hcpData.name} - Details`, window.location.pathname + window.location.search, 'HCP Details');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (!hcpData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    );
  }

  return (
    <Layout breadcrumbs={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Search HCPs', href: '/search' },
      { label: hcpData.name }
    ]}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-3xl font-bold text-gray-900">{hcpData.name}</h1>
                <p className="text-lg text-gray-600">{hcpData.credential} - {hcpData.specialty}</p>
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
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-8">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              hcpData.availability === 'Available'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {hcpData.availability}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credential</label>
                  <p className="text-gray-900">{hcpData.credential}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <p className="text-gray-900">{hcpData.profession}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <p className="text-gray-900">{hcpData.specialty}</p>
                </div>
                {hcpData.subspecialty && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subspecialty</label>
                    <p className="text-gray-900">{hcpData.subspecialty}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <p className="text-gray-900">{hcpData.experience}</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{hcpData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{hcpData.phone}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Address Information
              </h2>
              <div className="space-y-2">
                <p className="text-gray-900">{hcpData.address}</p>
                <p className="text-gray-900">{hcpData.city}, {hcpData.state} {hcpData.zipCode}</p>
              </div>
            </div>

            {/* Education & Training */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                Education & Training
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical School</label>
                  <p className="text-gray-900">{hcpData.medicalSchool}</p>
                  <p className="text-sm text-gray-500">Graduated: {hcpData.graduationYear}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residency Program</label>
                  <p className="text-gray-900">{hcpData.residencyProgram}</p>
                </div>
                {hcpData.fellowshipProgram && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fellowship Program</label>
                    <p className="text-gray-900">{hcpData.fellowshipProgram}</p>
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
                  <p className="text-gray-900">{hcpData.licenseNumber}</p>
                  <p className="text-sm text-gray-500">State: {hcpData.licenseState}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NPI Number</label>
                  <p className="text-gray-900">{hcpData.npiNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Board Certifications</label>
                  <p className="text-gray-900">{hcpData.boardCertifications}</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}