import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService, { User, CreateUserDTO, UpdateUserDTO } from '../../services/userService';

interface UserFormProps {
  user?: User;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher';
}

const UserForm: React.FC<UserFormProps> = ({ user, mode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'teacher',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'create') {
        const createData: CreateUserDTO = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };
        await userService.create(createData);
      } else if (user) {
        const updateData: UpdateUserDTO = {
          name: formData.name,
          role: formData.role,
        };
        await userService.update(user._id, updateData);
      }
      navigate('/admin/users');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Create New User' : 'Edit User'}
      </h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={mode === 'edit'}
          />
        </div>
        {mode === 'create' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'teacher' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {mode === 'create' ? 'Create' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; 