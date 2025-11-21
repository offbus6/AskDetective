import { Star, Heart, ChevronLeft, ChevronRight, ShieldCheck, Award, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ServiceCardProps {
  id: string;
  images?: string[];
  image?: string; // Backward compatibility
  avatar: string;
  name: string;
  level: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
}

export function ServiceCard({ id, images, image, avatar, name, level, title, rating, reviews, price }: ServiceCardProps) {
  const displayImages = images || (image ? [image] : []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <Link href={`/service/${id}`}>
      <a className="block h-full">
        <Card 
          className="h-full overflow-hidden border-gray-200 hover:shadow-md transition-shadow group cursor-pointer flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Slider */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <img 
              src={displayImages[currentImageIndex]} 
              alt={title} 
              className="object-cover w-full h-full transition-transform duration-300"
            />
            
            {/* Navigation Arrows - Only show on hover and if multiple images */}
            {displayImages.length > 1 && isHovered && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {displayImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 w-1.5 rounded-full shadow-sm transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <CardContent className="p-4 flex-1">
            {/* Author Row */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8 border border-gray-100">
                <AvatarImage src={avatar} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-900 hover:underline truncate">{name}</span>
                  
                  <TooltipProvider>
                    {/* Agency Verified Badge */}
                    {level === "Agency Verified" && (
                      <Tooltip>
                        <TooltipTrigger>
                           <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-50 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Agency Verified</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Pro Detective Badge */}
                    {level === "Pro Detective" && (
                      <Tooltip>
                        <TooltipTrigger>
                           <BadgeCheck className="h-4 w-4 text-green-600 fill-green-50 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pro Detective</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Top Rated Badge (Legacy support) */}
                    {level === "Top Rated Detective" && (
                      <Tooltip>
                        <TooltipTrigger>
                           <Award className="h-4 w-4 text-amber-500 fill-amber-50 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Top Rated</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </div>
                <span className="text-xs text-gray-500 truncate">{level}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-gray-700 hover:text-green-600 line-clamp-2 text-base mb-2 group-hover:underline decoration-green-600">
              {title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 text-sm mt-auto">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{rating}</span>
              <span className="text-gray-400">({reviews})</span>
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <Heart className="h-4 w-4 text-gray-400 hover:fill-red-500 hover:text-red-500 transition-colors cursor-pointer" />
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 uppercase font-semibold">Starting at</span>
              <span className="text-lg font-bold text-gray-900">${price}</span>
            </div>
          </CardFooter>
        </Card>
      </a>
    </Link>
  );
}
