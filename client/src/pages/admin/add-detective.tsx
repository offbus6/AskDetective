import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Plus, MapPin, DollarSign, Globe, Shield, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useServiceCategories } from "@/lib/hooks";

// Reuse the detailed countries list from signup for consistent experience
const COUNTRIES = [
  {
    name: "United States",
    code: "US",
    currency: "$",
    currencyCode: "USD",
    phoneCode: "+1",
    states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
  },
  {
    name: "United Kingdom",
    code: "UK",
    currency: "£",
    currencyCode: "GBP",
    phoneCode: "+44",
    states: ["England", "Scotland", "Wales", "Northern Ireland"]
  },
  {
    name: "India",
    code: "IN",
    currency: "₹",
    currencyCode: "INR",
    phoneCode: "+91",
    states: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"]
  },
  {
    name: "Canada",
    code: "CA",
    currency: "CA$",
    currencyCode: "CAD",
    phoneCode: "+1",
    states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"]
  },
  {
    name: "Australia",
    code: "AU",
    currency: "AU$",
    currencyCode: "AUD",
    phoneCode: "+61",
    states: ["New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia", "Australian Capital Territory", "Northern Territory"]
  },
  {
    name: "Germany",
    code: "DE",
    currency: "€",
    currencyCode: "EUR",
    phoneCode: "+49",
    states: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"]
  },
  {
    name: "France",
    code: "FR",
    currency: "€",
    currencyCode: "EUR",
    phoneCode: "+33",
    states: ["Île-de-France", "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"]
  },
];

export default function AdminAddDetective() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch service categories from API
  const { data: categoriesData } = useServiceCategories();
  const serviceCategories = categoriesData?.categories?.filter(cat => cat.isActive) || [];
  
  // Form State
  const [country, setCountry] = useState("US");
  const [state, setState] = useState("");
  const [businessType, setBusinessType] = useState<"individual" | "agency">("individual");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [categoryPricing, setCategoryPricing] = useState<Array<{category: string; price: string; currency: string}>>([]);

  const selectedCountryData = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];
  const currencySymbol = selectedCountryData.currency;
  const availableStates = selectedCountryData.states || [];

  const toggleService = (categoryName: string) => {
    if (selectedServices.includes(categoryName)) {
      setSelectedServices(prev => prev.filter(s => s !== categoryName));
      setCategoryPricing(prev => prev.filter(p => p.category !== categoryName));
    } else {
      if (selectedServices.length >= 2) {
        toast({
          title: "Maximum Limit Reached",
          description: "You can add more categories after the detective account is approved.",
          variant: "default",
        });
        return;
      }
      setSelectedServices(prev => [...prev, categoryName]);
      setCategoryPricing(prev => [...prev, {
        category: categoryName,
        price: "",
        currency: selectedCountryData.currencyCode
      }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Detective Added Successfully",
        description: `Unclaimed profile created with ${selectedServices.length} services assigned.`,
      });
      setLocation("/admin/detectives");
    }, 1000);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/detectives")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-heading">Add Detective Manually</h1>
            <p className="text-gray-500">Create a new detective profile. This will be marked as "Unclaimed" until claimed by the owner.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Account Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Login details for the detective (if you are creating an account for them).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="e.g. Sherlock" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="e.g. Holmes" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="email@agency.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex gap-2">
                  <Select value={phoneCountryCode} onValueChange={setPhoneCountryCode}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.phoneCode}>
                          {country.phoneCode} {country.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="5551234567"
                    className="flex-1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={businessType} onValueChange={(val) => setBusinessType(val as "individual" | "agency")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Detective</SelectItem>
                    <SelectItem value="agency">Detective Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {businessType === "agency" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyNameField">Business Name *</Label>
                    <Input id="companyNameField" placeholder="e.g. Holmes Investigations Ltd." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessWebsite">Business Website *</Label>
                    <Input 
                      id="businessWebsite" 
                      type="url"
                      placeholder="https://www.yourdetectiveagency.com"
                      required
                    />
                    <p className="text-xs text-gray-500">Enter the full URL including https://</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Supporting Documents (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Business registration, license, or other supporting documents</p>
                      <p className="text-xs text-gray-400 mt-1">Upload feature coming soon</p>
                    </div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password (Temporary)</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>Business registration and location information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name / Individual Name <span className="text-red-500">*</span></Label>
                <Input id="companyName" placeholder="e.g. Sherlock Investigations Ltd. or John Doe" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>State / Region</Label>
                  {availableStates.length > 0 ? (
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStates.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      placeholder="State, Province, or Region" 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registeredDate">Date Registered</Label>
                  <Input id="registeredDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number or GST</Label>
                  <Input id="regNumber" placeholder="Company Reg. No. / GST" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Registered Address</Label>
                <Textarea id="address" placeholder="Full registered office address..." className="h-20" />
              </div>
            </CardContent>
          </Card>

          {/* Professional Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Profile</CardTitle>
              <CardDescription>Public facing profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input id="title" placeholder="e.g. Senior Private Investigator | Ex-Police" />
                <p className="text-xs text-gray-500">This will appear under the name in search results.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" type="number" placeholder="e.g. 5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages Spoken</Label>
                  <Input id="languages" placeholder="e.g. English, Spanish" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea id="bio" placeholder="Describe experience, specialties, and approach..." className="h-32" />
              </div>

              <div className="space-y-2">
                <Label>Service Categories (Max 2) *</Label>
                <p className="text-xs text-gray-500 mb-2">Select up to 2 categories and set starting prices.</p>
                <div className="space-y-3">
                  {serviceCategories.map((category) => {
                    const isSelected = selectedServices.includes(category.name);
                    const pricing = categoryPricing.find(p => p.category === category.name);
                    
                    return (
                      <div key={category.id} className="border rounded-md p-3">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleService(category.name)}
                            className="rounded border-gray-300 mt-1"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            {isSelected && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm text-gray-600">Starting Price:</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-medium">{currencySymbol}</span>
                                  <Input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="100"
                                    value={pricing?.price || ""}
                                    onChange={(e) => {
                                      setCategoryPricing(prev => 
                                        prev.map(p => 
                                          p.category === category.name 
                                            ? { ...p, price: e.target.value }
                                            : p
                                        )
                                      );
                                    }}
                                    className="w-32"
                                  />
                                  <span className="text-xs text-gray-500">{selectedCountryData.currencyCode}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Section */}
          <Card>
            <CardHeader>
              <CardTitle>Documents & Verification</CardTitle>
              <CardDescription>Upload any available documents for this detective.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <h4 className="font-bold text-sm text-gray-700">Profile Photo / Logo</h4>
                  <p className="text-xs text-gray-500 mt-1">JPG or PNG (Max 2MB)</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <h4 className="font-bold text-sm text-gray-700">Incorporation Certificate</h4>
                  <p className="text-xs text-gray-500 mt-1">Official Document</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <h4 className="font-bold text-sm text-gray-700">Director's ID</h4>
                  <p className="text-xs text-gray-500 mt-1">Passport / License</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <h4 className="font-bold text-sm text-gray-700">PI License</h4>
                  <p className="text-xs text-gray-500 mt-1">PDF or Image</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setLocation("/admin/detectives")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Creating Profile..." : "Create Unclaimed Profile"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
