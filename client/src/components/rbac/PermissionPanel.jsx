import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export function PermissionsPanel({
  permissionCategories = [],
  role,
  setRoles,
  onPermissionsChange,
}) {
  const [saving, setSaving] = useState(false);

  if (!role) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        Select a role to view permissions
      </Card>
    );
  }

  // helper: check if permission is enabled for role
  const isPermEnabled = (perm) => {
    return (
      Array.isArray(role.permissions) &&
      role.permissions.includes(perm._id?.toString() || perm.id?.toString())
    );
  };

  // toggle single permission
  const handleToggle = async (perm, checked) => {
    const permId = perm._id?.toString() || perm.id?.toString();

    try {
      const current = Array.isArray(role.permissions)
        ? role.permissions.map((p) => p.toString())
        : [];

      let updated;
      if (checked) {
        updated = current.includes(permId) ? current : [...current, permId];
      } else {
        updated = current.filter((k) => k !== permId);
      }

      // ✅ Update frontend immediately
      setRoles((prevRoles) =>
        prevRoles.map((r) =>
          r._id === role._id ? { ...r, permissions: updated } : r
        )
      );

      setSaving(true);
      await onPermissionsChange(role._id || role.id, updated);
      toast.success("Permissions updated");
    } catch (err) {
      console.error("❌ Failed to update permissions", err);
      toast.error("Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  // toggle category
  const handleToggleCategory = async (category, enable) => {
    console.log("📂 handleToggleCategory called:", {
      role: role.name,
      category: category.name,
      enable,
      currentPermissions: role.permissions,
    });

    try {
      const current = Array.isArray(role.permissions)
        ? [...role.permissions]
        : [];
      const categoryKeys = (category.permissions || []).map(
        (p) => p._id || p.id
      );

      let updated;
      if (enable) {
        const set = new Set([...current, ...categoryKeys]);
        updated = Array.from(set);
      } else {
        updated = current.filter((k) => !categoryKeys.includes(k));
      }

      console.log("✅ Updated permissions after category toggle:", updated);

      setSaving(true);
      await onPermissionsChange(role._id || role.id, updated);
      toast.success(`${enable ? "Enabled" : "Disabled"} ${category.name}`);
    } catch (err) {
      console.error("❌ Category toggle failed", err);
      toast.error("Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Permissions for {role.name}</CardTitle>
        <div className="text-sm text-muted-foreground">{role.description}</div>
      </CardHeader>

      <CardContent>
        {/* Global Enable/Disable */}
        <div className="mb-4 flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              handleToggleCategory(
                {
                  permissions: permissionCategories.flatMap(
                    (c) => c.permissions
                  ),
                  name: "All",
                },
                true
              )
            }
          >
            Enable All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              handleToggleCategory(
                {
                  permissions: permissionCategories.flatMap(
                    (c) => c.permissions
                  ),
                  name: "All",
                },
                false
              )
            }
          >
            Disable All
          </Button>
        </div>

        {/* Accordion */}
        <Accordion type="multiple" className="w-full">
          {permissionCategories.map((category) => {
            const categoryEnabledCount = (category.permissions || []).reduce(
              (acc, p) => acc + (isPermEnabled(p) ? 1 : 0),
              0
            );
            const allEnabled =
              category.permissions &&
              category.permissions.length > 0 &&
              categoryEnabledCount === category.permissions.length;

            return (
              <AccordionItem key={category.name} value={category.name}>
                {/* Trigger (just category info, NO buttons here) */}
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="font-medium capitalize">
                        {category.name}
                      </span>
                      <Badge variant="outline">
                        {category.permissions?.length ?? 0}
                      </Badge>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {categoryEnabledCount}/{category.permissions?.length ?? 0}
                    </span>
                  </div>
                </AccordionTrigger>

                {/* Content (now contains the Enable/Disable button + permissions list) */}
                <AccordionContent>
                  <div className="mb-2 flex justify-end">
                    <Button
                      size="sm"
                      variant={allEnabled ? "secondary" : "ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCategory(category, !allEnabled);
                      }}
                    >
                      {allEnabled ? "Disable" : "Enable"} category
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(category.permissions || []).map((perm) => {
                      const enabled = isPermEnabled(perm);
                      return (
                        <div
                          key={perm._id || perm.name}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {perm.description || perm.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              key: {perm.name} • category: {perm.category}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => {
                                handleToggle(perm, checked);
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="mt-4 text-right">
          <Button size="sm" disabled={saving}>
            {saving ? "Saving..." : "Saved automatically"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
