import { Link, useLocation } from "wouter";
import { Search, Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COUNTRIES = [
  { code: "ALL", name: "Global", flag: "🌐" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  useEffect(() => {
    // Check URL for country param on mount
    const params = new URLSearchParams(window.location.search);
    const countryCode = params.get("country");
    if (countryCode) {
      const country = COUNTRIES.find(c => c.code === countryCode);
      if (country) setSelectedCountry(country);
    }
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      if (selectedCountry.code !== "ALL") {
        params.set("country", selectedCountry.code);
      }
      setLocation(`/search?${params.toString()}`);
    }
  };

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    
    // If currently on search page, update the URL
    if (location.startsWith("/search")) {
      const params = new URLSearchParams(window.location.search);
      if (country.code !== "ALL") {
        params.set("country", country.code);
      } else {
        params.delete("country");
      }
      setLocation(`/search?${params.toString()}`);
    }
  };

  // Effect to handle scroll state for transparent/solid navbar
  if (typeof window !== "undefined") {
    window.onscroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white border-b border-gray-200 text-gray-700" : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="text-2xl font-bold tracking-tight font-heading cursor-pointer flex items-center gap-1">
              Find<span className="text-green-500">Detectives</span>
              <span className="text-green-500 text-4xl leading-none">.</span>
            </a>
          </Link>

          {/* Country Selector */}
          <div className={`hidden md:flex items-center ${isScrolled ? "text-gray-700" : "text-white/90 hover:text-white"}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 hover:bg-white/10">
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="font-medium hidden lg:inline">{selectedCountry.code}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {COUNTRIES.map((country) => (
                  <DropdownMenuItem 
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="gap-3 cursor-pointer"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Search - Only show when scrolled or on non-home pages (simplified for now) */}
          <div className={`hidden xl:flex relative w-96 transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <Input 
              type="text" 
              placeholder={`Search in ${selectedCountry.name === 'Global' ? 'All Countries' : selectedCountry.name}...`}
              className="w-full pl-4 pr-10 h-10 bg-white border-gray-300 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Search 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 cursor-pointer" 
              onClick={() => {
                 if (searchQuery.trim()) {
                    const params = new URLSearchParams();
                    params.set("q", searchQuery);
                    if (selectedCountry.code !== "ALL") {
                      params.set("country", selectedCountry.code);
                    }
                    setLocation(`/search?${params.toString()}`);
                 }
              }}
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <Link href="/detective-signup">
            <a className="hover:text-green-500 transition-colors">Become a Detective</a>
          </Link>
          <Link href="/login">
            <a className="hover:text-green-500 transition-colors">Sign In</a>
          </Link>
          <Link href="/signup">
            <Button 
              variant={isScrolled ? "outline" : "outline"} 
              className={`${isScrolled ? "text-green-500 border-green-500 hover:bg-green-50" : "text-white border-white hover:bg-white hover:text-green-500"} transition-colors`}
            >
              Join
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isScrolled ? "text-black" : "text-white"}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="font-medium">Region</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <span>{selectedCountry.flag}</span> {selectedCountry.code} <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {COUNTRIES.map((country) => (
                        <DropdownMenuItem 
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className="gap-3"
                        >
                          <span>{country.flag}</span> {country.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href="/login">
                  <a className="text-lg font-medium">Sign In</a>
                </Link>
                <Link href="/signup">
                  <a className="text-lg font-medium text-green-600">Join</a>
                </Link>
                <Link href="/detective-signup">
                  <a className="text-lg font-medium">Become a Detective</a>
                </Link>
                <hr />
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-gray-500">Browse Categories</h4>
                  <Link href="/category/surveillance"><a className="text-base">Surveillance</a></Link>
                  <Link href="/category/background-check"><a className="text-base">Background Checks</a></Link>
                  <Link href="/category/cyber"><a className="text-base">Cyber Investigation</a></Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
