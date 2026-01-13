import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectApi, taskApi } from '../../services/api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { ArrowLeft, Calendar, CheckSquare, Clock, User, Briefcase, Plus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        priority: 'medium',
        due_date: '',
        status: 'todo',
        group: id,
        assigned_to: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const canCreateTask = ['admin', 'manager', 'client'].includes(user?.role);

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            const projectData = await projectApi.getProject(id);
            setProject(projectData);
            
            const tasksData = await taskApi.getProjectTasks(id);
            setTasks(tasksData);

            const usersData = await userApi.getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to fetch project details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await taskApi.createTask(formData);
        if (result.success) {
            fetchProjectDetails();
            setIsModalOpen(false);
            setFormData({ title: '', description: '', priority: 'medium', due_date: '', status: 'todo', group: id, assigned_to: [] });
        } else {
            alert('Failed to create task: ' + result.message);
        }
        setIsSubmitting(false);
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
    if (!project) return <div className="text-center py-10 text-white">Project not found.</div>;

    return (
        <div className="space-y-6">
            <button 
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Projects</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="!p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-[var(--primary-color)] bg-opacity-20 text-[var(--primary-color)]">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                                <span className={`text-xs px-2 py-1 rounded-full border ${project.status === 'completed' ? 'border-green-500 text-green-500' : 'border-blue-500 text-blue-500'}`}>
                                    {project.status || 'Active'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Description</label>
                                <p className="text-white mt-1">{project.description || 'No description provided.'}</p>
                            </div>

                            <div className="pt-4 border-t border-[#333]">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--text-secondary)]">Overall Progress</span>
                                    <span className="text-white font-bold">{Math.round((project.progress || 0) * 100)}%</span>
                                </div>
                                <ProgressBar progress={(project.progress || 0) * 100} className="h-3" />
                            </div>

                            <div className="pt-4 border-t border-[#333] flex items-center justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">Created At</span>
                                <span className="text-white">{new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tasks List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Project Tasks ({tasks.length})</h2>
                        {canCreateTask && (
                            <Button 
                                className="flex items-center gap-2" 
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Plus size={18} />
                                <span>New Task</span>
                            </Button>
                        )}
                    </div>

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Task to Project">
                        <form onSubmit={handleCreateTask} className="space-y-4">
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
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Assign To</label>
                                <div className="grid grid-cols-2 gap-2 p-3 bg-[#222] rounded-lg border border-[#333] max-h-40 overflow-y-auto">
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
                                {isSubmitting ? 'Creating...' : 'Create Task'}
                            </Button>
                        </form>
                    </Modal>

                    <div className="grid grid-cols-1 gap-4">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <Card key={task.id} className="!p-4 border border-[#333] hover:border-[#444] transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${task.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-[var(--surface-color)] border border-[#333]'}`}>
                                                <CheckSquare size={20} className={task.status === 'completed' ? 'text-green-500' : 'text-[var(--text-secondary)]'} />
                                            </div>
                                            <div>
                                                <h3 className={`font-bold ${task.status === 'completed' ? 'line-through text-[var(--text-secondary)]' : 'text-white'}`}>
                                                    {task.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                                                    </span>
                                                    {task.assigned_to_name && (
                                                        <span className="flex items-center gap-1">
                                                            <User size={12} />
                                                            {task.assigned_to_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                                {task.priority || 'Normal'}
                                            </span>
                                            <span className="px-2 py-1 rounded-md text-[10px] font-medium bg-[#222] text-[var(--text-secondary)] border border-[#333]">
                                                {task.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-10 text-[var(--text-secondary)] bg-[var(--surface-color)] rounded-xl border border-dashed border-[#333]">
                                No tasks assigned to this project yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
