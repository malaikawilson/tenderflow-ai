import { useState } from "react";
import { Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AuthEntry({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) return;
    onAuthenticated();
    try {
      localStorage.setItem("pumpiq.authenticated", "true");
      localStorage.setItem("pumpiq.user.email", email.trim());
      if (mode === "signup") localStorage.setItem("pumpiq.user.name", name.trim());
    } catch {
      // If storage is blocked (privacy mode), still allow session UI access.
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
            <Droplets className="h-5 w-5 text-white" />
          </div>
          <div className="text-white">
            <p className="text-xl font-bold leading-tight">PumpIQ</p>
            <p className="text-xs uppercase tracking-wider text-blue-100">Tender Intelligence</p>
          </div>
        </div>

        <Card className="border-white/20 bg-white/95 backdrop-blur shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex rounded-lg bg-muted p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
            <CardTitle className="text-lg pt-2">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <Input
                type="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full bg-gradient-primary">
                {mode === "login" ? "Login to PumpIQ" : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
