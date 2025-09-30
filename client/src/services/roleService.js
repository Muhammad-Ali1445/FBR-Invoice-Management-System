import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const roleService = {
  async getAllRoles() {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/api/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // server returns { roles: [...] }
  },

  async getRole(roleId) {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/api/roles/${roleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { role }
  },

  async createRole(roleData) {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/api/roles`, roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // IMPORTANT: server returns { message, role } (role is populated)
  async updateRolePermissions(roleId, permissionIds) {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `${API_URL}/api/roles/${roleId}/permissions`,
      { permissions: permissionIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data; // { message, role }
  },

  async updateRole(roleId, roleData) {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${API_URL}/api/roles/${roleId}`, roleData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async deleteRole(roleId) {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/api/roles/${roleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
