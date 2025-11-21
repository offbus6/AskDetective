import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

import { CurrencyProvider } from "./lib/currency-context";
import { UserProvider } from "./lib/user-context";
import ScrollToTop from "@/components/scroll-to-top";

// Lazy load pages to improve initial load performance
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
const DetectiveProfile = lazy(() => import("@/pages/detective-profile"));
const Login = lazy(() => import("@/pages/auth/login"));
const DetectiveSignup = lazy(() => import("@/pages/detective-signup"));
const SearchPage = lazy(() => import("@/pages/search"));

const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminSignups = lazy(() => import("@/pages/admin/signups"));
const AdminDetectives = lazy(() => import("@/pages/admin/detectives"));
const AdminServices = lazy(() => import("@/pages/admin/services"));
const AdminSignupDetails = lazy(() => import("@/pages/admin/signup-details"));
const AdminSubscriptions = lazy(() => import("@/pages/admin/subscriptions"));
const AdminAddDetective = lazy(() => import("@/pages/admin/add-detective"));
const AdminClaims = lazy(() => import("@/pages/admin/claims"));

const DetectiveDashboard = lazy(() => import("@/pages/detective/dashboard"));
const DetectiveProfileEdit = lazy(() => import("@/pages/detective/profile-edit"));
const DetectiveReviews = lazy(() => import("@/pages/detective/reviews"));
const DetectiveSubscription = lazy(() => import("@/pages/detective/subscription"));
const DetectiveBilling = lazy(() => import("@/pages/detective/billing"));
const DetectiveSettings = lazy(() => import("@/pages/detective/settings"));

const UserDashboard = lazy(() => import("@/pages/user/dashboard"));
const FavoritesPage = lazy(() => import("@/pages/user/favorites"));

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-sm text-gray-500 font-medium">Loading...</p>
          </div>
        </div>
      }>
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/service/:id" component={DetectiveProfile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Login} />
          <Route path="/detective-signup" component={DetectiveSignup} />
          <Route path="/search" component={SearchPage} />
          <Route path="/category/:name" component={SearchPage} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/signups" component={AdminSignups} />
          <Route path="/admin/signups/:id" component={AdminSignupDetails} />
          <Route path="/admin/detectives/add" component={AdminAddDetective} />
          <Route path="/admin/detectives" component={AdminDetectives} />
          <Route path="/admin/claims" component={AdminClaims} />
          <Route path="/admin/services" component={AdminServices} />
          <Route path="/admin/subscriptions" component={AdminSubscriptions} />
          <Route path="/admin/settings" component={AdminDashboard} />
          
          {/* Detective Routes */}
          <Route path="/detective/dashboard" component={DetectiveDashboard} />
          <Route path="/detective/profile" component={DetectiveProfileEdit} />
          <Route path="/detective/reviews" component={DetectiveReviews} />
          <Route path="/detective/subscription" component={DetectiveSubscription} />
          <Route path="/detective/billing" component={DetectiveBilling} />
          <Route path="/detective/settings" component={DetectiveSettings} />

          {/* User Routes */}
          <Route path="/user/dashboard" component={UserDashboard} />
          <Route path="/user/favorites" component={FavoritesPage} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CurrencyProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
