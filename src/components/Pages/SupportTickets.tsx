import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../Layout/Layout';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  User,
  Shield
} from 'lucide-react';

const mockTickets = [
  {
    id: 'TICK-001',
    title: 'Unable to verify provider credentials',
    description: 'Having issues with the credential verification process for Dr. Smith',
    status: 'open',
    priority: 'high',
    category: 'verification',
    createdBy: 'john.doe@hospital.com',
    assignedTo: 'support@practicelink.com',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    messages: 3,
  },
  {
    id: 'TICK-002',
    title: 'Bulk import failed for 50 providers',
    description: 'The bulk import process failed with validation errors',
    status: 'in_progress',
    priority: 'medium',
    category: 'import',
    createdBy: 'admin@clinic.com',
    assignedTo: 'tech@practicelink.com',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    messages: 7,
  },
  {
    id: 'TICK-003',
    title: 'Search functionality not working',
    description: 'Provider search returns no results even with valid criteria',
    status: 'resolved',
    priority: 'low',
    category: 'search',
    createdBy: 'user@practice.com',
    assignedTo: 'support@practicelink.com',
    createdAt: '2024-01-13T11:20:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
    messages: 5,
  },
];

const statusColors = {
  open: 'bg-red-100 text-red-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  urgent: 'bg-purple-100 text-purple-800',
};

export function SupportTickets() {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  if (!isAdmin) {
    return (
      <Layout breadcrumbs={[{ label: 'Access Denied' }]}>
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
        </div>
      </Layout>
    );
  }

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <Layout breadcrumbs={[{ label: 'Support Tickets' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage and track support tickets from users across the platform.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Open</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {mockTickets.filter(t => t.status === 'open').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {mockTickets.filter(t => t.status === 'in_progress').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {mockTickets.filter(t => t.status === 'resolved').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HelpCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                    <dd className="text-lg font-medium text-gray-900">{mockTickets.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search Tickets
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by title, description, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-blue-600">
                          {ticket.id}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
                        </span>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {ticket.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {ticket.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Created by {ticket.createdBy}</span>
                        <span>•</span>
                        <span>Assigned to {ticket.assignedTo}</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {ticket.messages}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}