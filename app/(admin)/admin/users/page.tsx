'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
  created_at: string;
}

export default function UsersPage() {
  const { user: currentUser, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadUsers = async () => {
    try {
      const response = await api.get<{ data: User[] }>('/users');
      setUsers(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setPageLoading(false);
    }
  };

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await api.post('/users', formData);
      setSuccessMessage('User created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
      });
      setShowCreateForm(false);
      await loadUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError?.[0] || 'Creation failed');
      } else {
        setError(err.response?.data?.message || 'Creation failed');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setSuccessMessage('User deleted successfully!');
      await loadUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {showCreateForm ? 'Cancel' : 'Create User'}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-300">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New User</h2>

          <form onSubmit={handleCreateUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min 8 chars, uppercase, lowercase, number"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
            >
              {isSaving ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{u.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          u.is_admin
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/admin/users/${u.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Edit
                      </Link>
                      {currentUser?.id !== u.id && (
                        <>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:text-red-700 font-semibold"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
