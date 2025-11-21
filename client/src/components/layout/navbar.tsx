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

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedCountry, setCountry } = useCurrency();
  const { user, logout, favorites } = useUser();

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
          <Link href="/">
            <a className="text-2xl font-bold tracking-tight font-heading cursor-pointer flex items-center gap-1">
              Find<span className="text-green-500">Detectives</span>
              <span className="text-green-500 text-4xl leading-none">.</span>
            </a>
          </Link>

          {/* Country Selector */}
          <div className={`hidden md:flex items-center ${isScrolled || location !== '/' ? "text-gray-700" : "text-white/90 hover:text-white"}`}>
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
          <Link href="/detective-signup">
            <a className="hover:text-green-500 transition-colors">Become a Detective</a>
          </Link>

          {user ? (
            <>
              {/* Favorites Icon */}
              <Link href="/user/favorites">
                <a className={`relative hover:text-green-500 transition-colors ${isScrolled || location !== '/' ? "text-gray-600" : "text-white"}`}>
                  <Heart className={`h-6 w-6 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </a>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Avatar className="h-9 w-9 cursor-pointer border border-gray-200">
                     <AvatarImage src={user.avatar} />
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
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="hover:text-green-500 transition-colors">Sign In</a>
              </Link>
              <Link href="/signup">
                <Button 
                  variant={isScrolled || location !== '/' ? "outline" : "outline"} 
                  className={`${isScrolled || location !== '/' ? "text-green-500 border-green-500 hover:bg-green-50" : "text-white border-white hover:bg-white hover:text-green-500"} transition-colors`}
                >
                  Join
                </Button>
              </Link>
            </>
          )}
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
                         <AvatarImage src={user.avatar} />
                         <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col">
                         <span className="font-bold">{user.name}</span>
                         <span className="text-sm text-gray-500">{user.email}</span>
                       </div>
                    </div>
                    
                    <Link href="/user/favorites">
                      <a className="text-lg font-medium flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" /> My Favorites
                      </a>
                    </Link>
                    <Link href="/user/dashboard">
                      <a className="text-lg font-medium">Dashboard</a>
                    </Link>
                    <button onClick={logout} className="text-lg font-medium text-left text-red-600">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <a className="text-lg font-medium">Sign In</a>
                    </Link>
                    <Link href="/signup">
                      <a className="text-lg font-medium text-green-600">Join</a>
                    </Link>
                  </>
                )}

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
