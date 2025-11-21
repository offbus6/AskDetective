import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const BILLING_HISTORY = [
  {
    id: "INV-001",
    date: "Nov 01, 2025",
    amount: 29.00,
    status: "Paid",
    plan: "Pro Monthly",
    method: "Visa ending in 4242"
  },
  {
    id: "INV-002",
    date: "Oct 01, 2025",
    amount: 29.00,
    status: "Paid",
    plan: "Pro Monthly",
    method: "Visa ending in 4242"
  },
  {
    id: "INV-003",
    date: "Sep 01, 2025",
    amount: 29.00,
    status: "Paid",
    plan: "Pro Monthly",
    method: "Visa ending in 4242"
  },
  {
    id: "INV-004",
    date: "Aug 01, 2025",
    amount: 29.00,
    status: "Paid",
    plan: "Pro Monthly",
    method: "Visa ending in 4242"
  }
];

export default function DetectiveBilling() {
  return (
    <DashboardLayout role="detective">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-heading text-gray-900">Billing & Payments</h2>
          <p className="text-gray-500">Manage your subscription, payment methods, and view payment history.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Current Plan Status */}
          <Card className="md:col-span-2 border-green-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Current Subscription</CardTitle>
                  <CardDescription>You are currently on the <span className="font-semibold text-green-700">Pro Plan</span></CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Next Payment Date</div>
                      <div className="text-lg font-bold text-gray-900">Dec 01, 2025</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Payment Amount</div>
                      <div className="text-lg font-bold text-gray-900">$29.00 <span className="text-sm font-normal text-gray-500">/ month</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-3 border-l pl-6 border-gray-100">
                   <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">Change Plan</Button>
                   <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">Cancel Subscription</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="h-8 w-12 bg-white border rounded flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                </div>
                <div>
                   <div className="font-medium text-sm">Visa ending in 4242</div>
                   <div className="text-xs text-gray-500">Expires 12/28</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">Update Payment Method</Button>
            </CardContent>
          </Card>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View and download invoices for past payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BILLING_HISTORY.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900">{item.id}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.plan}</TableCell>
                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex w-fit items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
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
