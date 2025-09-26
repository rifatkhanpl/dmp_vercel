import React from 'react';
import { Layout } from '../Layout/Layout';
import { useLocation } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Stethoscope,
  FileText,
  Calendar,
  Shield,
  Edit,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export function HCPDetail() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const providerId = searchParams.get('id') || '1';

  // Mock provider data
  const provider = {
    id: providerId,
    firstName: 'Sarah',
    middleName: 'Elizabeth',
    lastName: 'Johnson',
    credentials: 'MD',
    gender: 'Female',
    dateOfBirth: '1985-03-15',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    alternatePhone: '(555) 987-6543',
    practiceAddress: {
      address1: '123 Medical Center Dr',
      address2: 'Suite 200',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210'
    },
    mailingAddress: {
      address1: '456 Residential St',
      address2: 'Apt 5B',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90211'
    },
    primarySpecialty: 'Internal Medicine',
    secondarySpecialty: 'Geriatrics',
    npiNumber: '1234567890',
    deaNumber: 'BJ1234567',
    medicareNumber: 'MEDICARE123',
    medicaidNumber: 'MEDICAID456',
    licenseState: 'CA',
    licenseNumber: 'A12345',
    licenseIssueDate: '2010-06-15',
    licenseExpireDate: '2025-06-15',
    boardName: 'American Board of Internal Medicine',
    certificateName: 'Internal Medicine',
    certificationDate: '2010-07-01',
    gmeTraining: {
      programName: 'Internal Medicine Residency Program',
      institution: 'UCLA Medical Center',
      programType: 'Residency',
      startDate: '2007-07-01',
      endDate: '2010-06-30',
      programId: '1'
    },
    status: 'active',
    createdAt: '2023-01-15',
    updatedAt: '2024-01-10'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isLicenseExpiringSoon = () => {
    const expireDate = new Date(provider.licenseExpireDate);
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    
    return expireDate <= sixMonthsFromNow;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="/search"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {provider.firstName} {provider.middleName} {provider.lastName}, {provider.credentials}
                  </h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(provider.status)}`}>
                    {provider.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{provider.primarySpecialty}</p>
                <p className="text-sm text-gray-500">NPI: {provider.npiNumber}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Edit className="h-4 w-4" />
                <span>Edit Residents & Fellows</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {isLicenseExpiringSoon() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-900">License Expiring Soon</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Medical license expires on {new Date(provider.licenseExpireDate).toLocaleDateString()}. 
                  Please ensure renewal is completed before expiration.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {provider.firstName} {provider.middleName} {provider.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Credentials</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.credentials}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Gender</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(provider.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Alternate Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.alternatePhone}</p>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Addresses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Practice Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{provider.practiceAddress.address1}</p>
                    {provider.practiceAddress.address2 && <p>{provider.practiceAddress.address2}</p>}
                    <p>
                      {provider.practiceAddress.city}, {provider.practiceAddress.state} {provider.practiceAddress.zip}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Mailing Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{provider.mailingAddress.address1}</p>
                    {provider.mailingAddress.address2 && <p>{provider.mailingAddress.address2}</p>}
                    <p>
                      {provider.mailingAddress.city}, {provider.mailingAddress.state} {provider.mailingAddress.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Primary Specialty</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.primarySpecialty}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Secondary Specialty</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.secondarySpecialty}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">NPI Number</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.npiNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">DEA Number</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.deaNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Medicare Number</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.medicareNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Medicaid Number</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.medicaidNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* GME Training */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                GME Residency/Fellowship Training
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Program Name</label>
                  <a
                    href={`/gme-program-detail?id=${provider.gmeTraining.programId}`}
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {provider.gmeTraining.programName}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Institution</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.gmeTraining.institution}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Program Type</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.gmeTraining.programType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Training Dates</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(provider.gmeTraining.startDate).toLocaleDateString()} - {new Date(provider.gmeTraining.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* License Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                License Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">State</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.licenseState}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">License Number</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.licenseNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Issue Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(provider.licenseIssueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Expiration Date</label>
                  <div className="flex items-center space-x-2">
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(provider.licenseExpireDate).toLocaleDateString()}
                    </p>
                    {isLicenseExpiringSoon() ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Board Certification */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Board Certification
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Board Name</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.boardName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Certificate</label>
                  <p className="mt-1 text-sm text-gray-900">{provider.certificateName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Certification Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(provider.certificationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Record Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Record Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(provider.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(provider.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}