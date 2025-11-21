import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, User } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function UserDashboard() {
  // Mock visited profiles data
  const visitedProfiles = [
    { id: 1, name: "James Bond", title: "Senior Private Investigator", location: "London, UK", image: null, date: "2 hours ago" },
    { id: 2, name: "Sherlock Holmes", title: "Consulting Detective", location: "London, UK", image: null, date: "Yesterday" },
    { id: 3, name: "Nancy Drew", title: "Amateur Sleuth", location: "River Heights, US", image: null, date: "3 days ago" },
  ];

  return (
    <DashboardLayout role="user">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold font-heading text-gray-900">User Dashboard</h2>
             <p className="text-gray-500">Manage your account and view your history.</p>
          </div>
        </div>

        {/* Visited Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Visited Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitedProfiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={profile.image || ""} />
                      <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-gray-900">{profile.name}</h4>
                      <p className="text-sm text-gray-500">{profile.title} • {profile.location}</p>
                      <p className="text-xs text-gray-400 mt-1">Visited {profile.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/detective/${profile.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" /> View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-red-900">Delete Account</h4>
                <p className="text-sm text-red-700">Permanently delete your account and all of your data.</p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete Account</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
