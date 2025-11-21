import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, MapPin, Shield, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";

const ALL_SERVICES = ["Surveillance", "Background Checks", "Missing Persons", "Infidelity", "Corporate Fraud", "Cyber Investigation"];

export default function DetectiveProfileEdit() {
  const [services, setServices] = useState([
    { name: "Surveillance", startPrice: "150", endPrice: "500", offerPrice: "120" },
    { name: "Background Checks", startPrice: "100", endPrice: "300", offerPrice: "" }
  ]);

  const [newService, setNewService] = useState("");

  const availableServices = ALL_SERVICES.filter(s => !services.find(existing => existing.name === s));

  const addService = () => {
    if (newService) {
      setServices([...services, { name: newService, startPrice: "", endPrice: "", offerPrice: "" }]);
      setNewService("");
    }
  };

  const removeService = (name: string) => {
    setServices(services.filter(s => s.name !== name));
  };

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
                <CardTitle>Personal & Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage src={maleAvatar} />
                    <AvatarFallback>JB</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label className="block mb-2 font-medium">Profile Photo or Company Logo</Label>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" /> Upload New Image
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input defaultValue="Bond Investigations Ltd." />
                  </div>
                   <div className="space-y-2">
                    <Label>Registration Number / GST</Label>
                    <Input defaultValue="UK-REG-882910" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select defaultValue="UK">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="IN">India</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>State / Region</Label>
                    <Input defaultValue="London" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Registered Address</Label>
                    <Textarea className="h-20" defaultValue="221B Baker Street, London, NW1 6XE, United Kingdom" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Registered</Label>
                    <Input type="date" defaultValue="2015-05-15" />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-bold mb-4">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue="James Bond" />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Title</Label>
                      <Input defaultValue="Senior Private Investigator" />
                    </div>
                    <div className="space-y-2">
                      <Label>Years of Experience</Label>
                      <Input type="number" defaultValue="15" />
                    </div>
                    <div className="space-y-2">
                      <Label>Languages</Label>
                      <Input defaultValue="English, French, German" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea className="h-32" defaultValue="Former MI6 operative turned private investigator. Specializing in high-stakes surveillance, asset recovery, and deep-dive background checks. I have access to databases that others don't. When you need the truth, I'm the one you call." />
                </div>
                
                <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.name} className="border rounded-lg p-4 bg-gray-50 relative hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 h-8 w-8 p-0" onClick={() => removeService(service.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Starting Price</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">£</span>
                            <Input className="pl-7 bg-white" defaultValue={service.startPrice} placeholder="Min" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Ending Price (Optional)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">£</span>
                            <Input className="pl-7 bg-white" defaultValue={service.endPrice} placeholder="Max" />
                          </div>
                        </div>
                         <div className="space-y-2">
                          <Label className="text-xs text-green-600 font-bold">Offer Price (Deal)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-green-600 text-sm">£</span>
                            <Input className="pl-7 bg-green-50 border-green-200 text-green-700 font-bold" defaultValue={service.offerPrice} placeholder="Offer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {availableServices.length > 0 && (
                  <div className="flex items-end gap-4 pt-4 border-t">
                    <div className="space-y-2 flex-1">
                      <Label>Add Extra Service</Label>
                      <Select onValueChange={setNewService} value={newService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service to add..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableServices.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addService} disabled={!newService} className="bg-gray-900 text-white hover:bg-gray-800">
                      <Plus className="h-4 w-4 mr-2" /> Add Service
                    </Button>
                  </div>
                )}

                <div className="pt-4">
                   <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">Save Services</Button>
                </div>
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
