import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Shield, 
  Menu, 
  Bell,
  CreditCard,
  UserCheck,
  Star,
  Layers,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "detective" | "user";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminLinks = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/signups", label: "New Signups", icon: UserCheck },
    { href: "/admin/detectives", label: "Detectives", icon: Users },
    { href: "/admin/services", label: "Service Categories", icon: Layers },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const detectiveLinks = [
    { href: "/detective/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/detective/profile", label: "My Profile", icon: Users },
    { href: "/detective/reviews", label: "Reviews", icon: Star },
    { href: "/detective/subscription", label: "Subscription", icon: CreditCard },
    { href: "/detective/settings", label: "Settings", icon: Settings },
  ];

  const userLinks = [
    { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/", label: "Search Detectives", icon: Search }, // Need to import Search
  ];

  let links = detectiveLinks;
  if (role === "admin") links = adminLinks;
  if (role === "user") links = userLinks;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 text-gray-900">
      <div className="p-6 flex items-center gap-2">
        <Shield className="h-8 w-8 text-green-600" />
        <span className="font-bold text-xl tracking-tight font-heading">
          {role === "admin" ? "Admin" : role === "detective" ? "Detective" : "User"}
          <span className="text-green-600">Portal</span>
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <a className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium ${
                isActive 
                  ? "bg-green-50 text-green-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}>
                <Icon className="h-5 w-5" />
                {link.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
             <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
              <h1 className="text-lg font-semibold hidden md:block text-gray-700">
                {role === "admin" ? "Welcome back, Admin" : role === "detective" ? "Welcome back, Detective" : "Welcome back, User"}
              </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-gray-500">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-gray-900">
                  {role === "admin" ? "Super Admin" : role === "detective" ? "James Bond" : "John Doe"}
                </div>
                <div className="text-xs text-gray-500">
                  {role === "admin" ? "System Owner" : role === "detective" ? "Pro Member" : "Member"}
                </div>
              </div>
              <Avatar>
                <AvatarImage src={role === "detective" ? maleAvatar : ""} />
                <AvatarFallback>
                  {role === "admin" ? "SA" : role === "detective" ? "JB" : "JD"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
