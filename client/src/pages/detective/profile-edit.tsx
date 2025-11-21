import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, MapPin, Shield, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";

const ALL_SERVICES = ["Surveillance", "Background Checks", "Missing Persons", "Infidelity", "Corporate Fraud", "Cyber Investigation"];

type PackageTier = 'basic' | 'standard' | 'premium';

interface PackageDetails {
  name: string;
  description: string;
  price: string;
  deliveryTime: string;
  revisions: string;
  features: string[];
}

interface Service {
  name: string;
  description: string; // General service description
  packages: {
    basic: PackageDetails;
    standard: PackageDetails;
    premium: PackageDetails;
  };
}

const DEFAULT_PACKAGE: PackageDetails = {
  name: "",
  description: "",
  price: "",
  deliveryTime: "3 Days",
  revisions: "1",
  features: []
};

export default function DetectiveProfileEdit() {
  const [services, setServices] = useState<Service[]>([
    { 
      name: "Surveillance", 
      description: "Professional covert surveillance services for personal and corporate matters. We use state-of-the-art equipment to gather evidence discreetly.",
      packages: {
        basic: { ...DEFAULT_PACKAGE, name: "Basic Watch", price: "150", description: "4 hours of surveillance with basic report." },
        standard: { ...DEFAULT_PACKAGE, name: "Standard Day", price: "300", description: "8 hours of surveillance with video evidence." },
        premium: { ...DEFAULT_PACKAGE, name: "Full Investigation", price: "800", description: "24-hour coverage with full team and detailed dossier." }
      }
    },
    { 
      name: "Background Checks", 
      description: "Comprehensive background screening services. We verify identity, criminal history, employment, and more using reliable databases.",
      packages: {
        basic: { ...DEFAULT_PACKAGE, name: "Simple Check", price: "100", description: "Identity and criminal record check." },
        standard: { ...DEFAULT_PACKAGE, name: "Deep Dive", price: "250", description: "Includes financial and social media analysis." },
        premium: { ...DEFAULT_PACKAGE, name: "Complete Profile", price: "500", description: "Full 360-degree background investigation." }
      }
    }
  ]);

  const [newService, setNewService] = useState("");
  const [openService, setOpenService] = useState<string | null>(null);

  const availableServices = ALL_SERVICES.filter(s => !services.find(existing => existing.name === s));

  const addService = () => {
    if (newService) {
      setServices([...services, { 
        name: newService, 
        description: "",
        packages: {
          basic: { ...DEFAULT_PACKAGE, name: "Basic Package", price: "100" },
          standard: { ...DEFAULT_PACKAGE, name: "Standard Package", price: "200" },
          premium: { ...DEFAULT_PACKAGE, name: "Premium Package", price: "300" }
        }
      }]);
      setNewService("");
      setOpenService(newService); // Auto-open the new service
    }
  };

  const removeService = (name: string) => {
    setServices(services.filter(s => s.name !== name));
  };

  const updateServiceDescription = (serviceName: string, desc: string) => {
    setServices(services.map(s => s.name === serviceName ? { ...s, description: desc } : s));
  };

  const updatePackage = (serviceName: string, tier: PackageTier, field: keyof PackageDetails, value: string) => {
    setServices(services.map(s => {
      if (s.name === serviceName) {
        return {
          ...s,
          packages: {
            ...s.packages,
            [tier]: {
              ...s.packages[tier],
              [field]: value
            }
          }
        };
      }
      return s;
    }));
  };

  return (
    <DashboardLayout role="detective">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold font-heading text-gray-900">My Profile</h2>
          <Button variant="outline">View Public Profile</Button>
        </div>

        <Tabs defaultValue="services" className="w-full">
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
                    <Label>Company Name / Individual Name</Label>
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
                <CardTitle>Services & Pricing Packages</CardTitle>
                <CardDescription>Configure your service offerings and tiered pricing packages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {services.map((service) => (
                    <Collapsible 
                      key={service.name} 
                      open={openService === service.name} 
                      onOpenChange={(isOpen) => setOpenService(isOpen ? service.name : null)}
                      className="border rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg border-b">
                        <div className="flex items-center gap-3">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                               {openService === service.name ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </Button>
                          </CollapsibleTrigger>
                          <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeService(service.name)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Remove
                        </Button>
                      </div>
                      
                      <CollapsibleContent className="p-4 space-y-6">
                        {/* General Service Description */}
                        <div className="space-y-2">
                           <Label>About This Service</Label>
                           <Textarea 
                              placeholder="Describe what you offer in this service generally..." 
                              value={service.description}
                              onChange={(e) => updateServiceDescription(service.name, e.target.value)}
                              className="h-24"
                           />
                           <p className="text-xs text-gray-500">This text appears at the top of your service page.</p>
                        </div>

                        {/* Packages Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {(['basic', 'standard', 'premium'] as PackageTier[]).map((tier) => (
                              <div key={tier} className={`border rounded-md p-3 space-y-3 ${
                                 tier === 'basic' ? 'bg-gray-50/50 border-gray-200' : 
                                 tier === 'standard' ? 'bg-blue-50/30 border-blue-100' : 
                                 'bg-green-50/30 border-green-100'
                              }`}>
                                 <div className="font-bold uppercase text-xs tracking-wider text-center pb-2 border-b mb-2">
                                    {tier} Package
                                 </div>
                                 
                                 <div className="space-y-1">
                                    <Label className="text-xs">Package Name</Label>
                                    <Input 
                                       className="h-8 text-sm" 
                                       value={service.packages[tier].name}
                                       onChange={(e) => updatePackage(service.name, tier, 'name', e.target.value)}
                                    />
                                 </div>
                                 
                                 <div className="space-y-1">
                                    <Label className="text-xs">Description</Label>
                                    <Textarea 
                                       className="h-16 text-xs resize-none" 
                                       value={service.packages[tier].description}
                                       onChange={(e) => updatePackage(service.name, tier, 'description', e.target.value)}
                                    />
                                 </div>
                                 
                                 <div className="space-y-1">
                                    <Label className="text-xs">Price ($)</Label>
                                    <Input 
                                       type="number" 
                                       className="h-8 text-sm font-bold" 
                                       value={service.packages[tier].price}
                                       onChange={(e) => updatePackage(service.name, tier, 'price', e.target.value)}
                                    />
                                 </div>

                                 <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                       <Label className="text-[10px]">Delivery</Label>
                                       <Select 
                                          value={service.packages[tier].deliveryTime} 
                                          onValueChange={(val) => updatePackage(service.name, tier, 'deliveryTime', val)}
                                       >
                                          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                                          <SelectContent>
                                             <SelectItem value="1 Day">1 Day</SelectItem>
                                             <SelectItem value="3 Days">3 Days</SelectItem>
                                             <SelectItem value="7 Days">7 Days</SelectItem>
                                             <SelectItem value="14 Days">14 Days</SelectItem>
                                             <SelectItem value="30 Days">30 Days</SelectItem>
                                          </SelectContent>
                                       </Select>
                                    </div>
                                    <div className="space-y-1">
                                       <Label className="text-[10px]">Revisions</Label>
                                       <Select 
                                          value={service.packages[tier].revisions}
                                          onValueChange={(val) => updatePackage(service.name, tier, 'revisions', val)}
                                       >
                                          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                                          <SelectContent>
                                             <SelectItem value="0">None</SelectItem>
                                             <SelectItem value="1">1 Rev</SelectItem>
                                             <SelectItem value="2">2 Rev</SelectItem>
                                             <SelectItem value="Unlimited">Unlimited</SelectItem>
                                          </SelectContent>
                                       </Select>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
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
