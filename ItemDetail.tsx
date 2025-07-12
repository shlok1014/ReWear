import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  Leaf,
  MessageCircle,
  Share2,
  Flag,
  CheckCircle,
  Award,
  Users,
  Calendar
} from "lucide-react";

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  points: number;
  location: string;
  uploadedBy: string;
  userAvatar: string;
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isLiked: boolean;
  isAvailable: boolean;
  uploadDate: string;
  brand?: string;
  material?: string;
  color?: string;
  measurements?: string;
}

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock data
  const mockItem: Item = {
    id: "1",
    title: "Vintage Denim Jacket",
    description: "This is a beautiful vintage denim jacket from the 1990s. It features a classic fit with a slightly oversized silhouette that's perfect for layering. The denim has a lovely faded wash that gives it authentic vintage character. The jacket includes multiple pockets and a comfortable fit that works well for both casual and slightly dressier occasions. The quality of the denim is excellent - it's thick and durable while still being comfortable to wear. This piece has been well-cared for and shows minimal signs of wear, making it a great addition to any sustainable wardrobe. Perfect for those who appreciate timeless style and want to reduce their environmental impact through second-hand fashion.",
    category: "Outerwear",
    size: "M",
    condition: "Excellent",
    points: 150,
    location: "San Francisco, CA",
    uploadedBy: "Sarah M.",
    userAvatar: "/src/assets/hero-image.jpg",
    images: [
      "/src/assets/clothing-collection.jpg",
      "/src/assets/hero-image.jpg",
      "/src/assets/clothing-collection.jpg",
      "/src/assets/hero-image.jpg"
    ],
    tags: ["vintage", "denim", "jacket", "90s", "classic"],
    rating: 4.8,
    reviewCount: 12,
    isLiked: false,
    isAvailable: true,
    uploadDate: "2024-01-15",
    brand: "Levi's",
    material: "100% Cotton Denim",
    color: "Blue",
    measurements: "Chest: 42\", Length: 26\", Shoulders: 18\""
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setItem(mockItem);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const toggleLike = () => {
    if (item) {
      setItem({ ...item, isLiked: !item.isLiked });
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Like New": return "bg-green-100 text-green-800";
      case "Excellent": return "bg-blue-100 text-blue-800";
      case "Good": return "bg-yellow-100 text-yellow-800";
      case "Fair": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rewear-green"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
            <p className="text-foreground/70 mb-6">The item you're looking for doesn't exist.</p>
            <Link to="/browse">
              <Button>Browse Items</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/browse" className="flex items-center space-x-2 text-foreground/70 hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Browse</span>
              </Link>
              <div className="h-6 w-px bg-border/50" />
              <h1 className="text-2xl font-bold">{item.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleLike}>
                <Heart className={`w-5 h-5 ${item.isLiked ? 'fill-red-500 text-red-500' : 'text-foreground/60'}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-5 h-5 text-foreground/60" />
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="w-5 h-5 text-foreground/60" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-background/50">
              <img
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                    No Longer Available
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex 
                      ? 'border-rewear-green' 
                      : 'border-border/50 hover:border-rewear-green/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{item.rating}</span>
                  <span className="text-foreground/60">({item.reviewCount})</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Badge className={`${getConditionColor(item.condition)}`}>
                  {item.condition}
                </Badge>
                <Badge variant="outline">{item.size}</Badge>
                <div className="flex items-center space-x-1 text-foreground/60">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>

            {/* Points and Actions */}
            <div className="bg-background/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-6 h-6 text-rewear-green" />
                  <span className="text-2xl font-bold text-rewear-green">{item.points} points</span>
                </div>
                <Badge variant="secondary" className="bg-rewear-green-light text-rewear-green">
                  Available for Swap
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white py-6"
                  disabled={!item.isAvailable}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Request Swap
                </Button>
                <Button 
                  variant="outline" 
                  className="border-rewear-green text-rewear-green hover:bg-rewear-green hover:text-white py-6"
                  disabled={!item.isAvailable}
                >
                  <Leaf className="w-5 h-5 mr-2" />
                  Redeem with Points
                </Button>
              </div>
            </div>

            {/* Uploader Info */}
            <Card className="bg-background/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={item.userAvatar} />
                    <AvatarFallback>{item.uploadedBy.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.uploadedBy}</h3>
                    <div className="flex items-center space-x-4 text-sm text-foreground/60">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>24 swaps</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-background/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Description</h3>
                <div className="space-y-4">
                  <p className={`text-foreground/80 leading-relaxed ${!showFullDescription && 'line-clamp-3'}`}>
                    {item.description}
                  </p>
                  {item.description.length > 200 && (
                    <Button
                      variant="ghost"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-rewear-green hover:text-rewear-green/80"
                    >
                      {showFullDescription ? 'Show Less' : 'Read More'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Item Details */}
            <Card className="bg-background/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Item Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-foreground/60">Category:</span>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <span className="text-foreground/60">Size:</span>
                    <p className="font-medium">{item.size}</p>
                  </div>
                  {item.brand && (
                    <div>
                      <span className="text-foreground/60">Brand:</span>
                      <p className="font-medium">{item.brand}</p>
                    </div>
                  )}
                  {item.material && (
                    <div>
                      <span className="text-foreground/60">Material:</span>
                      <p className="font-medium">{item.material}</p>
                    </div>
                  )}
                  {item.color && (
                    <div>
                      <span className="text-foreground/60">Color:</span>
                      <p className="font-medium">{item.color}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-foreground/60">Uploaded:</span>
                    <p className="font-medium">{new Date(item.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>
                {item.measurements && (
                  <div className="mt-4">
                    <span className="text-foreground/60">Measurements:</span>
                    <p className="font-medium">{item.measurements}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-background/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-rewear-green-light text-rewear-green">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Items */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Similar items would be rendered here */}
            <div className="text-center py-8 text-foreground/60">
              <p>Similar items will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;