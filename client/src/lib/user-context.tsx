import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "./hooks";
import type { User } from "@shared/schema";

interface FavoriteService {
  id: string;
  name: string;
  title: string;
  image: string;
  avatar: string;
  rating: number;
  reviews: number;
  price: number;
  location?: string;
  badges?: string[];
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (service: FavoriteService) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  
  const user = data?.user || null;
  const isAuthenticated = !!user;

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  const toggleFavorite = (service: FavoriteService) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === service.id);
      const updated = exists 
        ? prev.filter(fav => fav.id !== service.id)
        : [...prev, service];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, isLoading, isAuthenticated, isFavorite, toggleFavorite }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
