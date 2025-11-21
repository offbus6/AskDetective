import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Briefcase } from "lucide-react";
import { useServices } from "@/lib/hooks";
import { Link } from "wouter";
import type { Service } from "@shared/schema";
import { useState } from "react";

export default function AdminServices() {
  const { data: servicesData, isLoading } = useServices(100);
  const services = servicesData?.services || [];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter((service: Service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-heading text-gray-900">Detective Services</h2>
            <p className="text-gray-500">Manage all services offered by detectives on the platform.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search services..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-services"
            />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="font-semibold">{services.length}</span>
              <span className="text-gray-500">Total Services</span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm ? "No services found matching your search" : "No services available yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service: Service) => (
                    <TableRow key={service.id} data-testid={`row-service-${service.id}`}>
                      <TableCell className="font-medium text-gray-900 max-w-xs truncate" data-testid={`text-title-${service.id}`}>
                        {service.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize" data-testid={`badge-category-${service.id}`}>
                          {service.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono" data-testid={`text-price-${service.id}`}>
                        ${service.offerPrice || service.basePrice}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span data-testid={`text-views-${service.id}`}>{service.viewCount}</span>
                        </div>
                      </TableCell>
                      <TableCell data-testid={`text-orders-${service.id}`}>
                        {service.orderCount}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={service.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                          data-testid={`badge-status-${service.id}`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/service/${service.id}`}>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            data-testid={`button-view-${service.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
