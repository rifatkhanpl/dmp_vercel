import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { BookmarkButton } from '../ui/BookmarkButton';
import { FormField } from '../ui/FormField';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ResidentFellowSchema } from '../../schemas/dmpSchemas';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Stethoscope,
  FileText,
  Calendar,
  Save,
  X,
  Plus
} from 'lucide-react';

export function HCPRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, errors, updateField, handleSubmit, isValid, isDirty } = useFormValidation({
    schema: ResidentFellowSchema.partial(),
    onSubmit: async (formData) => {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting:', formData);
      setIsSubmitting(false);
    }
  });

  return (
    <Layout breadcrumbs={[{ label: 'HCP Registration' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Healthcare Provider Registration</h1>
            <p className="text-gray-600 mt-1">Register a new healthcare provider in the system</p>
          </div>
          <BookmarkButton
            title="HCP Registration"
            url="/hcp-registration"
            category="Data Entry"
            icon="UserPlus"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="NPI Number"
                name="npi"
                type="text"
                value={data.npi || ''}
                onChange={(value) => updateField('npi', value)}
                error={errors.npi}
                placeholder="1234567890"
                required
                maxLength={10}
              />
              
              <FormField
                label="First Name"
                name="firstName"
                type="text"
                value={data.firstName || ''}
                onChange={(value) => updateField('firstName', value)}
                error={errors.firstName}
                placeholder="John"
                required
              />
              
              <FormField
                label="Last Name"
                name="lastName"
                type="text"
                value={data.lastName || ''}
                onChange={(value) => updateField('lastName', value)}
                error={errors.lastName}
                placeholder="Doe"
                required
              />
              
              <FormField
                label="Middle Name"
                name="middleName"
                type="text"
                value={data.middleName || ''}
                onChange={(value) => updateField('middleName', value)}
                error={errors.middleName}
                placeholder="Michael"
              />
              
              <FormField
                label="Credentials"
                name="credentials"
                type="text"
                value={data.credentials || ''}
                onChange={(value) => updateField('credentials', value)}
                error={errors.credentials}
                placeholder="MD"
                required
              />
              
              <FormField
                label="Gender"
                name="gender"
                type="select"
                value={data.gender || ''}
                onChange={(value) => updateField('gender', value)}
                error={errors.gender}
                options={[
                  { value: '', label: 'Select Gender' },
                  { value: 'M', label: 'Male' },
                  { value: 'F', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={data.email || ''}
                onChange={(value) => updateField('email', value)}
                error={errors.email}
                placeholder="john.doe@hospital.edu"
              />
              
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={data.phone || ''}
                onChange={(value) => updateField('phone', value)}
                error={errors.phone}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Practice Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Practice Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField
                  label="Address Line 1"
                  name="practiceAddress1"
                  type="text"
                  value={data.practiceAddress1 || ''}
                  onChange={(value) => updateField('practiceAddress1', value)}
                  error={errors.practiceAddress1}
                  placeholder="123 Medical Center Dr"
                  required
                />
              </div>
              
              <FormField
                label="City"
                name="practiceCity"
                type="text"
                value={data.practiceCity || ''}
                onChange={(value) => updateField('practiceCity', value)}
                error={errors.practiceCity}
                placeholder="Los Angeles"
                required
              />
              
              <FormField
                label="State"
                name="practiceState"
                type="text"
                value={data.practiceState || ''}
                onChange={(value) => updateField('practiceState', value)}
                error={errors.practiceState}
                placeholder="CA"
                required
                maxLength={2}
              />
              
              <FormField
                label="ZIP Code"
                name="practiceZip"
                type="text"
                value={data.practiceZip || ''}
                onChange={(value) => updateField('practiceZip', value)}
                error={errors.practiceZip}
                placeholder="90210"
                required
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Primary Specialty"
                name="primarySpecialty"
                type="text"
                value={data.primarySpecialty || ''}
                onChange={(value) => updateField('primarySpecialty', value)}
                error={errors.primarySpecialty}
                placeholder="Internal Medicine"
                required
              />
              
              <FormField
                label="Taxonomy Code"
                name="taxonomyCode"
                type="text"
                value={data.taxonomyCode || ''}
                onChange={(value) => updateField('taxonomyCode', value)}
                error={errors.taxonomyCode}
                placeholder="207R00000X"
              />
            </div>
          </div>

          {/* License Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">License Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="License State"
                name="licenseState"
                type="text"
                value={data.licenseState || ''}
                onChange={(value) => updateField('licenseState', value)}
                error={errors.licenseState}
                placeholder="CA"
                required
                maxLength={2}
              />
              
              <FormField
                label="License Number"
                name="licenseNumber"
                type="text"
                value={data.licenseNumber || ''}
                onChange={(value) => updateField('licenseNumber', value)}
                error={errors.licenseNumber}
                placeholder="A12345"
                required
              />
              
              <FormField
                label="License Issue Date"
                name="licenseIssueDate"
                type="date"
                value={data.licenseIssueDate || ''}
                onChange={(value) => updateField('licenseIssueDate', value)}
                error={errors.licenseIssueDate}
              />
              
              <FormField
                label="License Expiration Date"
                name="licenseExpireDate"
                type="date"
                value={data.licenseExpireDate || ''}
                onChange={(value) => updateField('licenseExpireDate', value)}
                error={errors.licenseExpireDate}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Provider'}</span>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}