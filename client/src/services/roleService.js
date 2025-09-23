const mockRoles = [
  {
    _id: "1",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: [
      "create_invoice",
      "validate_invoice",
      "view_invoice",
      "manage_users",
      "manage_roles",
      "view_reports",
      "system_settings",
      "audit_logs",
    ],
    userCount: 1,
    isActive: true,
  },
  {
    _id: "2",
    name: "Manager",
    description: "Invoice management and reporting access",
    permissions: [
      "create_invoice",
      "validate_invoice",
      "view_invoice",
      "view_reports",
    ],
    userCount: 2,
    isActive: true,
  },
  {
    _id: "3",
    name: "Staff",
    description: "Basic invoice creation and viewing",
    permissions: ["create_invoice", "view_invoice"],
    userCount: 5,
    isActive: true,
  },
  {
    _id: "4",
    name: "Viewer",
    description: "Read-only access to view invoices",
    permissions: ["view_invoice"],
    userCount: 10,
    isActive: true,
  },
];

export const roleService = {
  // Get all roles
  async getAllRoles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRoles);
      }, 300);
    });
  },

  // Get specific role
  async getRole(roleId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const role = mockRoles.find((r) => r._id === roleId);
        if (role) {
          resolve(role);
        } else {
          reject({ error: "Role not found" });
        }
      }, 200);
    });
  },

  // Create new role
  async createRole(roleData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRole = {
          _id: Date.now().toString(),
          ...roleData,
          userCount: 0,
          isActive: true,
        };
        mockRoles.push(newRole);
        resolve(newRole);
      }, 500);
    });
  },

  // Update role permissions
  async updateRolePermissions(roleId, permissionIds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const roleIndex = mockRoles.findIndex((r) => r._id === roleId);
        if (roleIndex !== -1) {
          mockRoles[roleIndex].permissions = permissionIds;
          resolve(mockRoles[roleIndex]);
        }
      }, 500);
    });
  },

  // Update role details
  async updateRole(roleId, roleData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const roleIndex = mockRoles.findIndex((r) => r._id === roleId);
        if (roleIndex !== -1) {
          mockRoles[roleIndex] = { ...mockRoles[roleIndex], ...roleData };
          resolve(mockRoles[roleIndex]);
        }
      }, 500);
    });
  },

  // Delete role
  async deleteRole(roleId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const roleIndex = mockRoles.findIndex((r) => r._id === roleId);
        if (roleIndex !== -1) {
          mockRoles.splice(roleIndex, 1);
        }
        resolve({ message: "Role deleted successfully" });
      }, 500);
    });
  },
};
