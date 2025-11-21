import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Shield, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Basic visibility for new detectives.",
    features: [
      "Basic Profile Listing",
      "Email Contact Only",
      "1 Service Category",
      "Standard Search Ranking",
      "5% Platform Fee"
    ],
    highlight: false,
    buttonText: "Get Started"
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "Enhanced tools for growing agencies.",
    features: [
      "Verified Badge",
      "Phone & WhatsApp Contact",
      "3 Service Categories",
      "Boosted Search Ranking",
      "2% Platform Fee",
      "Priority Support"
    ],
    highlight: true,
    popular: true,
    buttonText: "Upgrade to Pro"
  },
  {
    id: "agency",
    name: "Agency",
    price: 99,
    description: "Maximum exposure for top firms.",
    features: [
      "Agency Profile (Multiple Detectives)",
      "Unlimited Categories",
      "Top Search Ranking",
      "0% Platform Fee",
      "Dedicated Account Manager",
      "Featured on Homepage"
    ],
    highlight: false,
    buttonText: "Go Agency"
  }
];

export default function DetectiveSubscription() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // In a real app, this would redirect to checkout
    alert(`You selected the ${planId.toUpperCase()} plan! Redirecting to payment...`);
  };

  return (
    <DashboardLayout role="detective">
      <div className="space-y-8 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50">Pricing Plans</Badge>
          <h2 className="text-4xl font-bold font-heading text-gray-900">Upgrade Your Investigation Career</h2>
          <p className="text-xl text-gray-500">Unlock more clients, lower fees, and premium tools with our subscription plans.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>
              Yearly <span className="text-green-600 text-xs font-bold ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
          {PLANS.map((plan) => {
            const price = isAnnual ? Math.floor(plan.price * 12 * 0.8) : plan.price;
            const period = isAnnual ? "/year" : "/month";
            
            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col transition-all duration-200 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-green-500 shadow-lg scale-105 z-10 ring-1 ring-green-500' 
                    : 'border-gray-200 hover:-translate-y-1'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                    <Crown className="h-3 w-3" /> Most Popular
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    {plan.id === "agency" && <Shield className="h-6 w-6 text-gray-400" />}
                    {plan.id === "pro" && <Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" />}
                    {plan.id === "free" && <Star className="h-6 w-6 text-gray-400" />}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">${price}</span>
                    <span className="text-gray-500 font-medium">{period}</span>
                  </div>
                  <CardDescription className="mt-2 text-base">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="my-4 border-t border-gray-100"></div>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                        <div className="mt-0.5 rounded-full bg-green-100 p-1">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-4">
                  <Button 
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full h-12 text-base font-semibold shadow-sm ${
                      plan.popular 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    variant="default"
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto mt-16 bg-gray-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Need a Custom Enterprise Solution?</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              For large agencies with 10+ detectives, we offer custom enterprise plans with API access, white-label reporting, and dedicated infrastructure.
            </p>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
