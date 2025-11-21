import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/home/service-card";
import { ServiceCardSkeleton } from "@/components/home/service-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Filter, ChevronDown, Star, Check, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "wouter";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";
// @ts-ignore
import femaleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_female.png";

const RESULTS = [
  {
    id: "1",
    images: [
      "https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595852879736-2247b25533c8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1000&auto=format&fit=crop"
    ],
    avatar: maleAvatar,
    name: "James Bond",
    level: "Agency Verified",
    badges: ["verified", "recommended"],
    category: "Background Checks",
    country: "US",
    title: "I will conduct a comprehensive background check for any individual",
    rating: 5.0,
    reviews: 1254,
    price: 150,
    offerPrice: 120,
  },
  {
    id: "2",
    images: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop"
    ],
    avatar: femaleAvatar,
    name: "Sarah Holmes",
    level: "Pro Detective",
    badges: ["pro"],
    category: "Surveillance",
    country: "UK",
    title: "I will perform discreet surveillance and provide video evidence",
    rating: 4.9,
    reviews: 843,
    price: 300,
    offerPrice: null,
  },
  {
    id: "3",
    images: [
      "https://images.unsplash.com/photo-1563206767-5b1d972d9fb7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop"
    ],
    avatar: maleAvatar,
    name: "Mike Hammer",
    level: "Pro Detective",
    badges: ["pro"],
    category: "Missing Persons",
    country: "US",
    title: "I will find missing persons and reconnect families",
    rating: 4.8,
    reviews: 420,
    price: 500,
    offerPrice: 450,
  },
  {
    id: "4",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000&auto=format&fit=crop"
    ],
    avatar: femaleAvatar,
    name: "Nancy Drew",
    level: "Agency Verified",
    badges: ["verified", "recommended"],
    category: "Cyber Investigation",
    country: "CA",
    title: "I will investigate cyber bullying and online harassment",
    rating: 5.0,
    reviews: 2100,
    price: 200,
    offerPrice: 180,
  },
  {
    id: "5",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
    ],
    avatar: maleAvatar,
    name: "Thomas Magnum",
    level: "Free Member",
    badges: [],
    category: "Corporate Fraud",
    country: "US",
    title: "I will handle corporate fraud investigations and embezzlement",
    rating: 4.7,
    reviews: 156,
    price: 600,
    offerPrice: null,
  },
  {
    id: "6",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop"
    ],
    avatar: femaleAvatar,
    name: "Jessica Jones",
    level: "Agency Verified",
    badges: ["verified"],
    category: "Asset Search",
    country: "UK",
    title: "I will locate assets and hidden funds for divorce cases",
    rating: 4.9,
    reviews: 980,
    price: 450,
    offerPrice: 399,
  },
  {
    id: "7",
    images: [
      "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555861496-0666c8981751?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=1000&auto=format&fit=crop"
    ],
    avatar: maleAvatar,
    name: "Unknown Detective Agency",
    level: "Unclaimed Profile",
    badges: [],
    category: "Private Investigation",
    country: "US",
    title: "Professional Investigation Services - Agency Profile",
    rating: 0,
    reviews: 0,
    price: 100,
    offerPrice: null,
    isUnclaimed: true
  }
];

const CATEGORIES = [
  "Surveillance", 
  "Background Checks", 
  "Cyber Investigation", 
  "Legal", 
  "Missing Persons",
  "Infidelity",
  "Asset Search",
  "Forensics",
  "Due Diligence"
];

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SEO } from "@/components/seo";

