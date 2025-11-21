import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Upload, Shield, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link, useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useServiceCategories, useCreateApplication } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import type { InsertDetectiveApplication } from "@shared/schema";

const COUNTRIES = [
  {
    name: "United States",
    code: "US",
    currency: "$",
    states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
  },
  {
    name: "United Kingdom",
    code: "UK",
    currency: "£",
    states: ["England", "Scotland", "Wales", "Northern Ireland"]
  },
  {
    name: "India",
    code: "IN",
    currency: "₹",
    states: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"]
  },
  {
    name: "Canada",
    code: "CA",
    currency: "CA$",
    states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"]
  },
  {
    name: "Australia",
    code: "AU",
    currency: "AU$",
    states: ["New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia", "Australian Capital Territory", "Northern Territory"]
  },
  {
    name: "Germany",
    code: "DE",
    currency: "€",
    states: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"]
  },
  {
    name: "France",
    code: "FR",
    currency: "€",
    states: ["Île-de-France", "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"]
  },
];

export default function DetectiveSignup() {
  const [step, setStep] = useState(1);
  const [showLiabilityDialog, setShowLiabilityDialog] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessType: "individual" as "individual" | "agency",
    companyName: "",
    experience: "",
    licenseNumber: "",
  });

  const createApplication = useCreateApplication();
  const { data: categoriesData } = useServiceCategories();
  const serviceCategories = categoriesData?.categories?.filter(cat => cat.isActive) || [];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setShowLiabilityDialog(true);
  };

  const handleAgree = async () => {
    setShowLiabilityDialog(false);
    
    try {
      const applicationData: InsertDetectiveApplication = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || undefined,
        businessType: formData.businessType,
        experience: formData.experience || undefined,
        licenseNumber: formData.licenseNumber || undefined,
      };

      await createApplication.mutateAsync(applicationData);
      
      toast({
        title: "Application Submitted!",
        description: "Your application is under review. We'll notify you within 24-48 hours.",
      });
      
      setLocation("/application-under-review");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 md:px-12 lg:px-24 py-12 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
              
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex flex-col items-center gap-2 bg-gray-50 px-2`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                    step >= s ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  <span className={`text-xs font-semibold ${step >= s ? "text-green-700" : "text-gray-500"}`}>
                    {s === 1 ? "Account" : s === 2 ? "Profile" : "Verification"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading">
                {step === 1 && "Create your Detective Account"}
                {step === 2 && "Build your Professional Profile"}
                {step === 3 && "Verify your Credentials"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Let's get started with your login details."}
                {step === 2 && "Tell clients about your experience and skills."}
                {step === 3 && "Upload your license and ID for verification."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Sherlock"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        data-testid="input-firstName"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Holmes"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        data-testid="input-lastName"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="sherlock@bakerstreet.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select 
                      value={formData.businessType} 
                      onValueChange={(value) => handleInputChange("businessType", value)}
                    >
                      <SelectTrigger data-testid="select-businessType">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual Detective</SelectItem>
                        <SelectItem value="agency">Detective Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-bold">Tell us about your experience</p>
                      <p>Share your background as a detective to help us evaluate your application.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Business/Company Name (Optional)</Label>
                    <Input 
                      id="companyName" 
                      placeholder="e.g. Holmes Investigations Ltd."
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      data-testid="input-companyName"
                    />
                    <p className="text-xs text-gray-500">If you're an agency, provide your business name.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience (Optional)</Label>
                    <Input 
                      id="experience" 
                      placeholder="e.g. 5 years as licensed private investigator"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      data-testid="input-experience"
                    />
                    <p className="text-xs text-gray-500">This helps us understand your qualifications.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-bold">Verification Required</p>
                      <p>To maintain the integrity of our platform, we manually verify every detective. Your application will be pending approval until our team reviews it.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Private Investigator License Number (Optional)</Label>
                    <Input 
                      id="licenseNumber" 
                      placeholder="e.g. PI-123456"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      data-testid="input-licenseNumber"
                    />
                    <p className="text-xs text-gray-500">If you have a license, provide the number here for verification.</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> After submitting, your application will be reviewed by our admin team. You'll be notified once approved (usually within 24-48 hours).
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between border-t p-6">
              {step > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div></div> /* Spacer */
              )}

              {step < 3 ? (
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  className="bg-green-600 hover:bg-green-700" 
                  onClick={handleSubmit}
                  disabled={createApplication.isPending}
                  data-testid="button-submit-application"
                >
                  {createApplication.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Confirmation Dialog */}
      <Dialog open={showLiabilityDialog} onOpenChange={setShowLiabilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Application?</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-amber-800 font-medium">Important Declaration</p>
              </div>
              <p>
                All the information provided is accurate and complete to the best of my knowledge. I understand that false information may result in application rejection.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLiabilityDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAgree} 
              className="bg-green-600 hover:bg-green-700"
              disabled={createApplication.isPending}
            >
              {createApplication.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "I Agree & Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
