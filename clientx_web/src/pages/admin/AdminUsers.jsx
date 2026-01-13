import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { Plus, Search, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminApi.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader className="h-full" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <Button className="flex items-center gap-2">
                    <Plus size={20} />
                    <span>Add User</span>
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden">
                <div className="p-4 border-b border-[#333]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-[#121212] rounded-lg text-sm border border-[#333] focus:outline-none focus:border-[var(--primary-color)] w-full md:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#121212] text-[var(--text-secondary)] text-sm uppercase">
                                <th className="p-4 font-medium border-y border-[#333]">User</th>
                                <th className="p-4 font-medium border-y border-[#333]">Email</th>
                                <th className="p-4 font-medium border-y border-[#333]">Role</th>
                                <th className="p-4 font-medium border-y border-[#333]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-[#333] hover:bg-[#333]/20 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--surface-color)] border border-[#333] flex items-center justify-center text-[var(--text-secondary)]">
                                                    <UserIcon size={16} />
                                                </div>
                                                <span className="font-medium text-white">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[var(--text-secondary)]">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 
                                                  user.role === 'manager' ? 'bg-purple-500/20 text-purple-400' : 
                                                  user.role === 'client' ? 'bg-blue-500/20 text-blue-400' : 
                                                  'bg-green-500/20 text-green-400'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Button variant="outline" className="text-xs !px-2 !py-1">Edit</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-[var(--text-secondary)]">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminUsers;
