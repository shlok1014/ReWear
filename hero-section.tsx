import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Recycle, Users, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Give Your Clothes a 
                <span className="block text-rewear-yellow">Second Life</span>
              </h1>
              <p className="text-xl text-white/90 max-w-lg">
                Join ReWear's sustainable community where fashion meets responsibility. 
                Swap, redeem, and discover amazing pre-loved clothing while reducing textile waste.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild className="text-lg font-semibold">
                <Link to="/browse">
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2 mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-white/80 text-sm">Active Members</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2 mx-auto">
                  <Recycle className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-white/80 text-sm">Items Swapped</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2 mx-auto">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-white/80 text-sm">Happy Swappers</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={heroImage} 
                alt="People exchanging clothes in a sustainable fashion community" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-card animate-bounce-gentle">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-rewear-green rounded-full flex items-center justify-center">
                  <Recycle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Eco Impact</div>
                  <div className="text-sm text-muted-foreground">2.5kg CO₂ saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};