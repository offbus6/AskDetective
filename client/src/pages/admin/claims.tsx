import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, ExternalLink, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MOCK_CLAIMS = [
  {
    id: 1,
    detectiveName: "Sherlock Holmes Agency",
    claimantName: "John Watson",
    claimantEmail: "john@sherlockholmes.co.uk",
    proof: "Business License Uploaded",
    date: "2 hours ago",
    status: "Pending"
  },
  {
    id: 2,
    detectiveName: "Mars Investigations",
    claimantName: "Veronica Mars",
    claimantEmail: "veronica@mars.com",
    proof: "Website Verification",
    date: "1 day ago",
    status: "Pending"
  },
  {
    id: 3,
    detectiveName: "Spade & Archer",
    claimantName: "Sam Spade",
    claimantEmail: "sam@spade.com",
    proof: "ID Card",
    date: "3 days ago",
    status: "Rejected"
  }
];

export default function AdminClaims() {
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const { toast } = useToast();

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    setClaims(claims.map(claim => 
      claim.id === id ? { ...claim, status: action === 'approve' ? 'Approved' : 'Rejected' } : claim
    ));
    
    toast({
      title: `Claim ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The user has been notified via email.`,
      variant: action === 'approve' ? 'default' : 'destructive'
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-heading text-gray-900">Profile Claims</h2>
          <p className="text-gray-500">Review and approve ownership claims for existing detective profiles.</p>
        </div>

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
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none">
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
