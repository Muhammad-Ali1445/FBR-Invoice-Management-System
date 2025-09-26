import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles = [],
  allowedPermissions = [],
}) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // ✅ Fixed role and permission extraction
  const roleName =
    typeof user?.role === "string" ? user.role : user?.role?.name;

  const rolePermissions = Array.isArray(user?.role?.permissions)
    ? user.role.permissions.map((p) => p.name)
    : [];

  const userPermissions = Array.isArray(user?.permissions)
    ? user.permissions
    : [];

  const mergedPermissions = [
    ...new Set([...rolePermissions, ...userPermissions]),
  ];

  console.log("Merged permissions:", mergedPermissions);
  console.log("Allowed permissions:", allowedPermissions);

  // ✅ Role check (if provided)
  if (allowedRoles.length > 0 && !allowedRoles.includes(roleName)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Permission check (if provided)
  if (
    allowedPermissions.length > 0 &&
    !allowedPermissions.some((p) => mergedPermissions.includes(p))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
