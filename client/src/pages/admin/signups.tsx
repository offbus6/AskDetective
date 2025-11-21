import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Check, X, FileText, Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApplications, useUpdateApplicationStatus } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";

export default function AdminSignups() {
  const { data, isLoading } = useApplications();
  const updateStatus = useUpdateApplicationStatus();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const applications = data?.applications || [];
  
  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.fullName.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query)
    );
  });

  const handleApprove = async (id: string, fullName: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "approved" });
      toast({
        title: "Application Approved",
        description: `${fullName} has been approved and added to the platform.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string, fullName: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "rejected" });
      toast({
        title: "Application Rejected",
        description: `${fullName}'s application has been rejected.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-heading text-gray-900">Detective Applications</h2>
          <p className="text-gray-500">Review and approve new detective registrations.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search applications..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-applications"
            />
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 flex-1" />
                  </div>
                ))}
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Inbox className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Applications</h3>
                <p className="text-gray-600">
                  {searchQuery ? "No applications match your search." : "There are no pending applications at the moment."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id} data-testid={`application-${app.id}`}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900" data-testid={`text-full-name-${app.id}`}>{app.fullName}</span>
                          <span className="text-xs text-gray-500">{app.email}</span>
                          {app.phone && <span className="text-xs text-gray-400">{app.phone}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{app.businessType}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{app.experience || "Not specified"}</TableCell>
                      <TableCell>{format(new Date(app.createdAt), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            app.status === "pending" 
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" 
                              : app.status === "approved"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }
                          data-testid={`badge-status-${app.id}`}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {app.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700" 
                                title="Approve"
                                onClick={() => handleApprove(app.id, app.fullName)}
                                disabled={updateStatus.isPending}
                                data-testid={`button-approve-${app.id}`}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                title="Reject"
                                onClick={() => handleReject(app.id, app.fullName)}
                                disabled={updateStatus.isPending}
                                data-testid={`button-reject-${app.id}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
