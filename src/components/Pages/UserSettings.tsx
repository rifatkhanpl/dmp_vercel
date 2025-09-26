import React, { useState } from 'react';
import { Layout } from '../Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Settings, 
  User, 
  Shield, 
  Stethoscope,
  Plus,
  X,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Assignment {
  id: string;
  type: 'profession' | 'specialty' | 'subspecialty' | 'state';
  name: string;
  category?: string;
}

export function UserSettings() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: '1', type: 'profession', name: 'Physician' },
    { id: '2', type: 'profession', name: 'Nurse Practitioner' },
    { id: '3', type: 'specialty', name: 'Internal Medicine', category: 'Primary Care' },
    { id: '4', type: 'specialty', name: 'Emergency Medicine', category: 'Hospital-Based' },
    { id: '5', type: 'subspecialty', name: 'Cardiology', category: 'Internal Medicine' },
    { id: '6', type: 'state', name: 'California' },
    { id: '7', type: 'state', name: 'New York' },
    title: 'HCP Data Coordinator',

  const [newAssignment, setNewAssignment] = useState({
    type: 'profession' as 'profession' | 'specialty' | 'subspecialty' | 'state',
    name: '',
    category: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const professionOptions = [
    'Physician (MD/DO)',
    'Nurse Practitioner',
    'Physician Assistant',
    'Registered Nurse',
    'Pharmacist',
    'Physical Therapist',
    'Occupational Therapist',
    'Speech Therapist'
  ];

  const specialtyOptions = [
    { name: 'Internal Medicine', category: 'Primary Care' },
    { name: 'Family Medicine', category: 'Primary Care' },
    { name: 'Pediatrics', category: 'Primary Care' },
    { name: 'Emergency Medicine', category: 'Hospital-Based' },
    { name: 'Anesthesiology', category: 'Hospital-Based' },
    { name: 'Radiology', category: 'Hospital-Based' },
    { name: 'Surgery', category: 'Surgical' },
    { name: 'Orthopedic Surgery', category: 'Surgical' },
    { name: 'Cardiology', category: 'Specialty' },
    { name: 'Neurology', category: 'Specialty' },
    { name: 'Psychiatry', category: 'Mental Health' },
    { name: 'Dermatology', category: 'Specialty' }
  ];

  const subspecialtyOptions = [
    { name: 'Interventional Cardiology', category: 'Cardiology' },
    { name: 'Electrophysiology', category: 'Cardiology' },
    { name: 'Gastroenterology', category: 'Internal Medicine' },
    { name: 'Pulmonology', category: 'Internal Medicine' },
    { name: 'Endocrinology', category: 'Internal Medicine' },
    { name: 'Pediatric Surgery', category: 'Surgery' },
    { name: 'Vascular Surgery', category: 'Surgery' },
    { name: 'Neuro Surgery', category: 'Surgery' }
  ];

  const stateOptions = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const handleAddAssignment = () => {
    if (!newAssignment.name.trim()) return;

    const assignment: Assignment = {
      id: Date.now().toString(),
      type: newAssignment.type,
      name: newAssignment.name,
      category: newAssignment.category || undefined
    };

    setAssignments(prev => [...prev, assignment]);
    setNewAssignment({ type: 'profession', name: '', category: '' });
    setShowAddForm(false);
    setMessage({ type: 'success', text: 'Assignment added successfully' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRemoveAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    setMessage({ type: 'success', text: 'Assignment removed successfully' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    setMessage({ type: 'success', text: 'Settings saved successfully' });
    setTimeout(() => setMessage(null), 3000);
  };

  const getAssignmentsByType = (type: string) => {
    return assignments.filter(a => a.type === type);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'profession':
        return 'bg-blue-100 text-blue-800';
      case 'specialty':
        return 'bg-green-100 text-green-800';
      case 'subspecialty':
        return 'bg-purple-100 text-purple-800';
      case 'state':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOptions = () => {
    switch (newAssignment.type) {
      case 'profession':
        return professionOptions.map(p => ({ name: p, category: '' }));
      case 'specialty':
        return specialtyOptions;
      case 'subspecialty':
        return subspecialtyOptions;
      default:
        return [];
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="h-6 w-6 mr-3" />
                User Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your assigned professions, specialties, and subspecialties
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{user?.firstName} {user?.lastName}</span>
              <span className="text-gray-400">•</span>
              <Shield className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 capitalize">
                {user?.role === 'administrator' ? 'Administrator' : 'Coordinator'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`p-4 rounded-md flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Current Assignments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Current Assignments</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Assignment</span>
            </button>
          </div>

          {/* Add Assignment Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-md font-medium text-gray-900 mb-4">Add New Assignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <select
                    value={newAssignment.name}
                    onChange={(e) => {
                      const selected = professionOptions.find(p => p === e.target.value);
                      setNewAssignment(prev => ({ 
                        ...prev, 
                        type: 'profession',
                        name: e.target.value,
                        category: ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select profession</option>
                    {professionOptions.map((profession, index) => (
                      <option key={index} value={profession}>
                        {profession}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <select
                    value={newAssignment.type === 'specialty' ? newAssignment.name : ''}
                    onChange={(e) => {
                      const selected = specialtyOptions.find(s => s.name === e.target.value);
                      setNewAssignment(prev => ({ 
                        ...prev, 
                        type: 'specialty',
                        name: e.target.value,
                        category: selected?.category || ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select specialty</option>
                    {specialtyOptions.map((option, index) => (
                      <option key={index} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subspecialty</label>
                  <select
                    value={newAssignment.type === 'subspecialty' ? newAssignment.name : ''}
                    onChange={(e) => {
                      const selected = subspecialtyOptions.find(s => s.name === e.target.value);
                      setNewAssignment(prev => ({ 
                        ...prev, 
                        type: 'subspecialty',
                        name: e.target.value,
                        category: selected?.category || ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select subspecialty</option>
                    {subspecialtyOptions.map((option, index) => (
                      <option key={index} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={newAssignment.type === 'state' ? newAssignment.name : ''}
                    onChange={(e) => {
                      setNewAssignment(prev => ({ 
                        ...prev, 
                        type: 'state',
                        name: e.target.value,
                        category: ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select state</option>
                    {stateOptions.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddAssignment}
                  disabled={!newAssignment.name || !newAssignment.type}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Assignment
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAssignment({ type: 'profession', name: '', category: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Assignments by Type */}
          <div className="space-y-6">
            {/* Professions */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Professions</h3>
              <div className="flex flex-wrap gap-2">
                {getAssignmentsByType('profession').map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(assignment.type)}`}
                  >
                    <span>{assignment.name}</span>
                    <button
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {getAssignmentsByType('profession').length === 0 && (
                  <p className="text-sm text-gray-500 italic">No professions assigned</p>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {getAssignmentsByType('specialty').map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(assignment.type)}`}
                  >
                    <span>{assignment.name}</span>
                    {assignment.category && (
                      <span className="ml-1 text-xs opacity-75">({assignment.category})</span>
                    )}
                    <button
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {getAssignmentsByType('specialty').length === 0 && (
                  <p className="text-sm text-gray-500 italic">No specialties assigned</p>
                )}
              </div>
            </div>

            {/* Subspecialties */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Subspecialties</h3>
              <div className="flex flex-wrap gap-2">
                {getAssignmentsByType('subspecialty').map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(assignment.type)}`}
                  >
                    <span>{assignment.name}</span>
                    {assignment.category && (
                      <span className="ml-1 text-xs opacity-75">({assignment.category})</span>
                    )}
                    <button
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {getAssignmentsByType('subspecialty').length === 0 && (
                  <p className="text-sm text-gray-500 italic">No subspecialties assigned</p>
                )}
              </div>
            </div>
          </div>
            {/* States */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">States</h3>
              <div className="flex flex-wrap gap-2">
                {getAssignmentsByType('state').map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(assignment.type)}`}
                  >
                    <span>{assignment.name}</span>
                    <button
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {getAssignmentsByType('state').length === 0 && (
                  <p className="text-sm text-gray-500 italic">No states assigned</p>
                )}
              </div>
            </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>

        {/* Admin Section */}
        {user?.role === 'administrator' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Administrator Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/user-management"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900 mb-2">Manage User Assignments</h3>
                <p className="text-sm text-gray-600">
                  Assign professions, specialties, and subspecialties to users
                </p>
              </a>
              <a
                href="/assignment-templates"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900 mb-2">Assignment Templates</h3>
                <p className="text-sm text-gray-600">
                  Create and manage assignment templates for different roles
                </p>
              </a>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}