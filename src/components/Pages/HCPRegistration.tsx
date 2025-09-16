import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { FormField } from '../ui/FormField';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ResidentFellowSchema } from '../../schemas/dmpSchemas';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { AccessibleModal } from '../ui/AccessibleModal';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Stethoscope, 
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  Undo,
  Redo,
  History
} from 'lucide-react';

export function HCPRegistration() {
  const [showUndoModal, setShowUndoModal] = useState(false);
  
  const initialFormData = {
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
  };

  // Enhanced form validation with undo/redo
  const {
    data: formData,
    errors,
    warnings,
    isSubmitting,
    isDirty,
    updateField,
    handleSubmit,
    resetForm,
    getFieldProps,
    isValid
  } = useFormValidation({
    schema: ResidentFellowSchema.partial(), // Allow partial data during form filling
    onSubmit: async (data) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting provider data:', data);
    }
  });

  // Undo/Redo functionality
  const {
    state: undoRedoState,
    set: setUndoRedoState,
    undo,
    redo,
    canUndo,
    canRedo,
    historySize
  } = useUndoRedo(initialFormData);

  // Auto-fill mailing address when same as practice
  const handleSameAsPracticeChange = (checked: boolean) => {
    updateField('sameAsPractice', checked);
    
    if (checked) {
      updateField('mailingAddress1', formData.practiceAddress1);
      updateField('mailingAddress2', formData.practiceAddress2);
      updateField('mailingCity', formData.practiceCity);
      updateField('mailingState', formData.practiceState);
      updateField('mailingZip', formData.practiceZip);
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUndoModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  title={`View history (${historySize} changes)`}
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </button>
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo last change"
                  aria-label="Undo last change"
                >
                  <Undo className="h-4 w-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo last undone change"
                  aria-label="Redo last undone change"
                >
                  <Redo className="h-4 w-4" />
                </button>
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
                <FormField
                  label="First Name"
                  name="firstName"
                  required
                  maxLength={50}
                  autoComplete="given-name"
                  {...getFieldProps('firstName')}
                />
                <FormField
                  label="Middle Name"
                  name="middleName"
                  maxLength={50}
                  autoComplete="additional-name"
                  {...getFieldProps('middleName')}
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  required
                  maxLength={50}
                  autoComplete="family-name"
                  {...getFieldProps('lastName')}
                />
                <FormField
                  label="Credentials"
                  name="credentials"
                  required
                  placeholder="MD, DO, NP, PA, etc."
                  maxLength={20}
                  description="Professional credentials (e.g., MD, DO, NP, PA)"
                  {...getFieldProps('credentials')}
                />
                <FormField
                  label="Gender"
                  name="gender"
                  type="select"
                  options={[
                    { value: 'M', label: 'Male' },
                    { value: 'F', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  {...getFieldProps('gender')}
                />
                <FormField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  {...getFieldProps('dateOfBirth')}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  maxLength={100}
                  autoComplete="email"
                  description="Primary email address for communication"
                  {...getFieldProps('email')}
                />
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                  description="Primary phone number in (XXX) XXX-XXXX format"
                  {...getFieldProps('phone')}
                />
                <FormField
                  label="Alternate Phone"
                  name="alternatePhone"
                  type="tel"
                  pattern="^\(\d{3}\) \d{3}-\d{4}$"
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                  {...getFieldProps('alternatePhone')}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Primary Specialty"
                  name="primarySpecialty"
                  required
                  maxLength={100}
                  description="Main medical specialty or area of practice"
                  {...getFieldProps('primarySpecialty')}
                />
                <FormField
                  label="Secondary Specialty"
                  name="secondarySpecialty"
                  maxLength={100}
                  description="Additional specialty or subspecialty"
                  {...getFieldProps('secondarySpecialty')}
                />
                <FormField
                  label="NPI Number"
                  name="npi"
                  required
                  pattern="^\d{10}$"
                  maxLength={10}
                  placeholder="1234567890"
                  description="10-digit National Provider Identifier"
                  {...getFieldProps('npi')}
                />
                <FormField
                  label="DEA Number"
                  name="deaNumber"
                  maxLength={20}
                  placeholder="BJ1234567"
                  description="Drug Enforcement Administration number"
                  {...getFieldProps('deaNumber')}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              {isDirty && (
                <span className="text-sm text-yellow-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Unsaved changes
                </span>
              )}
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Provider'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* History Modal */}
        <AccessibleModal
          isOpen={showUndoModal}
          onClose={() => setShowUndoModal(false)}
          title="Form History"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              You have made {historySize} changes to this form.
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  undo();
                  setShowUndoModal(false);
                }}
                disabled={!canUndo}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Undo className="h-4 w-4" />
                <span>Undo Last Change</span>
              </button>
              <button
                onClick={() => {
                  redo();
                  setShowUndoModal(false);
                }}
                disabled={!canRedo}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <Redo className="h-4 w-4" />
                <span>Redo Change</span>
              </button>
            </div>
          </div>
        </AccessibleModal>
      </div>
    </Layout>
  );
}