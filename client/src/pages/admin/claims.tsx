import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, ExternalLink, ShieldAlert, FileText, Download, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const MOCK_CLAIMS = [
  {
    id: 1,
    detectiveName: "Sherlock Holmes Agency",
    claimantName: "John Watson",
    claimantEmail: "john@sherlockholmes.co.uk",
    claimantPhone: "+44 20 7224 3688",
    proof: "Business License Uploaded",
    proofType: "license",
    additionalDetails: "We have been operating at 221B Baker Street for over 10 years. Check our website for verification.",
    date: "2 hours ago",
    status: "Pending"
  },
  {
    id: 2,
    detectiveName: "Mars Investigations",
    claimantName: "Veronica Mars",
    claimantEmail: "veronica@mars.com",
    claimantPhone: "+1 (555) 019-2834",
    proof: "Website Verification",
    proofType: "website",
    additionalDetails: "I am the sole proprietor.",
    date: "1 day ago",
    status: "Pending"
  },
  {
    id: 3,
    detectiveName: "Spade & Archer",
    claimantName: "Sam Spade",
    claimantEmail: "sam@spade.com",
    claimantPhone: "+1 (415) 555-1941",
    proof: "ID Card",
    proofType: "id",
    additionalDetails: "",
    date: "3 days ago",
    status: "Rejected"
  }
];

export default function AdminClaims() {
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const { toast } = useToast();
  const [selectedClaim, setSelectedClaim] = useState<typeof MOCK_CLAIMS[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    setClaims(claims.map(claim => 
      claim.id === id ? { ...claim, status: action === 'approve' ? 'Approved' : 'Rejected' } : claim
    ));
    
    setIsViewDialogOpen(false);
    
    toast({
      title: `Claim ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The user has been notified via email.`,
      variant: action === 'approve' ? 'default' : 'destructive'
    });
  };

  const openClaimDetails = (claim: typeof MOCK_CLAIMS[0]) => {
    setSelectedClaim(claim);
    setIsViewDialogOpen(true);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-heading text-gray-900">Profile Claims</h2>
          <p className="text-gray-500">Review and approve ownership claims for existing detective profiles.</p>
        </div>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Claim Request</DialogTitle>
              <DialogDescription>
                Review the details and proof provided by the claimant.
              </DialogDescription>
            </DialogHeader>
            
            {selectedClaim && (
              <div className="space-y-6 mt-2">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Profile Being Claimed</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedClaim.detectiveName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedClaim.detectiveName}</p>
                      <Badge variant="outline" className="text-[10px] bg-white">Unclaimed Profile</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2">Claimant Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-500 uppercase block">Full Name</span>
                        <span className="font-medium">{selectedClaim.claimantName}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase block">Email Address</span>
                        <span className="font-medium">{selectedClaim.claimantEmail}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase block">Phone Number</span>
                        <span className="font-medium">{selectedClaim.claimantPhone}</span>
                      </div>
                      <div>
                         <span className="text-xs text-gray-500 uppercase block">Submission Date</span>
                         <span className="font-medium">{selectedClaim.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2">Proof Documents</h3>
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="font-medium text-sm text-gray-900">{selectedClaim.proof}</p>
                      <p className="text-xs text-gray-500 mb-3">Uploaded Document (PDF)</p>
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-xs">
                          <Eye className="h-3 w-3 mr-1" /> Preview
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs">
                          <Download className="h-3 w-3 mr-1" /> Download
                        </Button>
                      </div>
                    </div>
                    
                    {selectedClaim.additionalDetails && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase block mb-1">Additional Notes</span>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                          {selectedClaim.additionalDetails}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleAction(selectedClaim.id, 'reject')}
                    >
                      Reject Claim
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={() => handleAction(selectedClaim.id, 'approve')}
                    >
                      Approve & Transfer
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>Pending Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {claims.filter(c => c.status === 'Pending').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShieldAlert className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No pending claims to review.</p>
                </div>
              ) : (
                claims.filter(c => c.status === 'Pending').map((claim) => (
                  <div key={claim.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50/50 gap-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{claim.detectiveName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{claim.detectiveName}</h3>
                          <Badge variant="outline" className="text-[10px]">Unclaimed Profile</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Claimed by: <span className="font-medium">{claim.claimantName}</span> ({claim.claimantEmail})
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span>Proof: {claim.proof}</span>
                          <span>•</span>
                          <span>{claim.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none" onClick={() => openClaimDetails(claim)}>
                        <ExternalLink className="h-4 w-4 mr-2" /> View Proof
                      </Button>
                      <Button 
                        onClick={() => handleAction(claim.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none" size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" /> Approve
                      </Button>
                      <Button 
                        onClick={() => handleAction(claim.id, 'reject')}
                        variant="destructive" size="sm"
                        className="flex-1 md:flex-none"
                      >
                        <XCircle className="h-4 w-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {claims.filter(c => c.status !== 'Pending').map((claim) => (
                <div key={claim.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${claim.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium text-sm">{claim.detectiveName}</p>
                      <p className="text-xs text-gray-500">Claimed by {claim.claimantName}</p>
                    </div>
                  </div>
                  <Badge variant={claim.status === 'Approved' ? 'default' : 'destructive'}>
                    {claim.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
