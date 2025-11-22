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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SEO } from "@/components/seo";
import { useSearchServices, useServiceCategories } from "@/lib/hooks";
import type { Service, Detective } from "@shared/schema";

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

  const detectiveName = service.detective.businessName || "Unknown Detective";

  // Use actual database images - NO MOCK DATA
  const images = service.images && service.images.length > 0 ? service.images : undefined;
  const serviceImage = images ? images[0] : null;
  const detectiveLogo = service.detective.logo || null;
  
  return {
    id: service.id,
    images,
    image: serviceImage,
    avatar: detectiveLogo,
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

export default function SearchPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("q") || "All Services";
  const countryFilter = searchParams.get("country");
  
  const { data: servicesData, isLoading } = useSearchServices({
    search: query !== "All Services" ? query : undefined,
    country: countryFilter || undefined,
    limit: 50,
  });

  const { data: categoriesData } = useServiceCategories(true);
  const categories = categoriesData?.categories || [];

  const results = servicesData?.services.map(mapServiceToCard) || [];

  const FilterContent = () => (
     <Accordion type="multiple" defaultValue={["category", "budget", "location"]} className="w-full">
       <AccordionItem value="category">
         <AccordionTrigger className="font-bold text-sm">Category</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-2 pt-1">
             {categories.map((cat) => (
               <div key={cat.id} className="flex items-center space-x-2">
                 <Checkbox id={`cat-${cat.id}`} data-testid={`checkbox-category-${cat.name.toLowerCase().replace(/\s+/g, '-')}`} />
                 <label htmlFor={`cat-${cat.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 cursor-pointer hover:text-gray-900">
                   {cat.name}
                 </label>
               </div>
             ))}
           </div>
         </AccordionContent>
       </AccordionItem>

       <AccordionItem value="budget">
         <AccordionTrigger className="font-bold text-sm">Budget</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-3 pt-1">
             <div className="grid grid-cols-2 gap-2">
               <div className="space-y-1">
                 <Label className="text-xs text-gray-500">MIN</Label>
                 <Input type="number" placeholder="$" className="h-8 text-sm" data-testid="input-min-price" />
               </div>
               <div className="space-y-1">
                 <Label className="text-xs text-gray-500">MAX</Label>
                 <Input type="number" placeholder="$" className="h-8 text-sm" data-testid="input-max-price" />
               </div>
             </div>
             <Button size="sm" variant="outline" className="w-full h-8" data-testid="button-apply-price">Apply Price</Button>
           </div>
         </AccordionContent>
       </AccordionItem>

       <AccordionItem value="location">
         <AccordionTrigger className="font-bold text-sm">Location</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-3 pt-1">
             <div className="space-y-1.5">
               <Label className="text-xs text-gray-500">Country</Label>
               <Input placeholder="e.g. USA" className="h-8 text-sm" data-testid="input-country-filter" />
             </div>
             <div className="space-y-1.5">
               <Label className="text-xs text-gray-500">State / City</Label>
               <Input placeholder="e.g. New York" className="h-8 text-sm" data-testid="input-city-filter" />
             </div>
             <div className="flex items-center space-x-2 pt-2">
               <Switch id="local-only" data-testid="switch-local-only" />
               <Label htmlFor="local-only" className="text-sm">Local Sellers Only</Label>
             </div>
           </div>
         </AccordionContent>
       </AccordionItem>

       <AccordionItem value="options">
         <AccordionTrigger className="font-bold text-sm">Service Options</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-2 pt-1">
             <div className="flex items-center space-x-2">
               <Switch id="pro-only" data-testid="switch-pro-only" />
               <Label htmlFor="pro-only" className="text-sm font-semibold text-gray-700">Pro Detectives</Label>
             </div>
             <div className="flex items-center space-x-2">
               <Switch id="agency-only" data-testid="switch-agency-only" />
               <Label htmlFor="agency-only" className="text-sm font-semibold text-gray-700">Agency Verified</Label>
             </div>
           </div>
         </AccordionContent>
       </AccordionItem>

       <AccordionItem value="seller">
         <AccordionTrigger className="font-bold text-sm">Seller Details</AccordionTrigger>
         <AccordionContent>
           <div className="space-y-3 pt-1">
             <div>
               <Label className="text-xs font-semibold text-gray-500 mb-1.5 block">Language</Label>
               <div className="space-y-1.5">
                 <div className="flex items-center space-x-2">
                   <Checkbox id="lang-en" data-testid="checkbox-lang-english" />
                   <label htmlFor="lang-en" className="text-sm text-gray-600">English</label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox id="lang-es" data-testid="checkbox-lang-spanish" />
                   <label htmlFor="lang-es" className="text-sm text-gray-600">Spanish</label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox id="lang-fr" data-testid="checkbox-lang-french" />
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
        <div className="border-b border-gray-200 bg-white sticky top-20 z-40">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <ScrollArea className="w-full whitespace-nowrap py-3">
              <div className="flex w-max space-x-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
                    data-testid={`button-category-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:hidden mb-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex gap-2 border-gray-300" data-testid="button-filter-mobile">
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

            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
               <div className="flex items-center gap-2 font-bold text-lg pb-2 border-b">
                 <Filter className="h-5 w-5" /> Filters
               </div>
               <FilterContent />
            </aside>

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl font-bold font-heading mb-2" data-testid="text-search-heading">Results for "{query}"</h1>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span className="font-semibold text-gray-900" data-testid="text-results-count">{isLoading ? '...' : results.length}</span> services available
                   </div>
                   
                   <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Sort by:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <span className="font-bold cursor-pointer flex items-center gap-1" data-testid="button-sort-dropdown">Recommended <ChevronDown className="h-3 w-3" /></span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuCheckboxItem checked data-testid="sort-recommended">Recommended</DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem data-testid="sort-best-selling">Best Selling</DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem data-testid="sort-newest">Newest Arrivals</DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem data-testid="sort-price-low">Price: Low to High</DropdownMenuCheckboxItem>
                           <DropdownMenuCheckboxItem data-testid="sort-price-high">Price: High to Low</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <ServiceCardSkeleton key={i} />
                  ))
                ) : results.length > 0 ? (
                  results.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200" data-testid="empty-search-results">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Globe className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No detectives found here</h3>
                    <p className="text-gray-500 mb-6 text-center max-w-md">
                      We couldn't find any detectives matching your search for "{query}"{countryFilter ? ` in ${countryFilter}` : ""}.
                    </p>
                    <Button 
                      onClick={() => {
                        window.location.href = "/search"; 
                      }}
                      variant="outline"
                      data-testid="button-clear-filters"
                    >
                      Clear Filters & Search All
                    </Button>
                  </div>
                )}
              </div>

               {!isLoading && results.length > 0 && (
                 <div className="mt-12 flex justify-center">
                   <Button variant="outline" className="px-8 border-black text-black hover:bg-gray-50" data-testid="button-load-more">Load More</Button>
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
