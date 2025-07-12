import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Safety = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light p-8">
    <div className="max-w-2xl w-full bg-background/80 rounded-xl shadow-lg p-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <Shield className="w-8 h-8 text-rewear-green mr-2" />
        <h1 className="text-3xl font-bold">Safety Guidelines</h1>
      </div>
      <p className="text-lg text-foreground/70 mb-6">
        Stay safe while swapping! Read our guidelines to ensure a secure and positive experience on ReWear.
      </p>
      <Link to="/faq">
        <Button>FAQ</Button>
      </Link>
    </div>
  </div>
);

export default Safety; 