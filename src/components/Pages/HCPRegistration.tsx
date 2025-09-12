import React, { useState } from 'react';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { Breadcrumb } from '../Layout/Breadcrumb';
import { 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Stethoscope,
  Calendar,
  Save,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface HCPFormData {
  firstName: string;
  middleInitial: string;
  lastName: string;
  credential: string;
  profession: string;
  specialty: string;
  subspecialty: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  graduationYear: string;
  medicalSchool: string;
  residencyProgram: string;
  fellowshipProgram: string;
  boardCertifications: string;
  licenseNumber: string;
  licenseState: string;
  npiNumber: string;
}

export function HCPRegistration() {
  const { addBookmark, bookmarks } = useBookmarks();
  const [formData, setFormData] = useState<HCPFormData>({
    firstName: '',
    middleInitial: '',
    lastName: '',
    credential: '',
    profession: '',
    specialty: '',
    subspecialty: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    graduationYear: '',
    medicalSchool: '',
    residencyProgram: '',
    fellowshipProgram: '',
    boardCertifications: '',
    licenseNumber: '',
    licenseState: '',
    npiNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const isBookmarked = bookmarks.some(b => b.url === '/hcp-registration');

  const handleBookmark = () => {
    if (!isBookmarked) {
      addBookmark('HCP Registration', '/hcp-registration', 'Data Collection');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      setSubmitStatus('success');
      setSubmitMessage('Healthcare provider registered successfully!');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          middleInitial: '',
          lastName: '',
          credential: '',
          profession: '',
          specialty: '',
          subspecialty: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          graduationYear: '',
          medicalSchool: '',
          residencyProgram: '',
          fellowshipProgram: '',
          boardCertifications: '',
          licenseNumber: '',
          licenseState: '',
          npiNumber: ''
        });
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to register healthcare provider. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialties = [
    'Anesthesiology', 'Cardiology', 'Dermatology', 'Emergency Medicine',
    'Family Medicine', 'Internal Medicine', 'Neurology', 'Obstetrics & Gynecology',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Pathology', 'Pediatrics',
    'Psychiatry', 'Radiology', 'Surgery', 'Urology'
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <Layout breadcrumbs={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'HCP Registration' }
    ]}>
      <div className="flex-1 max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Healthcare Provider Registration</h1>
            </div>
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
          </div>
          <p className="text-gray-600 mt-2">
            Register a new healthcare provider in the PracticeLink database
          </p>
        </div>

        <div className="p-6">
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">{submitMessage}</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{submitMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="middleInitial" className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Initial
                  </label>
                  <input
                    type="text"
                    id="middleInitial"
                    name="middleInitial"
                    maxLength={1}
                    value={formData.middleInitial}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="M"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="credential" className="block text-sm font-medium text-gray-700 mb-2">
                    Credential *
                  </label>
                  <select
                    id="credential"
                    name="credential"
                    required
                    value={formData.credential}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select credential</option>
                    <option value="MD">MD</option>
                    <option value="DO">DO</option>
                    <option value="NP">NP</option>
                    <option value="PA">PA</option>
                    <option value="CRNA">CRNA</option>
                    <option value="CNM">CNM</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                    Profession *
                  </label>
                  <select
                    id="profession"
                    name="profession"
                    required
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select profession</option>
                    <option value="Physician">Physician</option>
                    <option value="Nurse Practitioner">Nurse Practitioner</option>
                    <option value="Physician Assistant">Physician Assistant</option>
                    <option value="CRNA">CRNA</option>
                    <option value="Certified Nurse Midwife">Certified Nurse Midwife</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty *
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select specialty</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="subspecialty" className="block text-sm font-medium text-gray-700 mb-2">
                    Subspecialty
                  </label>
                  <input
                    type="text"
                    id="subspecialty"
                    name="subspecialty"
                    value={formData.subspecialty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subspecialty"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="doctor@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Address Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Training */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                Education & Training
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="medicalSchool" className="block text-sm font-medium text-gray-700 mb-2">
                    Medical School
                  </label>
                  <input
                    type="text"
                    id="medicalSchool"
                    name="medicalSchool"
                    value={formData.medicalSchool}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="University Medical School"
                  />
                </div>
                <div>
                  <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    id="graduationYear"
                    name="graduationYear"
                    min="1950"
                    max="2030"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2020"
                  />
                </div>
                <div>
                  <label htmlFor="residencyProgram" className="block text-sm font-medium text-gray-700 mb-2">
                    Residency Program
                  </label>
                  <input
                    type="text"
                    id="residencyProgram"
                    name="residencyProgram"
                    value={formData.residencyProgram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hospital Residency Program"
                  />
                </div>
                <div>
                  <label htmlFor="fellowshipProgram" className="block text-sm font-medium text-gray-700 mb-2">
                    Fellowship Program
                  </label>
                  <input
                    type="text"
                    id="fellowshipProgram"
                    name="fellowshipProgram"
                    value={formData.fellowshipProgram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Fellowship Program"
                  />
                </div>
              </div>
            </div>

            {/* Licensing & Certification */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Licensing & Certification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="License number"
                  />
                </div>
                <div>
                  <label htmlFor="licenseState" className="block text-sm font-medium text-gray-700 mb-2">
                    License State
                  </label>
                  <select
                    id="licenseState"
                    name="licenseState"
                    value={formData.licenseState}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="npiNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    NPI Number
                  </label>
                  <input
                    type="text"
                    id="npiNumber"
                    name="npiNumber"
                    value={formData.npiNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label htmlFor="boardCertifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Board Certifications
                  </label>
                  <input
                    type="text"
                    id="boardCertifications"
                    name="boardCertifications"
                    value={formData.boardCertifications}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Board certifications"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{isSubmitting ? 'Registering...' : 'Register Healthcare Provider'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </Layout>
  );
}