import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const Help = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light p-8">
    <div className="max-w-2xl w-full bg-background/80 rounded-xl shadow-lg p-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <HelpCircle className="w-8 h-8 text-rewear-green mr-2" />
        <h1 className="text-3xl font-bold">Help Center</h1>
      </div>
      <p className="text-lg text-foreground/70 mb-6">
        Need assistance? Browse our FAQs or contact support for help with your ReWear experience.
      </p>
      <Link to="/faq">
        <Button>View FAQ</Button>
      </Link>
    </div>
  </div>
);

export default Help; 