import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Recycle, Instagram, Twitter, Facebook, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
              <Recycle className="h-8 w-8 text-rewear-green" />
              <span>ReWear</span>
            </Link>
            <p className="text-background/80 max-w-xs">
              Making fashion circular, one swap at a time. Join our sustainable community today.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-background/80 hover:text-background p-2">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-background/80 hover:text-background p-2">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-background/80 hover:text-background p-2">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/browse" className="block text-background/80 hover:text-background transition-colors">
                Browse Items
              </Link>
              <Link to="/how-it-works" className="block text-background/80 hover:text-background transition-colors">
                How It Works
              </Link>
              <Link to="/add-item" className="block text-background/80 hover:text-background transition-colors">
                List an Item
              </Link>
              <Link to="/dashboard" className="block text-background/80 hover:text-background transition-colors">
                My Dashboard
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-2">
              <Link to="/help" className="block text-background/80 hover:text-background transition-colors">
                Help Center
              </Link>
              <Link to="/contact" className="block text-background/80 hover:text-background transition-colors">
                Contact Us
              </Link>
              <Link to="/safety" className="block text-background/80 hover:text-background transition-colors">
                Safety Guidelines
              </Link>
              <Link to="/faq" className="block text-background/80 hover:text-background transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-background/80 text-sm">
              Get the latest sustainable fashion tips and community updates.
            </p>
            <div className="space-y-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
              />
              <Button className="w-full bg-rewear-green hover:bg-rewear-green/90">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-background/80 text-sm">
            © 2024 ReWear. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-background/80 hover:text-background text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-background/80 hover:text-background text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-background/80 hover:text-background text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};