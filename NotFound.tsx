import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-rewear-green to-rewear-coral rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-rewear-green to-rewear-coral bg-clip-text text-transparent">
              ReWear
            </span>
          </div>
        </div>

        {/* 404 Card */}
        <Card className="bg-background/80 backdrop-blur-md border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold text-rewear-green mb-4">404</div>
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p className="text-foreground/70 mb-8 leading-relaxed">
              Oops! The page you're looking for doesn't exist. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            <div className="space-y-4">
              <Link to="/" className="w-full">
                <Button className="w-full bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white py-6">
                  <Home className="w-5 h-5 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
              
              <Link to="/browse" className="w-full">
                <Button variant="outline" className="w-full border-rewear-green text-rewear-green hover:bg-rewear-green hover:text-white py-6">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Items
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
