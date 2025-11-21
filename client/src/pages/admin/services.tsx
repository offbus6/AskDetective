import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Edit2, Trash2, Layers, FileText } from "lucide-react";

const INITIAL_SERVICES = [
  { id: 1, name: "Surveillance", description: "Physical observation of subjects", status: "Active", count: 145 },
  { id: 2, name: "Background Checks", description: "Criminal, financial, and social history", status: "Active", count: 320 },
  { id: 3, name: "Missing Persons", description: "Locating individuals who have disappeared", status: "Active", count: 89 },
  { id: 4, name: "Cyber Investigation", description: "Digital forensics and online harassment", status: "Active", count: 210 },
  { id: 5, name: "Infidelity", description: "Matrimonial and partner investigations", status: "Active", count: 180 },
];

export default function AdminServices() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-heading text-gray-900">Service Categories</h2>
            <p className="text-gray-500">Manage the master list of services detectives can offer.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" /> Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Service Category</DialogTitle>
                <DialogDescription>
                  Create a new service category for the platform. Detectives will be able to select this when creating their profile.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input id="name" placeholder="e.g. Asset Recovery" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of this service category..." />
                </div>
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="space-y-0.5">
                    <Label className="text-base">Active Status</Label>
                    <p className="text-sm text-gray-500">Immediately available for signups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="grid gap-2">
                  <Label>Signup Form Requirements</Label>
                  <div className="border rounded-md p-4 space-y-3 bg-gray-50">
                    <p className="text-sm font-medium mb-2">Required documents for this service:</p>
                    <div className="flex items-center space-x-2">
                      <Switch id="req-license" defaultChecked />
                      <Label htmlFor="req-license">PI License</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="req-cert" />
                      <Label htmlFor="req-cert">Specialized Certification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="req-insurance" />
                      <Label htmlFor="req-insurance">Liability Insurance</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search categories..." className="pl-9" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Active Detectives</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INITIAL_SERVICES.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-bold text-gray-900 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-gray-400" />
                      {service.name}
                    </TableCell>
                    <TableCell className="text-gray-500">{service.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100">
                        {service.count} Detectives
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" title="Edit Form Requirements">
                          <FileText className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Edit Category">
                          <Edit2 className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Delete">
                          <Trash2 className="h-4 w-4 text-red-500" />
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
