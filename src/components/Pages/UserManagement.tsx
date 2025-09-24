import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { auth0Management, Auth0ManagementService } from '../../services/auth0Management';
import { 
  Users,
  User as UserIcon,
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
  AlertCircle,
  CheckCircle,
  Clock,
  Ban,
  Eye,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Changed to accept any string to show exact Auth0 roles
  roles: string[]; // Added to store all Auth0 roles
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin: string;
  createdAt: string;
  isEmailVerified: boolean;
  phone?: string;
  department?: string;
  providersManaged: number;
  lastActivity: string;
  assignedSpecialties?: string[];
}

export function UserManagement() {
  const { getAccessToken } = useAuth();
  const [showAuth0Notice, setShowAuth0Notice] = useState(false);
  const [isLoadingAuth0, setIsLoadingAuth0] = useState(true);
  const [auth0Error, setAuth0Error] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch Auth0 users on mount
  useEffect(() => {
    const fetchAuth0Users = async () => {
      try {
        setIsLoadingAuth0(true);
        setAuth0Error(null);

        const auth0Users = await auth0Management.getUsers(0, 100);

        if (auth0Users && auth0Users.length > 0) {
          // Map Auth0 users to our User format
          const mappedUsers = auth0Users.map((auth0User: any) =>
            Auth0ManagementService.mapAuth0UserToAppUser(auth0User)
          );

          console.log('Fetched and mapped Auth0 users:', mappedUsers);
          setUsers(mappedUsers);
        } else {
          console.log('No Auth0 users found');
          setUsers([]);
        }
      } catch (error) {
        console.error('Failed to fetch Auth0 users:', error);
        setAuth0Error(error instanceof Error ? error.message : 'Failed to fetch Auth0 users');
        setUsers([]); // Show empty list on error
      } finally {
        setIsLoadingAuth0(false);
      }
    };

    fetchAuth0Users();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'suspended':
        return <Ban className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.roles?.includes(roleFilter) || (roleFilter === 'No Role' && user.roles?.length === 0);
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserAction = (userId: string, action: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'activate':
            return { ...user, status: 'active' as const };
          case 'suspend':
            return { ...user, status: 'suspended' as const };
          case 'deactivate':
            return { ...user, status: 'inactive' as const };
          default:
            return user;
        }
      }
      return user;
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Layout breadcrumbs={[{ label: 'User Management' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingAuth0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800">Loading Auth0 users...</span>
            </div>
          </div>
        )}

        {/* Auth0 Error */}
        {auth0Error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading Auth0 users</h3>
                <p className="mt-1 text-sm text-red-700">{auth0Error}</p>
                <p className="mt-2 text-xs text-red-600">No users will be displayed until Auth0 connection is fixed. Check console for details.</p>
              </div>
            </div>
          </div>
        )}

        {/* Auth0 Integration Notice */}
        {showAuth0Notice && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-amber-800">Auth0 Management API Integration</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>To display real Auth0 users, you need to set up a backend API that connects to Auth0's Management API.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Auth0 Management API requires server-side authentication</li>
                    <li>Create backend endpoints to proxy Auth0 Management API calls</li>
                    <li>Never expose Management API credentials in frontend code</li>
                  </ul>
                  <div className="mt-3">
                    <p className="font-medium">Required backend endpoints:</p>
                    <code className="block mt-1 text-xs bg-amber-100 p-2 rounded">
                      GET /api/auth0/users - List users<br/>
                      GET /api/auth0/users/:id - Get user details<br/>
                      PATCH /api/auth0/users/:id - Update user<br/>
                      DELETE /api/auth0/users/:id - Delete user
                    </code>
                  </div>
                  <p className="mt-3 text-xs">Currently showing mock data. Once backend is configured, real Auth0 users will appear here.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setShowAuth0Notice(false)}
                    className="text-sm font-medium text-amber-800 hover:text-amber-900"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => u.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.roles?.includes('superadminudb') || u.roles?.includes('administrator')).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="superadminudb">Super Admin</option>
                    <option value="administrator">Administrator</option>
                    <option value="provider-relations-coordinator">Provider Relations Coordinator</option>
                    <option value="No Role">No Role</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h2>
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
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Providers
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.roles?.includes('superadminudb') || user.roles?.includes('administrator') ? (
                          <ShieldCheck className="h-4 w-4 text-purple-600 mr-2" />
                        ) : (
                          <Users className="h-4 w-4 text-blue-600 mr-2" />
                        )}
                        <span className="text-sm text-gray-900">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.providersManaged > 0 ? (
                        <a 
                          href={`/search?managedBy=${encodeURIComponent(user.firstName + ' ' + user.lastName)}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                          title={`View ${user.providersManaged} providers managed by ${user.firstName} ${user.lastName}`}
                        >
                          {user.providersManaged}
                        </a>
                      ) : (
                        <span className="text-gray-400">{user.providersManaged}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <a
                          href={`/user-profile?id=${user.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <UserIcon className="h-4 w-4" />
                        </a>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl font-medium text-blue-600">
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <p className="text-gray-600 capitalize">
                      {selectedUser.role.replace(/-/g, ' ')}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                      {getStatusIcon(selectedUser.status)}
                      <span className="ml-1 capitalize">{selectedUser.status}</span>
                    </span>
                  </div>
                </div>

                {/* Activity Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Login</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedUser.lastLogin)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Activity</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedUser.lastActivity)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Providers Managed</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.providersManaged}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  {selectedUser.status === 'active' && (
                    <button
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'suspend');
                        setShowUserModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Suspend User
                    </button>
                  )}
                  {selectedUser.status === 'suspended' && (
                    <button
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'activate');
                        setShowUserModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Activate User
                    </button>
                  )}
                  {selectedUser.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'activate');
                        setShowUserModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Approve User
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Edit User
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}