import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white pt-16 pb-8 text-gray-600">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Categories</h4>
            <Link href="#"><a className="hover:underline">Background Checks</a></Link>
            <Link href="#"><a className="hover:underline">Surveillance</a></Link>
            <Link href="#"><a className="hover:underline">Cyber Investigations</a></Link>
            <Link href="#"><a className="hover:underline">Asset Search</a></Link>
            <Link href="#"><a className="hover:underline">Missing Persons</a></Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">About</h4>
            <Link href="/about"><a className="hover:underline">About Us</a></Link>
            <Link href="/privacy"><a className="hover:underline">Privacy Policy</a></Link>
            <Link href="/terms"><a className="hover:underline">Terms of Service</a></Link>
            <Link href="/contact"><a className="hover:underline">Contact Us</a></Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Support</h4>
            <Link href="/support"><a className="hover:underline">Help & Support</a></Link>
            <Link href="/detective-signup"><a className="hover:underline">Become a Detective</a></Link>
            <Link href="/packages"><a className="hover:underline">Pricing & Packages</a></Link>
            <Link href="/login"><a className="hover:underline">Login as Detective</a></Link>
            <Link href="/signup"><a className="hover:underline">Signup as User</a></Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Community</h4>
            <Link href="/blog"><a className="hover:underline">Blog</a></Link>
            <Link href="#"><a className="hover:underline">Events</a></Link>
            <Link href="#"><a className="hover:underline">Forum</a></Link>
            <Link href="#"><a className="hover:underline">Podcast</a></Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">More From Us</h4>
            <Link href="#"><a className="hover:underline">FindDetectives Pro</a></Link>
            <Link href="#"><a className="hover:underline">FindDetectives Enterprise</a></Link>
            <Link href="#"><a className="hover:underline">FindDetectives Logo Maker</a></Link>
          </div>

          {/* Quick Links for Demo */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Quick Links (Demo)</h4>
            <Link href="/admin/dashboard"><a className="hover:underline text-blue-600">Super Admin Dashboard</a></Link>
            <Link href="/detective/dashboard"><a className="hover:underline text-green-600">Detective Dashboard</a></Link>
            <Link href="/detective/subscription"><a className="hover:underline text-green-600">Subscription Dashboard</a></Link>
            <Link href="/user/dashboard"><a className="hover:underline text-purple-600">User Dashboard</a></Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <span className="text-2xl font-bold tracking-tight font-heading flex items-center gap-1 text-gray-400">
              Find<span className="">Detectives</span>
              <span className="text-4xl leading-none">.</span>
            </span>
            <span className="text-sm">© FindDetectives International Ltd. 2025</span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Social Icons */}
            <div className="flex gap-4">
               {/* Placeholder icons */}
               <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
               <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
               <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
