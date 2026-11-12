
import api from "./api";

export const getDashboardStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data;
};

export const getAllGrievances = async (filters = {}) => {
    const response = await api.get("/admin/grievances", {
        params: filters,
    });

    return response.data;
};

export const getGrievanceDetails = async (id) => {
    const response = await api.get(`/admin/grievances/${id}`);
    return response.data;
};

export const analyzeGrievance = async (id) => {
    const response = await api.post(`/admin/grievances/${id}/analyze`);
    return response.data;
};

export const updateGrievanceStatus = async (id, data) =>
    (await api.put(`/admin/grievances/${id}/status`, data)).data;

export const addGrievanceRemark = async (id, data) =>
    (await api.post(`/admin/grievances/${id}/remarks`, data)).data;

// Get departments
export const getDepartments = async () => {
    const response = await api.get("/departments");
    return response.data;
};

// Get officers by department
export const getDepartmentOfficers = async (departmentId) => {
    const response = await api.get("/admin/officers", {
        params: { departmentId }
    });

    return response.data;
};

// Assign grievance
export const assignGrievance = async (id, data) => {
    const response = await api.put(
        `/admin/grievances/${id}/assign`,
        data
    );

    return response.data;
};