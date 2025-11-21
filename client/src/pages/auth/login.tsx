import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useUser } from "@/lib/user-context";
import { useState } from "react";

// @ts-ignore
import heroBg from "@assets/generated_images/professional_modern_city_skyline_at_dusk_with_subtle_mystery_vibes.png";

export default function Login() {
  const { login } = useUser();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Basic check to see if admin login
    const role = email.includes("admin") ? "admin" : "user";
    
    login(email, role);
    
    if (role === "admin") {
      setLocation("/admin/dashboard");
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex flex-1 bg-gray-900 relative items-center justify-center overflow-hidden">
         <div 
            className="absolute inset-0 z-0 opacity-60"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="relative z-10 p-12 text-white max-w-xl">
            <h1 className="text-5xl font-bold font-heading mb-6">Welcome Back.</h1>
            <p className="text-xl text-gray-200">Log in to access your dashboard, manage investigations, or find the perfect detective for your case.</p>
          </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 font-heading">Sign in to FindDetectives</h2>
            <p className="mt-2 text-gray-600">Don't have an account? <Link href="/signup"><a className="text-green-600 font-semibold hover:underline">Join here</a></Link></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input 
                id="email" 
                placeholder="name@example.com" 
                className="h-12 bg-gray-50 border-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-green-600 hover:underline">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                className="h-12 bg-gray-50 border-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-bold">Continue</Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
            </div>
            
             <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" className="h-12">Google</Button>
              <Button type="button" variant="outline" className="h-12">Apple</Button>
            </div>
          </form>
          
          <div className="text-xs text-gray-500 text-center mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
