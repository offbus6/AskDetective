import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useDetective, useServicesByDetective } from "@/lib/hooks";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  DollarSign,
  Package,
  Ban,
  CheckCircle,
  Clock,
  Briefcase,
  Save,
  ShieldCheck,
  Key,
  Copy
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ViewDetective() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: detectiveData, isLoading: loadingDetective } = useDetective(id);
  const { data: servicesData, isLoading: loadingServices } = useServicesByDetective(id);
  
  const adminUpdateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.detectives.adminUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detectives", id] });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (id: string) => api.detectives.resetPassword(id),
  });

  const detective = detectiveData?.detective;
  const services = servicesData?.services || [];

  const [editForm, setEditForm] = useState({
    businessName: "",
    bio: "",
    location: "",
    phone: "",
    whatsapp: "",
    languages: [] as string[],
  });

  // Initialize form when detective data loads
  useState(() => {
    if (detective && !isEditing) {
      setEditForm({
        businessName: detective.businessName || "",
        bio: detective.bio || "",
        location: detective.location || "",
        phone: detective.phone || "",
        whatsapp: detective.whatsapp || "",
        languages: detective.languages || [],
      });
    }
  });

  const handleBack = () => {
    setLocation("/admin/detectives");
  };

  const handleSuspendClick = () => {
    setShowSuspendDialog(true);
  };

  const handleConfirmSuspend = async () => {
    if (!detective) return;

    try {
      const newStatus = detective.status === "suspended" ? "active" : "suspended";
      await adminUpdateMutation.mutateAsync({
        id: detective.id,
        data: { status: newStatus },
      });

      toast({
        title: newStatus === "suspended" ? "Detective Suspended" : "Detective Unsuspended",
        description: newStatus === "suspended" 
          ? "The detective has been suspended and cannot login or receive orders."
          : "The detective has been unsuspended and can now login and receive orders.",
      });

      setShowSuspendDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update detective status",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!detective) return;

    try {
      await adminUpdateMutation.mutateAsync({
        id: detective.id,
        data: editForm,
      });

      toast({
        title: "Profile Updated",
        description: "Detective profile has been successfully updated.",
      });

      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update detective profile",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!detective) return;

    try {
      await adminUpdateMutation.mutateAsync({
        id: detective.id,
        data: { status: newStatus as any },
      });

      toast({
        title: "Status Updated",
        description: `Detective status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!detective) return;

    try {
      const result = await resetPasswordMutation.mutateAsync(detective.id);
      setTemporaryPassword(result.temporaryPassword);
      setShowPasswordDialog(true);

      toast({
        title: "Password Reset",
        description: "A temporary password has been generated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(temporaryPassword);
    toast({
      title: "Copied!",
      description: "Temporary password copied to clipboard.",
    });
  };

  if (loadingDetective) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading detective details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!detective) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl text-gray-600">Detective not found</p>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Detectives
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Detectives
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <div>
              <h1 className="text-2xl font-bold">Detective Management</h1>
              <p className="text-gray-500">View and manage complete detective profile</p>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={adminUpdateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {adminUpdateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <Card data-testid="card-profile-header">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                <AvatarImage src={detective.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${detective.businessName}`} />
                <AvatarFallback className="text-2xl">
                  {getInitials(detective.businessName || "Detective")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold" data-testid="text-business-name">
                      {detective.businessName}
                    </h2>
                    <Badge
                      className={
                        detective.status === "active"
                          ? "bg-green-100 text-green-700"
                          : detective.status === "suspended"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                      data-testid="badge-status"
                    >
                      {detective.status}
                    </Badge>
                    {detective.isVerified && (
                      <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1" data-testid="badge-verified">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="capitalize"
                      data-testid="badge-plan"
                    >
                      {detective.subscriptionPlan} Plan
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span data-testid="text-member-since">
                      Member since {format(new Date(detective.memberSince), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span data-testid="text-earnings">
                      Earnings: ${detective.totalEarnings}
                    </span>
                  </div>
                  {detective.lastActive && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span data-testid="text-last-active">
                        Last active {format(new Date(detective.lastActive), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="admin">Admin Controls</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Edit detective's profile information" : "View detective's profile information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    {isEditing ? (
                      <Input 
                        value={editForm.businessName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, businessName: e.target.value }))}
                        data-testid="input-edit-businessName"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium" data-testid="text-businessName">
                        {detective.businessName || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    {isEditing ? (
                      <Input 
                        value={editForm.location}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        data-testid="input-edit-location"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium" data-testid="text-location">
                        {detective.location || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <p className="text-gray-900 font-medium" data-testid="text-country">
                      {detective.country}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address (Login)</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900 font-medium" data-testid="text-email">
                        {(detective as any).email || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input 
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        data-testid="input-edit-phone"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium" data-testid="text-phone">
                        {detective.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    {isEditing ? (
                      <Input 
                        value={editForm.whatsapp}
                        onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                        data-testid="input-edit-whatsapp"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium" data-testid="text-whatsapp">
                        {detective.whatsapp || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea 
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      data-testid="input-edit-bio"
                    />
                  ) : (
                    <p className="text-gray-900" data-testid="text-bio">
                      {detective.bio || "No bio provided"}
                    </p>
                  )}
                </div>

                {detective.languages && detective.languages.length > 0 && (
                  <div className="space-y-2">
                    <Label>Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {detective.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" data-testid={`badge-language-${lang}`}>
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card data-testid="card-services">
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
                <CardDescription>
                  All services offered by this detective
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingServices ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading services...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No services created yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Card key={service.id} className="border-l-4 border-l-blue-500" data-testid={`service-${service.id}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg" data-testid={`service-title-${service.id}`}>
                                  {service.title}
                                </CardTitle>
                                <Badge variant="outline" data-testid={`service-category-${service.id}`}>
                                  {service.category}
                                </Badge>
                                {service.isActive ? (
                                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                                )}
                              </div>
                              <CardDescription data-testid={`service-description-${service.id}`}>
                                {service.description}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Base Price</p>
                              <p className="text-xl font-bold text-blue-600" data-testid={`service-price-${service.id}`}>
                                ${service.basePrice}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              <span>{service.orderCount} orders</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>👁️ {service.viewCount} views</span>
                            </div>
                            <div className="text-gray-500">
                              Created {format(new Date(service.createdAt), "MMM d, yyyy")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>Manage detective's subscription and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Current Plan</Label>
                    <p className="text-2xl font-bold capitalize">{detective.subscriptionPlan}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Status</Label>
                    <Badge
                      className={
                        detective.status === "active"
                          ? "bg-green-100 text-green-700 text-lg px-4 py-1"
                          : "bg-red-100 text-red-700 text-lg px-4 py-1"
                      }
                    >
                      {detective.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Verified Status</Label>
                    <p className="text-gray-900 font-medium">
                      {detective.isVerified ? "✓ Verified" : "Not Verified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Total Earnings</Label>
                    <p className="text-2xl font-bold text-green-600">${detective.totalEarnings}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Total Services</p>
                        <p className="text-3xl font-bold">{services.length}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-3xl font-bold">
                          {services.reduce((sum, s) => sum + s.orderCount, 0)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Total Views</p>
                        <p className="text-3xl font-bold">
                          {services.reduce((sum, s) => sum + s.viewCount, 0)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Controls Tab */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Controls</CardTitle>
                <CardDescription>Administrative actions and status management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Change Account Status</Label>
                    <div className="flex gap-2 mt-2">
                      <Select value={detective.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-48" data-testid="select-admin-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Password Management</Label>
                    <p className="text-sm text-gray-500">Reset the detective's password and generate a temporary password</p>
                    <Button
                      variant="outline"
                      onClick={handleResetPassword}
                      disabled={resetPasswordMutation.isPending}
                      data-testid="button-reset-password"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-red-600">Danger Zone</h3>
                    <Button
                      variant="destructive"
                      onClick={handleSuspendClick}
                      data-testid="button-suspend-toggle"
                    >
                      {detective.status === "suspended" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Unsuspend Account
                        </>
                      ) : (
                        <>
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Account
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Password Reset Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent data-testid="dialog-password-reset">
            <DialogHeader>
              <DialogTitle>Password Reset Successful</DialogTitle>
              <DialogDescription>
                A temporary password has been generated for {(detective as any).email || "this detective"}. Share this password securely with the detective.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Label className="text-sm text-gray-600">Temporary Password</Label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 text-lg font-mono bg-white px-4 py-2 rounded border border-gray-300" data-testid="text-temp-password">
                    {temporaryPassword}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPassword}
                    data-testid="button-copy-password"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-amber-600">
                  ⚠️ <strong>Security Notice:</strong> This password will only be shown once. Share it securely with the detective via a secure channel.
                </p>
                <p className="text-sm text-gray-500">
                  💡 <strong>Best Practice:</strong> Advise the detective to change this password immediately after their first login.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowPasswordDialog(false)} data-testid="button-close-password-dialog">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspend Dialog */}
        <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <AlertDialogContent data-testid="dialog-suspend-detective">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {detective.status === "suspended" ? "Unsuspend Detective Account" : "Suspend Detective Account"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {detective.status === "suspended"
                  ? "Are you sure you want to unsuspend this detective? They will be able to login and receive new orders again."
                  : "Are you sure you want to suspend this detective? They will not be able to login or receive new orders."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-suspend">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmSuspend}
                className={
                  detective.status === "suspended"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
                disabled={adminUpdateMutation.isPending}
                data-testid="button-confirm-suspend"
              >
                {adminUpdateMutation.isPending
                  ? "Processing..."
                  : detective.status === "suspended"
                  ? "Unsuspend"
                  : "Suspend"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
