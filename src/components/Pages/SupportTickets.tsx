import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { 
  MessageSquare,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Tag,
  Reply,
  Archive,
  Trash2,
  MoreVertical,
  Bookmark,
  BookmarkCheck,
  Plus
} from 'lucide-react';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'account' | 'billing' | 'feature-request' | 'other';
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  responses: number;
}

export function SupportTickets() {
  const { user: currentUser } = useAuth();
  const { addBookmark, bookmarks } = useBookmarks();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | SupportTicket['status']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | SupportTicket['priority']>('all');
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  const isBookmarked = bookmarks.some(b => b.url === '/support-tickets');

  // Check if current user is admin
  if (currentUser?.role !== 'administrator') {
    return (
      <Layout breadcrumbs={[{ label: 'Access Denied' }]}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need administrator privileges to access support tickets.</p>
          </div>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    const mockTickets: SupportTicket[] = [
      {
        id: '1',
        title: 'Unable to access HCP registration form',
        description: 'When I try to access the HCP registration form, I get a 404 error. This has been happening since yesterday.',
        status: 'open',
        priority: 'high',
        category: 'technical',
        userId: '1',
        userName: 'John Smith',
        userEmail: 'john.smith@practicelink.com',
        createdAt: '2024-12-20T09:30:00Z',
        updatedAt: '2024-12-20T09:30:00Z',
        responses: 0
      },
      {
        id: '2',
        title: 'Email verification not working',
        description: 'I registered yesterday but never received the verification email. I checked spam folder too.',
        status: 'in-progress',
        priority: 'medium',
        category: 'account',
        userId: '4',
        userName: 'Emily Rodriguez',
        userEmail: 'emily.rodriguez@practicelink.com',
        createdAt: '2024-12-19T14:15:00Z',
        updatedAt: '2024-12-20T10:00:00Z',
        assignedTo: 'Support Team',
        responses: 2
      },
      {
        id: '3',
        title: 'Feature request: Bulk export functionality',
        description: 'It would be great to have a bulk export feature for HCP data. Currently, I have to export one by one.',
        status: 'open',
        priority: 'low',
        category: 'feature-request',
        userId: '2',
        userName: 'Sarah Johnson',
        userEmail: 'sarah.johnson@practicelink.com',
        createdAt: '2024-12-18T16:45:00Z',
        updatedAt: '2024-12-18T16:45:00Z',
        responses: 1
      },
      {
        id: '4',
        title: 'AI import not parsing correctly',
        description: 'The AI bulk import feature is not correctly parsing resident names from the text I provided.',
        status: 'resolved',
        priority: 'medium',
        category: 'technical',
        userId: '1',
        userName: 'John Smith',
        userEmail: 'john.smith@practicelink.com',
        createdAt: '2024-12-17T11:20:00Z',
        updatedAt: '2024-12-19T15:30:00Z',
        assignedTo: 'Tech Team',
        responses: 4
      },
      {
        id: '5',
        title: 'Account suspended without notice',
        description: 'My account was suspended and I did not receive any notification. Please help me understand why.',
        status: 'open',
        priority: 'urgent',
        category: 'account',
        userId: '5',
        userName: 'David Wilson',
        userEmail: 'david.wilson@practicelink.com',
        createdAt: '2024-12-20T08:00:00Z',
        updatedAt: '2024-12-20T08:00:00Z',
        responses: 0
      }
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBookmark = () => {
    if (!isBookmarked) {
      addBookmark('Support Tickets', '/support-tickets', 'Administration');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectTicket = (ticketId: string) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId);
    } else {
      newSelected.add(ticketId);
    }
    setSelectedTickets(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTickets.size === filteredTickets.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(filteredTickets.map(t => t.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    const selectedTicketsList = tickets.filter(t => selectedTickets.has(t.id));
    
    switch (action) {
      case 'resolve':
        setTickets(prev => prev.map(t => 
          selectedTickets.has(t.id) ? { ...t, status: 'resolved' as const } : t
        ));
        break;
      case 'close':
        setTickets(prev => prev.map(t => 
          selectedTickets.has(t.id) ? { ...t, status: 'closed' as const } : t
        ));
        break;
      case 'assign':
        alert(`Assigning ${selectedTicketsList.length} tickets...`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedTicketsList.length} tickets?`)) {
          setTickets(prev => prev.filter(t => !selectedTickets.has(t.id)));
        }
        break;
    }
    
    setSelectedTickets(new Set());
    setShowBulkActions(false);
  };

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <Archive className="w-4 h-4 text-gray-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Layout breadcrumbs={[{ label: 'Support Tickets' }]}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading support tickets...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Support Tickets' }
    ]}>
      <div className="flex-1 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Tickets</h1>
              <p className="text-gray-600">Manage and respond to user support requests</p>
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
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span className="text-sm">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Tickets
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or user..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterPriority" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Priority
              </label>
              <select
                id="filterPriority"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
                <span className="text-sm text-gray-500">
                  {filteredTickets.length} of {tickets.length} tickets
                </span>
              </div>
              
              {selectedTickets.size > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedTickets.size} selected
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Bulk Actions
                    </button>
                    
                    {showBulkActions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleBulkAction('resolve')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <CheckCircle className="w-4 h-4 mr-3" />
                            Mark as Resolved
                          </button>
                          <button
                            onClick={() => handleBulkAction('close')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Archive className="w-4 h-4 mr-3" />
                            Close Tickets
                          </button>
                          <button
                            onClick={() => handleBulkAction('assign')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <User className="w-4 h-4 mr-3" />
                            Assign to Team
                          </button>
                          <button
                            onClick={() => handleBulkAction('delete')}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete Tickets
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {filteredTickets.length > 0 && (
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTickets.size === filteredTickets.length && filteredTickets.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Select All ({filteredTickets.length})
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedTickets.has(ticket.id)}
                      onChange={() => handleSelectTicket(ticket.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{ticket.userName}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            <span className="capitalize">{ticket.category.replace('-', ' ')}</span>
                          </div>
                          <div className="flex items-center">
                            <Reply className="w-4 h-4 mr-1" />
                            <span>{ticket.responses} responses</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => alert(`Viewing ticket: ${ticket.title}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => alert(`Replying to ticket: ${ticket.title}`)}
                          className="text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="px-6 py-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}