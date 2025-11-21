import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { ServiceCard } from "@/components/home/service-card";
import { ServiceCardSkeleton } from "@/components/home/service-card-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import { SEO } from "@/components/seo";
import { Link } from "wouter";
import { useSearchServices } from "@/lib/hooks";
import type { Service, Detective } from "@shared/schema";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";
// @ts-ignore
import femaleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_female.png";

function mapServiceToCard(service: Service & { detective: Detective; avgRating: number; reviewCount: number }) {
  const levelMap = {
    free: "Free Member",
    pro: "Pro Detective",
    agency: "Agency Verified",
  };

  const badges: string[] = [];
  if (service.detective.isVerified) badges.push("verified");
  if (service.detective.subscriptionPlan === "agency") badges.push("recommended");
  if (service.detective.subscriptionPlan === "pro") badges.push("pro");

  const avatarMap: { [key: string]: string } = {
    "John Holmes": maleAvatar,
    "Sarah Chen": femaleAvatar,
    "Mike Torres": maleAvatar,
  };

  const detectiveName = service.detective.businessName || "Unknown Detective";

  const images = service.images && service.images.length > 0 ? service.images : undefined;
  const defaultImage = "https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop";
  
  return {
    id: service.id,
    images,
    image: images ? images[0] : defaultImage,
    avatar: avatarMap[detectiveName] || maleAvatar,
    name: detectiveName,
    level: levelMap[service.detective.subscriptionPlan] || "Free Member",
    category: service.category,
    badges,
    title: service.title,
    rating: service.avgRating,
    reviews: service.reviewCount,
    price: Number(service.basePrice),
    offerPrice: service.offerPrice ? Number(service.offerPrice) : null,
  };
}

export default function Home() {
  const { data: popularServicesData, isLoading: isLoadingPopular } = useSearchServices({ 
    limit: 4, 
    sortBy: "popular" 
  });

  const { data: backgroundChecksData, isLoading: isLoadingBackground } = useSearchServices({ 
    category: "Background Checks", 
    limit: 4 
  });

  const { data: surveillanceData, isLoading: isLoadingSurveillance } = useSearchServices({ 
    category: "Surveillance", 
    limit: 4 
  });

  const popularServices = popularServicesData?.services.map(mapServiceToCard) || [];
  const backgroundChecks = backgroundChecksData?.services.map(mapServiceToCard) || [];
  const surveillanceServices = surveillanceData?.services.map(mapServiceToCard) || [];

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <SEO 
        title="FindDetectives - Hire Top Private Investigators" 
        description="The leading marketplace for professional private investigation services. Find verified detectives for surveillance, background checks, and more."
        keywords={["private investigator", "hire detective", "surveillance", "background checks", "infidelity investigation"]}
      />
      <Navbar />
      
      <main className="flex-1">
        <Hero />

        <div className="bg-gray-50 py-8 border-b border-gray-200">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 flex justify-center gap-8 md:gap-16 grayscale opacity-50">
            <span className="font-bold text-xl">Meta</span>
            <span className="font-bold text-xl">Google</span>
            <span className="font-bold text-xl">Netflix</span>
            <span className="font-bold text-xl">P&G</span>
            <span className="font-bold text-xl">PayPal</span>
          </div>
        </div>

        <section className="py-16 container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Popular Professional Services</h2>
            <Link href="/search">
              <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" data-testid="button-view-all-popular">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingPopular ? (
              [1, 2, 3, 4].map((i) => (
                <ServiceCardSkeleton key={i} />
              ))
            ) : popularServices.length > 0 ? (
              popularServices.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200" data-testid="empty-popular-services">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm">No popular services available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 container mx-auto px-6 md:px-12 lg:px-24 bg-gray-50/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Background Checks</h2>
            <Link href="/search?q=Background%20Checks">
              <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" data-testid="button-view-all-background">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingBackground ? (
              [1, 2, 3, 4].map((i) => (
                <ServiceCardSkeleton key={i} />
              ))
            ) : backgroundChecks.length > 0 ? (
              backgroundChecks.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200" data-testid="empty-background-checks">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm">No background check services available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Surveillance Services</h2>
            <Link href="/search?q=Surveillance">
              <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" data-testid="button-view-all-surveillance">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingSurveillance ? (
              [1, 2, 3, 4].map((i) => (
                <ServiceCardSkeleton key={i} />
              ))
            ) : surveillanceServices.length > 0 ? (
              surveillanceServices.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200" data-testid="empty-surveillance-services">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm">No surveillance services available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-green-50 py-16">
          <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-stretch gap-12">
            <div className="flex-1 space-y-6 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold font-heading">
                The best part? Everything.
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="flex items-center text-lg font-bold mb-1">
                    <div className="h-6 w-6 rounded-full border border-gray-900 flex items-center justify-center mr-2 text-sm">✓</div>
                    Stick to your budget
                  </h3>
                  <p className="text-gray-600 ml-8">Find the right service for every price point. No hourly rates, just project-based pricing.</p>
                </div>
                
                <div>
                  <h3 className="flex items-center text-lg font-bold mb-1">
                    <div className="h-6 w-6 rounded-full border border-gray-900 flex items-center justify-center mr-2 text-sm">✓</div>
                    Get quality work done quickly
                  </h3>
                  <p className="text-gray-600 ml-8">Hand your project over to a talented detective in minutes, get long-lasting results.</p>
                </div>
                
                <div>
                  <h3 className="flex items-center text-lg font-bold mb-1">
                    <div className="h-6 w-6 rounded-full border border-gray-900 flex items-center justify-center mr-2 text-sm">✓</div>
                    Pay when you're happy
                  </h3>
                  <p className="text-gray-600 ml-8">Upfront quotes mean no surprises. Payments only get released when you approve.</p>
                </div>
                
                <div>
                  <h3 className="flex items-center text-lg font-bold mb-1">
                    <div className="h-6 w-6 rounded-full border border-gray-900 flex items-center justify-center mr-2 text-sm">✓</div>
                    Count on 24/7 support
                  </h3>
                  <p className="text-gray-600 ml-8">Our round-the-clock support team is available to help anytime, anywhere.</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative min-h-[400px] lg:min-h-full">
              <div className="absolute inset-0 h-full w-full">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" 
                  alt="Team working" 
                  className="rounded-lg shadow-xl w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
