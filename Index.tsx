import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Heart, 
  Leaf, 
  Users, 
  Star, 
  TrendingUp,
  ShoppingBag,
  RefreshCw,
  Award
} from "lucide-react";

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroImages = [
    "/src/assets/hero-image.jpg",
    "/src/assets/clothing-collection.jpg"
  ];

  const features = [
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Sustainable Fashion",
      description: "Reduce textile waste by giving clothes a second life through community exchanges."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Connect with fashion-conscious individuals who share your values."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assured",
      description: "All items are verified and rated by our community members."
    }
  ];

  const stats = [
    { number: "10K+", label: "Items Exchanged" },
    { number: "5K+", label: "Happy Members" },
    { number: "50K+", label: "Pounds Saved" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-rewear-green to-rewear-coral rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-rewear-green to-rewear-coral bg-clip-text text-transparent">
              ReWear
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/browse" className="text-foreground/80 hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link to="/login" className="text-foreground/80 hover:text-foreground transition-colors">
              Login
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <Badge className="bg-rewear-green-light text-rewear-green border-rewear-green/20 px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Sustainable Fashion Community
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-rewear-green to-rewear-coral bg-clip-text text-transparent">
                  Swap Style,
                </span>
                <br />
                <span className="text-foreground">Save the Planet</span>
              </h1>
              
              <p className="text-xl text-foreground/70 leading-relaxed">
                Join thousands of fashion-conscious individuals in the ultimate clothing exchange platform. 
                Give your wardrobe a sustainable makeover while reducing textile waste.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/browse">
                  <Button size="lg" className="bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white px-8 py-6 text-lg">
                    Start Swapping
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/add-item">
                  <Button size="lg" variant="outline" className="border-rewear-green text-rewear-green hover:bg-rewear-green hover:text-white px-8 py-6 text-lg">
                    List an Item
                    <ShoppingBag className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className={`relative ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-rewear-green/20 to-rewear-coral/20 z-10" />
                <img 
                  src={heroImages[currentImageIndex]} 
                  alt="Sustainable Fashion"
                  className="w-full h-full object-cover transition-opacity duration-1000"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <Card className="bg-background/90 backdrop-blur-md border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Featured Collection</h3>
                          <p className="text-foreground/70">Discover trending sustainable fashion</p>
                        </div>
                        <div className="flex space-x-1">
                          {heroImages.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex 
                                  ? 'bg-rewear-green' 
                                  : 'bg-foreground/20'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-rewear-green-light to-rewear-coral-light">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl font-bold text-rewear-green mb-2">{stat.number}</div>
                <div className="text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ReWear?</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Join a community that values sustainability, quality, and connection
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`group hover:shadow-card transition-all duration-300 hover:-translate-y-2 ${
                  isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-rewear-green to-rewear-coral rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rewear-green to-rewear-coral">
        <div className="container mx-auto px-4 text-center">
          <div className={`max-w-3xl mx-auto ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Wardrobe?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of fashion enthusiasts who are making sustainable choices 
              while discovering amazing new styles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                  Browse Items
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" className="bg-white text-rewear-green hover:bg-white/90 px-8 py-6 text-lg">
                  Join Community
                  <Heart className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-rewear-green to-rewear-coral rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">ReWear</span>
              </div>
              <p className="text-background/70">
                Making sustainable fashion accessible to everyone through community-driven clothing exchanges.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-background/70">
                <li><Link to="/browse" className="hover:text-background transition-colors">Browse Items</Link></li>
                <li><Link to="/add-item" className="hover:text-background transition-colors">List an Item</Link></li>
                <li><Link to="/dashboard" className="hover:text-background transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-background/70">
                <li><Link to="/login" className="hover:text-background transition-colors">Join Us</Link></li>
                <li><Link to="/browse" className="hover:text-background transition-colors">How It Works</Link></li>
                <li><Link to="/admin" className="hover:text-background transition-colors">Guidelines</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
            <p>&copy; 2024 ReWear. All rights reserved. Making fashion sustainable, one swap at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
