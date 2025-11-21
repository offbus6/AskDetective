import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Basic visibility for new detectives.",
    features: [
      "Basic Profile Listing",
      "Email Contact Only",
      "1 Service Category",
      "Standard Search Ranking",
      "5% Platform Fee"
    ],
    current: false,
    buttonText: "Downgrade"
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Enhanced tools for growing agencies.",
    features: [
      "Verified Badge",
      "Phone & WhatsApp Contact",
      "3 Service Categories",
      "Boosted Search Ranking",
      "2% Platform Fee",
      "Priority Support"
    ],
    current: true,
    popular: true,
    buttonText: "Current Plan"
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    description: "Maximum exposure for top firms.",
    features: [
      "Agency Profile (Multiple Detectives)",
      "Unlimited Categories",
      "Top Search Ranking",
      "0% Platform Fee",
      "Dedicated Account Manager",
      "Featured on Homepage"
    ],
    current: false,
    buttonText: "Upgrade"
  }
];

export default function DetectiveSubscription() {
  return (
    <DashboardLayout role="detective">
      <div className="space-y-8 pb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold font-heading text-gray-900">Upgrade Your Investigation Career</h2>
          <p className="text-gray-500 mt-2">Unlock more clients, lower fees, and premium tools with our subscription plans.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={`relative flex flex-col ${plan.popular ? 'border-green-500 shadow-xl scale-105 z-10' : 'border-gray-200'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Crown className="h-3 w-3" /> Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${plan.current ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
