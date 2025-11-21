import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Mail, Phone, MessageCircle, ShieldCheck, Upload, FileText, Heart, Clock, RefreshCw, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/lib/currency-context";
import { useUser } from "@/lib/user-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";

// Mock data for unclaimed vs claimed profile
const CLAIMED_PROFILE = {
  id: "p_123",
  name: "James Bond",
  avatar: maleAvatar,
  title: "I will conduct a comprehensive background check for any individual",
  description: "Need to know who you are really dealing with? I provide professional, discreet, and comprehensive background checks for individuals and businesses.",
  location: "United Kingdom",
  memberSince: "May 2018",
  about: "Former MI6 operative turned private investigator. Specializing in high-stakes surveillance, asset recovery, and deep-dive background checks. I have access to databases that others don't. When you need the truth, I'm the one you call.",
  rating: 5.0,
  reviews: 1254,
  tier: 'agency',
  price: 150
};

const UNCLAIMED_PROFILE = {
  id: "p_unclaimed_001",
  name: "Unknown Detective Agency",
  avatar: "", // No avatar
  title: "Professional Investigation Services - Agency Profile",
  description: "This is a business listing for Unknown Detective Agency. We provide professional investigation services.",
  location: "United States",
  memberSince: "Jan 2024",
  about: "This business profile is currently unclaimed. If you are the owner, you can claim this profile to manage your information and respond to customer inquiries.",
  rating: 0,
  reviews: 0,
  tier: 'free',
  price: 100
};

interface PackageDetails {
  name: string;
  description: string;
  price: number;
  offerPrice: number | null;
  features: string[];
  enabled: boolean;
}

const PACKAGES: { basic: PackageDetails, standard: PackageDetails, premium: PackageDetails } = {
  basic: {
    name: "Simple Check",
    description: "Basic criminal record check and address verification for one individual.",
    price: 150,
    offerPrice: null,
    features: ["Background Check", "Report Included", "Confidentiality Guaranteed"],
    enabled: true
  },
  standard: {
    name: "Deep Dive",
    description: "Includes Basic + Social media analysis, employment verification, and asset search.",
    price: 300,
    offerPrice: null,
    features: ["Background Check", "Report Included", "Confidentiality Guaranteed", "Social Media Analysis"],
    enabled: true
  },
  premium: {
    name: "Full Investigation",
    description: "Complete 360° profile including on-site verification if needed (local only) and detailed report.",
    price: 800,
    offerPrice: null,
    features: ["Background Check", "Report Included", "Confidentiality Guaranteed", "Social Media Analysis", "On-site Verification"],
    enabled: true
  }
};

import { AlertTriangle } from "lucide-react";

