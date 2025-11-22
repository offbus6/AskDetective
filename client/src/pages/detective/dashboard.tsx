import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, MousePointer, MessageSquare, AlertCircle, Ban, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCurrentDetective } from "@/lib/hooks";

export default function DetectiveDashboard() {
  const { data, isLoading, error } = useCurrentDetective();
  const detective = data?.detective;

  if (isLoading) {
    return (
      <DashboardLayout role="detective">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !detective) {
    return (
      <DashboardLayout role="detective">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Profile</AlertTitle>
          <AlertDescription>
            Unable to load your detective profile. Please try again later.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const accountStatus = detective.status;
  
  // Calculate profile completion based on filled fields
  const totalFields = 7;
  const filledFields = [
    detective.businessName,
    detective.bio,
    detective.location,
    detective.phone,
    detective.whatsapp,
    detective.languages?.length,
    detective.country,
  ].filter(Boolean).length;
  const completionPercentage = Math.round((filledFields / totalFields) * 100);

  return (
    <DashboardLayout role="detective">
      <div className="space-y-8">
        {/* Status Banners */}
        {accountStatus === 'pending' && (
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-800" />
            <AlertTitle>Application Under Review</AlertTitle>
            <AlertDescription>
              Your application is currently being reviewed by our team. You will be notified once approved (usually within 24-48 hours).
            </AlertDescription>
          </Alert>
        )}

        {accountStatus === 'suspended' && (
          <Alert variant="destructive">
            <Ban className="h-4 w-4" />
            <AlertTitle>Account Suspended</AlertTitle>
            <AlertDescription>
              Your account has been suspended. Please contact support@detectiveportal.com for assistance.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold font-heading text-gray-900">
               Welcome, {detective.businessName}
             </h2>
             <p className="text-gray-500">Manage your profile, reviews, and performance.</p>
          </div>
          
          {accountStatus === 'active' && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-sm px-3 py-1">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
              Online Status: Active
            </Badge>
          )}
        </div>

        {/* Profile Completion - Only show if not 100% complete */}
        {completionPercentage < 100 && (
          <Card className="bg-gray-900 text-white border-none">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Complete your profile</h3>
                <p className="text-gray-400 text-sm">Add your certifications to reach 100% completion and get verified.</p>
                <div className="w-64 pt-2">
                   <div className="flex justify-between text-xs mb-1">
                     <span>{completionPercentage}% Complete</span>
                   </div>
                   <Progress value={completionPercentage} className="h-2 bg-gray-700" /> 
                </div>
              </div>
              <Link href="/detective/profile">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Update Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.0</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        <h3 className="text-xl font-bold font-heading mt-8">Recent Reviews</h3>
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <p>No reviews yet. Reviews will appear here once clients start submitting feedback.</p>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
