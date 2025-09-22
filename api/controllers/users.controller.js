import UserModel from "../models/userrModel.js";
import RoleModel from "../models/rolModel.js";
import PermissionModel from "../models/permissnModel.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    let query = { isActive: true };

    if (role) {
      const roleDoc = await UserModel.findOne({ name: role });
      if (roleDoc) query.role = roleDoc._id;
    }

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await UserModel.find(query)
      .populate("role", "name description color icon")
      .populate("permissions", "name description category")
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get specific user
export const getUserById = async (req, res) => {
  try {
    if (
      req.params.id !== req.user._id.toString() &&
      !["Admin", "Manager"].includes(req.user.role.name)
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await UserModel.findById(req.params.id)
      .populate("role")
      .populate("permissions")
      .select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newRole = await RoleModel.findOne({ name: roleName, isActive: true });
    if (!newRole)
      return res.status(400).json({ error: "Invalid role specified" });

    const oldRole = await RoleModel.findById(user.role);
    user.role = newRole._id;
    await UserModel.save();

    if (oldRole) await oldRole.updateUserCount();
    await newRole.updateUserCount();

    const updatedUser = await UserModel.findById(user._id)
      .populate("role")
      .select("-password");

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
};

// Update user permissions
export const updateUserPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPermissions = await PermissionModel.find({
      _id: { $in: permissions },
      isActive: true,
    });

    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({ error: "Some permissions are invalid" });
    }

    user.permissions = permissions;
    await user.save();

    const updatedUser = await UserModel.findById(user._id)
      .populate("role")
      .populate("permissions")
      .select("-password");

    res.json({
      message: "User permissions updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user permissions error:", error);
    res.status(500).json({ error: "Failed to update user permissions" });
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "Cannot deactivate your own account" });
    }

    user.isActive = false;
    await user.save();

    const role = await RoleModel.findById(user.role);
    if (role) await role.updateUserCount();

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Deactivate user error:", error);
    res.status(500).json({ error: "Failed to deactivate user" });
  }
};

// Reactivate user
export const activateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = true;
    await user.save();

    const role = await RoleModel.findById(user.role);
    if (role) await role.updateUserCount();

    res.json({ message: "User activated successfully" });
  } catch (error) {
    console.error("Activate user error:", error);
    res.status(500).json({ error: "Failed to activate user" });
  }
};
