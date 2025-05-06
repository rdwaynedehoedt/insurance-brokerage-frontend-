'use client';

import { useState } from 'react';
import { 
  Users, 
  LogOut,
  Plus,
  Search,
  Filter,
  ChevronRight,
  UserPlus,
  X,
  CheckCircle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

export default function AdminDashboard() {
  const [users] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Administrator', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Underwriter', status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Sales Personnel', status: 'inactive' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'Administrator',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual user creation logic
      console.log('Form submitted:', formData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form and hide after 2 seconds
      setTimeout(() => {
        setShowForm(false);
        setShowSuccess(false);
        setFormData({
          name: '',
          email: '',
          role: 'Administrator',
          password: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-orange-700 font-sans">
              Admin Panel
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <a href="#" className="flex items-center px-4 py-3 text-gray-700 bg-orange-50 rounded-lg border border-orange-100 group">
              <Users className="w-5 h-5 mr-3 text-orange-700" />
              <span className="font-medium font-sans">Users</span>
              <ChevronRight className="w-4 h-4 ml-auto text-orange-700" />
            </a>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-100 group"
            >
              <UserPlus className="w-5 h-5 mr-3 text-gray-500 group-hover:text-orange-700" />
              <span className="font-medium font-sans">Add User</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-orange-700" />
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-orange-50 rounded-lg border border-transparent hover:border-orange-100 group">
              <LogOut className="w-5 h-5 mr-3 text-gray-500 group-hover:text-orange-700" />
              <span className="font-medium font-sans">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 font-sans">User Management</h2>
          <p className="text-gray-600 font-sans">Manage system users and their roles</p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2.5 bg-orange-700 text-white rounded-lg hover:bg-orange-800 shadow-sm font-sans"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add User
            </button>
            <button className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-orange-50 shadow-sm font-sans">
              <Filter className="w-5 h-5 mr-2 text-orange-700" />
              Filter
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-700 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent w-64 hover:border-orange-300 font-sans"
            />
          </div>
        </div>

        {/* Add User Form */}
        {showForm && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 font-sans">Add New User</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center text-green-700 font-sans">
                <CheckCircle className="w-5 h-5 mr-2" />
                User created successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 font-sans">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent font-sans ${
                      errors.name ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 font-sans">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-sans">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent font-sans ${
                      errors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 font-sans">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1 font-sans">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent font-sans ${
                      errors.role ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Underwriter">Underwriter</option>
                    <option value="Sales Personnel">Sales Personnel</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600 font-sans">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-sans">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-700 focus:border-transparent font-sans ${
                      errors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 font-sans">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-orange-50 font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-orange-700 text-white rounded-lg hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider font-sans">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider font-sans">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider font-sans">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider font-sans">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-orange-800 uppercase tracking-wider font-sans">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-orange-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-sans">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-sans">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-sans">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-50 text-green-700 border border-green-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    } font-sans`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-orange-700 hover:text-orange-800 mr-4 font-sans">Edit</button>
                    <button className="text-red-600 hover:text-red-800 font-sans">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 