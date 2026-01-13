import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(username, password);
        
        if (result.success) {
            navigate('/'); // Navigate to home, which will redirect based on role in DashboardLayout or App
        } else {
            setError(result.message || 'Login failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background-color)] px-4">
            <div className="w-full max-w-md bg-[var(--surface-color)] p-8 rounded-2xl shadow-xl border border-[#333]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-[var(--text-secondary)]">Sign in to continue to ClientX</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Enter your username"
                        required
                    />
                    <Input 
                        label="Password" 
                        type="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter your password"
                        required
                    />

                    <Button 
                        type="submit" 
                        className="w-full mt-2" 
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader size={20} className="text-white" /> : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Don't have an account?{' '}

                </div>
            </div>
        </div>
    );
};

export default Login;
