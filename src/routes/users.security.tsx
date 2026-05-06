import { createFileRoute } from "@tanstack/react-router";
import { Shield, KeyRound, Lock, Activity, CheckCircle2 } from "lucide-react";
import { ModuleShell } from "@/components/ModuleShell";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usersSubnav } from "@/lib/subnavs";

export const Route = createFileRoute("/users/security")({
  component: Security,
});

const settings = [
  { label: "Single Sign-On (Azure AD)", desc: "Federated login through corporate identity provider", on: true },
  { label: "Multi-factor Authentication", desc: "Required for all roles, TOTP or hardware key", on: true },
  { label: "Session Timeout", desc: "Auto-logout after 30 min of inactivity", on: true },
  { label: "IP Allowlist", desc: "Restrict access to corporate VPN ranges", on: false },
  { label: "Document-level RBAC", desc: "Fine-grained permissions per tender folder", on: true },
  { label: "Audit Logging", desc: "Track every view, edit, and export action", on: true },
];

const audit = [
  { who: "Vikram Singh", what: "Exported PDF report — ADNOC-PMP-2025-0421", when: "2 min ago" },
  { who: "Priya Iyer", what: "Approved 12 low-confidence fields", when: "18 min ago" },
  { who: "Rahul Kapoor", what: "Reviewed deviation: LD cap 7.5%", when: "1 hr ago" },
  { who: "Aarav Mehta", what: "Uploaded Saudi Aramco LSTK-9912.pdf", when: "2 hr ago" },
];

function Security() {
  return (
    <ModuleShell
      eyebrow="Module 06 · User Management"
      title="Authentication & Security"
      description="Secure login, role-based access control, and full audit logging to protect sensitive tender and commercial data."
      subnav={usersSubnav}
      actions={<Button variant="outline"><Activity className="h-4 w-4" /> Full audit log</Button>}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Security Settings
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Workspace-wide policies enforced for all users.</p>
            <div className="space-y-4">
              {settings.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-4 p-4 rounded-lg border">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Switch defaultChecked={s.on} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-gradient-primary text-primary-foreground border-0">
            <CardContent className="p-5">
              <Lock className="h-5 w-5 mb-2" />
              <h4 className="font-semibold mb-1">Compliance</h4>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {["SOC 2 Type II", "ISO 27001", "GDPR", "AES-256"].map((c) => (
                  <Badge key={c} className="bg-white/20 hover:bg-white/30 border-0 text-white">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> {c}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Recent Activity
              </h4>
              <div className="space-y-3">
                {audit.map((a, i) => (
                  <div key={i} className="text-xs">
                    <p className="font-medium">{a.who}</p>
                    <p className="text-muted-foreground">{a.what}</p>
                    <p className="text-muted-foreground/70 mt-0.5">{a.when}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleShell>
  );
}
