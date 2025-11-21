import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/home/service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Filter, ChevronDown, Star, Check } from "lucide-react";
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

export default function SearchPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("q") || "All Services";

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Top Category Slider */}
        <div className="border-b border-gray-200 bg-white sticky top-20 z-40">
          <div className="container mx-auto px-4">
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

        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-heading mb-2">Results for "{query}"</h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
               <span className="font-semibold text-gray-900">2,451</span> services available
            </div>
          </div>

          {/* Horizontal Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8 sticky top-[116px] z-30 bg-white py-2">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 rounded-lg border-gray-300 font-semibold hover:border-black">
                  Category <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {CATEGORIES.slice(0, 5).map((cat) => (
                  <DropdownMenuCheckboxItem key={cat}>
                    {cat}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Service Options (Delivery, etc - Generic Placeholder) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 rounded-lg border-gray-300 font-semibold hover:border-black">
                  Service Options <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Delivery Time</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Express 24H</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Up to 3 Days</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Up to 7 Days</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Seller Details (Levels, Language) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 rounded-lg border-gray-300 font-semibold hover:border-black">
                  Seller Details <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="start">
                <DropdownMenuLabel>Seller Level</DropdownMenuLabel>
                <div className="p-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="top_rated" />
                    <label htmlFor="top_rated" className="text-sm font-medium leading-none">Top Rated</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="level_2" />
                    <label htmlFor="level_2" className="text-sm font-medium leading-none">Level 2</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="level_1" />
                    <label htmlFor="level_1" className="text-sm font-medium leading-none">Level 1</label>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Seller Speaks</DropdownMenuLabel>
                <div className="p-2 space-y-2">
                  <div className="flex items-center space-x-2">
                     <Checkbox id="lang_en" />
                     <label htmlFor="lang_en" className="text-sm font-medium leading-none">English</label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Checkbox id="lang_es" />
                     <label htmlFor="lang_es" className="text-sm font-medium leading-none">Spanish</label>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Budget */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 rounded-lg border-gray-300 font-semibold hover:border-black">
                  Budget <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4" align="start">
                 <div className="space-y-4">
                   <h4 className="font-medium text-sm">Price Range</h4>
                   <div className="flex items-center gap-4">
                     <div className="space-y-1.5">
                       <Label className="text-xs text-gray-500">MIN ($)</Label>
                       <Input type="number" placeholder="0" className="h-9" />
                     </div>
                     <div className="space-y-1.5">
                       <Label className="text-xs text-gray-500">MAX ($)</Label>
                       <Input type="number" placeholder="Any" className="h-9" />
                     </div>
                   </div>
                   <div className="flex justify-end gap-2">
                     <Button variant="ghost" size="sm">Clear</Button>
                     <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Apply</Button>
                   </div>
                 </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Location Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 rounded-lg border-gray-300 font-semibold hover:border-black">
                  Location <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-4" align="start">
                <div className="space-y-4">
                   <div className="space-y-2">
                     <Label>Country</Label>
                     <Input placeholder="Enter Country" className="h-9" />
                   </div>
                   <div className="space-y-2">
                     <Label>State/City</Label>
                     <Input placeholder="Enter City or State" className="h-9" />
                   </div>
                   <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">Apply Location</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Toggles (Pro, Local, etc) */}
            <div className="flex items-center gap-4 ml-2 border-l pl-4 h-8">
               <div className="flex items-center space-x-2">
                 <Switch id="pro-services" />
                 <Label htmlFor="pro-services" className="font-semibold cursor-pointer">Pro Services</Label>
               </div>
               <div className="flex items-center space-x-2">
                 <Switch id="local-sellers" />
                 <Label htmlFor="local-sellers" className="font-semibold cursor-pointer">Local Sellers</Label>
               </div>
            </div>
          </div>

          {/* Applied Filters Tags (Example) */}
          <div className="flex flex-wrap gap-2 mb-6">
             {/* Only show if active - hardcoded example */}
             {/* 
             <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 text-gray-700">
               Budget: $100 - $500 <X className="h-3 w-3 cursor-pointer" />
             </div>
             */}
          </div>

          {/* Sort Bar & Results Count */}
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-bold text-black">{RESULTS.length}</span> services found
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
                  </DropdownMenuContent>
                </DropdownMenu>
             </div>
          </div>

          {/* Results Grid - Full Width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {RESULTS.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>

           <div className="mt-12 flex justify-center">
             <Button variant="outline" className="px-8 border-black text-black hover:bg-gray-50">Load More</Button>
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
