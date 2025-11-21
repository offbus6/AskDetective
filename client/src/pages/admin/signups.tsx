import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, Check, X, FileText, Eye } from "lucide-react";
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

const PENDING_SIGNUPS = [
  { id: "APP-001", name: "John Doe", email: "john.doe@gmail.com", type: "Individual", applied: "Oct 24, 2025", status: "Pending" },
  { id: "APP-002", name: "Secure Eyes Agency", email: "contact@secureeyes.com", type: "Agency", applied: "Oct 23, 2025", status: "Pending" },
  { id: "APP-003", name: "Jane Smith", email: "jane.smith@yahoo.com", type: "Individual", applied: "Oct 22, 2025", status: "Under Review" },
  { id: "APP-004", name: "Robert McCall", email: "equalizer@gmail.com", type: "Individual", applied: "Oct 21, 2025", status: "Pending" },
  { id: "APP-005", name: "Magnum PI Services", email: "t.magnum@hawaii.com", type: "Agency", applied: "Oct 20, 2025", status: "Under Review" },
];

export default function AdminSignups() {
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
            <Input placeholder="Search applications..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline">Export</Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PENDING_SIGNUPS.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{app.name}</span>
                        <span className="text-xs text-gray-500">{app.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{app.type}</Badge>
                    </TableCell>
                    <TableCell>{app.applied}</TableCell>
                    <TableCell>
                      <Badge className={app.status === "Pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" title="View Documents">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" title="Approve">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" title="Reject">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
