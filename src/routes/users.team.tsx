import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Search, MoreVertical } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usersSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/users/team")({
  component: Team,
});

const users = [
  { name: "Aarav Mehta", email: "aarav@kbl.com", role: "Sales Engineer", status: "Active", last: "2 min ago" },
  { name: "Priya Iyer", email: "priya@kbl.com", role: "Engineering Lead", status: "Active", last: "12 min ago" },
  { name: "Rahul Kapoor", email: "rahul@kbl.com", role: "Commercial Manager", status: "Active", last: "1 hr ago" },
  { name: "Sara Khan", email: "sara@kbl.com", role: "Reviewer", status: "Active", last: "3 hr ago" },
  { name: "Vikram Singh", email: "vikram@kbl.com", role: "Admin", status: "Active", last: "Just now" },
  { name: "Neha Sharma", email: "neha@kbl.com", role: "Sales Engineer", status: "Invited", last: "Pending" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-primary/15 text-primary",
  "Engineering Lead": "bg-success/10 text-success",
  "Commercial Manager": "bg-accent text-accent-foreground",
  "Sales Engineer": "bg-muted text-foreground",
  Reviewer: "bg-warning/15 text-warning",
};

function Team() {
  return (
    <ModuleShell
      eyebrow="Module 06 · User Management"
      title="Team & Roles"
      description="Manage users, roles, and tender-level permissions for engineering, sales, commercial, and admin teams."
      subnav={usersSubnav}
      actions={
        <Button className="bg-gradient-primary">
          <UserPlus className="h-4 w-4" /> Invite User
        </Button>
      }
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <h3 className="font-semibold">Team ({users.length})</h3>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users…" className="pl-9" />
            </div>
          </div>
          <div className="rounded-xl border overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Last Active</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.email} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                          {u.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={roleColors[u.role] || "bg-muted"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-success" : "bg-warning"}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.last}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </ModuleShell>
  );
}
