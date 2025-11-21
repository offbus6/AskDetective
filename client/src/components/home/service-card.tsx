import { Star, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface ServiceCardProps {
  id: string;
  image: string;
  avatar: string;
  name: string;
  level: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
}

export function ServiceCard({ id, image, avatar, name, level, title, rating, reviews, price }: ServiceCardProps) {
  return (
    <Link href={`/service/${id}`}>
      <a className="block h-full">
        <Card className="h-full overflow-hidden border-gray-200 hover:shadow-md transition-shadow group cursor-pointer flex flex-col">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <CardContent className="p-4 flex-1">
            {/* Author Row */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatar} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 hover:underline">{name}</span>
                <span className="text-xs text-gray-500">{level}</span>
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
