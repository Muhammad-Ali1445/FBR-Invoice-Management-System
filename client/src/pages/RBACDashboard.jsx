"use client";
import { useState, useEffect } from "react";
import { roleService } from "../services/roleService";
import { permissionService } from "../services/permissionService.js";
import { RoleSelector } from "../components/rbac/RoleSelector";
import { PermissionsPanel } from "../components/rbac/PermissionPanel";
import { StatCard } from "../components/dashboard/statCard";
import { Card } from "@/components/ui/card";
import { Shield, Users, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";


const RBACDashboard = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissionCategories, setPermissionCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        roleService.getAllRoles(),
        permissionService.getPermissionCategories(),
      ]);
      setRoles(rolesData);
      setPermissionCategories(permissionsData);
    } catch (error) {
      toast.error("Failed to load RBAC data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionsChange = async (roleId, permissions) => {
    try {
      const permissionIds = permissions
        .filter((perm) => perm.isEnabled)
        .map((perm) => perm._id || perm.id);

      await roleService.updateRolePermissions(roleId, permissionIds);

      const updatedRoles = await roleService.getAllRoles();
      setRoles(updatedRoles);

      const updatedSelectedRole = updatedRoles.find(
        (role) => (role._id || role.id) === roleId
      );
      setSelectedRole(updatedSelectedRole);
    } catch (error) {
      console.error("Update permissions error:", error);
      throw error;
    }
  };

  const totalUsers = (roles || []).reduce(
    (sum, role) => sum + (role.userCount || 0),
    0
  );
  const totalPermissions = (permissionCategories || []).reduce(
    (sum, cat) => sum + (cat.permissions?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        <Shield className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading RBAC Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6 flex justify-center items-center">
          <div className="flex items-center space-x-3">
            {/* Icon */}
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Shield className="w-6 h-6" />
            </div>

            {/* Text aligned vertically center */}
            <div className="flex flex-col justify-center text-center">
              <h1 className="text-2xl font-bold">RBAC Management</h1>
              <p className="text-sm text-muted-foreground">
                Control roles & permissions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Users"
          value={totalUsers}
        />
        <StatCard
          icon={<Shield className="w-6 h-6" />}
          label="Roles"
          value={roles.length}
        />
        <StatCard
          icon={<KeyRound className="w-6 h-6" />}
          label="Permissions"
          value={totalPermissions}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1"
        >
          <RoleSelector
            roles={roles}
            selectedRole={selectedRole}
            onRoleSelect={setSelectedRole}
          />
        </motion.div>

        {/* Permissions */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          {selectedRole ? (
            <PermissionsPanel
              role={selectedRole}
              permissionCategories={permissionCategories}
              onPermissionsChange={handlePermissionsChange}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                Select a role to configure permissions
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};



export default RBACDashboard;
