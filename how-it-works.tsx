import { Card, CardContent } from "@/components/ui/card";
import { Upload, Search, Repeat, Gift } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "List Your Items",
    description: "Upload photos and details of clothes you no longer wear. Our community will love them!",
    color: "bg-rewear-green"
  },
  {
    icon: Search,
    title: "Browse & Discover",
    description: "Find amazing pre-loved fashion pieces that match your style and size preferences.",
    color: "bg-rewear-coral"
  },
  {
    icon: Repeat,
    title: "Swap or Redeem",
    description: "Trade directly with other members or use earned points to redeem items you love.",
    color: "bg-rewear-yellow"
  },
  {
    icon: Gift,
    title: "Enjoy & Repeat",
    description: "Refresh your wardrobe sustainably while building a positive environmental impact.",
    color: "bg-rewear-green"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-16 bg-rewear-green-light/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How ReWear Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the circular fashion revolution in four simple steps. 
            It's sustainable, social, and surprisingly fun!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative bg-card border-border/50 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-card rounded-xl p-8 shadow-soft">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-rewear-green mb-2">100%</div>
              <div className="text-foreground font-medium mb-1">Secure Transactions</div>
              <div className="text-sm text-muted-foreground">Protected swaps and payments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-rewear-coral mb-2">24/7</div>
              <div className="text-foreground font-medium mb-1">Community Support</div>
              <div className="text-sm text-muted-foreground">Always here to help</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-rewear-yellow mb-2">♻️</div>
              <div className="text-foreground font-medium mb-1">Sustainable Impact</div>
              <div className="text-sm text-muted-foreground">Every swap saves the planet</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};