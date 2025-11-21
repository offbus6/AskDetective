import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DetectiveProfile from "@/pages/detective-profile";
import Login from "@/pages/auth/login";
import DetectiveSignup from "@/pages/detective-signup";
import SearchPage from "@/pages/search";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminSignups from "@/pages/admin/signups";
import AdminDetectives from "@/pages/admin/detectives";
import AdminServices from "@/pages/admin/services";
import AdminSignupDetails from "@/pages/admin/signup-details";
import AdminSubscriptions from "@/pages/admin/subscriptions";
import AdminAddDetective from "@/pages/admin/add-detective";
import AdminClaims from "@/pages/admin/claims";

import DetectiveDashboard from "@/pages/detective/dashboard";
import DetectiveProfileEdit from "@/pages/detective/profile-edit";
import DetectiveReviews from "@/pages/detective/reviews";
import DetectiveSubscription from "@/pages/detective/subscription";
import DetectiveBilling from "@/pages/detective/billing";
import DetectiveSettings from "@/pages/detective/settings";
import UserDashboard from "@/pages/user/dashboard";

function Router() {
  return (
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
      <Route path="/admin/settings" component={AdminDashboard} /> {/* Placeholder reused */}
      
      {/* Detective Routes */}
      <Route path="/detective/dashboard" component={DetectiveDashboard} />
      <Route path="/detective/profile" component={DetectiveProfileEdit} />
      <Route path="/detective/reviews" component={DetectiveReviews} />
      <Route path="/detective/subscription" component={DetectiveSubscription} />
      <Route path="/detective/billing" component={DetectiveBilling} />
      <Route path="/detective/settings" component={DetectiveSettings} />

      {/* User Routes */}
      <Route path="/user/dashboard" component={UserDashboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

import { CurrencyProvider } from "./lib/currency-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App;
