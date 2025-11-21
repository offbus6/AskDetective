import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, MapPin, Shield } from "lucide-react";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";

export default function DetectiveProfileEdit() {
  return (
    <DashboardLayout role="detective">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold font-heading text-gray-900">My Profile</h2>
          <Button variant="outline">View Public Profile</Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="services">Services & Pricing</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>
          
          {/* General Info Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={maleAvatar} />
                    <AvatarFallback>JB</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue="James Bond" />
                  </div>
                  <div className="space-y-2">
                    <Label>Professional Title</Label>
                    <Input defaultValue="Senior Private Investigator" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input className="pl-9" defaultValue="London, UK" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea className="h-32" defaultValue="Former MI6 operative turned private investigator. Specializing in high-stakes surveillance, asset recovery, and deep-dive background checks. I have access to databases that others don't. When you need the truth, I'm the one you call." />
                </div>

                <div className="space-y-2">
                  <Label>Languages</Label>
                  <Input defaultValue="English, French, German" />
                </div>
                
                <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Background Check Service</h3>
                      <Badge>Active</Badge>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="font-bold text-sm mb-2">Basic</div>
                        <Input type="number" defaultValue="150" prefix="$" className="mb-2 bg-white" />
                        <Textarea className="text-xs h-20 bg-white" defaultValue="Basic criminal record check and address verification." />
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="font-bold text-sm mb-2">Standard</div>
                        <Input type="number" defaultValue="300" prefix="$" className="mb-2 bg-white" />
                        <Textarea className="text-xs h-20 bg-white" defaultValue="Includes Basic + Social media analysis and employment verification." />
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="font-bold text-sm mb-2">Premium</div>
                        <Input type="number" defaultValue="800" prefix="$" className="mb-2 bg-white" />
                        <Textarea className="text-xs h-20 bg-white" defaultValue="Complete 360° profile including on-site verification." />
                      </div>
                   </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">Save Packages</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification">
            <Card>
               <CardHeader>
                 <CardTitle>Identity Verification</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 bg-green-50 p-4 rounded-md border border-green-200 text-green-800">
                    <Shield className="h-6 w-6" />
                    <div>
                      <p className="font-bold">Identity Verified</p>
                      <p className="text-sm">Your ID and License have been verified by our team.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 opacity-50 pointer-events-none">
                    <div className="space-y-2">
                       <Label>Private Investigator License</Label>
                       <div className="border rounded-md p-3 flex items-center justify-between bg-gray-50">
                          <span>license_doc_2025.pdf</span>
                          <Badge variant="outline">Verified</Badge>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Government ID</Label>
                       <div className="border rounded-md p-3 flex items-center justify-between bg-gray-50">
                          <span>passport_scan.jpg</span>
                          <Badge variant="outline">Verified</Badge>
                       </div>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
