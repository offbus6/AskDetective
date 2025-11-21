import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Define User Type
type UserRole = "user" | "detective" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface Detective {
  id: string;
  name: string;
  title: string;
  image?: string;
  avatar: string;
  rating: number;
  reviews: number;
  price: number;
  location?: string;
  badges?: string[];
}

interface UserContextType {
  user: User | null;
  favorites: Detective[];
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  toggleFavorite: (detective: Detective) => void;
  isFavorite: (id: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Detective[]>([]);
  const { toast } = useToast();

  // Load from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("mock_user");
    const storedFavorites = localStorage.getItem("mock_favorites");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const login = (email: string, role: UserRole = "user") => {
    const mockUser: User = {
      id: "u_12345",
      name: email.split("@")[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    setUser(mockUser);
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    
    toast({
      title: "Welcome back!",
      description: `Logged in as ${mockUser.name}`,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_user");
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  const toggleFavorite = (detective: Detective) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
        variant: "destructive"
      });
      return;
    }

    setFavorites(prev => {
      const exists = prev.find(f => f.id === detective.id);
      let newFavorites;
      
      if (exists) {
        newFavorites = prev.filter(f => f.id !== detective.id);
        toast({ description: "Removed from favorites" });
      } else {
        newFavorites = [...prev, detective];
        toast({ description: "Added to favorites" });
      }
      
      localStorage.setItem("mock_favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  return (
    <UserContext.Provider value={{ user, favorites, login, logout, toggleFavorite, isFavorite }}>
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
