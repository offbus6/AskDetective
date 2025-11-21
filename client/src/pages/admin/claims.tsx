import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, ShieldAlert, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClaims, useUpdateClaimStatus, useDetective } from "@/lib/hooks";
import { format } from "date-fns";

function ClaimItem({ claim }: { claim: any }) {
  const { data: detectiveData } = useDetective(claim.detectiveId);
  const detective = detectiveData?.detective;
  const updateStatus = useUpdateClaimStatus();
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      await updateStatus.mutateAsync({ id: claim.id, status: "approved" });
      toast({
        title: "Claim Approved",
        description: `${claim.claimantName} can now manage this detective profile.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve claim. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    try {
      await updateStatus.mutateAsync({ id: claim.id, status: "rejected" });
      toast({
        title: "Claim Rejected",
        description: `${claim.claimantName}'s claim has been rejected.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject claim. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!detective) {
    return (
      <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50/50 gap-4" data-testid={`claim-${claim.id}`}>
      <div className="flex items-center space-x-4 flex-1">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{detective.businessName?.[0] || "D"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{detective.businessName}</h3>
            {!detective.isClaimed && (
              <Badge variant="outline" className="text-[10px]">Unclaimed</Badge>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Claimed by: <span className="font-medium">{claim.claimantName}</span> ({claim.claimantEmail})
          </div>
          {claim.claimantPhone && (
            <div className="text-xs text-gray-500">{claim.claimantPhone}</div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Submitted {format(new Date(claim.createdAt), "MMM dd, yyyy")}
          </div>
          {claim.details && (
            <div className="text-xs text-gray-600 mt-2 bg-white p-2 rounded border border-gray-200">
              {claim.details}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button 
          onClick={handleApprove}
          className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none" 
          size="sm"
          disabled={updateStatus.isPending}
          data-testid={`button-approve-${claim.id}`}
        >
          <CheckCircle className="h-4 w-4 mr-2" /> Approve
        </Button>
        <Button 
          onClick={handleReject}
          variant="destructive" 
          size="sm"
          className="flex-1 md:flex-none"
          disabled={updateStatus.isPending}
          data-testid={`button-reject-${claim.id}`}
        >
          <XCircle className="h-4 w-4 mr-2" /> Reject
        </Button>
      </div>
    </div>
  );
}

export default function AdminClaims() {
  const { data, isLoading } = useClaims();
  const claims = data?.claims || [];

  const pendingClaims = claims.filter(c => c.status === "pending");
  const completedClaims = claims.filter(c => c.status !== "pending");

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
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : pendingClaims.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Inbox className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No pending claims to review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingClaims.map((claim) => (
                  <ClaimItem key={claim.id} claim={claim} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {completedClaims.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedClaims.slice(0, 10).map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0" data-testid={`claim-history-${claim.id}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${claim.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-sm">{claim.claimantName}</p>
                        <p className="text-xs text-gray-500">{claim.claimantEmail}</p>
                      </div>
                    </div>
                    <Badge variant={claim.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
                      {claim.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
