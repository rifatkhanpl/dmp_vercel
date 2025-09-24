import React from 'react';
import { Layout } from '../Layout/Layout';
import { useLocation } from 'react-router-dom';
import { 
  GraduationCap,
  Building,
  MapPin, 
  Stethoscope,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  Award,
  BookOpen,
  Clock,
  DollarSign,
  FileText
} from 'lucide-react';

export function GMEProgramDetail() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const programId = searchParams.get('id') || '1';

  // Mock program data
  const program = {
    id: programId,
    programName: 'Internal Medicine Residency Program',
    institution: 'UCLA Medical Center',
    profession: 'Physician',
    specialty: 'Internal Medicine',
    subspecialty: null,
    city: 'Los Angeles',
    state: 'CA',
    programType: 'Residency',
    accreditation: 'ACGME',
    positions: 45,
    programDirector: 'Dr. Sarah Johnson, MD',
    associateDirector: 'Dr. Michael Chen, MD',
    website: 'https://ucla.edu/internal-medicine',
    email: 'internal.medicine@ucla.edu',
    phone: '(310) 825-6301',
    description: 'Our Internal Medicine Residency Program provides comprehensive training in all aspects of internal medicine with emphasis on primary care, subspecialty rotations, and research opportunities. We are committed to training the next generation of internists who will provide excellent patient care, advance medical knowledge, and serve as leaders in healthcare.',
    established: 1965,
    duration: '3 years',
    applicationDeadline: 'October 15, 2024',
    interviewSeason: 'November 2024 - February 2025',
    matchDate: 'March 15, 2025',
    salary: {
      pgy1: 65000,
      pgy2: 67000,
      pgy3: 69000
    },
    benefits: [
      'Health, dental, and vision insurance',
      'Malpractice insurance',
      'Educational allowance ($2,500/year)',
      'Vacation time (4 weeks/year)',
      'Sick leave',
      'Parental leave',
      'Housing assistance'
    ],
    rotations: [
      'Internal Medicine Wards',
      'ICU/CCU',
      'Emergency Medicine',
      'Ambulatory Medicine',
      'Subspecialty Electives',
      'Research',
      'Night Float',
      'Cardiology',
      'Gastroenterology',
      'Pulmonology',
      'Endocrinology',
      'Nephrology'
    ],
    requirements: [
      'MD or DO degree from LCME or AOA accredited school',
      'USMLE Step 1 and Step 2 CK scores',
      'USMLE Step 2 CS (if applicable)',
      'ECFMG certification (for international graduates)',
      'Strong clinical performance',
      'Research experience preferred',
      'Letters of recommendation (3 required)'
    ],
    statistics: {
      totalApplications: 2800,
      interviewsOffered: 180,
      matchRate: '95%',
      boardPassRate: '98%',
      chiefResidents: 6
    },
    fellowshipPlacements: [
      'Cardiology - 8 residents (2023)',
      'Gastroenterology - 5 residents (2023)',
      'Pulmonology - 4 residents (2023)',
      'Endocrinology - 3 residents (2023)',
      'Nephrology - 2 residents (2023)',
      'Hospitalist - 12 residents (2023)'
    ]
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="/gme-program-search"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </a>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {program.programName}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {program.programType}
                  </span>
                </div>
                <p className="text-gray-600 mt-1 flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  {program.institution}
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {program.city}, {program.state}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <a
                href={program.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <Globe className="h-4 w-4" />
                <span>Visit Website</span>
              </a>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <FileText className="h-4 w-4" />
                <span>Apply Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Affiliated Residents and Programs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Affiliated Residents
              </h2>
              <p className="text-gray-600 mb-4">
                View current residents, alumni, and fellows associated with this program
              </p>
              <a
                href={`/search?program=${encodeURIComponent(program.programName)}&institution=${encodeURIComponent(program.institution)}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                View Program Alumni & Current Residents
              </a>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Affiliated Programs
              </h2>
              <p className="text-gray-600 mb-4">
                Explore all residency and fellowship programs at this institution
              </p>
              <a
                href={`/gme-program-search?institution=${encodeURIComponent(program.institution)}`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Building className="h-4 w-4 mr-2" />
                View All {program.institution} Programs
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Overview</h2>
              <p className="text-gray-600 leading-relaxed">{program.description}</p>
            </div>

            {/* Program Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Specialty</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    {program.specialty}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Duration</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {program.duration}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Positions</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {program.positions} per year
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Established</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {program.established}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Accreditation</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    {program.accreditation}
                  </p>
                </div>
              </div>
            </div>

            {/* Rotations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Clinical Rotations
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {program.rotations.map((rotation, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-blue-50 text-blue-800 rounded-md text-sm font-medium"
                  >
                    {rotation}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Requirements</h2>
              <ul className="space-y-2">
                {program.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fellowship Placements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Fellowship Placements</h2>
              <div className="space-y-2">
                {program.fellowshipPlacements.map((placement, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-900">{placement.split(' - ')[0]}</span>
                    <span className="text-sm text-gray-500">{placement.split(' - ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Program Director</label>
                  <p className="mt-1 text-sm text-gray-900">{program.programDirector}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Associate Director</label>
                  <p className="mt-1 text-sm text-gray-900">{program.associateDirector}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${program.email}`} className="text-blue-600 hover:text-blue-700">
                      {program.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {program.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Application Deadline</label>
                  <p className="mt-1 text-sm text-gray-900">{program.applicationDeadline}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Interview Season</label>
                  <p className="mt-1 text-sm text-gray-900">{program.interviewSeason}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Match Date</label>
                  <p className="mt-1 text-sm text-gray-900">{program.matchDate}</p>
                </div>
              </div>
            </div>

            {/* Salary & Benefits */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Salary & Benefits
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Annual Salary</label>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-900">PGY-1: ${program.salary.pgy1.toLocaleString()}</p>
                    <p className="text-sm text-gray-900">PGY-2: ${program.salary.pgy2.toLocaleString()}</p>
                    <p className="text-sm text-gray-900">PGY-3: ${program.salary.pgy3.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Benefits</label>
                  <ul className="mt-1 space-y-1">
                    {program.benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600">• {benefit}</li>
                    ))}
                    <li className="text-sm text-blue-600">+ {program.benefits.length - 4} more benefits</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Program Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Applications</span>
                  <span className="text-sm font-medium text-gray-900">{program.statistics.totalApplications.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Interviews Offered</span>
                  <span className="text-sm font-medium text-gray-900">{program.statistics.interviewsOffered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Match Rate</span>
                  <span className="text-sm font-medium text-green-600">{program.statistics.matchRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Board Pass Rate</span>
                  <span className="text-sm font-medium text-green-600">{program.statistics.boardPassRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Chief Residents</span>
                  <span className="text-sm font-medium text-gray-900">{program.statistics.chiefResidents}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}