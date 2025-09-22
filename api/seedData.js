// seedData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import RoleModel from "./models/rolModel.js";
import PermissionModel from "./models/permissnModel.js";
import UserModel from "./models/userrModel.js";

dotenv.config();

// Connect to MongoDB
await mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Error:", err));

// ----------------- PERMISSIONS -----------------
const permissions = [
  // Invoice Management
  {
    name: "Create Invoice",
    description: "Create new invoices",
    category: "invoices",
    resource: "invoice",
    action: "create",
    key: "invoice.create",
  },
  {
    name: "Edit Invoice",
    description: "Modify existing invoices",
    category: "invoices",
    resource: "invoice",
    action: "update",
    key: "invoice.update",
  },
  {
    name: "Delete Invoice",
    description: "Remove invoices from system",
    category: "invoices",
    resource: "invoice",
    action: "delete",
    key: "invoice.delete",
  },
  {
    name: "Approve Invoice",
    description: "Approve invoices for processing",
    category: "invoices",
    resource: "invoice",
    action: "approve",
    key: "invoice.approve",
  },
  {
    name: "Validate Invoice",
    description: "Validate invoice data and format",
    category: "invoices",
    resource: "invoice",
    action: "validate",
    key: "invoice.validate",
  },
  {
    name: "View Invoice",
    description: "View invoice details",
    category: "invoices",
    resource: "invoice",
    action: "read",
    key: "invoice.read",
  },

  // Reports & Analytics
  {
    name: "View Reports",
    description: "Access standard reports",
    category: "reports",
    resource: "report",
    action: "read",
    key: "report.read",
  },
  {
    name: "Create Reports",
    description: "Generate custom reports",
    category: "reports",
    resource: "report",
    action: "create",
    key: "report.create",
  },
  {
    name: "Export Reports",
    description: "Export reports to various formats",
    category: "reports",
    resource: "report",
    action: "export",
    key: "report.export",
  },
  {
    name: "Analytics Dashboard",
    description: "Access advanced analytics",
    category: "reports",
    resource: "analytics",
    action: "read",
    key: "analytics.read",
  },

  // User Management
  {
    name: "Create User",
    description: "Add new users to system",
    category: "user_management",
    resource: "user",
    action: "create",
    key: "user.create",
  },
  {
    name: "Edit User",
    description: "Modify user information",
    category: "user_management",
    resource: "user",
    action: "update",
    key: "user.update",
  },
  {
    name: "Delete User",
    description: "Remove users from system",
    category: "user_management",
    resource: "user",
    action: "delete",
    key: "user.delete",
  },
  {
    name: "Assign Roles",
    description: "Assign and modify user roles",
    category: "user_management",
    resource: "user_role",
    action: "update",
    key: "user_role.update",
  },
  {
    name: "View Users",
    description: "View user information",
    category: "user_management",
    resource: "user",
    action: "read",
    key: "user.read",
  },

  // System Administration
  {
    name: "System Configuration",
    description: "Modify system settings",
    category: "system",
    resource: "system_config",
    action: "update",
    key: "system_config.update",
  },
  {
    name: "Audit Logs",
    description: "Access system audit logs",
    category: "system",
    resource: "audit_log",
    action: "read",
    key: "audit_log.read",
  },
  {
    name: "Backup & Restore",
    description: "Manage system backups",
    category: "system",
    resource: "backup",
    action: "create",
    key: "backup.create",
  },
  {
    name: "Maintenance Mode",
    description: "Enable/disable maintenance mode",
    category: "system",
    resource: "maintenance",
    action: "update",
    key: "maintenance.update",
  },
];

// ----------------- ROLES -----------------
const roles = [
  {
    name: "Admin",
    description: "Full system access with all administrative privileges",
    icon: "👑",
    color: "from-primary to-primary-glow",
  },
  {
    name: "Manager",
    description: "Management level access with approval rights",
    icon: "📊",
    color: "from-accent to-emerald-500",
  },
  {
    name: "Staff",
    description: "Standard user with invoice processing capabilities",
    icon: "👨‍💼",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Viewer",
    description: "Read-only access to system data and reports",
    icon: "👁️",
    color: "from-gray-500 to-gray-600",
  },
];

// ----------------- SEED FUNCTION -----------------
const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding...");

    // Clear existing data to prevent inconsistencies
    await PermissionModel.deleteMany({});
    await RoleModel.deleteMany({});
    await UserModel.deleteMany({});

    // Insert permissions
    console.log("📌 Creating permissions...");
    const createdPermissions = await PermissionModel.insertMany(permissions);
    console.log(`✅ Created ${createdPermissions.length} permissions`);

    // Insert roles with appropriate permissions
    console.log("📌 Creating roles...");
    const createdRoles = [];

    for (const roleData of roles) {
      let rolePermissions = [];

      switch (roleData.name) {
        case "Admin":
          rolePermissions = createdPermissions.map((p) => p._id);
          break;
        case "Manager":
          rolePermissions = createdPermissions
            .filter((p) => p.category !== "system")
            .map((p) => p._id);
          break;
        case "Staff":
          rolePermissions = createdPermissions
            .filter(
              (p) =>
                (p.category === "invoices" && p.action !== "delete") ||
                (p.category === "reports" && p.action === "read")
            )
            .map((p) => p._id);
          break;
        case "Viewer":
          rolePermissions = createdPermissions
            .filter((p) => p.action === "read")
            .map((p) => p._id);
          break;
      }

      const role = new RoleModel({
        ...roleData,
        permissions: rolePermissions,
      });

      const savedRole = await role.save();
      createdRoles.push(savedRole);
      console.log(
        `✅ Created role: ${roleData.name} with ${rolePermissions.length} permissions`
      );
    }

    // Create default admin user
    console.log("📌 Creating admin user...");
    const adminRole = createdRoles.find((role) => role.name === "Admin");
    const adminUser = new UserModel({
      username: "admin",
      email: "admin@fbr.gov.pk",
      password: "admin123", // will be hashed by pre-save hook
      role: adminRole._id,
    });

    await adminUser.save();
    console.log("✅ Created admin user: admin@fbr.gov.pk (password: admin123)");

    // Update role user counts
    console.log("📌 Updating role user counts...");
    for (const role of createdRoles) {
      if (typeof role.updateUserCount === "function") {
        await role.updateUserCount();
      }
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n🔑 Login credentials:");
    console.log("   Email: admin@fbr.gov.pk");
    console.log("   Password: admin123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

await seedDatabase();
