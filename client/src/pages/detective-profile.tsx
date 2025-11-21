import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Check, Clock, RefreshCw, MessageSquare, Mail, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// @ts-ignore
import maleAvatar from "@assets/generated_images/professional_headshot_of_a_private_detective_male.png";

export default function DetectiveProfile() {
  // Mock subscription tier for demo - change this to 'free' or 'agency' to test other views
  const detectiveTier = 'agency' as 'free' | 'pro' | 'agency';

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-gray-900">
              I will conduct a comprehensive background check for any individual
            </h1>

            {/* Author Meta */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={maleAvatar} />
                <AvatarFallback>JB</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-lg flex items-center gap-2">
                  James Bond
                  {detectiveTier === 'agency' && (
                     <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 text-xs px-2 py-0.5">
                        <ShieldCheck className="h-3 w-3" /> Recommended
                     </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-yellow-500 font-bold flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500" /> 5.0
                  </span>
                  <span>(1,254 reviews)</span>
                  <span>•</span>
                  <span>Top Rated Detective</span>
                </div>
              </div>
            </div>

            {/* Gallery - Placeholder for Carousel */}
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
              <img 
                src="https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?q=80&w=1000&auto=format&fit=crop" 
                alt="Service Preview" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* About This Service */}
            <section className="mb-10 space-y-4">
              <h2 className="text-xl font-bold font-heading">About This Service</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p>
                  Need to know who you are really dealing with? I provide professional, discreet, and comprehensive background checks for individuals and businesses.
                </p>
                <p className="mt-4">
                  <strong>My services include:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Criminal history verification (State & Federal)</li>
                  <li>Employment and education verification</li>
                  <li>Social media footprint analysis</li>
                  <li>Financial history and asset search</li>
                  <li>Civil litigation records</li>
                </ul>
                <p className="mt-4">
                  I am a licensed private investigator with over 15 years of experience in law enforcement and private security. All investigations are conducted legally and ethically.
                </p>
              </div>
            </section>

            <Separator className="my-8" />

            {/* About The Seller */}
            <section className="mb-10">
              <h2 className="text-xl font-bold font-heading mb-6">About The Detective</h2>
              <div className="flex gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={maleAvatar} />
                  <AvatarFallback>JB</AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">From</span>
                      <span className="font-bold">United Kingdom</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Member since</span>
                      <span className="font-bold">May 2018</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Avg. response time</span>
                      <span className="font-bold">1 hour</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Last delivery</span>
                      <span className="font-bold">about 2 hours</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Languages</span>
                      <span className="font-bold">English, French, German</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Former MI6 operative turned private investigator. Specializing in high-stakes surveillance, asset recovery, and deep-dive background checks. I have access to databases that others don't. When you need the truth, I'm the one you call.
                  </p>
                  
                  {/* Contact Methods - Conditional Display */}
                  <div className="pt-4 flex gap-3">
                     <Button variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" /> Contact via Email
                     </Button>
                     {detectiveTier !== 'free' && (
                       <>
                         <Button variant="outline" className="gap-2">
                            <Phone className="h-4 w-4" /> Call
                         </Button>
                         <Button variant="outline" className="gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100">
                            <MessageCircle className="h-4 w-4" /> WhatsApp
                         </Button>
                       </>
                     )}
                  </div>
                </div>
              </div>
            </section>
            
            <Separator className="my-8" />

            {/* Reviews (Brief) */}
            <section>
              <h2 className="text-xl font-bold font-heading mb-6">Reviews</h2>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="border-b border-gray-100 pb-6">
                     <div className="flex items-center gap-3 mb-2">
                       <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs">U{i}</div>
                       <span className="font-bold text-sm">User_{i}</span>
                       <div className="flex text-yellow-500"><Star className="h-3 w-3 fill-yellow-500" /><Star className="h-3 w-3 fill-yellow-500" /><Star className="h-3 w-3 fill-yellow-500" /><Star className="h-3 w-3 fill-yellow-500" /><Star className="h-3 w-3 fill-yellow-500" /></div>
                     </div>
                     <p className="text-gray-600 text-sm">Excellent work! Found exactly what I needed in record time. Highly recommended for anyone needing discreet information.</p>
                   </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24">
              <Card className="border-gray-200 shadow-lg overflow-hidden">
                <Tabs defaultValue="standard" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-14 rounded-none bg-gray-50 border-b border-gray-200 p-0">
                    <TabsTrigger value="basic" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 font-bold text-gray-500 bg-transparent shadow-none">Basic</TabsTrigger>
                    <TabsTrigger value="standard" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 font-bold text-gray-500 bg-transparent shadow-none">Standard</TabsTrigger>
                    <TabsTrigger value="premium" className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-600 font-bold text-gray-500 bg-transparent shadow-none">Premium</TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6">
                    <TabsContent value="basic" className="mt-0 space-y-4">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-lg">Simple Check</h3>
                        <span className="text-2xl font-bold text-gray-900">$150</span>
                      </div>
                      <p className="text-sm text-gray-600">Basic criminal record check and address verification for one individual.</p>
                    </TabsContent>
                    
                    <TabsContent value="standard" className="mt-0 space-y-4">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-lg">Deep Dive</h3>
                        <span className="text-2xl font-bold text-gray-900">$300</span>
                      </div>
                      <p className="text-sm text-gray-600">Includes Basic + Social media analysis, employment verification, and asset search.</p>
                    </TabsContent>
                    
                    <TabsContent value="premium" className="mt-0 space-y-4">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-lg">Full Investigation</h3>
                        <span className="text-2xl font-bold text-gray-900">$800</span>
                      </div>
                      <p className="text-sm text-gray-600">Complete 360° profile including on-site verification if needed (local only) and detailed report.</p>
                    </TabsContent>

                    <div className="flex items-center gap-4 text-sm font-semibold text-gray-600 mt-6">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>3 Days Delivery</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RefreshCw className="h-4 w-4" />
                        <span>1 Revision</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                       <div className="flex items-center gap-2 text-sm text-gray-500"><Check className="h-4 w-4 text-green-500" /> <span>Background Check</span></div>
                       <div className="flex items-center gap-2 text-sm text-gray-500"><Check className="h-4 w-4 text-green-500" /> <span>Report Included</span></div>
                       <div className="flex items-center gap-2 text-sm text-gray-500"><Check className="h-4 w-4 text-green-500" /> <span>Confidentiality Guaranteed</span></div>
                    </div>
                    
                    <Button className="w-full mt-6 bg-black hover:bg-gray-800 text-white font-bold py-6 text-lg">
                      Continue
                    </Button>
                    
                    <Button variant="outline" className="w-full mt-3 border-gray-300 text-gray-600 hover:bg-gray-50">
                      Contact Detective
                    </Button>
                  </div>
                </Tabs>
              </Card>
              
              <div className="mt-6 text-center">
                 <Button variant="ghost" className="text-gray-500 text-sm">
                   <MessageSquare className="h-4 w-4 mr-2" /> Report this Service
                 </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
