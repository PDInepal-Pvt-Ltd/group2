import React from 'react';
import Card from '../../components/ui/Card';
// Placeholder for now, similar to Admin but fewer stats
const ManagerDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
            <p className="text-[var(--text-secondary)]">Welcome to your dashboard. Select Projects or Tasks from the sidebar to manage your work.</p>
            
            {/* Quick Stats Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Quick Actions">
                    <p className="text-[var(--text-secondary)]">Quickly access your frequent tasks.</p>
                </Card>
                 <Card title="Recent Projects">
                    <p className="text-[var(--text-secondary)]">See what you worked on recently.</p>
                </Card>
            </div>
        </div>
    );
};
export default ManagerDashboard;