export default function DetectiveProfile() {
  const params = new URLSearchParams(window.location.search);
  const isUnclaimed = params.get("unclaimed") === "true"; // Determine if profile is unclaimed based on URL for now
  
  const profileData = isUnclaimed ? UNCLAIMED_PROFILE : CLAIMED_PROFILE;

  // Mock subscription tier for demo - change this to 'free' or 'agency' to test other views
  const detectiveTier = profileData.tier as 'free' | 'pro' | 'agency';
  const { formatPrice } = useCurrency();
  const { user, isFavorite, toggleFavorite } = useUser();
  const { toast } = useToast();
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [claimFormData, setClaimFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    details: ""
  });
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingClaim(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingClaim(false);
      setIsClaimDialogOpen(false);
      toast({
        title: "Claim Request Submitted",
        description: "We have received your proof documents. Our team will review your claim shortly.",
      });
    }, 1500);
  };
  
  const [reviews, setReviews] = useState([
    { id: 1, user: "User_1", rating: 5, text: "Excellent work! Found exactly what I needed in record time. Highly recommended for anyone needing discreet information." },
    { id: 2, user: "User_2", rating: 5, text: "Very professional and thorough. Kept me updated throughout the process." },
    { id: 3, user: "User_3", rating: 5, text: "Worth every penny. The detailed report provided was beyond my expectations." }
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, text: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = () => {
    if (!newReview.text || !newReview.name) return;
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setReviews([{
        id: Date.now(),
        user: newReview.name,
        rating: newReview.rating,
        text: newReview.text
      }, ...reviews]);
      setNewReview({ rating: 5, text: "", name: "" });
      setIsSubmitting(false);
    }, 500);
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
        variant: "destructive"
      });
      return;
    }

    toggleFavorite({
      id: profileData.id,
      name: profileData.name,
      title: profileData.title,
      image: isUnclaimed ? undefined : "https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop",
      avatar: profileData.avatar,
      rating: profileData.rating,
      reviews: profileData.reviews,
      price: profileData.price,
      location: profileData.location,
      badges: detectiveTier === 'agency' ? ['verified', 'recommended'] : []
    });
  };
  
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-24 py-8 mt-20">
        {isUnclaimed && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
             <div className="flex items-start gap-4">
               <div className="bg-blue-100 p-2 rounded-full mt-1">
                 <AlertTriangle className="h-6 w-6 text-blue-600" />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-blue-900">Is this your business?</h2>
                 <p className="text-blue-700 max-w-xl">
                   This profile is currently unclaimed. Claim it now to manage your details, respond to reviews, and access premium features.
                 </p>
               </div>
             </div>
             <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
               <DialogTrigger asChild>
                 <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap px-8 shadow-md">
                   Claim This Profile
                 </Button>
               </DialogTrigger>
               <DialogContent className="max-w-md">
                 <DialogHeader>
                   <DialogTitle>Claim Business Profile</DialogTitle>
                   <DialogDescription>
                     Please provide your details and proof of ownership to claim this profile.
                   </DialogDescription>
                 </DialogHeader>
                 <form onSubmit={handleClaimSubmit} className="space-y-4 mt-4">
                   <div className="space-y-2">
                     <Label htmlFor="fullName">Full Name</Label>
                     <Input 
                       id="fullName" 
                       required 
                       placeholder="Your legal name"
                       value={claimFormData.fullName}
                       onChange={(e) => setClaimFormData({...claimFormData, fullName: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="email">Business Email</Label>
                     <Input 
                       id="email" 
                       type="email" 
                       required 
                       placeholder="name@agency.com" 
                       value={claimFormData.email}
                       onChange={(e) => setClaimFormData({...claimFormData, email: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="phone">Phone Number</Label>
                     <Input 
                       id="phone" 
                       type="tel" 
                       required 
                       placeholder="+1 (555) 000-0000" 
                       value={claimFormData.phone}
                       onChange={(e) => setClaimFormData({...claimFormData, phone: e.target.value})}
                     />
                   </div>
                   
                   <div className="space-y-2">
                     <Label>Proof of Ownership</Label>
                     <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                       <div className="flex flex-col items-center gap-2">
                         <Upload className="h-8 w-8 text-gray-400" />
                         <span className="text-sm text-gray-600 font-medium">Upload Business License or ID</span>
                         <span className="text-xs text-gray-400">PDF, JPG or PNG (Max 5MB)</span>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <Label htmlFor="details">Additional Details (Optional)</Label>
                     <Textarea 
                       id="details" 
                       placeholder="Any extra information to help verify your ownership..." 
                       value={claimFormData.details}
                       onChange={(e) => setClaimFormData({...claimFormData, details: e.target.value})}
                     />
                   </div>

                   <DialogFooter className="pt-4">
                     <Button type="button" variant="outline" onClick={() => setIsClaimDialogOpen(false)}>Cancel</Button>
                     <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmittingClaim}>
                       {isSubmittingClaim ? "Submitting..." : "Submit Claim"}
                     </Button>
                   </DialogFooter>
                 </form>
               </DialogContent>
             </Dialog>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
               <h1 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-gray-900 flex-1">
                 {profileData.title}
               </h1>
               
               {/* Favorite Button for Profile - Always show */}
               <Button 
                 variant="outline" 
                 size="icon" 
                 className={`ml-4 flex-shrink-0 rounded-full border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 ${isFavorite(profileData.id) ? "text-red-500 bg-red-50 border-red-200" : ""}`}
                 onClick={handleToggleFavorite}
               >
                 <Heart className={`h-5 w-5 ${isFavorite(profileData.id) ? "fill-red-500 text-red-500" : ""}`} />
               </Button>
            </div>

            {/* Author Meta */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback>{profileData.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-lg flex items-center gap-2">
                  {profileData.name}
                  {detectiveTier === 'agency' && (
                     <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 text-xs px-2 py-0.5">
                        <ShieldCheck className="h-3 w-3" /> Recommended
                     </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {isUnclaimed ? (
                    <span className="text-gray-400 italic">Unclaimed Profile</span>
                  ) : (
                    <>
                      <span className="text-yellow-500 font-bold flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500" /> {profileData.rating.toFixed(1)}
                      </span>
                      <span>({profileData.reviews} reviews)</span>
                      <span>•</span>
                      <span>Top Rated Detective</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery - Placeholder for Carousel */}
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
              {isUnclaimed ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 flex-col gap-2">
                  <FileText className="h-12 w-12 opacity-50" />
                  <span className="font-medium">No images available</span>
                </div>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop" 
                  alt="Service Preview" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* About This Service */}
            <section className="mb-10 space-y-4">
              <h2 className="text-xl font-bold font-heading">About This Service</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p>
                  {profileData.description}
                </p>
                
                <div className="mt-6 mb-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-900">Services Provided</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Surveillance", "Background Checks", "Infidelity Investigations", "Missing Persons", "Asset Search", "Due Diligence"].map((service) => (
                      <Badge key={service} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 text-sm border-green-100">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="mt-4">
                  <strong>My services include:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Criminal history verification (State & Federal)</li>
                  <li>Employment and education verification</li>
                  <li>Social media footprint analysis</li>
                  <li>Financial history and asset search</li>
                  <li>Civil litigation records</li>
                </ul>
                <p className="mt-4">
                  {profileData.about}
                </p>
              </div>
            </section>

            <Separator className="my-8" />

            {/* About The Seller */}
            <section className="mb-10">
              <h2 className="text-xl font-bold font-heading mb-6">About The Detective</h2>
              <div className="flex gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback>{profileData.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">From</span>
                      <span className="font-bold">{profileData.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Member since</span>
                      <span className="font-bold">{profileData.memberSince}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Avg. response time</span>
                      <span className="font-bold">1 hour</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Last delivery</span>
                      <span className="font-bold">about 2 hours</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Languages</span>
                      <span className="font-bold">English, French, German</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {profileData.about}
                  </p>
                  
                  {/* Contact Methods - Conditional Display */}
                  <div className="pt-4 text-sm text-gray-500">
                     <p>Contact options are available based on the detective's subscription plan.</p>
                  </div>
                </div>
              </div>
            </section>
            
            <Separator className="my-8" />

            {/* Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading">Reviews</h2>
                <div className="flex items-center gap-2">
                  {isUnclaimed ? (
                    <span className="text-gray-500 text-sm">No reviews yet</span>
                  ) : (
                    <>
                      <span className="text-yellow-500 font-bold flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-500" /> {profileData.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">({reviews.length} reviews)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Add Review Form */}
              <Card className="mb-8 bg-gray-50 border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">Leave a Review</h3>
                  <div className="space-y-2">
                    <Label>Your Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-6 w-6 ${star <= newReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input 
                      placeholder="Enter your name" 
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Review</Label>
                    <Textarea 
                      placeholder="Share your experience with this detective..." 
                      value={newReview.text}
                      onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                      className="bg-white min-h-[100px]"
                    />
                  </div>
                  <Button 
                    onClick={handleSubmitReview} 
                    disabled={!newReview.text || !newReview.name || isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                   <div key={review.id} className="border-b border-gray-100 pb-6">
                     <div className="flex items-center gap-3 mb-2">
                       <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs">
                         {review.user.charAt(0).toUpperCase()}
                       </div>
                       <span className="font-bold text-sm">{review.user}</span>
                       <div className="flex text-yellow-500">
                         {[...Array(5)].map((_, i) => (
                           <Star 
                             key={i} 
                             className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-500' : 'text-gray-300'}`} 
                           />
                         ))}
                       </div>
                     </div>
                     <p className="text-gray-600 text-sm">{review.text}</p>
                   </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24">
              <Card className="border-gray-200 shadow-lg overflow-hidden">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-14 rounded-none bg-gray-50 border-b border-gray-200 p-0">
                    {PACKAGES.basic.enabled && (
                      <TabsTrigger value="basic" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 font-bold text-gray-500 bg-transparent shadow-none">Basic</TabsTrigger>
                    )}
                    {PACKAGES.standard.enabled && (
                      <TabsTrigger value="standard" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 font-bold text-gray-500 bg-transparent shadow-none">Standard</TabsTrigger>
                    )}
                    {PACKAGES.premium.enabled && (
                      <TabsTrigger value="premium" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 font-bold text-gray-500 bg-transparent shadow-none">Premium</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <div className="p-6">
                    {PACKAGES.basic.enabled && (
                      <TabsContent value="basic" className="mt-0 space-y-4">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-lg">{PACKAGES.basic.name}</h3>
                          <div className="text-right">
                            {PACKAGES.basic.offerPrice ? (
                              <>
                                <span className="text-2xl font-bold text-green-600">{formatPrice(PACKAGES.basic.offerPrice)}</span>
                                <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(PACKAGES.basic.price)}</span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-gray-900">{formatPrice(PACKAGES.basic.price)}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{PACKAGES.basic.description}</p>
                      </TabsContent>
                    )}
                    
                    {PACKAGES.standard.enabled && (
                      <TabsContent value="standard" className="mt-0 space-y-4">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-lg">{PACKAGES.standard.name}</h3>
                          <div className="text-right">
                            {PACKAGES.standard.offerPrice ? (
                              <>
                                <span className="text-2xl font-bold text-green-600">{formatPrice(PACKAGES.standard.offerPrice)}</span>
                                <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(PACKAGES.standard.price)}</span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-gray-900">{formatPrice(PACKAGES.standard.price)}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{PACKAGES.standard.description}</p>
                      </TabsContent>
                    )}

                    {PACKAGES.premium.enabled && (
                      <TabsContent value="premium" className="mt-0 space-y-4">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-lg">{PACKAGES.premium.name}</h3>
                          <div className="text-right">
                            {PACKAGES.premium.offerPrice ? (
                              <>
                                <span className="text-2xl font-bold text-green-600">{formatPrice(PACKAGES.premium.offerPrice)}</span>
                                <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(PACKAGES.premium.price)}</span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-gray-900">{formatPrice(PACKAGES.premium.price)}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{PACKAGES.premium.description}</p>
                      </TabsContent>
                    )}

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                        <Clock className="h-4 w-4" /> 
                        <span>2 Days Delivery</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                        <RefreshCw className="h-4 w-4" /> 
                        <span>1 Revision</span>
                      </div>

                      <div className="space-y-2 mt-4">
                        {PACKAGES.basic.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700 text-lg font-bold h-12 mt-4">
                        Continue ({formatPrice(PACKAGES.basic.offerPrice || PACKAGES.basic.price)})
                      </Button>
                      
                      <Button variant="ghost" className="w-full text-gray-500">
                        Compare Packages
                      </Button>
                    </div>
                  </div>
                </Tabs>
                
                {/* Contact Methods based on Tier */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                   <Button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 shadow-sm h-12">
                     <Mail className="h-5 w-5" />
                     <span className="font-bold">Contact via Email</span>
                   </Button>
                   
                   {detectiveTier !== 'free' ? (
                     <>
                       <Button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-green-700 border border-green-200 shadow-sm h-12">
                         <Phone className="h-5 w-5" />
                         <span className="font-bold">Call Now</span>
                       </Button>
                       
                       <Button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-green-700 border border-green-200 shadow-sm h-12">
                         <MessageCircle className="h-5 w-5" />
                         <span className="font-bold">WhatsApp</span>
                       </Button>
                     </>
                   ) : (
                     <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-center">
                        <p className="text-xs text-yellow-800 font-medium mb-2">
                          Phone & WhatsApp available on Pro plans
                        </p>
                        <div className="flex gap-2 opacity-50">
                          <Button disabled className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 shadow-sm h-10 text-gray-400">
                             <Phone className="h-4 w-4" />
                          </Button>
                          <Button disabled className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 shadow-sm h-10 text-gray-400">
                             <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                     </div>
                   )}
                </div>
              </Card>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> 100% Secure & Confidential
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
