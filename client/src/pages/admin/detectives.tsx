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

import { Link } from "wouter";

const DETECTIVES = [
  { id: 1, name: "James Bond", email: "007@mi6.gov.uk", level: "Top Rated", plan: "Professional", status: "Active", earnings: "$15,240" },
  { id: 2, name: "Sherlock Holmes", email: "sherlock@bakerst.com", level: "Level 2", plan: "Standard", status: "Active", earnings: "$8,450" },
  { id: 3, name: "Adrian Monk", email: "monk@sfpd.com", level: "Level 1", plan: "Basic", status: "Suspended", earnings: "$1,200" },
  { id: 4, name: "Jessica Fletcher", email: "jessica@cabotcove.com", level: "Level 2", plan: "Professional", status: "Active", earnings: "$12,100" },
  { id: 5, name: "Columbo", email: "lt.columbo@lapd.gov", level: "Top Rated", plan: "Standard", status: "Active", earnings: "$9,800" },
];

export default function AdminDetectives() {
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
                {DETECTIVES.map((detective) => (
                  <TableRow key={detective.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{detective.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{detective.name}</span>
                          <span className="text-xs text-gray-500">{detective.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                        {detective.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{detective.plan}</TableCell>
                    <TableCell className="font-mono">{detective.earnings}</TableCell>
                    <TableCell>
                      <Badge className={detective.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                        {detective.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Subscriptions</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" /> Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