export default function SearchPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("q") || "All Services";
  const countryFilter = searchParams.get("country");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [query, countryFilter]);

  const filteredResults = RESULTS.filter(service => {
    if (countryFilter && service.country !== countryFilter) return false;
    
    // Simple search filtering
    if (query !== "All Services") {
      const searchLower = query.toLowerCase();
      const matchesCategory = service.category.toLowerCase().includes(searchLower);
      const matchesTitle = service.title.toLowerCase().includes(searchLower);
      const matchesName = service.name.toLowerCase().includes(searchLower);
      
      if (!matchesCategory && !matchesTitle && !matchesName) return false;
    }
    
    return true;
  });

  const FilterContent = () => (
     <Accordion type="multiple" defaultValue={["category", "budget", "location"]} className="w-full">
       {/* Category Filter */}
       <AccordionItem value="category">
         <AccordionTrigger className="font-bold text-sm">Category</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-2 pt-1">
             {CATEGORIES.slice(0, 8).map((cat) => (
               <div key={cat} className="flex items-center space-x-2">
                 <Checkbox id={`cat-${cat}`} />
                 <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 cursor-pointer hover:text-gray-900">
                   {cat}
                 </label>
               </div>
             ))}
           </div>
         </AccordionContent>
       </AccordionItem>

       {/* Budget Filter */}
       <AccordionItem value="budget">
         <AccordionTrigger className="font-bold text-sm">Budget</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-3 pt-1">
             <div className="grid grid-cols-2 gap-2">
               <div className="space-y-1">
                 <Label className="text-xs text-gray-500">MIN</Label>
                 <Input type="number" placeholder="$" className="h-8 text-sm" />
               </div>
               <div className="space-y-1">
                 <Label className="text-xs text-gray-500">MAX</Label>
                 <Input type="number" placeholder="$" className="h-8 text-sm" />
               </div>
             </div>
             <Button size="sm" variant="outline" className="w-full h-8">Apply Price</Button>
           </div>
         </AccordionContent>
       </AccordionItem>

       {/* Location Filter */}
       <AccordionItem value="location">
         <AccordionTrigger className="font-bold text-sm">Location</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-3 pt-1">
             <div className="space-y-1.5">
               <Label className="text-xs text-gray-500">Country</Label>
               <Input placeholder="e.g. USA" className="h-8 text-sm" />
             </div>
             <div className="space-y-1.5">
               <Label className="text-xs text-gray-500">State / City</Label>
               <Input placeholder="e.g. New York" className="h-8 text-sm" />
             </div>
             <div className="flex items-center space-x-2 pt-2">
               <Switch id="local-only" />
               <Label htmlFor="local-only" className="text-sm">Local Sellers Only</Label>
             </div>
           </div>
         </AccordionContent>
       </AccordionItem>

       {/* Service Options */}
       <AccordionItem value="options">
         <AccordionTrigger className="font-bold text-sm">Service Options</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-2 pt-1">
             <div className="flex items-center space-x-2">
               <Switch id="pro-only" />
               <Label htmlFor="pro-only" className="text-sm font-semibold text-gray-700">Pro Detectives</Label>
             </div>
             <div className="flex items-center space-x-2">
               <Switch id="agency-only" />
               <Label htmlFor="agency-only" className="text-sm font-semibold text-gray-700">Agency Verified</Label>
             </div>
           </div>
         </AccordionContent>
       </AccordionItem>

       {/* Seller Details */}
       <AccordionItem value="seller">
         <AccordionTrigger className="font-bold text-sm">Seller Details</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-3 pt-1">
             <div>
               <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">Language</Label>
               <div className="space-y-1.5">
                 <div className="flex items-center space-x-2">
                   <Checkbox id="lang-en" />
                   <label htmlFor="lang-en" className="text-sm text-gray-600">English</label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox id="lang-es" />
                   <label htmlFor="lang-es" className="text-sm text-gray-600">Spanish</label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox id="lang-fr" />
                   <label htmlFor="lang-fr" className="text-sm text-gray-600">French</label>
                 </div>
               </div>
             </div>
           </div>
         </AccordionContent>
       </AccordionItem>
     </Accordion>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <SEO 
        title={`Search Results for "${query}" | FindDetectives`}
        description={`Find the best private investigators for ${query}. Compare ratings, reviews, and prices from verified professionals.`}
      />
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Top Category Slider */}
        <div className="border-b border-gray-200 bg-white sticky top-20 z-40">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <ScrollArea className="w-full whitespace-nowrap py-3">
              <div className="flex w-max space-x-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden mb-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex gap-2 border-gray-300">
                    <Filter className="h-4 w-4" /> Filter Results
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                   <div className="flex items-center gap-2 font-bold text-lg pb-4 border-b mb-4">
                     <Filter className="h-5 w-5" /> Filters
                   </div>
                   <FilterContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
               <div className="flex items-center gap-2 font-bold text-lg pb-2 border-b">
                 <Filter className="h-5 w-5" /> Filters
               </div>
               <FilterContent />
            </aside>

            {/* Main Results Area */}
            <div className="flex-1">
              {/* Search Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold font-heading mb-2">Results for "{query}"</h1>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span className="font-semibold text-gray-900">{isLoading ? '...' : filteredResults.length}</span> services available
                   </div>
                   
                   <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Sort by:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <span className="font-bold cursor-pointer flex items-center gap-1">Recommended <ChevronDown className="h-3 w-3" /></span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuCheckboxItem checked>Recommended</DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem>Best Selling</DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem>Newest Arrivals</DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem>Price: Low to High</DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem>Price: High to Low</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <ServiceCardSkeleton key={i} />
                  ))
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Globe className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No detectives found here</h3>
                    <p className="text-gray-500 mb-6 text-center max-w-md">
                      We couldn't find any detectives matching your filters in {countryFilter || "this region"}.
                    </p>
                    <Button 
                      onClick={() => {
                        // Clear filters logic could go here
                        window.location.href = "/search"; 
                      }}
                      variant="outline"
                    >
                      Clear Filters & Search All
                    </Button>
                  </div>
                )}
              </div>

               {!isLoading && filteredResults.length > 0 && (
                 <div className="mt-12 flex justify-center">
                   <Button variant="outline" className="px-8 border-black text-black hover:bg-gray-50">Load More</Button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
