import mongoose from "mongoose";
const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true }, // Admin, Staff, Viewer
    description: { type: String },
    icon: { type: String },
    color: { type: String },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    isActive: { type: Boolean, default: true },
    userCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-update user count
roleSchema.methods.updateUserCount = async function () {
  const User = mongoose.model("User");
  this.userCount = await User.countDocuments({
    role: this._id,
    isActive: true,
  });
  await this.save();
};

const RoleModel = mongoose.model("Role", roleSchema);
export default RoleModel;
