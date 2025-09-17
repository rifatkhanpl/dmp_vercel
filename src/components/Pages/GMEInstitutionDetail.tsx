import React from 'react';
import { Layout } from '../Layout/Layout';
import { useLocation } from 'react-router-dom';
import { 
  Building,
  MapPin, 
  Users,
  GraduationCap,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Edit,
  Award,
  Calendar,
  Shield,
  FileText,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';

export function GMEInstitutionDetail() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const institutionId = searchParams.get('id') || '1';

  // Mock institution data
  const institution = {
    id: institutionId,
    institutionName: 'UCLA Medical Center',
    institutionType: 'Academic Medical Center',
    address: {
      address1: '757 Westwood Plaza',
      address2: null,
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90095'
    },
    contact: {
      website: 'https://www.uclahealth.org',
      mainPhone: '(310) 825-9111',
      mainEmail: 'info@uclahealth.org',
      gmeOfficePhone: '(310) 825-6301',
      gmeOfficeEmail: 'gme@mednet.ucla.edu'
    },
    leadership: {
      dioName: 'Dr. Sarah Johnson, MD',
      dioEmail: 'sarah.johnson@ucla.edu',
      dioPhone: '(310) 825-6301'
    },
    metrics: {
      totalResidents: 450,
      totalPrograms: 18,
      hospitalBeds: 520,
      establishedYear: 1955
    },
    accreditation: {
      status: 'Accredited',
      expiry: '2027-06-30',
      lastReview: '2024-06-30'
    },
    traumaLevel: 'Level I',
    teachingAffiliations: [
      'David Geffen School of Medicine at UCLA',
      'UCLA Fielding School of Public Health'
    ],
    researchFocus: [
      'Cancer Research',
      'Neuroscience', 
      'Cardiovascular Medicine',
      'Stem Cell Research'
    ],
    specialtyStrengths: [
      'Internal Medicine',
      'Surgery',
      'Pediatrics',
      'Neurology',
      'Oncology'
    ],
    programs: [
      {
        id: '1',
        name: 'Internal Medicine Residency Program',
        type: 'Residency',
        positions: 45,
        director: 'Dr. Sarah Johnson, MD'
      },
      {
        id: '2',
        name: 'Surgery Residency Program',
        type: 'Residency',
        positions: 25,
        director: 'Dr. Robert Martinez, MD'
      },
      {
        id: '3',
        name: 'Cardiology Fellowship Program',
        type: 'Fellowship',
        positions: 12,
        director: 'Dr. Emily Rodriguez, MD'
      },
      {
        id: '4',
        name: 'Emergency Medicine Residency Program',
        type: 'Residency',
        positions: 36,
        director: 'Dr. Michael Chen, MD'
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'accreditation',
        title: 'Accreditation renewed',
        description: 'ACGME accreditation renewed through 2027',
        date: '2024-06-30'
      },
      {
        id: '2',
        type: 'program',
        title: 'New fellowship program approved',
        description: 'Interventional Cardiology Fellowship Program',
        date: '2024-01-15'
      },
      {
        id: '3',
        type: 'resident',
        title: 'Match results',
        description: '98% match rate for 2024 cycle',
        date: '2024-03-15'
      }
    ],
    status: 'active',
    managedBy: 'Emily Rodriguez',
    createdAt: '2023-01-15',
    updatedAt: '2024-01-10'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'probation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccreditationColor = (status: string) => {
    switch (status) {
      case 'Accredited':
        return 'bg-green-100 text-green-800';
      case 'Probation':
        return 'bg-red-100 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isAccreditationExpiringSoon = () => {
    if (!institution.accreditation.expiry) return false;
    const expireDate = new Date(institution.accreditation.expiry);
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    return expireDate <= oneYearFromNow;
  };

  return (
    <Layout breadcrumbs={[
      { label: 'GME Institution Search', href: '/gme-institution-search' },
      { label: 'Institution Details' }
    ]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="/gme-institution-search"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {institution.institutionName}
                  </h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(institution.status)}`}>
                    {institution.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-1 flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  {institution.institutionType}
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {institution.address.city}, {institution.address.state}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              {institution.contact.website && (
                <a
                  href={institution.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Globe className="h-4 w-4" />
                  <span>Visit Website</span>
                </a>
              )}
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Edit className="h-4 w-4" />
                <span>Edit Institution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {isAccreditationExpiringSoon() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-900">Accreditation Expiring Soon</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  ACGME accreditation expires on {new Date(institution.accreditation.expiry).toLocaleDateString()}. 
                  Please ensure renewal process is initiated.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-blue-600">{institution.metrics.totalPrograms}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Residents</p>
                <p className="text-2xl font-bold text-green-600">{institution.metrics.totalResidents}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hospital Beds</p>
                <p className="text-2xl font-bold text-purple-600">{institution.metrics.hospitalBeds}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Established</p>
                <p className="text-2xl font-bold text-orange-600">{institution.metrics.establishedYear}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Programs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Training Programs ({institution.programs.length})
                </h2>
                <a
                  href={`/gme-program-search?institution=${encodeURIComponent(institution.institutionName)}`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all programs →
                </a>
              </div>
              <div className="space-y-3">
                {institution.programs.map((program) => (
                  <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{program.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            program.type === 'Residency' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {program.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {program.positions} positions
                          </span>
                          <span>Director: {program.director}</span>
                        </div>
                      </div>
                      <a
                        href={`/gme-program-detail?id=${program.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Focus */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Research Focus Areas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {institution.researchFocus.map((focus, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-blue-50 text-blue-800 rounded-md text-sm font-medium text-center"
                  >
                    {focus}
                  </div>
                ))}
              </div>
            </div>

            {/* Specialty Strengths */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Specialty Strengths
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {institution.specialtyStrengths.map((strength, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-green-50 text-green-800 rounded-md text-sm font-medium text-center"
                  >
                    {strength}
                  </div>
                ))}
              </div>
            </div>

            {/* Teaching Affiliations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Teaching Affiliations
              </h2>
              <ul className="space-y-2">
                {institution.teachingAffiliations.map((affiliation, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{affiliation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {institution.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <div className="mt-1 text-sm text-gray-900">
                    <p>{institution.address.address1}</p>
                    {institution.address.address2 && <p>{institution.address.address2}</p>}
                    <p>{institution.address.city}, {institution.address.state} {institution.address.zipCode}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Main Phone</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {institution.contact.mainPhone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Main Email</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${institution.contact.mainEmail}`} className="text-blue-600 hover:text-blue-700">
                      {institution.contact.mainEmail}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">GME Office</label>
                  <div className="mt-1 text-sm text-gray-900 space-y-1">
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {institution.contact.gmeOfficePhone}
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${institution.contact.gmeOfficeEmail}`} className="text-blue-600 hover:text-blue-700">
                        {institution.contact.gmeOfficeEmail}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Leadership
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Designated Institutional Official (DIO)</label>
                  <p className="mt-1 text-sm text-gray-900">{institution.leadership.dioName}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${institution.leadership.dioEmail}`} className="text-blue-600 hover:text-blue-700">
                      {institution.leadership.dioEmail}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Managed By</label>
                  <p className="mt-1 text-sm text-gray-900">{institution.managedBy}</p>
                </div>
              </div>
            </div>

            {/* Accreditation Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Accreditation Status
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Current Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccreditationColor(institution.accreditation.status)}`}>
                      {institution.accreditation.status}
                    </span>
                    {isAccreditationExpiringSoon() ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Expiration Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(institution.accreditation.expiry).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Review</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(institution.accreditation.lastReview).toLocaleDateString()}
                  </p>
                </div>
                {institution.traumaLevel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Trauma Designation</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      {institution.traumaLevel} Trauma Center
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Institution Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Institution Metrics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Programs per 100 beds</span>
                  <span className="text-sm font-medium text-gray-900">
                    {((institution.metrics.totalPrograms / institution.metrics.hospitalBeds) * 100).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Residents per program</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(institution.metrics.totalResidents / institution.metrics.totalPrograms)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Years in operation</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date().getFullYear() - institution.metrics.establishedYear}
                  </span>
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
                    {new Date(institution.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(institution.updatedAt).toLocaleDateString()}
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