import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const ApiService = {
  // Authentication Helpers
  getToken: () => localStorage.getItem("access_token"),
  saveTokens: (access, refresh) => {
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
  },
  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
  },
  saveRole: (role) => localStorage.setItem("user_role", role),
  getRole: () => localStorage.getItem("user_role"),

  // Interceptor setup should be done where api is used or exported differently,
  // but for simplicity we'll add token to requests manually or via interceptor here.
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = ApiService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: async (username, password) => {
    try {
      const response = await api.post("/users/login/", { username, password });
      if (response.status === 200) {
        const { access, refresh } = response.data;
        ApiService.saveTokens(access, refresh);
        // Fetch profile to get role
        const user = await userApi.getProfile();
        if (user) {
          ApiService.saveRole(user.role || "employee");
        }
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || error.message,
      };
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post("/users/register/", userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
  logout: () => {
    ApiService.clearTokens();
  },
};

export const userApi = {
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile/");
      return response.data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      return null;
    }
  },
  updateProfile: async (profileData) => {
    try {
      const response = await api.patch("/users/profile/", profileData);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get("/admin-dashboard/users/");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
  getNotifications: async (role) => {
    try {
      // endpoints: /notifications/employee/, /notifications/manager/, /notifications/admin/
      const endpoint = `/notifications/${role === 'client' ? 'employee' : role}/`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },
  markAllAsRead: async (role) => {
    try {
      const endpoint = `/notifications/${role === 'client' ? 'employee' : role}/`;
      const response = await api.post(endpoint);
      return response.status === 200;
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      return false;
    }
  },
};

export const adminApi = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin-dashboard/");
      return response.data;
    } catch (error) {
      return { total_employees: 0, total_projects: 0, total_tasks: 0 };
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get("/admin-dashboard/users/");
      return response.data;
    } catch (error) {
      return [];
    }
  },
  getAllTasks: async () => {
    try {
      const response = await api.get("/admin-dashboard/tasks/");
      return response.data;
    } catch (error) {
      return [];
    }
  },
  getAnalytics: async () => {
    try {
      const response = await api.get("/admin-dashboard/analytics/");
      return response.data;
    } catch (error) {
      return {};
    }
  },
  getNotifications: async () => {
    try {
      const response = await api.get("/notifications/admin/");
      return response.data;
    } catch (error) {
      return [];
    }
  },
  createUser: async (userData) => {
    // Admin creating user uses register endpoint usually
    return authApi.register(userData);
  },
};

export const projectApi = {
  getProjects: async () => {
    try {
      const response = await api.get("/tasks/groups/");
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  },
  getProject: async (id) => {
    try {
      const response = await api.get(`/tasks/groups/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching project:", error);
      return null;
    }
  },
  createProject: async (projectData) => {
    try {
      const response = await api.post("/tasks/groups/", projectData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
  updateProject: async (id, projectData) => {
    try {
      const response = await api.patch(`/tasks/groups/${id}/`, projectData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
  deleteProject: async (id) => {
    try {
      await api.delete(`/tasks/groups/${id}/`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
};

export const taskApi = {
  getMyTasks: async (groupId = null) => {
    try {
      let url = "/tasks/my-tasks/";
      if (groupId) {
        url += `?group_id=${groupId}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return [];
    }
  },
  getProjectTasks: async (projectId) => {
    try {
        const response = await api.get('/tasks/my-tasks/');
        // Filter by group on client side for now
        return response.data.filter(t => t.group === parseInt(projectId) || t.group?.id === parseInt(projectId));
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        return [];
    }
  },
  createTask: async (taskData) => {
    try {
      const response = await api.post("/tasks/create/", taskData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/`, taskData);
      return { success: true, task: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
  deleteTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}/`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
};

export default api;
