import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Layers, Shield, RefreshCw, Mail } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeOnlyDefault, setActiveOnlyDefault] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("fd_admin_activeOnlyDefault");
    setActiveOnlyDefault(stored === "true");
  }, []);

  const handleToggleActiveOnlyDefault = (val: boolean) => {
    setActiveOnlyDefault(val);
    localStorage.setItem("fd_admin_activeOnlyDefault", String(val));
    toast({ title: "Preference Saved", description: val ? "Showing only active categories by default" : "Showing all categories by default" });
  };

  const handleClearCaches = async () => {
    queryClient.clear();
    toast({ title: "Cache Cleared", description: "Client caches cleared. Reloading..." });
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-heading text-gray-900">Super Admin Settings</h2>
            <p className="text-gray-500 mt-1">Platform controls and admin preferences</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-green-600" /> Service Categories</CardTitle>
            <CardDescription>Control admin defaults and manage categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Show only active categories by default</Label>
                <p className="text-sm text-gray-500">Admin UI preference; public pages already filter by active</p>
              </div>
              <Switch checked={activeOnlyDefault} onCheckedChange={handleToggleActiveOnlyDefault} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Manage Service Categories</Label>
                <p className="text-sm text-gray-500">Create, deactivate, or delete categories</p>
              </div>
              <Link href="/admin/service-categories">
                <Button variant="outline">Open Categories</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-600" /> Maintenance</CardTitle>
            <CardDescription>Operational tools for the admin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Clear client caches</Label>
                <p className="text-sm text-gray-500">Forces fresh data across admin UI</p>
              </div>
              <Button onClick={handleClearCaches} className="bg-green-600 hover:bg-green-700"><RefreshCw className="h-4 w-4 mr-2" /> Clear Caches</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-green-600" /> Email & Notifications</CardTitle>
            <CardDescription>SMTP settings are environment-based; contact DevOps to update .env</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Outbound email uses server-side configuration (SMTP host, user, and password). Changes require updating environment variables and redeploying the server.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

