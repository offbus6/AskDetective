import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CurrencyCode = "USD" | "GBP" | "INR" | "CAD" | "AUD" | "EUR";

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: CurrencyCode;
  currencySymbol: string;
  exchangeRate: number; // Relative to USD (USD = 1)
}

// Enhanced country data with currency info
export const COUNTRIES: Country[] = [
  { code: "ALL", name: "Global", flag: "🌐", currency: "USD", currencySymbol: "$", exchangeRate: 1 },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", currencySymbol: "$", exchangeRate: 1 },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", currencySymbol: "£", exchangeRate: 0.79 },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", currencySymbol: "₹", exchangeRate: 83.5 },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", currencySymbol: "C$", exchangeRate: 1.35 },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", currencySymbol: "A$", exchangeRate: 1.52 },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", currencySymbol: "€", exchangeRate: 0.92 },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", currencySymbol: "€", exchangeRate: 0.92 },
];

interface CurrencyContextType {
  selectedCountry: Country;
  setCountry: (country: Country) => void;
  formatPrice: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);

  // Initialize from URL or localStorage if needed (logic moved from Navbar)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const countryCode = params.get("country");
    if (countryCode) {
      const country = COUNTRIES.find(c => c.code === countryCode);
      if (country) setSelectedCountry(country);
    }
  }, []);

  const setCountry = (country: Country) => {
    setSelectedCountry(country);
    // URL update logic can happen here or in the component triggering the change
    // For now, we'll keep URL logic in Navbar to avoid side effects in Context
  };

  const formatPrice = (priceInUSD: number) => {
    const convertedPrice = priceInUSD * selectedCountry.exchangeRate;
    
    // For large numbers (like INR), we typically don't show decimals
    // For strong currencies (like GBP, EUR, USD), we might show decimals if needed, 
    // but for this design, whole numbers look cleaner.
    
    // Special case for INR to format with commas properly if needed, 
    // but standard toLocaleString handles it well.
    
    return new Intl.NumberFormat(selectedCountry.code === 'IN' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: selectedCountry.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ selectedCountry, setCountry, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
