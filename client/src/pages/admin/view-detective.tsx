import { useParams, useLocation } from "wouter";
import { useDetective, useServicesByDetective, useUpdateDetective } from "@/lib/hooks";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
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
import { useState } from "react";

export default function ViewDetective() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);

  const { data: detectiveData, isLoading: loadingDetective } = useDetective(id);
  const { data: servicesData, isLoading: loadingServices } = useServicesByDetective(id);
  const updateDetective = useUpdateDetective();

  const detective = detectiveData?.detective;
  const services = servicesData?.services || [];

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
      await updateDetective.mutateAsync({
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
              <h1 className="text-2xl font-bold">Detective Profile</h1>
              <p className="text-gray-500">Complete view of detective information</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={detective.status === "suspended" ? "default" : "destructive"}
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

        {/* Profile Overview */}
        <Card data-testid="card-profile-overview">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${detective.businessName}`} />
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
                      <Badge className="bg-blue-100 text-blue-700" data-testid="badge-verified">
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
                  <p className="text-gray-600" data-testid="text-bio">
                    {detective.bio || "No bio provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span data-testid="text-location">{detective.location || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span data-testid="text-country">{detective.country}</span>
                  </div>
                  {detective.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span data-testid="text-phone">{detective.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span data-testid="text-member-since">
                      Member since {format(new Date(detective.memberSince), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span data-testid="text-earnings">
                      Total Earnings: ${detective.totalEarnings}
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

                {detective.languages && detective.languages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {detective.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" data-testid={`badge-language-${lang}`}>
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services & Packages */}
        <Card data-testid="card-services">
          <CardHeader>
            <CardTitle>Services & Packages</CardTitle>
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
                          {service.offerPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ${service.offerPrice}
                            </p>
                          )}
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

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="card-stats-services">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" data-testid="stat-total-services">
                {services.length}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-stats-orders">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" data-testid="stat-total-orders">
                {services.reduce((sum, s) => sum + s.orderCount, 0)}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-stats-views">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" data-testid="stat-total-views">
                {services.reduce((sum, s) => sum + s.viewCount, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

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
                disabled={updateDetective.isPending}
                data-testid="button-confirm-suspend"
              >
                {updateDetective.isPending
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
