import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Check, X, Inbox } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "wouter";
import { useApplications, useUpdateApplicationStatus } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSignups() {
  const [newLimit, setNewLimit] = useState(10);
  const [newOffset, setNewOffset] = useState(0);
  const [approvedLimit, setApprovedLimit] = useState(10);
  const [approvedOffset, setApprovedOffset] = useState(0);
  const [rejectedLimit, setRejectedLimit] = useState(10);
  const [rejectedOffset, setRejectedOffset] = useState(0);
  const [approvedSearch, setApprovedSearch] = useState("");
  const [rejectedSearch, setRejectedSearch] = useState("");

  const { data: newData, isLoading: loadingNew } = useApplications({ status: "pending", limit: newLimit, offset: newOffset });
  const { data: underReviewData } = useApplications({ status: "under_review", limit: newLimit, offset: newOffset });
  const { data: approvedData, isLoading: loadingApproved } = useApplications({ status: "approved", limit: approvedLimit, offset: approvedOffset, search: approvedSearch });
  const { data: rejectedData, isLoading: loadingRejected } = useApplications({ status: "rejected", limit: rejectedLimit, offset: rejectedOffset, search: rejectedSearch });

  const updateStatus = useUpdateApplicationStatus();
  const { toast } = useToast();

  const newApplications = useMemo(() => {
    const a = newData?.applications || [];
    const b = underReviewData?.applications || [];
    return [...a, ...b].sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
  }, [newData, underReviewData]);

  const handleApprove = async (id: string, fullName: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "approved" });
      toast({ title: "Application Approved", description: `${fullName} has been approved and added to the platform.` });
    } catch {
      toast({ title: "Error", description: "Failed to approve application. Please try again.", variant: "destructive" });
    }
  };

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState<{ id: string; fullName: string } | null>(null);

  const openRejectDialog = (id: string, fullName: string) => {
    setRejectTarget({ id, fullName });
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    try {
      await updateStatus.mutateAsync({ id: rejectTarget.id, status: "rejected", reviewNotes: rejectReason.trim() || undefined });
      setRejectDialogOpen(false);
      toast({ title: "Application Rejected", description: `${rejectTarget.fullName}'s application has been rejected.` });
    } catch {
      toast({ title: "Error", description: "Failed to reject application. Please try again.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-heading text-gray-900">Detective Applications</h2>
          <p className="text-gray-500">Review and approve new detective registrations.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">New Signups</h3>
          <Card>
            <CardContent className="p-0">
              {loadingNew ? (
                <div className="p-8 space-y-4">{[1,2,3].map(i => (<div key={i} className="flex items-center gap-4"><Skeleton className="h-12 flex-1" /></div>))}</div>
              ) : newApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Inbox className="h-10 w-10 text-gray-300 mb-3" />
                  <div className="text-gray-600">No new applications</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Business Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex flex-col"><Link href={`/admin/signups/${app.id}`} className="font-bold text-gray-900 hover:underline">{app.fullName}</Link><span className="text-xs text-gray-500">{app.email}</span></div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{app.businessType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div className="space-y-1">
                            {app.companyName && <div className="font-medium">{app.companyName}</div>}
                            {app.businessWebsite && (<a href={app.businessWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block">Website →</a>)}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(app.createdAt), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Badge className={app.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}>{app.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" className="bg-green-600" onClick={() => handleApprove(app.id, app.fullName)} disabled={updateStatus.isPending}><Check className="h-4 w-4" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => openRejectDialog(app.id, app.fullName)} disabled={updateStatus.isPending}><X className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="flex items-center justify-end gap-2 p-4 border-t">
                <Button variant="outline" onClick={() => setNewOffset(Math.max(0, newOffset - newLimit))}>Prev</Button>
                <Button variant="outline" onClick={() => setNewOffset(newOffset + newLimit)}>Next</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Approved</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search approved" className="pl-9" value={approvedSearch} onChange={(e) => setApprovedSearch(e.target.value)} />
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              {loadingApproved ? (
                <div className="p-8 space-y-4">{[1,2,3].map(i => (<div key={i} className="flex items-center gap-4"><Skeleton className="h-12 flex-1" /></div>))}</div>
              ) : (approvedData?.applications || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center"><Inbox className="h-10 w-10 text-gray-300 mb-3" /><div className="text-gray-600">No approved applications</div></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Business Type</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Approved Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(approvedData?.applications || []).map(app => (
                      <TableRow key={app.id}>
                        <TableCell><div className="flex flex-col"><Link href={`/admin/signups/${app.id}`} className="font-bold hover:underline">{app.fullName}</Link><span className="text-xs text-gray-500">{app.email}</span></div></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{app.businessType}</Badge></TableCell>
                        <TableCell>{app.companyName || "-"}</TableCell>
                        <TableCell>{format(new Date((app as any).reviewedAt || app.createdAt), "MMM dd, yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="flex items-center justify-end gap-2 p-4 border-t"><Button variant="outline" onClick={() => setApprovedOffset(Math.max(0, approvedOffset - approvedLimit))}>Prev</Button><Button variant="outline" onClick={() => setApprovedOffset(approvedOffset + approvedLimit)}>Next</Button></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Rejected</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search rejected" className="pl-9" value={rejectedSearch} onChange={(e) => setRejectedSearch(e.target.value)} />
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              {loadingRejected ? (
                <div className="p-8 space-y-4">{[1,2,3].map(i => (<div key={i} className="flex items-center gap-4"><Skeleton className="h-12 flex-1" /></div>))}</div>
              ) : (rejectedData?.applications || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center"><Inbox className="h-10 w-10 text-gray-300 mb-3" /><div className="text-gray-600">No rejected applications</div></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Business Type</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Rejected Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(rejectedData?.applications || []).map(app => (
                      <TableRow key={app.id}>
                        <TableCell><div className="flex flex-col"><Link href={`/admin/signups/${app.id}`}><a className="font-bold hover:underline">{app.fullName}</a></Link><span className="text-xs text-gray-500">{app.email}</span></div></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{app.businessType}</Badge></TableCell>
                        <TableCell>{app.companyName || "-"}</TableCell>
                        <TableCell>{format(new Date((app as any).reviewedAt || app.createdAt), "MMM dd, yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="flex items-center justify-end gap-2 p-4 border-t"><Button variant="outline" onClick={() => setRejectedOffset(Math.max(0, rejectedOffset - rejectedLimit))}>Prev</Button><Button variant="outline" onClick={() => setRejectedOffset(rejectedOffset + rejectedLimit)}>Next</Button></div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Enter the internal reason for rejection. This note is visible only to the admin team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm text-gray-700">{rejectTarget?.fullName}</div>
            <Textarea placeholder="Reason for rejection" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={updateStatus.isPending}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
