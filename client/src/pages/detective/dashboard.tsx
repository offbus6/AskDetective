import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, MousePointer, MessageSquare, AlertCircle, Ban } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export default function DetectiveDashboard() {
  // Mock status: 'pending' | 'approved' | 'suspended'
  // In a real app, this would come from the backend/auth context
  const [accountStatus] = useState<'pending' | 'approved' | 'suspended'>('pending');
  
  // Mock profile completion percentage
  // If 100%, the completion card will be hidden
  const [completionPercentage] = useState(75);

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
             <h2 className="text-3xl font-bold font-heading text-gray-900">My Dashboard</h2>
             <p className="text-gray-500">Manage your profile, reviews, and performance.</p>
          </div>
          
          {accountStatus === 'approved' && (
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
              <div className="text-2xl font-bold">2.4k</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">843</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.0</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        <h3 className="text-xl font-bold font-heading mt-8">Recent Reviews</h3>
        <Card>
          <CardContent className="p-0">
             <div className="grid grid-cols-4 p-4 border-b border-gray-100 bg-gray-50 font-semibold text-sm text-gray-500">
               <div className="col-span-2">Client / Comment</div>
               <div>Rating</div>
               <div className="text-right">Action</div>
             </div>
             {[1, 2].map((i) => (
               <div key={i} className="grid grid-cols-4 p-4 border-b border-gray-100 items-center last:border-0 hover:bg-gray-50/50 transition-colors">
                 <div className="col-span-2 flex items-center gap-3">
                   <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">C{i}</div>
                   <div>
                     <div className="font-bold text-sm">Client Name {i}</div>
                     <div className="text-xs text-gray-500 italic">"Great service, very discreet..."</div>
                   </div>
                 </div>
                 <div className="flex text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                 </div>
                 <div className="text-right">
                    <Button size="sm" variant="outline" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" /> Reply
                    </Button>
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
