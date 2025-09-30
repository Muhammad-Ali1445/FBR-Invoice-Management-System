import React, { useMemo, useState } from "react";
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

  // normalize role permission IDs to a Set of strings
  const rolePermissionIds = useMemo(() => {
    if (!role || !Array.isArray(role.permissions)) return new Set();
    return new Set(
      role.permissions.map((p) =>
        typeof p === "string"
          ? p
          : p._id?.toString?.() || p.id?.toString?.() || ""
      )
    );
  }, [role]);

  // If permissionCategories are provided by API, use them. If empty, fall back to categories built from role.permissions
  const categories = useMemo(() => {
    if (Array.isArray(permissionCategories) && permissionCategories.length > 0) {
      return permissionCategories;
    }

    // fallback: build categories from role.permissions (which should be populated objects)
    const groups = {};
    (role?.permissions || []).forEach((perm) => {
      const cat = perm.category || "uncategorized";
      if (!groups[cat]) groups[cat] = { name: cat, permissions: [] };
      groups[cat].permissions.push(perm);
    });
    return Object.values(groups);
  }, [permissionCategories, role]);

  const isPermEnabled = (perm) => {
    const id = perm._id?.toString?.() || perm.id?.toString?.() || "";
    return rolePermissionIds.has(id);
  };

  // toggle a single permission -> build updated IDs array and call parent handler
  const handleToggle = async (perm, checked) => {
    if (!role) return;
    const permId = perm._id?.toString?.() || perm.id?.toString?.();
    const currentIds = Array.from(rolePermissionIds);

    let updatedIds;
    if (checked) {
      updatedIds = currentIds.includes(permId) ? currentIds : [...currentIds, permId];
    } else {
      updatedIds = currentIds.filter((id) => id !== permId);
    }

    try {
      setSaving(true);
      // parent will call the API and update selectedRole in state
      await onPermissionsChange(role._id || role.id, updatedIds);
      // success toast handled in parent — optional local toast:
      // toast.success("Permissions updated");
    } catch (err) {
      console.error("Failed to update permission:", err);
      toast.error("Failed to update permission");
    } finally {
      setSaving(false);
    }
  };

  // toggle whole category
  const handleToggleCategory = async (category, enable) => {
    if (!role) return;
    const categoryIds = (category.permissions || []).map(
      (p) => p._id?.toString?.() || p.id?.toString?.()
    );
    
    const currentIds = Array.from(rolePermissionIds);
    let updatedIds;
    if (enable) {
      const set = new Set([...currentIds, ...categoryIds]);
      updatedIds = Array.from(set);
    } else {
      updatedIds = currentIds.filter((id) => !categoryIds.includes(id));
    }

    try {
      setSaving(true);
      await onPermissionsChange(role._id || role.id, updatedIds);
    } catch (err) {
      console.error("Category toggle failed:", err);
      toast.error("Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  if (!role) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        Select a role to view permissions
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Permissions for {role.name}</CardTitle>
        <div className="text-sm text-muted-foreground">{role.description}</div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              const all = categories.flatMap((c) => c.permissions || []);
              const allIds = all.map((p) => p._id?.toString?.() || p.id?.toString?.());
              handleToggleCategory({ permissions: all }, true);
            }}
          >
            Enable All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              handleToggleCategory({ permissions: categories.flatMap((c) => c.permissions || []) }, false);
            }}
          >
            Disable All
          </Button>
        </div>

        <Accordion type="multiple" className="w-full">
          {categories.map((category) => {
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
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="font-medium capitalize">{category.name}</span>
                      <Badge variant="outline">{category.permissions?.length ?? 0}</Badge>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {categoryEnabledCount}/{category.permissions?.length ?? 0}
                    </span>
                  </div>
                </AccordionTrigger>

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
                              key: {perm.key} • category: {perm.category}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => handleToggle(perm, checked)}
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
