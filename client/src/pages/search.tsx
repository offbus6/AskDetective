import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/home/service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Filter } from "lucide-react";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";
// @ts-ignore
import femaleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_female.png";

const RESULTS = [
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
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    avatar: maleAvatar,
    name: "Thomas Magnum",
    level: "Level 1 Detective",
    title: "I will handle corporate fraud investigations and embezzlement",
    rating: 4.7,
    reviews: 156,
    price: 600,
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
    avatar: femaleAvatar,
    name: "Jessica Jones",
    level: "Top Rated Detective",
    title: "I will locate assets and hidden funds for divorce cases",
    rating: 4.9,
    reviews: 980,
    price: 450,
  },
];

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Results for "Background Check"</h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
             <span className="font-semibold text-gray-900">2,451</span> services available
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0 space-y-8">
            {/* Mobile Filter Toggle (hidden on desktop) */}
            <Button variant="outline" className="w-full lg:hidden mb-4">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:block space-y-6">
              {/* Category */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm">Category</h3>
                <div className="space-y-2">
                  {["Surveillance", "Background Checks", "Cyber Investigation", "Legal", "Missing Persons"].map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox id={cat} />
                      <label htmlFor={cat} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Details */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-sm">Detective Level</h3>
                <div className="space-y-2">
                  {["Top Rated Detective", "Level 2", "Level 1", "New Seller"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox id={level} />
                      <label htmlFor={level} className="text-sm font-medium leading-none text-gray-600">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-sm">Budget</h3>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" className="h-8 text-sm" />
                  <span className="text-gray-400">-</span>
                  <Input type="number" placeholder="Max" className="h-8 text-sm" />
                </div>
              </div>

               {/* Location */}
               <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-sm">Location</h3>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Enter city or zip" className="pl-8 h-9 text-sm" />
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {["Pro Services", "Local Sellers", "Online Now"].map((filter) => (
                  <div key={filter} className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-semibold hover:border-gray-900 cursor-pointer transition-colors">
                    {filter}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <span className="font-bold cursor-pointer">Recommended</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESULTS.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>

             <div className="mt-12 flex justify-center">
               <Button variant="outline" className="px-8">Load More</Button>
             </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
