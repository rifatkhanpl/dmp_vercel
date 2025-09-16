import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Stethoscope, 
  FileText,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export function HCPRegistration() {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    credentials: '',
    gender: '',
    dateOfBirth: '',
    
    // Contact Information
    email: '',
    phone: '',
    alternatePhone: '',
    
    // Practice Address
    practiceAddress1: '',
    practiceAddress2: '',
    practiceCity: '',
    practiceState: '',
    practiceZip: '',
    
    // Mailing Address
    mailingAddress1: '',
    mailingAddress2: '',
    mailingCity: '',
    mailingState: '',
    mailingZip: '',
    sameAsPractice: false,
    
    // Professional Information
    primarySpecialty: '',
    secondarySpecialty: '',
    npiNumber: '',
    deaNumber: '',
    medicareNumber: '',
    medicaidNumber: '',
    
    // License Information
    licenseState: '',
    licenseNumber: '',
    licenseIssueDate: '',
    licenseExpireDate: '',
    
    // Board Certification
    boardName: '',
    certificateName: '',
    certificationDate: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill mailing address when same as practice
  const handleSameAsPracticeChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, sameAsPractice: checked }));
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        mailingAddress1: prev.practiceAddress1,
        mailingAddress2: prev.practiceAddress2,
        mailingCity: prev.practiceCity,
        mailingState: prev.practiceState,
        mailingZip: prev.practiceZip
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting provider data:', formData);
      alert('Provider registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Layout breadcrumbs={[{ label: 'HCP Registration' }]}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Healthcare Provider Registration</h1>
                <p className="text-gray-600 mt-1">Enter the provider's information to create a new record</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter middle name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="provider@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setFormData({
                  firstName: '',
                  middleName: '',
                  lastName: '',
                  credentials: '',
                  gender: '',
                  dateOfBirth: '',
                  email: '',
                  phone: '',
                  alternatePhone: '',
                  practiceAddress1: '',
                  practiceAddress2: '',
                  practiceCity: '',
                  practiceState: '',
                  practiceZip: '',
                  mailingAddress1: '',
                  mailingAddress2: '',
                  mailingCity: '',
                  mailingState: '',
                  mailingZip: '',
                  sameAsPractice: false,
                  primarySpecialty: '',
                  secondarySpecialty: '',
                  npiNumber: '',
                  deaNumber: '',
                  medicareNumber: '',
                  medicaidNumber: '',
                  licenseState: '',
                  licenseNumber: '',
                  licenseIssueDate: '',
                  licenseExpireDate: '',
                  boardName: '',
                  certificateName: '',
                  certificationDate: ''
                })}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Provider'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}