import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Mail, Phone, MessageCircle, ShieldCheck, AlertTriangle, FileText, Heart, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/currency-context";
import { useUser } from "@/lib/user-context";
import { useService, useReviewsByService } from "@/lib/hooks";
import { useState } from "react";
import { useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/seo";
import { format } from "date-fns";
import type { Review, User } from "@shared/schema";

export default function DetectiveProfile() {
  const [, params] = useRoute("/service/:id");
  const serviceId = params?.id;
  
  const { data: serviceData, isLoading: isLoadingService, error: serviceError } = useService(serviceId);
  const { data: reviewsData, isLoading: isLoadingReviews } = useReviewsByService(serviceId);
  
  const { formatPrice } = useCurrency();
  const { user, isFavorite, toggleFavorite } = useUser();
  const { toast } = useToast();

  // Loading state
  if (isLoadingService) {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <main className="container mx-auto px-6 md:px-12 lg:px-24 py-8 mt-20">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="w-full aspect-video rounded-lg" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="lg:w-[380px]">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (serviceError || !serviceData) {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <main className="container mx-auto px-6 md:px-12 lg:px-24 py-8 mt-20">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
            <p className="text-gray-600">The service you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { service, detective, avgRating, reviewCount } = serviceData;
  const reviews = reviewsData?.reviews || [];

  const isClaimable = detective.isClaimable && !detective.isClaimed;
  const detectiveTier = detective.subscriptionPlan;
  const detectiveName = detective.businessName || "Unknown Detective";
  
  const memberSince = format(new Date(detective.memberSince), "MMMM yyyy");
  
  // Use actual detective logo and service images from database - NO MOCK DATA
  const detectiveLogo = detective.logo;
  const serviceImage = service.images && service.images.length > 0 ? service.images[0] : null;

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
      id: service.id,
      name: detectiveName,
      title: service.title,
      image: serviceImage || "",
      avatar: detectiveLogo || "",
      rating: avgRating,
      reviews: reviewCount,
      price: Number(service.basePrice),
      location: detective.location || detective.country,
      badges: detective.isVerified ? ['verified'] : []
    });
  };

  // Schema.org Structured Data
  const detectiveSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": detectiveName,
    "image": serviceImage || detectiveLogo || "",
    "description": service.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": detective.location,
      "addressCountry": detective.country
    },
    "aggregateRating": reviewCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": reviewCount
    } : undefined,
    "priceRange": "$$"
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <SEO 
        title={`${service.title} by ${detectiveName}`}
        description={service.description}
        image={serviceImage || detectiveLogo || ""}
        type="profile"
        schema={detectiveSchema}
      />
      <Navbar />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-24 py-8 mt-20">
        {isClaimable && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm" data-testid="claimable-banner">
             <div className="flex items-start gap-4">
               <div className="bg-blue-100 p-2 rounded-full mt-1">
                 <AlertTriangle className="h-6 w-6 text-blue-600" />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-blue-900">Is this your business?</h2>
                 <p className="text-blue-700 max-w-xl">
                   Claim this profile to manage your details, respond to reviews, and access premium features.
                 </p>
               </div>
             </div>
             <Button 
               className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap px-8 shadow-md" 
               data-testid="button-claim-profile"
               onClick={() => window.location.href = `/claim-profile/${detective.id}`}
             >
               Claim This Profile
             </Button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
               <h1 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-gray-900 flex-1" data-testid="text-service-title">
                 {service.title}
               </h1>
               
               <Button 
                 variant="outline" 
                 size="icon" 
                 className={`ml-4 flex-shrink-0 rounded-full border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 ${isFavorite(service.id) ? "text-red-500 bg-red-50 border-red-200" : ""}`}
                 onClick={handleToggleFavorite}
                 data-testid="button-toggle-favorite"
               >
                 <Heart className={`h-5 w-5 ${isFavorite(service.id) ? "fill-red-500 text-red-500" : ""}`} />
               </Button>
            </div>

            {/* Author Meta */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12" data-testid="img-detective-avatar">
                {detectiveLogo ? (
                  <AvatarImage src={detectiveLogo} />
                ) : (
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xl">{detectiveName[0]}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-bold text-lg flex items-center gap-2" data-testid="text-detective-name">
                  {detectiveName}
                  {detective.isVerified && (
                     <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 text-xs px-2 py-0.5" data-testid="badge-verified">
                        <ShieldCheck className="h-3 w-3" /> Verified
                     </Badge>
                  )}
                  {detectiveTier === "agency" && (
                     <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 text-xs px-2 py-0.5" data-testid="badge-agency">
                        Agency
                     </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {reviewCount > 0 ? (
                    <>
                      <span className="text-yellow-500 font-bold flex items-center gap-1" data-testid="text-rating">
                        <Star className="h-4 w-4 fill-yellow-500" /> {avgRating.toFixed(1)}
                      </span>
                      <span data-testid="text-review-count">({reviewCount} reviews)</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8" data-testid="img-service-gallery">
              {service.images && service.images.length > 0 ? (
                <img 
                  src={service.images[0]} 
                  alt="Service Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 flex-col gap-2">
                  <FileText className="h-12 w-12 opacity-50" />
                  <span className="font-medium">No images available</span>
                </div>
              )}
            </div>

            {/* About This Service */}
            <section className="mb-10 space-y-4">
              <h2 className="text-xl font-bold font-heading">About This Service</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed" data-testid="text-service-description">
                <p>{service.description}</p>
                
                {detective.bio && (
                  <p className="mt-4">{detective.bio}</p>
                )}

                <div className="mt-6 mb-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-900">Service Type</h3>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 text-sm border-green-100" data-testid="badge-category">
                    {service.title}
                  </Badge>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* About The Detective */}
            <section className="mb-10">
              <h2 className="text-xl font-bold font-heading mb-6">About The Detective</h2>
              <div className="flex gap-6">
                <Avatar className="h-24 w-24">
                  {detectiveLogo ? (
                    <AvatarImage src={detectiveLogo} />
                  ) : (
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-3xl">{detectiveName[0]}</AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">From</span>
                      <span className="font-bold" data-testid="text-location">{detective.location || detective.country}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Member since</span>
                      <span className="font-bold" data-testid="text-member-since">{memberSince}</span>
                    </div>
                    {detective.languages && detective.languages.length > 0 && (
                      <div>
                        <span className="text-gray-500 block">Languages</span>
                        <span className="font-bold" data-testid="text-languages">{detective.languages.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  {detective.bio && (
                    <p className="text-gray-700 leading-relaxed" data-testid="text-bio">
                      {detective.bio}
                    </p>
                  )}
                </div>
              </div>
            </section>
            
            <Separator className="my-8" />

            {/* Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading">Reviews</h2>
                <div className="flex items-center gap-2">
                  {reviewCount > 0 ? (
                    <>
                      <span className="text-yellow-500 font-bold flex items-center gap-1" data-testid="text-avg-rating">
                        <Star className="h-5 w-5 fill-yellow-500" /> {avgRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500" data-testid="text-total-reviews">({reviewCount} reviews)</span>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm" data-testid="text-no-reviews">No reviews yet</span>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              {isLoadingReviews ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-gray-100 pb-6 space-y-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                     <div key={review.id} className="border-b border-gray-100 pb-6" data-testid={`review-${review.id}`}>
                       <div className="flex items-center gap-3 mb-2">
                         <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs">
                           U
                         </div>
                         <span className="font-bold text-sm">User</span>
                         <div className="flex text-yellow-500">
                           {[...Array(5)].map((_, i) => (
                             <Star 
                               key={i} 
                               className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-500' : 'text-gray-300'}`} 
                             />
                           ))}
                         </div>
                       </div>
                       {review.comment && (
                         <p className="text-gray-600 text-sm" data-testid={`review-comment-${review.id}`}>{review.comment}</p>
                       )}
                     </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center" data-testid="empty-reviews">
                  <Star className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Be the first to review this service.</p>
                </div>
              )}
            </section>

          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24">
              <Card className="border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-lg">Service Price</h3>
                    <div className="text-right">
                      {service.offerPrice ? (
                        <>
                          <span className="text-2xl font-bold text-green-600" data-testid="text-offer-price">{formatPrice(Number(service.offerPrice))}</span>
                          <span className="text-sm text-gray-400 line-through ml-2" data-testid="text-base-price">{formatPrice(Number(service.basePrice))}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900" data-testid="text-price">{formatPrice(Number(service.basePrice))}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Professional investigation service</p>
                </div>
                
                {/* Contact Methods based on Tier */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                   <Button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 shadow-sm h-12" data-testid="button-contact-email">
                     <Mail className="h-5 w-5" />
                     <span className="font-bold">Contact via Email</span>
                   </Button>
                   
                   {detectiveTier !== 'free' && detective.phone && (
                     <Button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-green-700 border border-green-200 shadow-sm h-12" data-testid="button-contact-phone">
                       <Phone className="h-5 w-5" />
                       <span className="font-bold">Call Now</span>
                     </Button>
                   )}
                   
                   {detectiveTier !== 'free' && detective.whatsapp && (
                     <Button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-green-700 border border-green-200 shadow-sm h-12" data-testid="button-contact-whatsapp">
                       <MessageCircle className="h-5 w-5" />
                       <span className="font-bold">WhatsApp</span>
                     </Button>
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
