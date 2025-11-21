import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, MousePointer, DollarSign } from "lucide-react";

export default function DetectiveDashboard() {
  return (
    <DashboardLayout role="detective">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold font-heading text-gray-900">My Dashboard</h2>
             <p className="text-gray-500">Manage your profile, orders, and performance.</p>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-sm px-3 py-1">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
            Online Status: Active
          </Badge>
        </div>

        {/* Profile Completion */}
        <Card className="bg-gray-900 text-white border-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Complete your profile</h3>
              <p className="text-gray-400 text-sm">Add your certifications to reach 100% completion and get verified.</p>
              <div className="w-64 pt-2">
                 <div className="flex justify-between text-xs mb-1">
                   <span>75% Complete</span>
                 </div>
                 <Progress value={75} className="h-2 bg-gray-700" /> 
              </div>
            </div>
            <Link href="/detective/profile">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Update Profile</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Earnings (Aug)</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,250</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <h3 className="text-xl font-bold font-heading mt-8">Active Orders</h3>
        <Card>
          <CardContent className="p-0">
             <div className="grid grid-cols-5 p-4 border-b border-gray-100 bg-gray-50 font-semibold text-sm text-gray-500">
               <div className="col-span-2">Client / Service</div>
               <div>Price</div>
               <div>Due Date</div>
               <div>Status</div>
             </div>
             {[1, 2].map((i) => (
               <div key={i} className="grid grid-cols-5 p-4 border-b border-gray-100 items-center last:border-0 hover:bg-gray-50/50 transition-colors">
                 <div className="col-span-2 flex items-center gap-3">
                   <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">C{i}</div>
                   <div>
                     <div className="font-bold text-sm">Client Name {i}</div>
                     <div className="text-xs text-gray-500">Background Check Standard</div>
                   </div>
                 </div>
                 <div className="font-medium">$300</div>
                 <div className="text-sm text-gray-500">Aug 24, 2025</div>
                 <div><Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">In Progress</Badge></div>
               </div>
             ))}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
