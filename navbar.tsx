import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Recycle, User, Heart, Plus } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-rewear-green hover:text-primary transition-colors">
            <Recycle className="h-8 w-8" />
            <span>ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-foreground hover:text-rewear-green transition-colors font-medium">
              Browse Items
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-rewear-green transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/about" className="text-foreground hover:text-rewear-green transition-colors font-medium">
              About
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/wishlist">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/add-item">
                <Plus className="h-4 w-4 mr-2" />
                List Item
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/admin">Admin</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border animate-fade-in">
            <Link to="/browse" className="block text-foreground hover:text-rewear-green transition-colors font-medium">
              Browse Items
            </Link>
            <Link to="/how-it-works" className="block text-foreground hover:text-rewear-green transition-colors font-medium">
              How It Works
            </Link>
            <Link to="/about" className="block text-foreground hover:text-rewear-green transition-colors font-medium">
              About
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/add-item">
                  <Plus className="h-4 w-4 mr-2" />
                  List Item
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="w-full" asChild>
                <Link to="/signup">Join ReWear</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};