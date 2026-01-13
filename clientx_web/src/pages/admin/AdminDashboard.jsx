import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { Users, Briefcase, CheckSquare, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-[var(--text-secondary)] text-sm">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    </Card>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, analyticsData] = await Promise.all([
                    adminApi.getDashboardStats(),
                    adminApi.getAnalytics()
                ]);
                setStats(statsData);
                setAnalytics(analyticsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader className="h-full" />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Employees" 
                    value={stats?.total_employees || 0} 
                    icon={Users} 
                    color="bg-blue-500 text-blue-500" 
                />
                <StatCard 
                    title="Total Projects" 
                    value={stats?.total_projects || 0} 
                    icon={Briefcase} 
                    color="bg-purple-500 text-purple-500" 
                />
                <StatCard 
                    title="Total Tasks" 
                    value={stats?.total_tasks || 0} 
                    icon={CheckSquare} 
                    color="bg-green-500 text-green-500" 
                />
                <StatCard 
                    title="Active Tasks" 
                    value={analytics?.task_status_counts?.['In Progress'] || 0} // Example
                    icon={TrendingUp} 
                    color="bg-orange-500 text-orange-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Task Analytics">
                    {/* Placeholder for Chart */}
                    <div className="h-64 flex items-center justify-center text-[var(--text-secondary)] border border-dashed border-[#333] rounded-lg">
                        Chart: Task Status Distribution (Coming Soon)
                         <br/>
                         {JSON.stringify(analytics?.task_status_counts)} 
                    </div>
                </Card>

                <Card title="Recent Activity">
                    <div className="space-y-4">
                        <p className="text-[var(--text-secondary)]">No recent activity.</p>
                        {/* Map through notifications or logs if available */}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
