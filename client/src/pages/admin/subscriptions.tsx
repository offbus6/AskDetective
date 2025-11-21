import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface PlanFeature {
  id: string;
  text: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  highlight: boolean;
  popular: boolean;
  active: boolean;
}

const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Basic visibility for new detectives.",
    features: [
      "Basic Profile Listing",
      "Email Contact Only",
      "2 Service Categories",
      "Standard Search Ranking",
      "No Phone/WhatsApp Displayed"
    ],
    highlight: false,
    popular: false,
    active: true
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "Enhanced tools for growing agencies.",
    features: [
      "Verified Badge",
      "Phone & WhatsApp Contact",
      "4 Service Categories",
      "Boosted Search Ranking",
      "Priority Support"
    ],
    highlight: true,
    popular: true,
    active: true
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: "Maximum exposure for top firms.",
    features: [
      "Agency Profile (Multiple Detectives)",
      "Unlimited Categories",
      "Free Blue Tick Included",
      "Recommended Badge",
      "Top Search Ranking"
    ],
    highlight: false,
    popular: false,
    active: true
  }
];

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [blueTickPrice, setBlueTickPrice] = useState({ monthly: 15, yearly: 150 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "",
    features: [],
    highlight: false,
    popular: false,
    active: true
  });
  const [featureInput, setFeatureInput] = useState("");

  const handleOpenDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setCurrentPlan(plan);
      setFormData({ ...plan });
    } else {
      setCurrentPlan(null);
      setFormData({
        name: "",
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: "",
        features: [],
        highlight: false,
        popular: false,
        active: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentPlan) {
      // Update existing
      setPlans(plans.map(p => p.id === currentPlan.id ? { ...currentPlan, ...formData } as SubscriptionPlan : p));
    } else {
      // Create new
      const newPlan = {
        ...formData,
        id: formData.name?.toLowerCase().replace(/\s+/g, '-') || `plan-${Date.now()}`,
      } as SubscriptionPlan;
      setPlans([...plans, newPlan]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentPlan) {
      setPlans(plans.filter(p => p.id !== currentPlan.id));
      setIsDeleteDialogOpen(false);
      setCurrentPlan(null);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()]
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold font-heading text-gray-900">Subscription Plans</h2>
            <p className="text-gray-500">Manage pricing tiers and features for detectives.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-gray-900 hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" /> Create New Plan
          </Button>
        </div>

        {/* Blue Tick Configuration */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Add-on Service</Badge>
              <CardTitle className="text-lg text-blue-900">Blue Tick Verification</CardTitle>
            </div>
            <CardDescription className="text-blue-700/80">
              Set the standalone price for the Blue Tick verification badge (included free in Agency plan).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="space-y-2 w-32">
                <Label htmlFor="bt-monthly">Monthly ($)</Label>
                <Input 
                  id="bt-monthly" 
                  type="number" 
                  value={blueTickPrice.monthly} 
                  onChange={(e) => setBlueTickPrice({...blueTickPrice, monthly: Number(e.target.value)})}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2 w-32">
                <Label htmlFor="bt-yearly">Yearly ($)</Label>
                <Input 
                  id="bt-yearly" 
                  type="number" 
                  value={blueTickPrice.yearly} 
                  onChange={(e) => setBlueTickPrice({...blueTickPrice, yearly: Number(e.target.value)})}
                  className="bg-white"
                />
              </div>
              <Button onClick={() => alert("Blue Tick pricing updated!")} className="bg-blue-600 hover:bg-blue-700 text-white">
                Update Pricing
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Plans</CardTitle>
            <CardDescription>
              These plans are currently visible to detectives on the subscription page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Yearly</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Highlights</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      <div>{plan.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{plan.description}</div>
                    </TableCell>
                    <TableCell>${plan.monthlyPrice}/mo</TableCell>
                    <TableCell>${plan.yearlyPrice}/yr</TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? "default" : "secondary"} className={plan.active ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                        {plan.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {plan.popular && <Badge variant="outline" className="border-yellow-500 text-yellow-600">Popular</Badge>}
                        {plan.highlight && <Badge variant="outline" className="border-blue-500 text-blue-600">Highlighted</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(plan)}>
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setCurrentPlan(plan); setIsDeleteDialogOpen(true); }}>
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

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
              <DialogDescription>
                Configure the subscription details below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Enterprise"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
                  <Input 
                    id="monthlyPrice" 
                    type="number" 
                    value={formData.monthlyPrice} 
                    onChange={(e) => setFormData({...formData, monthlyPrice: Number(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
                  <Input 
                    id="yearlyPrice" 
                    type="number" 
                    value={formData.yearlyPrice} 
                    onChange={(e) => setFormData({...formData, yearlyPrice: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Short description of the plan..."
                />
              </div>

              <div className="space-y-2">
                <Label>Plan Features</Label>
                <div className="flex gap-2">
                  <Input 
                    value={featureInput} 
                    onChange={(e) => setFeatureInput(e.target.value)} 
                    placeholder="Add a feature..."
                    onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button type="button" onClick={addFeature} size="sm" variant="secondary">Add</Button>
                </div>
                <div className="bg-gray-50 rounded-md p-2 space-y-1 min-h-[100px] max-h-[200px] overflow-y-auto border">
                  {formData.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border text-sm">
                      <span>{feature}</span>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-500" onClick={() => removeFeature(idx)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {(!formData.features || formData.features.length === 0) && (
                    <div className="text-center text-gray-400 py-4 text-sm">No features added yet</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between border p-3 rounded-md">
                  <Label htmlFor="popular" className="cursor-pointer">Popular Badge</Label>
                  <Switch 
                    id="popular" 
                    checked={formData.popular} 
                    onCheckedChange={(c) => setFormData({...formData, popular: c})} 
                  />
                </div>
                <div className="flex items-center justify-between border p-3 rounded-md">
                  <Label htmlFor="highlight" className="cursor-pointer">Highlighted</Label>
                  <Switch 
                    id="highlight" 
                    checked={formData.highlight} 
                    onCheckedChange={(c) => setFormData({...formData, highlight: c})} 
                  />
                </div>
                <div className="flex items-center justify-between border p-3 rounded-md col-span-2">
                  <Label htmlFor="active" className="cursor-pointer">Plan Active</Label>
                  <Switch 
                    id="active" 
                    checked={formData.active} 
                    onCheckedChange={(c) => setFormData({...formData, active: c})} 
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Plan</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the <strong>{currentPlan?.name}</strong> plan? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
