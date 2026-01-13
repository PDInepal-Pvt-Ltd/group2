import React, { useEffect, useState } from 'react';
import { taskApi, userApi } from '../../services/api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { Plus, CheckSquare, Clock, User, Edit2, Trash2, MoreVertical, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        priority: 'medium',
        due_date: '',
        status: 'todo',
        assigned_to: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth();
    const canCreateTask = ['admin', 'manager', 'client'].includes(user?.role);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await taskApi.getMyTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await userApi.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setFormData({ title: '', description: '', priority: 'medium', due_date: '', status: 'todo', assigned_to: [] });
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setFormData({ 
            title: task.title, 
            description: task.description || '', 
            priority: task.priority || 'medium', 
            due_date: task.due_date || '', 
            status: task.status || 'todo',
            assigned_to: Array.isArray(task.assigned_to) ? task.assigned_to.map(u => typeof u === 'object' ? u.id : u) : []
        });
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this task?')) {
            const result = await taskApi.deleteTask(id);
            if (result.success) {
                setTasks(tasks.filter(t => t.id !== id));
            } else {
                alert('Failed to delete task: ' + result.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        let result;
        if (editingTask) {
             result = await taskApi.updateTask(editingTask.id, formData);
        } else {
             result = await taskApi.createTask(formData);
        }

        if (result.success) {
            fetchTasks(); 
            setIsModalOpen(false);
        } else {
            alert(`Failed to ${editingTask ? 'update' : 'create'} task: ` + result.message);
        }
        setIsSubmitting(false);
    };

    const handleStatusChange = async (taskId, newStatus, e) => {
        e.stopPropagation(); // prevent modal opening if card click handled later
        const result = await taskApi.updateTask(taskId, { status: newStatus });
        if (result.success) {
            setTasks(tasks.map(t => t.id === taskId ? result.task : t));
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority?.toLowerCase()) {
            case 'high': return 'text-red-500 bg-red-500/10';
            case 'medium': return 'text-orange-500 bg-orange-500/10';
            case 'low': return 'text-green-500 bg-green-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    if (loading) return <Loader className="h-full" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">My Tasks</h1>
                {canCreateTask && (
                    <Button className="flex items-center gap-2" onClick={openCreateModal}>
                        <Plus size={20} />
                        <span>New Task</span>
                    </Button>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? "Edit Task" : "Create New Task"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Title" 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required 
                    />
                    <Input 
                        label="Description" 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Priority</label>
                            <select 
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                className="w-full px-3 py-2 bg-[var(--surface-color)] border border-[#333] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6200ea]"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <Input 
                            label="Due Date" 
                            type="date"
                            value={formData.due_date} 
                            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                        />
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-3 py-2 bg-[var(--surface-color)] border border-[#333] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6200ea]"
                        >
                             <option value="todo">To Do</option>
                             <option value="in_progress">In Progress</option>
                             <option value="review">Review</option>
                             <option value="completed">Completed</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Assign To</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-[#222] rounded-lg border border-[#333] max-h-40 overflow-y-auto">
                            {users.map(user => (
                                <label key={user.id} className="flex items-center gap-2 text-sm cursor-pointer p-1 hover:bg-[#333] rounded transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.assigned_to.includes(user.id)}
                                        onChange={(e) => {
                                            const newAssigned = e.target.checked 
                                                ? [...formData.assigned_to, user.id]
                                                : formData.assigned_to.filter(id => id !== user.id);
                                            setFormData({...formData, assigned_to: newAssigned});
                                        }}
                                        className="rounded border-[#444] text-[#6200ea] focus:ring-[#6200ea] bg-[#111]"
                                    />
                                    <span className="truncate">{user.username}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                    </Button>
                </form>
            </Modal>

            <div className="grid grid-cols-1 gap-4">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <Card key={task.id} className="hover:border-[var(--primary-color)] border border-transparent transition-all cursor-pointer group !p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${task.is_completed ? 'bg-green-500/20 text-green-500' : 'bg-[var(--surface-color)] border border-[#333]'}`}>
                                        <CheckSquare size={20} className={task.is_completed ? 'text-green-500' : 'text-[var(--text-secondary)]'} />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold mb-1 ${task.is_completed ? 'line-through text-[var(--text-secondary)]' : 'text-white'}`}>
                                            {task.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                                            </span>
                                            {task.assigned_to_name && (
                                                <span className="flex items-center gap-1">
                                                    <User size={14} />
                                                    {task.assigned_to_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                        {task.priority || 'Normal'}
                                    </span>
                                    
                                    <select 
                                        value={task.status || 'todo'}
                                        onChange={(e) => handleStatusChange(task.id, e.target.value, e)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-2 py-1 rounded-md text-xs font-medium bg-[#333] text-[var(--text-secondary)] border-none focus:ring-1 focus:ring-[var(--primary-color)]"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    
                                     {canCreateTask && (
                                        <div className="flex gap-1 ml-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
                                                className="p-1.5 hover:bg-[#333] rounded-md text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                             <button 
                                                onClick={(e) => handleDeleteTask(task.id, e)}
                                                className="p-1.5 hover:bg-[#333] rounded-md text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                     )}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-[var(--text-secondary)]">
                        No tasks found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;
