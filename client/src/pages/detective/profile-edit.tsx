import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, Loader2, AlertCircle, Lock, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCurrentDetective, useUpdateDetective } from "@/lib/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "EU", name: "European Union" },
];

interface Recognition {
  title: string;
  issuer: string;
  year: string;
}

export default function DetectiveProfileEdit() {
  const { toast } = useToast();
  const { data, isLoading, error } = useCurrentDetective();
  const detective = data?.detective;
  const updateDetective = useUpdateDetective();

  const [formData, setFormData] = useState({
    businessName: "",
    bio: "",
    location: "",
    country: "US",
    phone: "",
    whatsapp: "",
    languages: "",
    logo: "",
    yearsExperience: "",
    businessWebsite: "",
    licenseNumber: "",
    businessType: "",
  });

  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Load detective data into form when it's available
  useEffect(() => {
    if (detective) {
      setFormData({
        businessName: detective.businessName || "",
        bio: detective.bio || "",
        location: detective.location || "",
        country: detective.country || "US",
        phone: detective.phone || "",
        whatsapp: detective.whatsapp || "",
        languages: detective.languages?.join(", ") || "English",
        logo: detective.logo || "",
        yearsExperience: detective.yearsExperience || "",
        businessWebsite: detective.businessWebsite || "",
        licenseNumber: detective.licenseNumber || "",
        businessType: detective.businessType || "",
      });
      setLogoPreview(detective.logo || "");
      
      // Load recognitions from JSONB field
      if (detective.recognitions && Array.isArray(detective.recognitions)) {
        setRecognitions(detective.recognitions as Recognition[]);
      }
    }
  }, [detective]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Logo must be under 5MB",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addRecognition = () => {
    setRecognitions([...recognitions, { title: "", issuer: "", year: "" }]);
  };

  const removeRecognition = (index: number) => {
    setRecognitions(recognitions.filter((_, i) => i !== index));
  };

  const updateRecognition = (index: number, field: keyof Recognition, value: string) => {
    const updated = [...recognitions];
    updated[index] = { ...updated[index], [field]: value };
    setRecognitions(updated);
  };

  const handleSave = async () => {
    if (!detective) return;

    try {
      const updateData: any = {
        businessName: formData.businessName,
        bio: formData.bio,
        location: formData.location,
        country: formData.country,
        languages: formData.languages.split(",").map(l => l.trim()).filter(Boolean),
        yearsExperience: formData.yearsExperience,
        businessWebsite: formData.businessWebsite,
        licenseNumber: formData.licenseNumber,
        businessType: formData.businessType,
      };

      // ALWAYS preserve recognitions (even for Free plan)
      // This prevents accidental data loss when Free users edit their profile
      const validRecognitions = recognitions.filter(r => r.title && r.issuer && r.year);
      updateData.recognitions = validRecognitions;

      // Only include phone/whatsapp if plan is Pro or Agency
      if (detective.subscriptionPlan === "pro" || detective.subscriptionPlan === "agency") {
        updateData.phone = formData.phone;
        updateData.whatsapp = formData.whatsapp;
      }

      // Include logo if changed
      if (logoPreview && logoPreview !== detective.logo) {
        updateData.logo = logoPreview;
      }

      await updateDetective.mutateAsync({
        id: detective.id,
        data: updateData,
      });

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

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

  const subscriptionPlan = detective.subscriptionPlan;
  const isPro = subscriptionPlan === "pro";
  const isAgency = subscriptionPlan === "agency";
  const isPremium = isPro || isAgency;

  return (
    <DashboardLayout role="detective">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold font-heading text-gray-900">My Profile</h2>
            <p className="text-gray-500">Manage your profile information and public listing</p>
          </div>
          <Badge className={isPremium ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
            {subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)} Plan
          </Badge>
        </div>

        {subscriptionPlan === "free" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upgrade to Unlock More Features</AlertTitle>
            <AlertDescription>
              Free members have limited contact visibility and features. Upgrade to Pro or Agency to display your phone, WhatsApp, and add recognitions to your profile.
              <Link href="/detective/subscription">
                <Button variant="link" className="p-0 h-auto ml-2">
                  View Plans
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Basic Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              This information will be displayed on your public detective listing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Business Logo / Profile Picture</Label>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  {logoPreview && <AvatarImage src={logoPreview} />}
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-2xl">
                    {formData.businessName?.substring(0, 2).toUpperCase() || "DT"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    data-testid="input-logo"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                    data-testid="button-upload-logo"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Logo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG or JPG, max 5MB. This logo appears across the platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name / Full Name</Label>
              <Input
                id="businessName"
                data-testid="input-businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Enter your business or full name"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                data-testid="input-bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell clients about your expertise and experience"
                className="h-32"
              />
              <p className="text-xs text-gray-500">
                Displayed prominently on your public profile. Make it compelling!
              </p>
            </div>

            {/* Location & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location (City, State)</Label>
                <Input
                  id="location"
                  data-testid="input-location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange("country", value)}
                >
                  <SelectTrigger id="country" data-testid="select-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                data-testid="input-languages"
                value={formData.languages}
                onChange={(e) => handleInputChange("languages", e.target.value)}
                placeholder="e.g., English, Spanish, French"
              />
              <p className="text-xs text-gray-500">Separate multiple languages with commas</p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>
              Information about your business and credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Years of Experience */}
            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                data-testid="input-yearsExperience"
                value={formData.yearsExperience}
                onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                placeholder="e.g., 5"
                type="text"
              />
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleInputChange("businessType", value)}
              >
                <SelectTrigger id="businessType" data-testid="select-businessType">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number (Optional)</Label>
              <Input
                id="licenseNumber"
                data-testid="input-licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                placeholder="Enter your PI license number"
              />
            </div>

            {/* Business Website */}
            <div className="space-y-2">
              <Label htmlFor="businessWebsite">Business Website (Optional)</Label>
              <Input
                id="businessWebsite"
                data-testid="input-businessWebsite"
                value={formData.businessWebsite}
                onChange={(e) => handleInputChange("businessWebsite", e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>

            {/* Business Documents - Read Only */}
            {detective.businessDocuments && detective.businessDocuments.length > 0 && (
              <div className="space-y-2">
                <Label>Business Documents</Label>
                <div className="text-sm text-gray-600">
                  {detective.businessDocuments.length} document(s) uploaded during signup
                </div>
                <p className="text-xs text-gray-500">
                  Documents are verified during application review and cannot be changed here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information (Pro/Agency Only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Contact Information
              {!isPremium && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Pro/Agency Only
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Your contact details displayed on your public profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phone (Pro/Agency Only) */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                data-testid="input-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                disabled={!isPremium}
                className={!isPremium ? "bg-gray-100" : ""}
              />
              {isPremium && (
                <p className="text-xs text-green-600">✓ Visible on your public profile</p>
              )}
              {!isPremium && (
                <p className="text-xs text-gray-500">
                  Upgrade to Pro or Agency to display your phone number publicly
                </p>
              )}
            </div>

            {/* WhatsApp (Pro/Agency Only) */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                data-testid="input-whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                placeholder="+1 (555) 000-0000"
                disabled={!isPremium}
                className={!isPremium ? "bg-gray-100" : ""}
              />
              {isPremium && (
                <p className="text-xs text-green-600">✓ Visible on your public profile</p>
              )}
              {!isPremium && (
                <p className="text-xs text-gray-500">
                  Upgrade to Pro or Agency to display your WhatsApp publicly
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recognitions & Awards (Pro/Agency Only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recognitions & Awards
              {!isPremium && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Pro/Agency Only
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Showcase your professional achievements and certifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isPremium && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upgrade to Pro or Agency to add recognitions and awards to your profile.
                </AlertDescription>
              </Alert>
            )}

            {isPremium && (
              <>
                {recognitions.map((recognition, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Recognition #{index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecognition(index)}
                        data-testid={`button-remove-recognition-${index}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={recognition.title}
                        onChange={(e) => updateRecognition(index, "title", e.target.value)}
                        placeholder="e.g., Best Detective Award"
                        data-testid={`input-recognition-title-${index}`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Issuing Organization</Label>
                        <Input
                          value={recognition.issuer}
                          onChange={(e) => updateRecognition(index, "issuer", e.target.value)}
                          placeholder="e.g., National PI Association"
                          data-testid={`input-recognition-issuer-${index}`}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          value={recognition.year}
                          onChange={(e) => updateRecognition(index, "year", e.target.value)}
                          placeholder="e.g., 2023"
                          data-testid={`input-recognition-year-${index}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addRecognition}
                  className="w-full"
                  data-testid="button-add-recognition"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recognition
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updateDetective.isPending}
            className="bg-green-600 hover:bg-green-700"
            data-testid="button-save-profile"
          >
            {updateDetective.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
