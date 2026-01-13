import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../services/api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { Plus, Briefcase, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ui/ProgressBar';

import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const isManagerOrAdmin = ['admin', 'manager'].includes(user?.role);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Determine which API to call based on role? 
                // Currently projectApi.getProjects calls /tasks/groups/ which returns all or filtered
                const data = await projectApi.getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setFormData({ name: project.name, description: project.description });
        setIsModalOpen(true);
    };

    const handleDeleteProject = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this project?')) {
            const result = await projectApi.deleteProject(id);
            if (result.success) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert('Failed to delete project: ' + result.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        let result;
        if (editingProject) {
            result = await projectApi.updateProject(editingProject.id, formData);
        } else {
            result = await projectApi.createProject(formData);
        }

        if (result.success) {
            if (editingProject) {
                setProjects(projects.map(p => p.id === editingProject.id ? result.data : p));
            } else {
                setProjects([...projects, result.data]);
            }
            setIsModalOpen(false);
        } else {
            alert(`Failed to ${editingProject ? 'update' : 'create'} project: ` + result.message);
        }
        setIsSubmitting(false);
    };


    if (loading) return <Loader className="h-full" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Projects</h1>
                {isManagerOrAdmin && (
                    <Button className="flex items-center gap-2" onClick={openCreateModal}>
                        <Plus size={20} />
                        <span>New Project</span>
                    </Button>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? "Edit Project" : "Create New Project"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Project Name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required  
                    />
                    <Input 
                        label="Description" 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required  
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                    </Button>
                </form>
            </Modal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <Card 
                            key={project.id} 
                            className="hover:border-[var(--primary-color)] border border-transparent transition-all cursor-pointer group relative"
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                           <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-[var(--primary-color)] bg-opacity-20 text-[var(--primary-color)] group-hover:bg-[var(--primary-color)] group-hover:text-white transition-colors">
                                    <Briefcase size={24} />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full border ${project.status === 'completed' ? 'border-green-500 text-green-500' : 'border-blue-500 text-blue-500'}`}>
                                    {project.status || 'Active'}
                                </span>
                           </div>
                           
                           <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--primary-color)] transition-colors">{project.name}</h3>
                           <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">{project.description || 'No description provided.'}</p>
                           
                           <div className="mb-4">
                               <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                                   <span>Progress</span>
                                   <span>{Math.round((project.progress || 0) * 100)}%</span>
                               </div>
                               <ProgressBar progress={(project.progress || 0) * 100} />
                           </div>

                           <div className="flex items-center text-[var(--text-secondary)] text-sm">
                                <Calendar size={16} className="mr-2" />
                                <span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}</span>
                           </div>
                           
                            {/* Actions */}
                             {isManagerOrAdmin && (
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); openEditModal(project); }}
                                        className="p-2 bg-[var(--surface-color)] rounded-lg hover:text-[var(--primary-color)] transition-colors border border-[#333]"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={(e) => handleDeleteProject(project.id, e)}
                                        className="p-2 bg-[var(--surface-color)] rounded-lg hover:text-red-500 transition-colors border border-[#333]"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-[var(--text-secondary)]">
                        No projects found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
