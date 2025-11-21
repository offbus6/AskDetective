import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function PageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="h-20 border-b border-gray-100 container mx-auto px-6 flex items-center justify-between">
         <Skeleton className="h-8 w-40" />
         <div className="flex gap-4">
           <Skeleton className="h-10 w-20" />
           <Skeleton className="h-10 w-20" />
         </div>
      </div>
      <div className="flex-1 container mx-auto px-6 py-12 space-y-8">
         <Skeleton className="h-12 w-64" />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Skeleton className="h-64 w-full rounded-xl" />
           <Skeleton className="h-64 w-full rounded-xl" />
           <Skeleton className="h-64 w-full rounded-xl" />
         </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
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
