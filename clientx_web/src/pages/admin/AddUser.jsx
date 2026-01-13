import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await adminApi.createUser(formData);
      if (result.success) {
        navigate('/admin/users');
      } else {
        setError(result.message || 'Failed to create user');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-color)] px-4">
      <div className="w-full max-w-md bg-[var(--surface-color)] p-8 rounded-2xl shadow-xl border border-[#333]">
        <h1 className="text-3xl font-bold text-white mb-4">Add New User</h1>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[var(--surface-color)] border border-[#333] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6200ea]"
            >
              <option value="client">Client</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? <Loader size={20} className="text-white" /> : 'Create User'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
