import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MoreHorizontal, Shield, Star, Ban, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Link, useLocation } from "wouter";
import { useDetectives, useUpdateDetective } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Detective } from "@shared/schema";
import { useState } from "react";
import { format } from "date-fns";

export default function AdminDetectives() {
  const { data: detectivesData, isLoading } = useDetectives(100);
  const detectives = detectivesData?.detectives || [];
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedDetective, setSelectedDetective] = useState<Detective | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendingDetective, setSuspendingDetective] = useState<Detective | null>(null);

  const updateDetective = useUpdateDetective();

  const handleViewProfile = (detective: Detective) => {
    setLocation(`/detective/${detective.id}`);
  };

  const handleViewSubscriptions = (detective: Detective) => {
    setSelectedDetective(detective);
    setShowSubscriptionDialog(true);
  };

  const handleSuspendClick = (detective: Detective) => {
    setSuspendingDetective(detective);
    setShowSuspendDialog(true);
  };

  const handleConfirmSuspend = async () => {
    if (!suspendingDetective) return;

    const isSuspended = suspendingDetective.status === "suspended";
    const newStatus = isSuspended ? "active" : "suspended";

    try {
      await updateDetective.mutateAsync({
        id: suspendingDetective.id,
        data: { status: newStatus },
      });

      toast({
        title: "Success",
        description: `Detective account ${isSuspended ? "unsuspended" : "suspended"} successfully`,
      });

      setShowSuspendDialog(false);
      setSuspendingDetective(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isSuspended ? "unsuspend" : "suspend"} detective account`,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-heading text-gray-900">Detectives Directory</h2>
            <p className="text-gray-500">Manage all approved detectives on the platform.</p>
          </div>
          <Link href="/admin/detectives/add">
            <Button className="bg-green-600 hover:bg-green-700 gap-2">
              <Plus className="h-4 w-4" /> Add Detective
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name, email, or ID..." className="pl-9" />
          </div>
          <div className="flex gap-2">
             <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
               <option>All Statuses</option>
               <option>Active</option>
               <option>Suspended</option>
             </select>
             <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
               <option>All Levels</option>
               <option>Top Rated</option>
               <option>Level 2</option>
               <option>Level 1</option>
             </select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Detective</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-12 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : detectives.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No detectives found
                    </TableCell>
                  </TableRow>
                ) : (
                  detectives.map((detective: Detective) => (
                    <TableRow key={detective.id} data-testid={`row-detective-${detective.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{(detective.businessName || "D")[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{detective.businessName || "Unknown"}</span>
                            <span className="text-xs text-gray-500">{detective.location || detective.country}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                          {detective.subscriptionPlan}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{detective.subscriptionPlan}</TableCell>
                      <TableCell className="font-mono">${detective.totalEarnings}</TableCell>
                      <TableCell>
                        <Badge className={detective.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"} data-testid={`badge-status-${detective.id}`}>
                          {detective.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${detective.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => handleViewProfile(detective)}
                              data-testid={`menuitem-view-profile-${detective.id}`}
                            >
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleViewSubscriptions(detective)}
                              data-testid={`menuitem-view-subscriptions-${detective.id}`}
                            >
                              View Subscriptions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleSuspendClick(detective)}
                              data-testid={`menuitem-suspend-account-${detective.id}`}
                            >
                              <Ban className="mr-2 h-4 w-4" /> 
                              {detective.status === "suspended" ? "Unsuspend Account" : "Suspend Account"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
          <DialogContent data-testid="dialog-subscription-details">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
              <DialogDescription>
                {selectedDetective?.businessName || "Detective"}'s subscription information
              </DialogDescription>
            </DialogHeader>
            {selectedDetective && (
              <div className="space-y-4" data-testid="subscription-info">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Plan</p>
                    <p className="text-lg font-semibold capitalize" data-testid="text-plan">
                      {selectedDetective.subscriptionPlan}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge 
                      className={selectedDetective.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                      data-testid="badge-subscription-status"
                    >
                      {selectedDetective.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="text-lg font-semibold" data-testid="text-member-since">
                      {format(new Date(selectedDetective.memberSince), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <AlertDialogContent data-testid="dialog-suspend-detective">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {suspendingDetective?.status === "suspended" ? "Unsuspend Detective Account" : "Suspend Detective Account"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {suspendingDetective?.status === "suspended" 
                  ? "Are you sure you want to unsuspend this detective? They will be able to login and receive new orders again."
                  : "Are you sure you want to suspend this detective? They will not be able to login or receive new orders."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-suspend">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmSuspend}
                className={suspendingDetective?.status === "suspended" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                disabled={updateDetective.isPending}
                data-testid="button-confirm-suspend"
              >
                {updateDetective.isPending 
                  ? "Processing..." 
                  : suspendingDetective?.status === "suspended" 
                    ? "Unsuspend" 
                    : "Suspend"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
