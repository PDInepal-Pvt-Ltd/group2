import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        user_type: 'client' // Default role
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            user_type: formData.user_type
        };

        const result = await register(userData);
        
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message || 'Registration failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background-color)] px-4 py-8">
            <div className="w-full max-w-md bg-[var(--surface-color)] p-8 rounded-2xl shadow-xl border border-[#333]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent mb-2">
                        Create Account
                    </h1>
                    <p className="text-[var(--text-secondary)]">Join ClientX today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Username" 
                        name="username"
                        value={formData.username} 
                        onChange={handleChange} 
                        placeholder="Choose a username"
                        required
                    />
                    <Input 
                        label="Email" 
                        type="email"
                        name="email"
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Enter your email"
                        required
                    />
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                            I am a...
                        </label>
                        <select 
                            name="user_type"
                            value={formData.user_type} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-[var(--surface-color)] border border-[#333] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6200ea]"
                        >
                            <option value="client">Client</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>

                    <Input 
                        label="Password" 
                        type="password"
                        name="password"
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="Create a password"
                        required
                    />
                    <Input 
                        label="Confirm Password" 
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        placeholder="Confirm your password"
                        required
                    />

                    <Button 
                        type="submit" 
                        className="w-full mt-4" 
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader size={20} className="text-white" /> : 'Register'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--secondary-color)] hover:underline font-medium">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
