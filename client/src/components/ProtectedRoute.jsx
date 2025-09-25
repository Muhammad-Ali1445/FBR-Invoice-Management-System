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

  const roleName = user?.role?.name || user?.role; // support if role is just a string
  const rolePermissions = user?.role?.permissions?.map((p) => p.name) || [];
  const userPermissions = user?.permissions?.map((p) => p.name) || [];
  const mergedPermissions = [
    ...new Set([...rolePermissions, ...userPermissions]),
  ];

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
