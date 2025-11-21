import { Link, useLocation } from "wouter";
import { Search, Menu, X, Globe, ChevronDown, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useCurrency, COUNTRIES } from "@/lib/currency-context";
import { useUser } from "@/lib/user-context";
import { useLogout } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedCountry, setCountry } = useCurrency();
  const { user } = useUser();
  const logoutMutation = useLogout();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out",
        description: "See you soon!",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

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
    setCountry(country);
    
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
        isScrolled || location !== '/' ? "bg-white border-b border-gray-200 text-gray-700" : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tight font-heading cursor-pointer flex items-center gap-1">
              Find<span className="text-green-500">Detectives</span>
              <span className="text-green-500 text-4xl leading-none">.</span>
          </Link>

          {/* Country Selector */}
          <div className={`hidden md:hidden items-center ${isScrolled || location !== '/' ? "text-gray-700" : "text-white/90 hover:text-white"}`}>
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
          <div className={`hidden xl:flex relative w-96 transition-opacity duration-300 ${isScrolled || location !== '/' ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
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
          {user ? (
            <>
              {/* Favorites Icon */}
              <Link href="/user/favorites" className={`relative hover:text-green-500 transition-colors ${isScrolled || location !== '/' ? "text-gray-600" : "text-white"}`} data-testid="link-favorites">
                  <Heart className="h-6 w-6" />
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Avatar className="h-9 w-9 cursor-pointer border border-gray-200">
                     <AvatarImage src={user.avatar ?? undefined} />
                     <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                   </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' ? (
                    <Link href="/admin/dashboard">
                       <DropdownMenuItem className="cursor-pointer">Admin Dashboard</DropdownMenuItem>
                    </Link>
                  ) : user.role === 'detective' ? (
                     <Link href="/detective/dashboard">
                       <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
                     </Link>
                  ) : (
                     <Link href="/user/dashboard">
                       <DropdownMenuItem className="cursor-pointer">Dashboard</DropdownMenuItem>
                     </Link>
                  )}
                  <Link href="/user/favorites">
                    <DropdownMenuItem className="cursor-pointer">Favorites</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600" data-testid="button-logout">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Login Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:text-green-500 transition-colors">
                    Login <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/login">
                    <DropdownMenuItem className="cursor-pointer">As a General User</DropdownMenuItem>
                  </Link>
                  <Link href="/login">
                    <DropdownMenuItem className="cursor-pointer">As a Detective</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sign Up Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={isScrolled || location !== '/' ? "outline" : "outline"} 
                    className={`${isScrolled || location !== '/' ? "text-green-500 border-green-500 hover:bg-green-50" : "text-white border-white hover:bg-white hover:text-green-500"} transition-colors gap-1`}
                  >
                    Sign Up <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/signup">
                    <DropdownMenuItem className="cursor-pointer">As a General User</DropdownMenuItem>
                  </Link>
                  <Link href="/detective-signup">
                    <DropdownMenuItem className="cursor-pointer">As a Detective</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {/* Country Selector - Desktop */}
          <div className={`hidden md:flex items-center ${isScrolled || location !== '/' ? "text-gray-700" : "text-white/90 hover:text-white"}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 hover:bg-white/10">
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="font-medium hidden lg:inline">{selectedCountry.code}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Country Display */}
           <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`gap-1 px-2 ${isScrolled || location !== '/' ? "text-black hover:bg-gray-100" : "text-white hover:bg-white/20"}`}>
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isScrolled || location !== '/' ? "text-black" : "text-white"}>
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

                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                       <Avatar className="h-10 w-10 border border-gray-200">
                         <AvatarImage src={user.avatar ?? undefined} />
                         <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col">
                         <span className="font-bold">{user.name}</span>
                         <span className="text-sm text-gray-500">{user.email}</span>
                       </div>
                    </div>
                    
                    <Link href="/user/favorites" className="text-lg font-medium flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" /> My Favorites
                    </Link>
                    <Link href="/user/dashboard" className="text-lg font-medium">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="text-lg font-medium text-left text-red-600" data-testid="button-logout-mobile">
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Mobile Login Dropdown */}
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-500">Login</span>
                      <Link href="/login" className="text-lg font-medium pl-2 border-l-2 border-transparent hover:border-green-500 hover:text-green-600 transition-colors">
                          As a General User
                      </Link>
                      <Link href="/login" className="text-lg font-medium pl-2 border-l-2 border-transparent hover:border-green-500 hover:text-green-600 transition-colors">
                          As a Detective
                      </Link>
                    </div>

                    {/* Mobile Sign Up Dropdown */}
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-sm font-semibold text-gray-500">Sign Up</span>
                      <Link href="/signup" className="text-lg font-medium pl-2 border-l-2 border-green-500 text-green-600 bg-green-50/50 py-1 rounded-r">
                          As a General User
                      </Link>
                      <Link href="/detective-signup" className="text-lg font-medium pl-2 border-l-2 border-green-500 text-green-600 bg-green-50/50 py-1 rounded-r">
                          As a Detective
                      </Link>
                    </div>
                  </div>
                )}

                <hr />
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-gray-500">Browse Categories</h4>
                  <Link href="/category/surveillance" className="text-base">Surveillance</Link>
                  <Link href="/category/background-check" className="text-base">Background Checks</Link>
                  <Link href="/category/cyber" className="text-base">Cyber Investigation</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
