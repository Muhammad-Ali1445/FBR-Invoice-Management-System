import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    key: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ["invoices", "reports", "system", "user_management"],
      required: true,
    },
    resource: { type: String, required: true }, // e.g. "invoice"
    action: {
      type: String,
      enum: [
        "create",
        "read",
        "update",
        "delete",
        "approve",
        "validate",
        "export",
      ],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

const PermissionModel = mongoose.model("Permission", permissionSchema);
export default PermissionModel;
