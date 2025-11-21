import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useUser } from "@/lib/user-context";
import { ServiceCard } from "@/components/home/service-card";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FavoritesPage() {
  const { favorites, user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 mt-16">
          <div className="text-center max-w-md">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
            <p className="text-gray-500 mb-6">You need to be logged in to view your favorites.</p>
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700">Sign In Now</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-5 py-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading text-gray-900 flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              My Favorites
            </h1>
            <p className="text-gray-500 mt-1">
              {favorites.length} {favorites.length === 1 ? 'detective' : 'detectives'} saved to your list
            </p>
          </div>
          <Link href="/search">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Browse More
            </Button>
          </Link>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((detective) => (
              <ServiceCard
                key={detective.id}
                id={detective.id}
                images={detective.image ? [detective.image] : []}
                avatar={detective.avatar}
                name={detective.name}
                level="Pro"
                title={detective.title}
                rating={detective.rating}
                reviews={detective.reviews}
                price={detective.price}
                category={detective.location}
                badges={detective.badges}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Start exploring detectives and services, and click the heart icon to save them here for later.
            </p>
            <Link href="/search">
              <Button className="bg-green-600 hover:bg-green-700">Explore Detectives</Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
