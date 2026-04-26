import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import BuyPlanLastDialog from './BuyPlanLastDialog';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureDetail {
  id: number;
  name: string;
  feature_identifier: string;
  description: string;
  have_limit: boolean;
  value: number;
  overage_price: string;
  price: string;
  currency: string;
  interval: string;
  marketing_features: string[];
  active: boolean;
  stripe_product_id: string;
  stripe_price_id: string;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  currency: string;
  interval: string;
  trial_period_days: number;
  marketing_features: string[];
  features_details: FeatureDetail[];
}

interface SubscriptionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  plans: Plan[];
}

// ─── Component ────────────────────────────────────────────────────────────────

const BuyPlanDialog = ({ open, setOpen, plans }: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPlanDetailsOpen, setIsPlanDetailsOpen] = useState(false);

  const formatPrice = (price: string, currency: string) => {
    const amount = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleChoosePlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPlanDetailsOpen(true);
  };

  const handleBackToPlans = () => {
    setIsPlanDetailsOpen(false);
    setSelectedPlan(null);
  };

  return (
    <>
      {/* ── Plan list dialog ── */}
      <Dialog open={open && !isPlanDetailsOpen} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl! mx-2 md:mx-0 bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Select a subscription plan that fits your needs.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {plans?.map((plan) => (
              <Card
                key={plan.id}
                className="bg-gray-800 border-gray-700 flex flex-col justify-between transition-all hover:ring-2 hover:ring-primary"
              >
                <CardHeader>
                  <CardTitle className="text-xl capitalize text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-gray-400 ml-2">/{plan.interval}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-300">Features included:</p>
                    <ul className="space-y-2">
                      {[
                        ...plan.marketing_features,
                        ...plan.features_details.map(f => f.name),
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-400">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
                    onClick={() => handleChoosePlan(plan)}
                  >
                    Choose {plan.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Plan details / configure dialog ── */}
      <BuyPlanLastDialog
        open={isPlanDetailsOpen}
        setOpen={(val) => {
          setIsPlanDetailsOpen(val);
          // If the details dialog is closed without going back, close the outer dialog too
          if (!val) {
            setSelectedPlan(null);
            setOpen(false);
          }
        }}
        plan={selectedPlan}
        onBack={handleBackToPlans}
      />
    </>
  );
};

export default BuyPlanDialog;