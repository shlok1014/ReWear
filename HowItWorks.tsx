import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

const HowItWorks = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light p-8">
    <div className="max-w-2xl w-full bg-background/80 rounded-xl shadow-lg p-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <Leaf className="w-8 h-8 text-rewear-green mr-2" />
        <h1 className="text-3xl font-bold">How It Works</h1>
      </div>
      <p className="text-lg text-foreground/70 mb-6">
        ReWear makes it easy to swap, list, and discover sustainable fashion. Browse items, list your own, and connect with the community for eco-friendly style swaps!
      </p>
      <Link to="/browse">
        <Button>Browse Items</Button>
      </Link>
    </div>
  </div>
);

export default HowItWorks; 