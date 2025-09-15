import React from 'react';
import { Layout } from '../Layout/Layout';
import { useLocation } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Stethoscope,
  Phone,
  Mail,
  Eye,
  Edit,
  ArrowLeft
} from 'lucide-react';

export function SearchResults() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const managedBy = searchParams.get('managedBy') || '';

  // Mock search results
  const allResults = [
    // John Doe's Internal Medicine/Cardiology providers (28 total)
    {
      id: '1',
      name: 'Dr. Robert Anderson',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Los Angeles, CA',
      phone: '(555) 123-4567',
      email: 'robert.anderson@example.com',
      npi: '1234567890',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '2',
      name: 'Dr. Maria Gonzalez',
      credentials: 'MD',
      specialty: 'Cardiology',
      location: 'Beverly Hills, CA',
      phone: '(555) 234-5678',
      email: 'maria.gonzalez@example.com',
      npi: '1234567891',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '3',
      name: 'Dr. James Wilson',
      credentials: 'MD',
      specialty: 'Gastroenterology',
      location: 'Santa Monica, CA',
      phone: '(555) 345-6789',
      email: 'james.wilson@example.com',
      npi: '1234567892',
      status: 'active',
      managedBy: 'John Doe'
    },
    {
      id: '4',
      name: 'Dr. Jennifer Lee',
      credentials: 'MD',
      specialty: 'Internal Medicine',
      location: 'Pasadena, CA',
      phone: '(555) 456-7890',
      email: 'jennifer.lee@example.com',
      npi: '1234567893',
      status: 'active',
      managedBy: 'John Doe'
    },
    // Emily Rodriguez's Pediatrics/Family Medicine providers (35 total)
    {
      id: '5',
      name: 'Dr. Sarah Martinez',
      credentials: 'MD',
      specialty: 'Pediatrics',
      location: 'Miami, FL',
      phone: '(555) 567-8901',
      email: 'sarah.martinez@example.com',
      npi: '1234567894',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '6',
      name: 'Dr. Michael Brown',
      credentials: 'DO',
      specialty: 'Family Medicine',
      location: 'Orlando, FL',
      phone: '(555) 678-9012',
      email: 'michael.brown@example.com',
      npi: '1234567895',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    {
      id: '7',
      name: 'Dr. Amanda Davis',
      credentials: 'MD',
      specialty: 'Pediatric Surgery',
      location: 'Tampa, FL',
      phone: '(555) 789-0123',
      email: 'amanda.davis@example.com',
      npi: '1234567896',
      status: 'active',
      managedBy: 'Emily Rodriguez'
    },
    // David Thompson's Orthopedic/Sports Medicine providers (22 total)
    {
      id: '8',
      name: 'Dr. Kevin Johnson',
      credentials: 'MD',
      specialty: 'Orthopedic Surgery',
      location: 'Denver, CO',
      phone: '(555) 890-1234',
      email: 'kevin.johnson@example.com',
      npi: '1234567897',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '9',
      name: 'Dr. Rachel Green',
      credentials: 'DO',
      specialty: 'Sports Medicine',
      location: 'Boulder, CO',
      phone: '(555) 901-2345',
      email: 'rachel.green@example.com',
      npi: '1234567898',
      status: 'active',
      managedBy: 'David Thompson'
    },
    {
      id: '10',
      name: 'Dr. Thomas Miller',
      credentials: 'DPT',
      specialty: 'Physical Therapy',
      location: 'Colorado Springs, CO',
      phone: '(555) 012-3456',
      email: 'thomas.miller@example.com',
      npi: '1234567899',
      status: 'active',
      managedBy: 'David Thompson'
    },
    // Lisa Wang's Mental Health providers (15 total)
    {
      id: '11',
      name: 'Dr. Patricia White',
      credentials: 'MD',
      specialty: 'Psychiatry',
      location: 'Seattle, WA',
      phone: '(555) 123-4567',
      email: 'patricia.white@example.com',
      npi: '1234567900',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '12',
      name: 'Dr. Daniel Clark',
      credentials: 'PsyD',
      specialty: 'Psychology',
      location: 'Portland, OR',
      phone: '(555) 234-5678',
      email: 'daniel.clark@example.com',
      npi: '1234567901',
      status: 'active',
      managedBy: 'Lisa Wang'
    },
    {
      id: '13',
      name: 'Dr. Susan Taylor',
      credentials: 'DO',
      specialty: 'Mental Health',
      location: 'Spokane, WA',
      phone: '(555) 345-6789',
      email: 'susan.taylor@example.com',
      npi: '1234567902',
      status: 'active',
      managedBy: 'Lisa Wang'
    }
  ];

  // Filter results based on search query and managed by
  const results = allResults.filter(provider => {
    const matchesQuery = !query || 
      provider.name.toLowerCase().includes(query.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(query.toLowerCase()) ||
      provider.location.toLowerCase().includes(query.toLowerCase());
    
    const matchesManagedBy = !managedBy || provider.managedBy === managedBy;
    
    return matchesQuery && matchesManagedBy;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTitle = () => {
    if (managedBy && query) {
      return `Search Results for "${query}" managed by ${managedBy}`;
    } else if (managedBy) {
      return `Providers managed by ${managedBy}`;
    } else if (query) {
      return `Search Results for "${query}"`;
    }
    return 'Search Results';
  };

  const getBreadcrumbs = () => {
    if (managedBy) {
      return [
        { label: 'User Management', href: '/user-management' },
        { label: 'Provider Results' }
      ];
    }
    return [
      { label: 'HCP Search', href: '/search' },
      { label: 'Search Results' }
    ];
  };

  return (
    <Layout breadcrumbs={getBreadcrumbs()}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <a
              href={managedBy ? "/user-management" : "/search"}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-gray-600">
                {results.length} results found
                {query && ` for "${query}"`}
                {managedBy && ` managed by ${managedBy}`}
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {results.map((provider) => (
            <div key={provider.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {provider.name}, {provider.credentials}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                        {provider.status}
                      </span>
                    </div>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        {provider.specialty}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {provider.location}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {provider.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {provider.email}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        NPI: {provider.npi}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={`/hcp-detail?id=${provider.id}`}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </a>
                  <a
                    href={`/hcp-edit?id=${provider.id}`}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}