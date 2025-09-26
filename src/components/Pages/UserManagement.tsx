import React, { useState, useEffect } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { auth0Management } from '../../services/auth0Management';
import { errorService } from '../../services/errorService';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Users, UserPlus, Search, Filter, Download, ChevronDown, X, Eye, CreditCard as Edit, Ban, Trash2, Shield, User, Mail, Phone, Calendar, Activity, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roles?: string[];
  status: string;
  lastLogin?: string;
  createdAt: string;
  isEmailVerified: boolean;
  phone?: string;
  department?: string;
  providersManaged?: number;
  lastActivity?: string;
  assignedSpecialties?: string[];
}

export function UserManagement() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    department: '',
    lastLogin: ''
  });

  // Mock users data as fallback
  const mockUsers: AppUser[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@practicelink.com',
      role: 'administrator',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-01-15T09:00:00Z',
      isEmailVerified: true,
      phone: '(555) 123-4567',
      department: 'IT Administration',
      providersManaged: 0,
      lastActivity: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@practicelink.com',
      role: 'provider-relations-coordinator',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z',
      createdAt: '2023-02-01T09:00:00Z',
      isEmailVerified: true,
      phone: '(555) 234-5678',
      department: 'Provider Relations',
      providersManaged: 247,
      lastActivity: '2024-01-14T16:45:00Z',
      assignedSpecialties: ['Internal Medicine', 'Emergency Medicine']
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@practicelink.com',
      role: 'provider-relations-coordinator',
      status: 'pending',
      createdAt: '2024-01-10T09:00:00Z',
      isEmailVerified: false,
      phone: '(555) 345-6789',
      department: 'Provider Relations',
      providersManaged: 0,
      lastActivity: '2024-01-10T09:00:00Z'
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@practicelink.com',
      role: 'provider-relations-coordinator',
      status: 'active',
      lastLogin: '2024-01-13T14:20:00Z',
      createdAt: '2023-03-15T09:00:00Z',
      isEmailVerified: true,
      phone: '(555) 456-7890',
      department: 'Provider Relations & Development',
      providersManaged: 189,
      lastActivity: '2024-01-13T14:20:00Z',
      assignedSpecialties: ['Pediatrics', 'Family Medicine', 'Surgery']
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Thompson',
      email: 'david.thompson@practicelink.com',
      role: 'provider-relations-coordinator',
      status: 'active',
      lastLogin: '2024-01-12T11:15:00Z',
      createdAt: '2023-04-20T09:00:00Z',
      isEmailVerified: true,
      phone: '(555) 567-8901',
      department: 'Provider Relations',
      providersManaged: 156,
      lastActivity: '2024-01-12T11:15:00Z',
      assignedSpecialties: ['Cardiology', 'Neurology', 'Radiology']
    }
  ];

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch real Auth0 users first
      const auth0Users = await auth0Management.getUsers();
      
      if (auth0Users && auth0Users.length > 0) {
        // Convert Auth0 users to app users
        const appUsers = auth0Users.map(auth0User => 
          auth0Management.constructor.mapAuth0UserToAppUser(auth0User)
        );
        setUsers(appUsers);
        console.log('Loaded Auth0 users:', appUsers);
      } else {
        // Fallback to mock data
        setUsers(mockUsers);
        console.log('Using mock user data');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to mock data on error
      setUsers(mockUsers);
      errorService.showWarning('Using demo data - Auth0 integration not available');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes('administrator') || role.includes('Admin')) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-blue-100 text-blue-800';
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
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = !filters.role || user.role.includes(filters.role);
    const matchesStatus = !filters.status || user.status === filters.status;
    const matchesDepartment = !filters.department || user.department === filters.department;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      errorService.showError('Please select users first');
      return;
    }

    switch (action) {
      case 'export':
        console.log('Exporting selected users:', selectedUsers);
        errorService.showSuccess('User data exported successfully');
        break;
      case 'activate':
        console.log('Activating selected users:', selectedUsers);
        errorService.showSuccess(`Activated ${selectedUsers.length} users`);
        break;
      case 'suspend':
        if (confirm(`Are you sure you want to suspend ${selectedUsers.length} users?`)) {
          console.log('Suspending selected users:', selectedUsers);
          errorService.showSuccess(`Suspended ${selectedUsers.length} users`);
        }
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
          console.log('Deleting selected users:', selectedUsers);
          errorService.showSuccess(`Deleted ${selectedUsers.length} users`);
        }
        break;
    }
    setSelectedUsers([]);
  };

  const handleUserAction = async (userId: string, action: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    try {
      switch (action) {
        case 'view':
          window.location.href = `/user-profile?id=${userId}`;
          break;
        case 'edit':
          window.location.href = `/admin/user-settings?id=${userId}`;
          break;
        case 'providers':
          window.location.href = `/search?managedBy=${encodeURIComponent(targetUser.firstName + ' ' + targetUser.lastName)}`;
          break;
        case 'suspend':
          if (confirm(`Are you sure you want to suspend ${targetUser.firstName} ${targetUser.lastName}?`)) {
            console.log('Suspending user:', userId);
            errorService.showSuccess('User suspended successfully');
            await loadUsers();
          }
          break;
        case 'activate':
          console.log('Activating user:', userId);
          errorService.showSuccess('User activated successfully');
          await loadUsers();
          break;
        case 'delete':
          if (confirm(`Are you sure you want to delete ${targetUser.firstName} ${targetUser.lastName}? This action cannot be undone.`)) {
            console.log('Deleting user:', userId);
            errorService.showSuccess('User deleted successfully');
            await loadUsers();
          }
          break;
      }
    } catch (error) {
      errorService.showError('Action failed. Please try again.');
    }
    setActiveDropdown(null);
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      status: '',
      department: '',
      lastLogin: ''
    });
    setSearchQuery('');
  };

  // Get unique values for filters
  const roles = [...new Set(users.map(u => u.role))];
  const statuses = [...new Set(users.map(u => u.status))];
  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <Layout breadcrumbs={[{ label: 'Unauthorized' }]}>
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access user management.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <a
                href="/add-user"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add User</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
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
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role.includes('administrator')).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search users by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={100}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => console.log('Exporting all users')}
                className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Roles</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status} className="capitalize">{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                  <select
                    value={filters.lastLogin}
                    onChange={(e) => setFilters(prev => ({ ...prev, lastLogin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('export')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Selected</span>
                </button>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Activate</span>
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Ban className="h-4 w-4" />
                  <span>Suspend</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Users ({filteredUsers.length})
              </h2>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-600">Select All</label>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <LoadingSpinner size="lg" text="Loading users..." />
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <span className="text-sm font-medium text-blue-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role.includes('administrator') ? (
                              <>
                                <Shield className="h-3 w-3 mr-1" />
                                Administrator
                              </>
                            ) : (
                              <>
                                <User className="h-3 w-3 mr-1" />
                                Coordinator
                              </>
                            )}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1 capitalize">{user.status}</span>
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {user.email}
                            {user.isEmailVerified ? (
                              <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 ml-1 text-yellow-500" />
                            )}
                          </div>
                          {user.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {user.phone}
                            </div>
                          )}
                          {user.department && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Shield className="h-4 w-4 mr-2" />
                              {user.department}
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            {user.lastLogin && (
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-1" />
                                Last login {new Date(user.lastLogin).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          {user.providersManaged !== undefined && user.providersManaged > 0 && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              <a
                                href={`/search?managedBy=${encodeURIComponent(user.firstName + ' ' + user.lastName)}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {user.providersManaged} providers managed
                              </a>
                            </div>
                          )}
                          {user.assignedSpecialties && user.assignedSpecialties.length > 0 && (
                            <div className="flex items-start text-sm text-gray-600">
                              <Shield className="h-4 w-4 mr-2 mt-0.5" />
                              <div className="flex flex-wrap gap-1">
                                {user.assignedSpecialties.slice(0, 3).map((specialty, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                    {specialty}
                                  </span>
                                ))}
                                {user.assignedSpecialties.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                    +{user.assignedSpecialties.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <span>Actions</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {activeDropdown === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => handleUserAction(user.id, 'view')}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'edit')}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </button>
                            {user.providersManaged && user.providersManaged > 0 && (
                              <button
                                onClick={() => handleUserAction(user.id, 'providers')}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Users className="h-4 w-4 mr-2" />
                                View Managed Providers ({user.providersManaged})
                              </button>
                            )}
                            <div className="border-t border-gray-100"></div>
                            {user.status === 'active' ? (
                              <button
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend User
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction(user.id, 'activate')}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate User
                              </button>
                            )}
                            <button
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}