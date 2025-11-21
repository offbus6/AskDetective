import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DetectiveProfile from "@/pages/detective-profile";
import Login from "@/pages/auth/login";
import AdminDashboard from "@/pages/admin/dashboard";
import DetectiveDashboard from "@/pages/detective/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/service/:id" component={DetectiveProfile} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/signups" component={AdminDashboard} /> {/* Placeholder */}
      <Route path="/admin/detectives" component={AdminDashboard} /> {/* Placeholder */}
      
      {/* Detective Routes */}
      <Route path="/detective/dashboard" component={DetectiveDashboard} />
      <Route path="/detective/profile" component={DetectiveDashboard} /> {/* Placeholder */}
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
