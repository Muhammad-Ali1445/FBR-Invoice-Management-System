import RoleModel from "../models/rolModel.js";
import PermissionModel from "../models/permissnModel.js";
import UserModel from "../models/userrModel.js";

// Get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find({ isActive: true })
      .populate("permissions")
      .sort({ name: 1 });

    for (let role of roles) {
      await role.updateUserCount();
    }

    res.json({ roles });
  } catch (error) {
    console.error("Fetch roles error:", error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

// Get specific role
export const getRoleById = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id).populate("permissions");

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.json({ role });
  } catch (error) {
    console.error("Fetch role error:", error);
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

// Create new role
export const createRole = async (req, res) => {
  try {
    const { name, description, icon, color, permissions = [] } = req.body;

    const existingRole = await RoleModel.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ error: "Role with this name already exists" });
    }

    const role = new RoleModel({ name, description, icon, color, permissions });
    await role.save();

    const populatedRole = await RoleModel.findById(role._id).populate("permissions");

    res.status(201).json({
      message: "Role created successfully",
      role: populatedRole,
    });
  } catch (error) {
    console.error("Create role error:", error);
    res.status(500).json({ error: "Failed to create role" });
  }
};

// Update role permissions
export const updateRolePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const role = await RoleModel.findById(req.params.id);

    if (!role) return res.status(404).json({ error: "Role not found" });

    const validPermissions = await PermissionModel.find({
      _id: { $in: permissions },
      isActive: true,
    });

    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({ error: "Some permissions are invalid" });
    }

    role.permissions = permissions;
    await role.save();

    const updatedRole = await RoleModel.findById(role._id).populate("permissions");

    res.json({ message: "Role permissions updated successfully", role: updatedRole });
  } catch (error) {
    console.error("Update role permissions error:", error);
    res.status(500).json({ error: "Failed to update role permissions" });
  }
};

// Update role details
export const updateRole = async (req, res) => {
  try {
    const { name, description, icon, color, isActive } = req.body;
    const role = await RoleModel.findById(req.params.id);

    if (!role) return res.status(404).json({ error: "Role not found" });

    if (name && name !== role.name) {
      const existingRole = await RoleModel.findOne({
        name,
        _id: { $ne: role._id },
      });
      if (existingRole) {
        return res.status(400).json({ error: "Role with this name already exists" });
      }
      role.name = name;
    }

    if (description) role.description = description;
    if (icon) role.icon = icon;
    if (color) role.color = color;
    if (typeof isActive === "boolean") role.isActive = isActive;

    await role.save();

    const updatedRole = await RoleModel.findById(role._id).populate("permissions");

    res.json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });

    const usersWithRole = await UserModel.countDocuments({
      role: role._id,
      isActive: true,
    });

    if (usersWithRole > 0) {
      return res.status(400).json({
        error: "Cannot delete role. Users are still assigned to this role.",
        userCount: usersWithRole,
      });
    }

    await RoleModel.findByIdAndDelete(role._id);

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Delete role error:", error);
    res.status(500).json({ error: "Failed to delete role" });
  }
};
