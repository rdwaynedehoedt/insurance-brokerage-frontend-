'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { 
  Users, 
  FileText, 
  UserPlus,
  ShieldCheck
} from 'lucide-react';

// Import our components
import Header from './components/Header';
import Sidebar, { TabType } from './components/Sidebar';
import StatsGrid from './components/StatsGrid';
import UserTable from './components/UserTable';
import UserForm, { UserFormData } from './components/UserForm';
import { User } from './components/UserTable';
import { StatCardData } from './components/StatsGrid';

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  
  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Mock data
  const users: User[] = [
    { 
      id: '1', 
      email: 'john@example.com', 
      first_name: 'John',
      last_name: 'Doe',
      role: 'Administrator', 
      phone_number: '+1234567890',
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:00:00Z',
      is_active: true,
      last_login: '2024-03-20T10:00:00Z'
    },
    { 
      id: '2', 
      email: 'jane@example.com', 
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'Underwriter', 
      phone_number: '+1234567891',
      created_at: '2024-03-19T10:00:00Z',
      updated_at: '2024-03-19T10:00:00Z',
      is_active: true,
      last_login: '2024-03-19T10:00:00Z'
    },
    { 
      id: '3', 
      email: 'mike@example.com', 
      first_name: 'Mike',
      last_name: 'Johnson',
      role: 'Sales Personnel', 
      phone_number: '+1234567892',
      created_at: '2024-03-18T10:00:00Z',
      updated_at: '2024-03-18T10:00:00Z',
      is_active: false,
      last_login: '2024-03-18T10:00:00Z'
    },
    { 
      id: '4', 
      email: 'sarah@example.com', 
      first_name: 'Sarah',
      last_name: 'Parker',
      role: 'Underwriter', 
      phone_number: '+1234567893',
      created_at: '2024-03-17T10:00:00Z',
      updated_at: '2024-03-17T10:00:00Z',
      is_active: true,
      last_login: '2024-03-17T10:00:00Z'
    },
    { 
      id: '5', 
      email: 'robert@example.com', 
      first_name: 'Robert',
      last_name: 'Wilson',
      role: 'Sales Personnel', 
      phone_number: '+1234567894',
      created_at: '2024-03-16T10:00:00Z',
      updated_at: '2024-03-16T10:00:00Z',
      is_active: true,
      last_login: '2024-03-16T10:00:00Z'
    },
  ];
  
  // Count sales personnel
  const salesPersonnelCount = users.filter(user => user.role === 'Sales Personnel').length;
  
  // Stats cards data
  const statCards: StatCardData[] = [
    { 
      title: 'Total Users', 
      value: 156, 
      change: 12.5, 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Active Policies', 
      value: 532, 
      change: 8.2, 
      icon: FileText, 
      color: 'bg-green-500' 
    },
    { 
      title: 'New Clients', 
      value: 24, 
      change: -3.6, 
      icon: UserPlus, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Sales Personnel', 
      value: salesPersonnelCount, 
      change: 10.0, 
      icon: ShieldCheck, 
      color: 'bg-amber-500' 
    }
  ];
  
  // Handlers
  const handleLogout = () => {
    logout();
  };
  
  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
    setActiveTab('users');
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
    setActiveTab('users');
  };
  
  const handleDeleteUser = (user: User) => {
    // In a real app, implement confirmation dialog and API call
    console.log('Deleting user:', user);
  };
  
  const handleSubmitUser = async (formData: UserFormData) => {
    // In a real app, this would make an API call
    console.log('Form submitted:', formData);
    // Mock successful submission by resolving after a delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
      />

      <main className={`pt-16 ${isSidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Welcome to your admin dashboard</p>
              </div>
              
              <StatsGrid stats={statCards} />
              
              <div className="mt-8">
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={handleAddUser}
                    className="flex items-center px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add User
                  </button>
                </div>
                <UserTable 
                  users={users} 
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              </div>
            </>
          )}
          
          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                  <p className="text-gray-600">Manage system users and their permissions</p>
                </div>
                {!showUserForm && (
                  <button 
                    onClick={handleAddUser}
                    className="flex items-center px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add User
                  </button>
                )}
              </div>
              
              {showUserForm ? (
                <UserForm 
                  onSubmit={handleSubmitUser}
                  onCancel={() => setShowUserForm(false)}
                  initialData={editingUser ? {
                    email: editingUser.email,
                    first_name: editingUser.first_name,
                    last_name: editingUser.last_name,
                    role: editingUser.role,
                    phone_number: editingUser.phone_number,
                    password: '',
                  } : undefined}
                  isEdit={!!editingUser}
                />
              ) : (
                <UserTable 
                  users={users} 
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}
            </>
          )}
          
          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="flex flex-col items-center justify-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Policy Management</h1>
              <p className="text-gray-600 mb-8">This page is under development.</p>
              <div className="p-8 bg-white shadow-md rounded-lg border border-gray-200">
                <p className="text-center text-gray-500">
                  The policy management interface will be available soon.
                </p>
              </div>
            </div>
          )}
          
          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="flex flex-col items-center justify-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Reports</h1>
              <p className="text-gray-600 mb-8">This page is under development.</p>
              <div className="p-8 bg-white shadow-md rounded-lg border border-gray-200">
                <p className="text-center text-gray-500">
                  The reporting interface will be available soon.
                </p>
              </div>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="flex flex-col items-center justify-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
              <p className="text-gray-600 mb-8">This page is under development.</p>
              <div className="p-8 bg-white shadow-md rounded-lg border border-gray-200">
                <p className="text-center text-gray-500">
                  The settings interface will be available soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 