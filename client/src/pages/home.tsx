import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { ServiceCard } from "@/components/home/service-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";
// @ts-ignore
import femaleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_female.png";

const SERVICES = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "James Bond",
    level: "Top Rated Detective",
    title: "I will conduct a comprehensive background check for any individual",
    rating: 5.0,
    reviews: 1254,
    price: 150,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Sarah Holmes",
    level: "Level 2 Detective",
    title: "I will perform discreet surveillance and provide video evidence",
    rating: 4.9,
    reviews: 843,
    price: 300,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1563206767-5b1d972d9fb7?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "Mike Hammer",
    level: "Level 2 Detective",
    title: "I will find missing persons and reconnect families",
    rating: 4.8,
    reviews: 420,
    price: 500,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Nancy Drew",
    level: "Top Rated Detective",
    title: "I will investigate cyber bullying and online harassment",
    rating: 5.0,
    reviews: 2100,
    price: 200,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />
      
      <main className="flex-1">
        <Hero />

        {/* Trusted By (Optional polish) */}
        <div className="bg-gray-50 py-8 border-b border-gray-200">
          <div className="container mx-auto px-4 flex justify-center gap-8 md:gap-16 grayscale opacity-50">
            {/* Placeholders for logos */}
            <span className="font-bold text-xl">Meta</span>
            <span className="font-bold text-xl">Google</span>
            <span className="font-bold text-xl">Netflix</span>
            <span className="font-bold text-xl">P&G</span>
            <span className="font-bold text-xl">PayPal</span>
          </div>
        </div>

        {/* Popular Services */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Popular Professional Services</h2>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>

        {/* Value Proposition */}
        <section className="bg-green-50 py-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
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
            
            <div className="flex-1">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" 
                  alt="Team working" 
                  className="rounded-lg shadow-xl"
                />
                {/* Video button overlay could go here */}
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
