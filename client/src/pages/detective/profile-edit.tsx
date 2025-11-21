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
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";

const ALL_SERVICES = ["Surveillance", "Background Checks", "Missing Persons", "Infidelity", "Corporate Fraud", "Cyber Investigation"];

type PackageTier = 'basic' | 'standard' | 'premium';

interface PackageDetails {
  name: string;
  description: string;
  price: string;
  offerPrice: string;
  features: string[];
  enabled: boolean;
}

import { Switch } from "@/components/ui/switch";

interface Service {
  name: string;
  title: string;
  description: string;
  images: string[];
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
  offerPrice: "",
  features: [],
  enabled: true
};

import { Award } from "lucide-react";
// @ts-ignore
import awardGold from "@assets/generated_images/gold_badge_award_icon.png";
// @ts-ignore
import awardSilver from "@assets/generated_images/silver_trophy_cup_icon.png";
// @ts-ignore
import awardCert from "@assets/generated_images/certificate_scroll_icon.png";

interface Recognition {
  id: string;
  name: string;
  year: string;
  description: string;
  image: string;
}

export default function DetectiveProfileEdit() {
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [recognitions, setRecognitions] = useState<Recognition[]>([
    {
      id: '1',
      name: "Top Investigator 2024",
      year: "2024",
      description: "Awarded for outstanding performance in corporate fraud investigation.",
      image: awardGold
    },
    {
      id: '2',
      name: "Excellence in Surveillance",
      year: "2023",
      description: "Recognized by the National Association of Private Investigators.",
      image: awardSilver
    }
  ]);

  const [newRecognition, setNewRecognition] = useState<Partial<Recognition>>({
    name: "",
    year: new Date().getFullYear().toString(),
    description: "",
    image: awardCert
  });

  const addRecognition = () => {
    if (newRecognition.name && newRecognition.year && newRecognition.description && recognitions.length < 4) {
      setRecognitions([...recognitions, {
        id: Date.now().toString(),
        name: newRecognition.name!,
        year: newRecognition.year!,
        description: newRecognition.description!,
        image: newRecognition.image || awardCert
      }]);
      setNewRecognition({
        name: "",
        year: new Date().getFullYear().toString(),
        description: "",
        image: awardCert
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecognition({...newRecognition, image: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('recognition-image-upload')?.click();
  };

  const removeRecognition = (id: string) => {
    setRecognitions(recognitions.filter(r => r.id !== id));
  };

  const [services, setServices] = useState<Service[]>([
    { 
      name: "Surveillance", 
      title: "I will conduct professional covert surveillance for your case",
      description: "Professional covert surveillance services for personal and corporate matters. We use state-of-the-art equipment to gather evidence discreetly.",
      images: [],
      packages: {
        basic: { ...DEFAULT_PACKAGE, name: "Basic Watch", price: "150", offerPrice: "120", description: "4 hours of surveillance with basic report.", enabled: true },
        standard: { ...DEFAULT_PACKAGE, name: "Standard Day", price: "300", offerPrice: "", description: "8 hours of surveillance with video evidence.", enabled: true },
        premium: { ...DEFAULT_PACKAGE, name: "Full Investigation", price: "800", offerPrice: "750", description: "24-hour coverage with full team and detailed dossier.", enabled: true }
      }
    },
    { 
      name: "Background Checks", 
      title: "I will perform a comprehensive background check on any individual",
      description: "Comprehensive background screening services. We verify identity, criminal history, employment, and more using reliable databases.",
      images: [],
      packages: {
        basic: { ...DEFAULT_PACKAGE, name: "Simple Check", price: "100", offerPrice: "", description: "Identity and criminal record check.", enabled: true },
        standard: { ...DEFAULT_PACKAGE, name: "Deep Dive", price: "250", offerPrice: "200", description: "Includes financial and social media analysis.", enabled: true },
        premium: { ...DEFAULT_PACKAGE, name: "Complete Profile", price: "500", offerPrice: "", description: "Full 360-degree background investigation.", enabled: true }
      }
    }
  ]);

  const [newService, setNewService] = useState("");
  const [openService, setOpenService] = useState<string | null>(null);
  
  // Mock subscription tier for demo - change this to 'free', 'pro', or 'agency' to test
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'agency'>('agency');
  
  const [contactInfo, setContactInfo] = useState({
    email: "james.bond@example.com",
    phone: "",
    whatsapp: ""
  });

  const availableServices = ALL_SERVICES.filter(s => !services.find(existing => existing.name === s));

  const addService = () => {
    if (newService) {
      setServices([...services, { 
        name: newService, 
        title: `I will provide ${newService} services`,
        description: "",
        images: [],
        packages: {
          basic: { ...DEFAULT_PACKAGE, name: "Basic Package", price: "100", offerPrice: "", enabled: true },
          standard: { ...DEFAULT_PACKAGE, name: "Standard Package", price: "200", offerPrice: "", enabled: true },
          premium: { ...DEFAULT_PACKAGE, name: "Premium Package", price: "300", offerPrice: "", enabled: true }
        }
      }]);
      setNewService("");
      setOpenService(newService); // Auto-open the new service
    }
  };

  const removeService = (name: string) => {
    setServices(services.filter(s => s.name !== name));
  };

  const updateServiceField = (serviceName: string, field: keyof Service, value: any) => {
    setServices(services.map(s => s.name === serviceName ? { ...s, [field]: value } : s));
  };

  const updatePackage = (serviceName: string, tier: PackageTier, field: keyof PackageDetails, value: any) => {
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

  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>, serviceName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // 400KB limit
      if (file.size > 400 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 400KB",
          variant: "destructive"
        });
        e.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const service = services.find(s => s.name === serviceName);
        if (service) {
             updateServiceField(serviceName, 'images', [...service.images, reader.result as string]);
             if (validationErrors[`${serviceName}-images`]) {
                  setValidationErrors(prev => {
                    const next = { ...prev };
                    delete next[`${serviceName}-images`];
                    return next;
                  });
             }
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const validateAndSaveSingleService = (serviceName: string) => {
    const service = services.find(s => s.name === serviceName);
    if (!service) return;

    const newErrors: Record<string, boolean> = { ...validationErrors };
    let hasErrors = false;

    // Clear previous errors for this service
    delete newErrors[`${serviceName}-title`];
    delete newErrors[`${serviceName}-description`];
    delete newErrors[`${serviceName}-images`];

    if (!service.title.trim()) {
      newErrors[`${serviceName}-title`] = true;
      hasErrors = true;
    }
    if (!service.description.trim()) {
      newErrors[`${serviceName}-description`] = true;
      hasErrors = true;
    }
    if (service.images.length === 0) {
      newErrors[`${serviceName}-images`] = true;
      hasErrors = true;
    }

    setValidationErrors(newErrors);

    if (hasErrors) {
      toast({
        title: "Missing Information",
        description: `Please fill in all mandatory fields marked with *`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Service Saved",
      description: `${serviceName} details have been updated.`,
    });
  };

  return (
    <DashboardLayout role="detective">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold font-heading text-gray-900">My Profile</h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-full">
               <span className="text-gray-500">Simulate Plan:</span>
               <select 
                  className="bg-transparent border-none text-gray-900 font-bold focus:outline-none cursor-pointer"
                  value={subscriptionTier}
                  onChange={(e) => setSubscriptionTier(e.target.value as any)}
               >
                 <option value="free">Free Plan</option>
                 <option value="pro">Pro Plan</option>
                 <option value="agency">Agency Plan</option>
               </select>
             </div>
             <Button variant="outline">View Public Profile</Button>
          </div>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="recognitions">Recognitions</TabsTrigger>
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

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-bold mb-4">Contact Information</h3>
                  <p className="text-sm text-gray-500 mb-4">
                     These details will be displayed on your public profile based on your subscription plan.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input 
                        value={contactInfo.email} 
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      />
                      <p className="text-xs text-green-600 font-medium">✓ Visible on public profile</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="relative">
                        <Input 
                           value={contactInfo.phone} 
                           onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                           placeholder="+1 (555) 000-0000"
                           disabled={subscriptionTier === 'free'}
                           className={subscriptionTier === 'free' ? "bg-gray-100 text-gray-400" : ""}
                        />
                        {subscriptionTier === 'free' && (
                           <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-[1px] rounded-md">
                              <Link href="/detective/subscription">
                                <Button variant="secondary" size="sm" className="shadow-md">
                                  Upgrade to Pro/Agency to Unlock
                                </Button>
                              </Link>
                           </div>
                        )}
                      </div>
                      {subscriptionTier !== 'free' && <p className="text-xs text-green-600 font-medium">✓ Visible on public profile</p>}
                    </div>

                    <div className="space-y-2">
                       <Label>WhatsApp Number</Label>
                       <div className="relative">
                        <Input 
                           value={contactInfo.whatsapp} 
                           onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                           placeholder="+1 (555) 000-0000"
                           disabled={subscriptionTier === 'free'}
                           className={subscriptionTier === 'free' ? "bg-gray-100 text-gray-400" : ""}
                        />
                        {subscriptionTier === 'free' && (
                           <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-[1px] rounded-md">
                              <Link href="/detective/subscription">
                                <Button variant="secondary" size="sm" className="shadow-md">
                                  Upgrade to Pro/Agency to Unlock
                                </Button>
                              </Link>
                           </div>
                        )}
                       </div>
                       {subscriptionTier !== 'free' && <p className="text-xs text-green-600 font-medium">✓ Visible on public profile</p>}
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
                        {/* Service Title */}
                        <div className="space-y-2">
                           <Label className="flex items-center gap-1">
                             Service Title <span className="text-red-500">*</span>
                           </Label>
                           <Input 
                              placeholder="e.g., I will conduct a comprehensive background check" 
                              value={service.title}
                              onChange={(e) => {
                                updateServiceField(service.name, 'title', e.target.value);
                                if (validationErrors[`${service.name}-title`]) {
                                  setValidationErrors(prev => {
                                    const next = { ...prev };
                                    delete next[`${service.name}-title`];
                                    return next;
                                  });
                                }
                              }}
                              className={validationErrors[`${service.name}-title`] ? "border-red-500 focus-visible:ring-red-500" : ""}
                           />
                           <p className="text-xs text-gray-500">Use a catchy title starting with "I will..."</p>
                        </div>

                        {/* Service Images */}
                        <div className="space-y-2">
                           <Label className="flex items-center gap-1">
                             Service Gallery (Max 3 Images) <span className="text-red-500">*</span>
                           </Label>
                           <div className={`flex items-center gap-4 p-2 rounded-md ${validationErrors[`${service.name}-images`] ? "border border-red-500 bg-red-50/10" : ""}`}>
                             {service.images.map((img, idx) => (
                               <div key={idx} className="h-24 w-24 relative group rounded-md overflow-hidden border border-gray-200">
                                  <img src={img} alt={`Service ${idx}`} className="w-full h-full object-cover" />
                                  <button 
                                    onClick={() => {
                                      const newImages = service.images.filter((_, i) => i !== idx);
                                      updateServiceField(service.name, 'images', newImages);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                               </div>
                             ))}
                             
                             {service.images.length < 3 && (
                               <div 
                                 className={`h-24 w-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-green-500 hover:text-green-500 transition-colors relative ${validationErrors[`${service.name}-images`] ? "border-red-300 bg-red-50" : ""}`}
                               >
                                  <input 
                                    type="file" 
                                    id={`upload-${service.name}`} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                    accept="image/*"
                                    onChange={(e) => handleServiceImageUpload(e, service.name)}
                                  />
                                  <Upload className="h-6 w-6 mb-1" />
                                  <span className="text-[10px]">Upload</span>
                               </div>
                             )}
                           </div>
                           {validationErrors[`${service.name}-images`] && (
                             <p className="text-xs text-red-500 font-medium">At least one image is required.</p>
                           )}
                           <div className="text-xs text-gray-500 mt-1">
                              <p>Upload high-quality images representing this service. First image will be the main cover.</p>
                              <p>Supported formats: JPG, PNG. Max size: 400KB.</p>
                           </div>
                        </div>

                        {/* General Service Description */}
                        <div className="space-y-2">
                           <Label className="flex items-center gap-1">
                             About This Service <span className="text-red-500">*</span>
                           </Label>
                           <Textarea 
                              placeholder="Describe what you offer in this service generally..." 
                              value={service.description}
                              onChange={(e) => {
                                updateServiceField(service.name, 'description', e.target.value);
                                if (validationErrors[`${service.name}-description`]) {
                                  setValidationErrors(prev => {
                                    const next = { ...prev };
                                    delete next[`${service.name}-description`];
                                    return next;
                                  });
                                }
                              }}
                              className={`h-24 ${validationErrors[`${service.name}-description`] ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                           />
                           <p className="text-xs text-gray-500">This text appears at the top of your service page.</p>
                        </div>

                        {/* Packages Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {(['basic', 'standard', 'premium'] as PackageTier[]).map((tier) => {
                              const isEnabled = service.packages[tier].enabled;
                              
                              return (
                                <div key={tier} className={`border rounded-md p-3 space-y-3 transition-all ${
                                   isEnabled 
                                     ? (tier === 'basic' ? 'bg-gray-50/50 border-gray-200' : 
                                        tier === 'standard' ? 'bg-blue-50/30 border-blue-100' : 
                                        'bg-green-50/30 border-green-100')
                                     : 'bg-gray-100 border-gray-200 opacity-75'
                                }`}>
                                 <div className="flex items-center justify-between border-b pb-2 mb-2">
                                    <div className="font-bold uppercase text-xs tracking-wider">
                                       {tier} Package
                                    </div>
                                    <Switch 
                                       checked={isEnabled}
                                       onCheckedChange={(checked) => updatePackage(service.name, tier, 'enabled', checked)}
                                       className="scale-75"
                                    />
                                 </div>
                                 
                                 <div className={isEnabled ? "" : "pointer-events-none opacity-50"}>
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
                                   
                                   <div className="grid grid-cols-2 gap-2">
                                      <div className="space-y-1">
                                         <Label className="text-xs">Price ($)</Label>
                                         <Input 
                                            type="number" 
                                            className="h-8 text-sm font-bold" 
                                            value={service.packages[tier].price}
                                            onChange={(e) => updatePackage(service.name, tier, 'price', e.target.value)}
                                         />
                                      </div>
                                      <div className="space-y-1">
                                         <Label className="text-xs text-green-600">Offer Price ($)</Label>
                                         <Input 
                                            type="number" 
                                            className="h-8 text-sm font-bold border-green-200 text-green-700 bg-green-50" 
                                            placeholder="Optional"
                                            value={service.packages[tier].offerPrice}
                                            onChange={(e) => updatePackage(service.name, tier, 'offerPrice', e.target.value)}
                                         />
                                      </div>
                                   </div>
                                 </div>
                              </div>
                           );
                           })}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-700 border-green-200 hover:bg-green-50"
                            onClick={() => validateAndSaveSingleService(service.name)}
                          >
                            <Save className="h-4 w-4 mr-2" /> Save {service.name}
                          </Button>
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

          {/* Recognitions Tab */}
          <TabsContent value="recognitions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recognitions & Awards</CardTitle>
                  <CardDescription>Showcase your achievements to build trust (Max 4).</CardDescription>
                </CardHeader>
                <CardContent>
                  {subscriptionTier !== 'agency' ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-gray-900">Agency Plan Feature</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                          This section is only for the Agency Plan. Upgrade to update your recognitions and showcase your achievements on your public profile.
                        </p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Upgrade to Agency
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Existing Recognitions */}
                      {recognitions.map((rec) => (
                        <div key={rec.id} className="relative flex gap-4 items-start p-4 border rounded-lg bg-white shadow-sm">
                          <div className="h-16 w-16 bg-gray-50 rounded-md border flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img src={rec.image} alt={rec.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-sm truncate pr-6">{rec.name}</h4>
                              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 whitespace-nowrap">
                                {rec.year}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{rec.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                            onClick={() => removeRecognition(rec.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}

                      {/* Add New Recognition Form */}
                      {recognitions.length < 4 && (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col gap-4 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-gray-900">Add New Recognition</h4>
                            <span className="text-xs text-gray-500">{recognitions.length}/4 Added</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex gap-3">
                               <div 
                                 className="h-16 w-16 bg-white rounded-md border flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-blue-400 transition-colors relative overflow-hidden"
                                 onClick={triggerFileInput}
                               >
                                 <img src={newRecognition.image || awardCert} alt="Preview" className="w-full h-full object-contain p-1" />
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                                   <span className="text-[10px] bg-white/90 px-1 rounded shadow-sm opacity-0 hover:opacity-100">Upload</span>
                                 </div>
                                 <input 
                                   type="file" 
                                   id="recognition-image-upload" 
                                   className="hidden" 
                                   accept="image/*"
                                   onChange={handleImageUpload}
                                 />
                               </div>
                               
                               <div className="flex-1 space-y-2">
                                 <Input 
                                   placeholder="Award Name" 
                                   value={newRecognition.name || ""}
                                   onChange={(e) => setNewRecognition({...newRecognition, name: e.target.value})}
                                   className="h-8 text-sm"
                                 />
                                 <Input 
                                   placeholder="Year" 
                                   type="number"
                                   value={newRecognition.year || ""}
                                   onChange={(e) => setNewRecognition({...newRecognition, year: e.target.value})}
                                   className="h-8 text-sm"
                                 />
                               </div>
                            </div>
                            
                            <Textarea 
                              placeholder="Short description of the award..." 
                              value={newRecognition.description || ""}
                              onChange={(e) => setNewRecognition({...newRecognition, description: e.target.value})}
                              className="h-16 text-sm resize-none"
                            />
                            
                            <Button 
                              size="sm" 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={addRecognition}
                              disabled={!newRecognition.name || !newRecognition.description || !newRecognition.year}
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Recognition
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
