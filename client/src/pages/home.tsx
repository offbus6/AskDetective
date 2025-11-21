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

const POPULAR_SERVICES = [
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
    offerPrice: 120,
    badges: ["verified", "recommended"],
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
    offerPrice: null,
    badges: ["pro"],
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
    offerPrice: 450,
    badges: ["pro"],
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
    offerPrice: 180,
    badges: ["verified", "recommended"],
  },
];

const BACKGROUND_CHECKS = [
  {
    id: "bc1",
    image: "https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "John Doe",
    level: "Pro Detective",
    title: "I will run a complete background check on any US citizen",
    rating: 4.9,
    reviews: 320,
    price: 120,
    offerPrice: 99,
    badges: ["pro"],
  },
  {
    id: "bc2",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Jane Smith",
    level: "Level 2 Detective",
    title: "I will verify employment history and educational credentials",
    rating: 4.8,
    reviews: 150,
    price: 90,
    offerPrice: 75,
    badges: ["verified"],
  },
  {
    id: "bc3",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "Robert Brown",
    level: "Agency Verified",
    title: "I will perform criminal record and financial background checks",
    rating: 5.0,
    reviews: 560,
    price: 250,
    offerPrice: null,
    badges: ["verified", "recommended"],
  },
  {
    id: "bc4",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Emily White",
    level: "Top Rated Detective",
    title: "I will conduct deep web background screening for hires",
    rating: 4.9,
    reviews: 410,
    price: 180,
    offerPrice: 150,
    badges: ["pro"],
  },
];

const INFIDELITY_SERVICES = [
  {
    id: "inf1",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Sarah Holmes",
    level: "Top Rated Detective",
    title: "I will investigate suspected infidelity with photo evidence",
    rating: 5.0,
    reviews: 890,
    price: 350,
    offerPrice: 299,
    badges: ["verified", "recommended"],
  },
  {
    id: "inf2",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "David Miller",
    level: "Pro Detective",
    title: "I will track your partner's activities discreetly",
    rating: 4.8,
    reviews: 230,
    price: 300,
    offerPrice: null,
    badges: ["pro"],
  },
  {
    id: "inf3",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Lisa Wilson",
    level: "Level 2 Detective",
    title: "I will find out if your spouse is cheating on you",
    rating: 4.9,
    reviews: 450,
    price: 280,
    offerPrice: 250,
    badges: ["verified"],
  },
  {
    id: "inf4",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "James Black",
    level: "Agency Verified",
    title: "I will provide concrete proof of infidelity for court cases",
    rating: 5.0,
    reviews: 670,
    price: 500,
    offerPrice: 450,
    badges: ["verified", "recommended"],
  },
];

const SURVEILLANCE_SERVICES = [
  {
    id: "sur1",
    image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "Agent 47",
    level: "Pro Detective",
    title: "I will provide 24/7 covert surveillance on any target",
    rating: 5.0,
    reviews: 1100,
    price: 600,
    offerPrice: 550,
    badges: ["pro", "recommended"],
  },
  {
    id: "sur2",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Natasha Romanoff",
    level: "Top Rated Detective",
    title: "I will conduct mobile and static surveillance operations",
    rating: 4.9,
    reviews: 950,
    price: 550,
    offerPrice: null,
    badges: ["verified"],
  },
  {
    id: "sur3",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "Sam Fisher",
    level: "Agency Verified",
    title: "I will perform counter-surveillance and bug sweeping",
    rating: 4.8,
    reviews: 340,
    price: 400,
    offerPrice: 350,
    badges: ["verified", "pro"],
  },
  {
    id: "sur4",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Lara Croft",
    level: "Level 2 Detective",
    title: "I will document daily routines and associations of subjects",
    rating: 4.7,
    reviews: 210,
    price: 350,
    offerPrice: 300,
    badges: ["verified"],
  },
];

const ASSET_SEARCH_SERVICES = [
  {
    id: "as1",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Jessica Jones",
    level: "Top Rated Detective",
    title: "I will locate hidden bank accounts and offshore assets",
    rating: 5.0,
    reviews: 780,
    price: 450,
    offerPrice: 399,
    badges: ["verified", "recommended"],
  },
  {
    id: "as2",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "Matt Murdock",
    level: "Pro Detective",
    title: "I will uncover real estate properties and vehicle ownership",
    rating: 4.9,
    reviews: 540,
    price: 380,
    offerPrice: null,
    badges: ["pro"],
  },
  {
    id: "as3",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "Foggy Nelson",
    level: "Agency Verified",
    title: "I will perform comprehensive asset investigation for litigation",
    rating: 4.8,
    reviews: 290,
    price: 420,
    offerPrice: 380,
    badges: ["verified"],
  },
  {
    id: "as4",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Karen Page",
    level: "Level 2 Detective",
    title: "I will find hidden cryptocurrency wallets and digital assets",
    rating: 4.9,
    reviews: 360,
    price: 500,
    offerPrice: 450,
    badges: ["verified"],
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
          <div className="container mx-auto px-6 md:px-12 lg:px-24 flex justify-center gap-8 md:gap-16 grayscale opacity-50">
            {/* Placeholders for logos */}
            <span className="font-bold text-xl">Meta</span>
            <span className="font-bold text-xl">Google</span>
            <span className="font-bold text-xl">Netflix</span>
            <span className="font-bold text-xl">P&G</span>
            <span className="font-bold text-xl">PayPal</span>
          </div>
        </div>

        {/* Popular Services */}
        <section className="py-16 container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Popular Professional Services</h2>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_SERVICES.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>

        {/* Background Checks */}
        <section className="py-12 container mx-auto px-6 md:px-12 lg:px-24 bg-gray-50/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Background Checks</h2>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BACKGROUND_CHECKS.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>

        {/* Infidelity */}
        <section className="py-12 container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Infidelity Investigations</h2>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INFIDELITY_SERVICES.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>

        {/* Surveillance */}
        <section className="py-12 container mx-auto px-6 md:px-12 lg:px-24 bg-gray-50/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Surveillance Services</h2>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SURVEILLANCE_SERVICES.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>

        {/* Asset Search */}
        <section className="py-12 container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-heading">Asset Search & Recovery</h2>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ASSET_SEARCH_SERVICES.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </section>

        {/* Value Proposition */}
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
