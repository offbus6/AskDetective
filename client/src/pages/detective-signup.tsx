import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Upload, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";

export default function DetectiveSignup() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 mt-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
              
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex flex-col items-center gap-2 bg-gray-50 px-2`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                    step >= s ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  <span className={`text-xs font-semibold ${step >= s ? "text-green-700" : "text-gray-500"}`}>
                    {s === 1 ? "Account" : s === 2 ? "Profile" : "Verification"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading">
                {step === 1 && "Create your Detective Account"}
                {step === 2 && "Build your Professional Profile"}
                {step === 3 && "Verify your Credentials"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Let's get started with your login details."}
                {step === 2 && "Tell clients about your experience and skills."}
                {step === 3 && "Upload your license and ID for verification."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Sherlock" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Holmes" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="sherlock@bakerstreet.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4 border-b pb-6">
                    <h3 className="font-bold text-lg">Company Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" placeholder="e.g. Sherlock Investigations Ltd." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="registeredDate">Date Registered</Label>
                        <Input id="registeredDate" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="regNumber">Registration Number</Label>
                        <Input id="regNumber" placeholder="Company Reg. No." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Registered Address</Label>
                      <Textarea id="address" placeholder="Full registered office address..." className="h-20" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Professional Profile</h3>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input id="title" placeholder="e.g. Senior Private Investigator | Ex-Police" />
                      <p className="text-xs text-gray-500">This will appear under your name in search results.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea id="bio" placeholder="Describe your experience, specialties, and approach..." className="h-32" />
                    </div>

                    <div className="space-y-2">
                      <Label>Specializations & Pricing</Label>
                      <p className="text-xs text-gray-500 mb-2">Select your services and set a starting price (optional).</p>
                      <div className="grid gap-3">
                        {["Surveillance", "Background Checks", "Missing Persons", "Infidelity", "Corporate Fraud", "Cyber Investigation"].map((spec) => (
                          <div key={spec} className="flex items-center justify-between border p-3 rounded-md hover:bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id={spec} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                              <label htmlFor={spec} className="text-sm font-medium leading-none cursor-pointer">
                                {spec}
                              </label>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Starting at $</span>
                              <Input type="number" className="w-24 h-8 text-sm" placeholder="Optional" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-bold">Verification Required</p>
                      <p>To maintain the integrity of our platform, we manually verify every detective. Your profile will be pending approval until we review your documents.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <h4 className="font-bold text-gray-700">Upload Private Investigator License</h4>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <h4 className="font-bold text-gray-700">Upload Company Incorporation Certificate</h4>
                      <p className="text-xs text-gray-500 mt-1">Official Government Document</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <h4 className="font-bold text-gray-700">Upload Director's Government ID</h4>
                      <p className="text-xs text-gray-500 mt-1">Passport or Driver's License of Director</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
                    </label>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between border-t p-6">
              {step > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div></div> /* Spacer */
              )}

              {step < 3 ? (
                <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Link href="/detective/dashboard">
                   <Button className="bg-green-600 hover:bg-green-700">
                     Submit Application
                   </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
