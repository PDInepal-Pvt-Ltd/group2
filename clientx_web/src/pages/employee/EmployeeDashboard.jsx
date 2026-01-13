import React from 'react';
import TaskList from '../tasks/TaskList';

const EmployeeDashboard = () => {
    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
             <p className="text-[var(--text-secondary)]">Here are your assigned tasks.</p>
             <TaskList />
        </div>
    );
};
export default EmployeeDashboard;
