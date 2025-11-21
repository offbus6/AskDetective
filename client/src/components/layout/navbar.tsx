import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
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

          {/* Desktop Search - Only show when scrolled or on non-home pages (simplified for now) */}
          <div className={`hidden md:flex relative w-96 transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <Input 
              type="text" 
              placeholder="What service are you looking for?" 
              className="w-full pl-4 pr-10 h-10 bg-white border-gray-300 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Search 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 cursor-pointer" 
              onClick={() => searchQuery.trim() && setLocation(`/search?q=${encodeURIComponent(searchQuery)}`)}
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
