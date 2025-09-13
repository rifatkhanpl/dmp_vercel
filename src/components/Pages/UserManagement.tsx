import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '../../contexts/BookmarkContext';
import { Layout } from '../Layout/Layout';
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
  Unlock,
  MessageSquare,
  FileText,
  Download,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { User, UserRole } from '../../types/user';

interface UserWithActivity extends User {
  lastActivity: string;
  status: 'active' | 'inactive' | 'suspended';
  loginCount: number;
  registrationDate: string;
  supportTickets: number;
}

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const { addBookmark, bookmarks } = useBookmarks();
  const [users, setUsers] = useState<UserWithActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithActivity | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const isBookmarked = bookmarks.some(b => b.url === '/user-management');

  // Check if current user is admin
  if (currentUser?.role !== 'administrator') {
    return (
      <Layout breadcrumbs={[{ label: 'Access Denied' }]}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need administrator privileges to access user management.</p>
          </div>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    const mockUsers: UserWithActivity[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@practicelink.com',
        role: 'provider-relations-coordinator',
        isEmailVerified: true,
        createdAt: '2024-01-15T10:00:00Z',
        lastActivity: '2024-12-20T14:30:00Z',
        status: 'active',
        loginCount: 45,
        registrationDate: '2024-01-15T10:00:00Z',
        supportTickets: 2
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@practicelink.com',
        role: 'provider-relations-coordinator',
        isEmailVerified: true,
        createdAt: '2024-02-10T09:15:00Z',
        lastActivity: '2024-12-19T16:45:00Z',
        status: 'active',
        loginCount: 32,
        registrationDate: '2024-02-10T09:15:00Z',
        supportTickets: 0
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@practicelink.com',
        role: 'administrator',
        isEmailVerified: true,
        createdAt: '2024-01-05T08:00:00Z',
        lastActivity: '2024-12-20T12:00:00Z',
        status: 'active',
        loginCount: 78,
        registrationDate: '2024-01-05T08:00:00Z',
        supportTickets: 1
      },
      {
        id: '4',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@practicelink.com',
        role: 'provider-relations-coordinator',
        isEmailVerified: false,
        createdAt: '2024-12-18T14:20:00Z',
        lastActivity: '2024-12-18T14:20:00Z',
        status: 'inactive',
        loginCount: 1,
        registrationDate: '2024-12-18T14:20:00Z',
        supportTickets: 3
      },
      {
        id: '5',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@practicelink.com',
        role: 'provider-relations-coordinator',
        isEmailVerified: true,
        createdAt: '2024-03-20T11:30:00Z',
        lastActivity: '2024-11-15T10:00:00Z',
        status: 'suspended',
        loginCount: 15,
        registrationDate: '2024-03-20T11:30:00Z',
        supportTickets: 5
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBookmark = () => {
    if (!isBookmarked) {
      addBookmark('User Management', '/user-management', 'Administration');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const handleEditUser = (user: UserWithActivity) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'suspended' as const } : u
    ));
  };

  const handleActivateUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'active' as const } : u
    ));
  };

  const handleBulkAction = (action: string) => {
    const selectedUsersList = users.filter(u => selectedUsers.has(u.id));
    
    switch (action) {
      case 'suspend':
        setUsers(prev => prev.map(u => 
          selectedUsers.has(u.id) ? { ...u, status: 'suspended' as const } : u
        ));
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          selectedUsers.has(u.id) ? { ...u, status: 'active' as const } : u
        ));
        break;
      case 'export':
        // Create CSV content
        const csvContent = [
          ['Name', 'Email', 'Role', 'Status', 'Last Activity', 'Login Count', 'Support Tickets'],
          ...selectedUsersList.map(u => [
            `${u.firstName} ${u.lastName}`,
            u.email,
            u.role,
            u.status,
            new Date(u.lastActivity).toLocaleDateString(),
            u.loginCount.toString(),
            u.supportTickets.toString()
          ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        break;
      case 'message':
        alert(`Sending message to ${selectedUsersList.length} users...`);
        break;
    }
    
    setSelectedUsers(new Set());
    setShowBulkActions(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suspended':
        return <Ban className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    return role === 'administrator' ? 
      <ShieldCheck className="w-4 h-4 text-purple-500" /> : 
      <Users className="w-4 h-4 text-blue-500" />;
  };

  if (loading) {
    return (
      <Layout breadcrumbs={[{ label: 'User Management' }]}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'User Management' }
    ]}>
      <div className="flex-1 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage users, roles, and provide support oversight</p>
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
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Support Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((sum, u) => sum + u.supportTickets, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Ban className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="filterRole" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                id="filterRole"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="administrator">Administrator</option>
                <option value="provider-relations-coordinator">Coordinator</option>
              </select>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                <span className="text-sm text-gray-500">
                  {filteredUsers.length} of {users.length} users
                </span>
              </div>
              
              {selectedUsers.size > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {selectedUsers.size} selected
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
                            onClick={() => handleBulkAction('activate')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <CheckCircle className="w-4 h-4 mr-3" />
                            Activate Users
                          </button>
                          <button
                            onClick={() => handleBulkAction('suspend')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Ban className="w-4 h-4 mr-3" />
                            Suspend Users
                          </button>
                          <button
                            onClick={() => handleBulkAction('message')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <MessageSquare className="w-4 h-4 mr-3" />
                            Send Message
                          </button>
                          <button
                            onClick={() => handleBulkAction('export')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Download className="w-4 h-4 mr-3" />
                            Export Selected
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {filteredUsers.length > 0 && (
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Select All ({filteredUsers.length})
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Support
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="flex items-center mt-1">
                            {user.isEmailVerified ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Unverified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className="ml-2 text-sm text-gray-900">
                          {user.role === 'administrator' ? 'Administrator' : 'Coordinator'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {new Date(user.lastActivity).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.loginCount} logins
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{user.supportTickets}</span>
                        {user.supportTickets > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Needs Attention
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Sending message to ${user.firstName} ${user.lastName}...`)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        {user.status === 'suspended' ? (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
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