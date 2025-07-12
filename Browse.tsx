import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { itemsAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Filter, 
  Heart, 
  Star, 
  MapPin, 
  Clock,
  Leaf,
  ArrowLeft,
  Grid3X3,
  List,
  Eye,
  MessageCircle
} from "lucide-react";

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  location: string;
  uploader: {
    _id: string;
    name: string;
    avatar: string;
  };
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  tags: string[];
  views: number;
  likes: string[];
  swapRequests: Array<{
    _id: string;
    user: string;
    status: string;
  }>;
  status: string;
  createdAt: string;
  isFeatured: boolean;
}

const Browse = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch items from API
  const fetchItems = async (page = 1, reset = false) => {
    try {
      const params = {
        page,
        limit: 12,
        search: searchTerm || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        size: selectedSize !== "all" ? selectedSize : undefined,
        condition: selectedCondition !== "all" ? selectedCondition : undefined,
        sortBy: sortBy === "newest" ? "createdAt" : sortBy === "oldest" ? "-createdAt" : sortBy,
        sortOrder: sortBy === "newest" ? "desc" : "asc"
      };

      const response = await itemsAPI.getAll(params);
      const newItems = response.data.items || [];
      
      if (reset) {
        setItems(newItems);
        setFilteredItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setFilteredItems(prev => [...prev, ...newItems]);
      }
      
      setHasMore(response.data.currentPage < response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1, true);
  }, [searchTerm, selectedCategory, selectedSize, selectedCondition, sortBy]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchItems(currentPage + 1);
    }
  };

  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Size filter
    if (selectedSize !== "all") {
      filtered = filtered.filter(item => item.size === selectedSize);
    }

    // Condition filter
    if (selectedCondition !== "all") {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "points-low":
        filtered = [...filtered].sort((a, b) => (a.views || 0) - (b.views || 0));
        break;
      case "points-high":
        filtered = [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        break;
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, selectedSize, selectedCondition, sortBy]);

  const toggleLike = async (itemId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to like items",
        variant: "destructive",
      });
      return;
    }

    try {
      await itemsAPI.toggleLike(itemId);
      
      // Update local state
      setItems(prevItems =>
        prevItems.map(item => {
          if (item._id === itemId) {
            const isLiked = item.likes.includes(user._id);
            return {
              ...item,
              likes: isLiked 
                ? item.likes.filter(id => id !== user._id)
                : [...item.likes, user._id]
            };
          }
          return item;
        })
      );
      
      setFilteredItems(prevItems =>
        prevItems.map(item => {
          if (item._id === itemId) {
            const isLiked = item.likes.includes(user._id);
            return {
              ...item,
              likes: isLiked 
                ? item.likes.filter(id => id !== user._id)
                : [...item.likes, user._id]
            };
          }
          return item;
        })
      );

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-foreground/70 hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-border/50" />
              <h1 className="text-2xl font-bold">Browse Items</h1>
            </div>
            <Link to="/add-item">
              <Button className="bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white">
                List an Item
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
            <Input
              placeholder="Search items, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-rewear-green"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Tops">Tops</SelectItem>
                <SelectItem value="Bottoms">Bottoms</SelectItem>
                <SelectItem value="Outerwear">Outerwear</SelectItem>
                <SelectItem value="Sweaters">Sweaters</SelectItem>
                <SelectItem value="Footwear">Footwear</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="12">12</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="points-low">Points: Low to High</SelectItem>
                <SelectItem value="points-high">Points: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="bg-background/50 border-border/50"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="bg-background/50 border-border/50"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-foreground/70">
            Showing {filteredItems.length} of {items.length} items
          </p>
        </div>

        {/* Items Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item._id} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-background/80 backdrop-blur-sm border-border/50">
                <div className="relative">
                  <img
                    src={item.images[0]?.url || "/src/assets/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => toggleLike(item._id)}
                  >
                    <Heart className={`w-4 h-4 ${item.likes.includes(user?._id || '') ? 'fill-red-500 text-red-500' : 'text-foreground/60'}`} />
                  </Button>
                  <Badge className={`absolute top-2 left-2 ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </Badge>
                  {item.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-rewear-green to-rewear-coral text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-rewear-green transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-foreground/40" />
                      <span className="text-sm font-medium">{item.views}</span>
                    </div>
                  </div>
                  
                  <p className="text-foreground/70 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {item.size}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-foreground/40" />
                      <span className="text-sm font-medium">{item.likes.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-rewear-green-light text-rewear-green">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-foreground/40" />
                      <span className="text-sm text-foreground/60">{item.swapRequests.length} requests</span>
                    </div>
                    <span className="text-sm text-foreground/60">by {item.uploader.name}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Link to={`/item/${item._id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="col-span-full flex justify-center mt-8">
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  variant="outline"
                  className="border-rewear-green text-rewear-green hover:bg-rewear-green hover:text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rewear-green mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    "Load More Items"
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item._id} className="group hover:shadow-card transition-all duration-300 bg-background/80 backdrop-blur-sm border-border/50">
                <div className="flex">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <img
                      src={item.images[0]?.url || "/src/assets/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-l-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={() => toggleLike(item._id)}
                    >
                      <Heart className={`w-4 h-4 ${item.likes.includes(user?._id || '') ? 'fill-red-500 text-red-500' : 'text-foreground/60'}`} />
                    </Button>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-rewear-green transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-foreground/70 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.likes?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {item.size}
                      </Badge>
                      <Badge className={`text-xs ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-foreground/60">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-wrap gap-1">
                          {item.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-rewear-green-light text-rewear-green">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Leaf className="w-4 h-4 text-rewear-green" />
                          <span className="font-semibold text-rewear-green">{item.views || 0} views</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-foreground/60">by {item.uploader?.name || "Unknown"}</span>
                        <Link to={`/item/${item._id}`}>
                          <Button className="bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-rewear-green-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-rewear-green" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-foreground/70 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedSize("all");
                setSelectedCondition("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;