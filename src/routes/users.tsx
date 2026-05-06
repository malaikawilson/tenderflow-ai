import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Shield, Search, MoreVertical } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/users")({
  component: Users,
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

function Users() {
  return (
    <div className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Module 06"
        title="User Management"
        description="Secure access control with role-based permissions for engineering, sales, commercial, and admin teams."
        actions={
          <>
            <Button variant="outline">
              <Shield className="h-4 w-4" /> Audit Log
            </Button>
            <Button className="bg-gradient-primary">
              <UserPlus className="h-4 w-4" /> Invite User
            </Button>
          </>
        }
      />

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: "Total Users", v: "24" },
          { l: "Active Now", v: "8", c: "text-success" },
          { l: "Pending Invites", v: "3", c: "text-warning" },
          { l: "Admins", v: "2", c: "text-primary" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className={`text-2xl font-bold mt-1 ${s.c ?? ""}`}>{s.v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <h3 className="font-semibold">Team</h3>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users…" className="pl-9" />
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
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
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === "Active" ? "bg-success" : "bg-warning"
                          }`}
                        />
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
    </div>
  );
}
