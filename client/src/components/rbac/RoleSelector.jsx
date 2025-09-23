import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/**
 * props:
 *  - roles: array of role objects from mockRoles
 *  - selectedRole: currently selected role object
 *  - onRoleSelect: fn(role) => void
 */
export function RoleSelector({ roles = [], selectedRole, onRoleSelect }) {
  if (!roles || roles.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No roles available
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>System Roles</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {roles.map((role) => {
          const isActive =
            selectedRole && (selectedRole._id || selectedRole.id) === (role._id || role.id);

          return (
            <div
              key={role._id || role.id}
              onClick={() => onRoleSelect?.(role)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition
                ${isActive ? "bg-primary/10 border-primary" : "hover:bg-muted/30"}`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <span className="text-xs font-bold">
                    {role.name?.[0]?.toUpperCase() || "R"}
                  </span>
                </Avatar>

                <div>
                  <p className="font-medium">{role.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {role.description || ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {role.userCount ?? 0} users
                  </p>
                </div>
              </div>

              <Badge variant={isActive ? "default" : "outline"}>
                {role.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
