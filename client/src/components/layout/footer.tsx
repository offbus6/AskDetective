import { Link } from "wouter";
import { useSiteSettings } from "@/lib/hooks";

export function Footer() {
  const { data: siteData } = useSiteSettings();
  const links = (siteData?.settings?.footerLinks || []) as Array<{ label: string; href: string }>;
  return (
    <footer className="border-t border-gray-200 bg-white pt-16 pb-8 text-gray-600">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Categories</h4>
            {links.length ? (
              links.map((l, i) => (
                <Link key={i} href={l.href} className="hover:underline">{l.label}</Link>
              ))
            ) : (
              <>
                <Link href="/search" className="hover:underline">Background Checks</Link>
                <Link href="/search" className="hover:underline">Surveillance</Link>
                <Link href="/search" className="hover:underline">Cyber Investigations</Link>
                <Link href="/search" className="hover:underline">Asset Search</Link>
                <Link href="/search" className="hover:underline">Missing Persons</Link>
              </>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">About</h4>
            <Link href="/about" className="hover:underline">About Us</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/contact" className="hover:underline">Contact Us</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Support</h4>
            <Link href="/support" className="hover:underline">Help & Support</Link>
            <Link href="/detective-signup" className="hover:underline">Become a Detective</Link>
            <Link href="/packages" className="hover:underline">Pricing & Packages</Link>
            <Link href="/login" className="hover:underline">Login as Detective</Link>
            <Link href="/signup" className="hover:underline">Signup as User</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Community</h4>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <Link href="/" className="hover:underline">Events</Link>
            <Link href="/" className="hover:underline">Forum</Link>
            <Link href="/" className="hover:underline">Podcast</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">More From Us</h4>
            <Link href="/" className="hover:underline">FindDetectives Pro</Link>
            <Link href="/" className="hover:underline">FindDetectives Enterprise</Link>
            <Link href="/" className="hover:underline">FindDetectives Logo Maker</Link>
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
