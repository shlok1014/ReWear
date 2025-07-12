import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const featuredItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    category: "Outerwear",
    size: "M",
    condition: "Excellent",
    points: 45,
    image: "https://images.unsplash.com/photo-1551038284-8b2a8df7b50e?w=400&h=400&fit=crop",
    user: "Sarah M.",
    rating: 4.9,
    isFeatured: true
  },
  {
    id: 2,
    title: "Designer Handbag",
    category: "Accessories",
    size: "One Size",
    condition: "Like New",
    points: 85,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    user: "Emma K.",
    rating: 5.0,
    isFeatured: true
  },
  {
    id: 3,
    title: "Cozy Knit Sweater",
    category: "Tops",
    size: "L",
    condition: "Good",
    points: 30,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
    user: "Alex T.",
    rating: 4.7,
    isFeatured: false
  },
  {
    id: 4,
    title: "Running Sneakers",
    category: "Shoes",
    size: "9",
    condition: "Very Good",
    points: 55,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    user: "Mike R.",
    rating: 4.8,
    isFeatured: true
  }
];

const ItemCard = ({ item }: { item: typeof featuredItems[0] }) => (
  <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
    <CardContent className="p-0">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {item.isFeatured && (
          <Badge className="absolute top-3 left-3 bg-rewear-coral text-white">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-foreground p-2"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-rewear-green transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{item.category}</span>
            <span>•</span>
            <span>Size {item.size}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {item.condition}
          </Badge>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-3 w-3 fill-rewear-yellow text-rewear-yellow" />
            <span className="font-medium">{item.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-rewear-green font-semibold">
            <Zap className="h-4 w-4" />
            <span>{item.points} pts</span>
          </div>
          <span className="text-xs text-muted-foreground">by {item.user}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/item/${item.id}`}>View Details</Link>
          </Button>
          <Button size="sm" variant="outline" className="px-3">
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const FeaturedItems = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Featured Items
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing pre-loved fashion pieces from our community. 
            Every item comes with quality assurance and sustainable impact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link to="/browse">
              View All Items
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};