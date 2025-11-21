import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, FileText, Download, Shield, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function AdminSignupDetails() {
  const [match, params] = useRoute("/admin/signups/:id");
  const id = params?.id || "APP-001"; // Fallback for demo

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/admin/signups">
                <a className="text-sm text-gray-500 hover:text-gray-900 hover:underline">← Back to Signups</a>
              </Link>
            </div>
            <h2 className="text-3xl font-bold font-heading text-gray-900">Application #{id}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Applied on Oct 24, 2025</span>
              <span>•</span>
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none">Pending Review</Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
              <X className="mr-2 h-4 w-4" /> Reject Application
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" /> Approve Detective
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Applicant Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">Full Name</span>
                    <p className="font-bold text-gray-900">John Doe</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">Type</span>
                    <p className="font-bold text-gray-900">Individual Detective</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">Email Address</span>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">john.doe@gmail.com</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">Phone Number</span>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">Location</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">New York, NY</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">May 15, 1985</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-500">Professional Bio</span>
                  <p className="text-gray-700 leading-relaxed">
                    Experienced private investigator with over 10 years in law enforcement. Specialized in corporate fraud and asset recovery. Looking to expand my client base through this platform. I have handled high-profile cases in the tri-state area and maintain excellent relationships with local authorities.
                  </p>
                </div>

                <div className="space-y-2">
                   <span className="text-sm font-medium text-gray-500">Selected Categories</span>
                   <div className="flex flex-wrap gap-2">
                     <Badge variant="secondary">Surveillance</Badge>
                     <Badge variant="secondary">Background Checks</Badge>
                     <Badge variant="secondary">Corporate Fraud</Badge>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  Verification Documents
                </CardTitle>
                <CardDescription>Review the uploaded documents for authenticity.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-lg border flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Private Investigator License.pdf</p>
                      <p className="text-xs text-gray-500">2.4 MB • Uploaded Oct 24, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-lg border flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Driver's License_Front.jpg</p>
                      <p className="text-xs text-gray-500">1.1 MB • Uploaded Oct 24, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-lg border flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Driver's License_Back.jpg</p>
                      <p className="text-xs text-gray-500">1.0 MB • Uploaded Oct 24, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Admin Notes & Checklist */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="check1" className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <label htmlFor="check1" className="text-sm text-gray-700 leading-tight">Verify PI License number with state database</label>
                </div>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="check2" className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <label htmlFor="check2" className="text-sm text-gray-700 leading-tight">Check ID expiration date</label>
                </div>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="check3" className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <label htmlFor="check3" className="text-sm text-gray-700 leading-tight">Confirm no criminal record matches</label>
                </div>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="check4" className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <label htmlFor="check4" className="text-sm text-gray-700 leading-tight">Validate phone number and email</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
                <CardDescription>Private notes for admin team.</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full min-h-[150px] p-3 border rounded-md text-sm bg-gray-50 focus:bg-white transition-colors outline-none border-gray-200 focus:border-gray-400"
                  placeholder="Add notes about this application..."
                ></textarea>
                <Button size="sm" variant="outline" className="mt-2 w-full">Save Note</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
