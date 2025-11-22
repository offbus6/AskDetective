import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, Loader2, AlertCircle, Lock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCurrentDetective, useUpdateDetective } from "@/lib/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "EU", name: "European Union" },
];

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
  });

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
      });
      setLogoPreview(detective.logo || "");
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

  const handleSave = async () => {
    if (!detective) return;

    try {
      const updateData: any = {
        businessName: formData.businessName,
        bio: formData.bio,
        location: formData.location,
        country: formData.country,
        languages: formData.languages.split(",").map(l => l.trim()).filter(Boolean),
      };

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
              Free members have limited contact visibility. Upgrade to Pro or Agency to display your phone and WhatsApp on your public profile.
              <Link href="/detective/subscription">
                <Button variant="link" className="p-0 h-auto ml-2">
                  View Plans
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
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
                  <AvatarImage src={logoPreview || maleAvatar} />
                  <AvatarFallback>
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

            {/* Phone (Pro/Agency Only) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                {!isPremium && (
                  <Badge variant="outline" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Pro/Agency Only
                  </Badge>
                )}
              </div>
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
              <div className="flex items-center gap-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                {!isPremium && (
                  <Badge variant="outline" className="text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Pro/Agency Only
                  </Badge>
                )}
              </div>
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

            {/* Save Button */}
            <div className="flex justify-end pt-4">
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
