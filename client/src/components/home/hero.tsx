import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
// @ts-ignore
import heroBg from "@assets/generated_images/professional_modern_city_skyline_at_dusk_with_subtle_mystery_vibes.png";

export function Hero() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative h-[600px] w-full flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-start max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">
          Find the perfect <i className="font-serif font-light text-green-400">private detective</i><br />
          for your investigation.
        </h1>
        
        {/* Search Bar */}
        <div className="w-full bg-white rounded-md flex items-center p-1 pr-2 h-14 md:h-16 shadow-lg mb-6">
          <div className="flex-1 h-full relative">
            <Search className="absolute ml-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 md:h-6 md:w-6" />
            <input 
              type="text" 
              className="w-full h-full pl-12 md:pl-14 text-gray-800 text-base md:text-lg outline-none placeholder:text-gray-400 rounded-l-md"
              placeholder="What service are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="h-full px-8 md:px-10 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-md"
          >
            Search
          </Button>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <span className="text-gray-300">Popular:</span>
          {["Background Checks", "Infidelity", "Surveillance", "Asset Search"].map((tag) => (
            <button 
              key={tag}
              onClick={() => setLocation(`/search?q=${encodeURIComponent(tag)}`)}
              className="px-3 py-1 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
