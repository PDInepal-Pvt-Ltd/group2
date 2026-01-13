import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Bell, CheckCircle, Clock, AlertCircle, Info } from 'lucide-react';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingProgress, setMarkingProgress] = useState(false);

    const fetchNotifications = async () => {
        if (!user?.role) return;
        setLoading(true);
        const data = await userApi.getNotifications(user.role);
        setNotifications(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications();
    }, [user?.role]);

    const handleMarkAllAsRead = async () => {
        if (!user?.role) return;
        setMarkingProgress(true);
        const success = await userApi.markAllAsRead(user.role);
        if (success) {
            // Update local state to reflect all read
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
        setMarkingProgress(false);
    };

    const getIcon = (type) => {
        if (type?.includes('assigned')) return <CheckCircle className="text-blue-500" size={20} />;
        if (type?.includes('updated')) return <Clock className="text-orange-500" size={20} />;
        if (type?.includes('overdue')) return <AlertCircle className="text-red-500" size={20} />;
        return <Info className="text-gray-500" size={20} />;
    };

    if (loading) return <Loader className="h-full" />;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Bell className="text-[var(--primary-color)]" />
                    Notifications
                </h1>
                {notifications.some(n => !n.is_read) && (
                    <Button 
                        variant="outline" 
                        onClick={handleMarkAllAsRead}
                        disabled={markingProgress}
                        className="text-sm"
                    >
                        {markingProgress ? 'Marking...' : 'Mark all as read'}
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <Card className="text-center py-12">
                        <Bell size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                        <p className="text-[var(--text-secondary)]">No notifications yet.</p>
                    </Card>
                ) : (
                    notifications.map((notif) => (
                        <Card 
                            key={notif.id} 
                            className={`transition-all ${notif.is_read ? 'opacity-60 grayscale-[0.5]' : 'border-l-4 border-l-[var(--primary-color)] shadow-lg shadow-purple-900/10'}`}
                        >
                            <div className="flex gap-4">
                                <div className={`p-2 rounded-lg h-fit ${notif.is_read ? 'bg-gray-800' : 'bg-[var(--primary-color)] bg-opacity-10'}`}>
                                    {getIcon(notif.notif_type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-semibold ${notif.is_read ? 'text-[var(--text-secondary)]' : 'text-white'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs text-[var(--text-secondary)]">
                                            {new Date(notif.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-sm">
                                        {notif.message}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
