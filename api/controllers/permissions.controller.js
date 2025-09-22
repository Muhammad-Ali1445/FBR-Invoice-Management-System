import PermissionModel from "../models/permissnModel.js";

// Get all permissions grouped by category
export const getPermissions = async (req, res) => {
  try {
    const permissions = await PermissionModel.find({ isActive: true });

    const categories = {};
    permissions.forEach((permission) => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });

    const categoryNames = {
      invoices: "Invoice Management",
      reports: "Reports & Analytics",
      user_management: "User Management",
      system: "System Administration",
    };

    const categoryDescriptions = {
      invoices: "Create, edit, and manage invoices",
      reports: "Access to reporting and analytics features",
      user_management: "Manage users and their access",
      system: "System-level configuration and maintenance",
    };

    const permissionCategories = Object.keys(categories).map((categoryId) => ({
      id: categoryId,
      name: categoryNames[categoryId] || categoryId,
      description: categoryDescriptions[categoryId] || "",
      permissions: categories[categoryId],
    }));

    res.json({ permissionCategories });
  } catch (error) {
    console.error("Fetch permissions error:", error);
    res.status(500).json({ error: "Failed to fetch permissions" });
  }
};

// Create new permission
export const createPermission = async (req, res) => {
  try {
    const { name, description, category, resource, action } = req.body;

    const existingPermission = await PermissionModel.findOne({
      resource,
      action,
    });
    if (existingPermission) {
      return res
        .status(400)
        .json({
          error: "Permission with this resource and action already exists",
        });
    }

    const permission = new PermissionModel({
      name,
      description,
      category,
      resource,
      action,
    });

    await permission.save();

    res.status(201).json({
      message: "Permission created successfully",
      permission,
    });
  } catch (error) {
    console.error("Create permission error:", error);
    res.status(500).json({ error: "Failed to create permission" });
  }
};

// Update permission
export const updatePermission = async (req, res) => {
  try {
    const { name, description, category, isActive } = req.body;

    const permission = await PermissionModel.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: "Permission not found" });
    }

    if (name) permission.name = name;
    if (description) permission.description = description;
    if (category) permission.category = category;
    if (typeof isActive === "boolean") permission.isActive = isActive;

    await permission.save();

    res.json({
      message: "Permission updated successfully",
      permission,
    });
  } catch (error) {
    console.error("Update permission error:", error);
    res.status(500).json({ error: "Failed to update permission" });
  }
};

// Soft delete permission
export const deletePermission = async (req, res) => {
  try {
    const permission = await PermissionModel.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: "Permission not found" });
    }

    permission.isActive = false;
    await permission.save();

    res.json({ message: "Permission deactivated successfully" });
  } catch (error) {
    console.error("Delete permission error:", error);
    res.status(500).json({ error: "Failed to delete permission" });
  }
};
