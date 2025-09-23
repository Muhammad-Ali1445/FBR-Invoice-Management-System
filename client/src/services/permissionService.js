const mockPermissionCategories = {
  'Invoice Management': [
    {
      _id: '1',
      name: 'create_invoice',
      description: 'Create new invoices',
      category: 'Invoice Management',
      isActive: true
    },
    {
      _id: '2',
      name: 'validate_invoice', 
      description: 'Validate and approve invoices',
      category: 'Invoice Management',
      isActive: true
    },
    {
      _id: '3',
      name: 'view_invoice',
      description: 'View existing invoices', 
      category: 'Invoice Management',
      isActive: true
    }
  ],
  'User Management': [
    {
      _id: '4',
      name: 'manage_users',
      description: 'Create, edit, and delete users',
      category: 'User Management',
      isActive: true
    }
  ],
  'Role Management': [
    {
      _id: '5', 
      name: 'manage_roles',
      description: 'Create, edit, and delete roles',
      category: 'Role Management',
      isActive: true
    }
  ],
  'Reporting': [
    {
      _id: '6',
      name: 'view_reports',
      description: 'Access system reports and analytics',
      category: 'Reporting',
      isActive: true
    }
  ],
  'Administration': [
    {
      _id: '7',
      name: 'system_settings',
      description: 'Configure system settings',
      category: 'Administration',
      isActive: true
    },
    {
      _id: '8',
      name: 'audit_logs',
      description: 'View system audit logs',
      category: 'Administration',
      isActive: true
    }
  ]
};

export const permissionService = {
  // Get all permissions grouped by category
  async getPermissionCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Convert object format to array format that dashboard expects
        const categoriesArray = Object.keys(mockPermissionCategories).map(categoryName => ({
          name: categoryName,
          permissions: mockPermissionCategories[categoryName]
        }));
        resolve(categoriesArray);
      }, 200);
    });
  },

  // Create new permission
  async createPermission(permissionData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPermission = {
          _id: Date.now().toString(),
          ...permissionData,
          isActive: true
        };
        
        // Add to appropriate category
        if (!mockPermissionCategories[permissionData.category]) {
          mockPermissionCategories[permissionData.category] = [];
        }
        mockPermissionCategories[permissionData.category].push(newPermission);
        
        resolve(newPermission);
      }, 500);
    });
  },

  // Update permission
  async updatePermission(permissionId, permissionData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find and update permission across categories
        for (const category in mockPermissionCategories) {
          const permIndex = mockPermissionCategories[category].findIndex(p => p._id === permissionId);
          if (permIndex !== -1) {
            mockPermissionCategories[category][permIndex] = { 
              ...mockPermissionCategories[category][permIndex], 
              ...permissionData 
            };
            resolve(mockPermissionCategories[category][permIndex]);
            return;
          }
        }
      }, 500);
    });
  },

  // Delete permission
  async deletePermission(permissionId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find and remove permission across categories
        for (const category in mockPermissionCategories) {
          const permIndex = mockPermissionCategories[category].findIndex(p => p._id === permissionId);
          if (permIndex !== -1) {
            mockPermissionCategories[category].splice(permIndex, 1);
            break;
          }
        }
        resolve({ message: 'Permission deleted successfully' });
      }, 500);
    });
  }
};