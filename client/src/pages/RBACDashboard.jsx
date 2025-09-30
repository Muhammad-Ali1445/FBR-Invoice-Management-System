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
      const [rolesData, permissionCats] = await Promise.all([
        roleService.getAllRoles(),
        permissionService.getPermissionCategories(),
      ]);

      // rolesData might be { roles: [...] } or array
      const loadedRoles = Array.isArray(rolesData)
        ? rolesData
        : rolesData.roles || [];

      setRoles(loadedRoles);
      setPermissionCategories(
        Array.isArray(permissionCats) ? permissionCats : []
      );
    } catch (error) {
      console.error("Failed to load RBAC data:", error);
      toast.error("Failed to load RBAC data");
    } finally {
      setLoading(false);
    }
  };

  // roleId: string, updatedPermissionIds: array of strings
  const handlePermissionsChange = async (roleId, updatedPermissionIds) => {
    try {
      setLoading(true);
      const res = await roleService.updateRolePermissions(
        roleId,
        updatedPermissionIds
      );

      // response shape: { message, role: updatedRole }
      const updatedRole = res && res.role ? res.role : null;
      if (!updatedRole) {
        toast.error("Server did not return updated role");
        return;
      }

      // normalize _id strings when comparing
      const updatedId =
        updatedRole._id?.toString?.() || updatedRole.id?.toString?.();

      // update selectedRole and roles array
      setSelectedRole(updatedRole);
      setRoles((prev) =>
        prev.map((r) => {
          const rid = r._id?.toString?.() || r.id?.toString?.();
          return rid === updatedId ? updatedRole : r;
        })
      );

      // Optionally refresh permission categories if you expect changes on the perms list itself
      // const freshPermissions = await permissionService.getPermissionCategories();
      // setPermissionCategories(freshPermissions);

      toast.success("Permissions updated");
      return updatedRole;
    } catch (error) {
      console.error("Update permissions error:", error);
      toast.error("Failed to update permissions");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = (Array.isArray(roles) ? roles : []).reduce(
    (sum, role) => sum + (role.userCount || 0),
    0
  );

  const totalPermissions = (
    Array.isArray(permissionCategories) ? permissionCategories : []
  ).reduce((sum, cat) => sum + (cat.permissions?.length || 0), 0);

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
      {/* header and stats omitted for brevity (copy your existing UI) */}
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <RoleSelector
            roles={roles}
            selectedRole={selectedRole}
            onRoleSelect={setSelectedRole}
          />
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {selectedRole ? (
            <PermissionsPanel
              role={selectedRole}
              setRoles={setRoles}
              permissionCategories={permissionCategories}
              onPermissionsChange={handlePermissionsChange} // now expects (roleId, updatedIds)
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
