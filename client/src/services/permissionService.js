import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const permissionService = {
  // Get all permissions grouped by category — return an ARRAY always
  async getPermissionCategories() {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/api/permissions`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    const data = res.data;

    // Support a few possible server shapes:
    if (Array.isArray(data)) return data; // server returned array
    if (Array.isArray(data.permissionCategories)) return data.permissionCategories;
    if (Array.isArray(data.categories)) return data.categories;

    // fallback empty array (never return undefined)
    return [];
  },

  async createPermission(permissionData) {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/api/permissions`,
      permissionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async updatePermission(permissionId, permissionData) {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `${API_URL}/api/permissions/${permissionId}`,
      permissionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async deletePermission(permissionId) {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/api/permissions/${permissionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
