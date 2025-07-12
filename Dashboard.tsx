import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { usersAPI, itemsAPI } from "@/services/api";
import { 
  User, 
  Package, 
  ArrowRightLeft, 
  Star, 
  MapPin, 
  Calendar,
  Leaf,
  Plus,
  Settings,
  Heart,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  LogOut,
  Search,
  Grid3X3
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  location: string;
  joinDate: string;
  rating: number;
  totalSwaps: number;
  points: number;
  level: string;
  badges: string[];
}

interface Item {
  id: string;
  title: string;
  image: string;
  status: "active" | "pending" | "sold" | "expired";
  views: number;
  likes: number;
  points: number;
  uploadDate: string;
}

interface Swap {
  id: string;
  type: "incoming" | "outgoing";
  status: "pending" | "accepted" | "completed" | "declined";
  itemTitle: string;
  otherUser: string;
  otherUserAvatar: string;
  date: string;
  points?: number;
}

interface BrowseItem {
  id: string;
  title: string;
  image: string;
  category: string;
  size: string;
  condition: string;
  uploader: string;
  uploaderAvatar: string;
  likes: number;
  uploadDate: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [browseItems, setBrowseItems] = useState<BrowseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const [profileRes, statsRes, itemsRes, swapsRes, browseRes] = await Promise.all([
        usersAPI.getProfile(),
        usersAPI.getStats(),
        usersAPI.getMyItems({ limit: 10 }),
        usersAPI.getSwapRequests({ limit: 10 }),
        itemsAPI.getAll({ limit: 8 })
      ]);

      setProfile({
        name: profileRes.data.user.name,
        email: profileRes.data.user.email,
        avatar: profileRes.data.user.avatar || "",
        location: profileRes.data.user.location || "Not specified",
        joinDate: new Date(profileRes.data.user.createdAt).toLocaleDateString(),
        rating: 4.9, // Mock rating for now
        totalSwaps: statsRes.data.stats?.successfulSwaps || 0,
        points: (statsRes.data.stats?.itemsUploaded || 0) * 100, // Mock points calculation
        level: getLevelFromPoints((statsRes.data.stats?.itemsUploaded || 0) * 100),
        badges: statsRes.data.badges || []
      });

      setStats(statsRes.data.stats);
      
      setItems((itemsRes.data.items || []).map((item: any) => ({
        id: item._id,
        title: item.title,
        image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "/src/assets/placeholder.svg",
        status: item.status,
        views: item.views || 0,
        likes: Array.isArray(item.likes) ? item.likes.length : 0,
        points: (item.views || 0) * 10, // Mock points calculation
        uploadDate: new Date(item.createdAt).toLocaleDateString()
      })));

      setSwaps((swapsRes.data.requests || []).map((request: any) => ({
        id: request._id,
        type: "incoming",
        status: request.status || "pending",
        itemTitle: request.item?.title || "Unknown Item",
        otherUser: request.requester?.name || "Unknown User",
        otherUserAvatar: request.requester?.avatar || "",
        date: new Date(request.createdAt).toLocaleDateString()
      })));

      setBrowseItems((browseRes.data.items || []).map((item: any) => ({
        id: item._id,
        title: item.title,
        image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "/src/assets/placeholder.svg",
        category: item.category,
        size: item.size,
        condition: item.condition,
        uploader: item.uploader?.name || "Unknown",
        uploaderAvatar: item.uploader?.avatar || "",
        likes: Array.isArray(item.likes) ? item.likes.length : 0,
        uploadDate: new Date(item.createdAt).toLocaleDateString()
      })));

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelFromPoints = (points: number) => {
    if (points < 100) return "Newcomer";
    if (points < 500) return "Eco Explorer";
    if (points < 1000) return "Eco Warrior";
    if (points < 2000) return "Sustainability Champion";
    return "Eco Legend";
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "sold": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-green-100 text-green-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "declined": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelProgress = (points: number) => {
    const levels = [
      { name: "Newcomer", min: 0, max: 100 },
      { name: "Eco Explorer", min: 101, max: 500 },
      { name: "Eco Warrior", min: 501, max: 1000 },
      { name: "Sustainability Champion", min: 1001, max: 2000 },
      { name: "Eco Legend", min: 2001, max: Infinity }
    ];
    
    const currentLevel = levels.find(level => points >= level.min && points <= level.max);
    const nextLevel = levels[levels.findIndex(level => level.name === currentLevel?.name) + 1];
    
    if (!currentLevel || !nextLevel) return 100;
    
    const progress = ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100;
    return Math.min(progress, 100);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rewear-green-light via-background to-rewear-coral-light">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-foreground/70 mb-6">Please log in to view your dashboard.</p>
            <Link to="/login">
              <Button>Login</Button>
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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link to="/browse">
                <Button variant="outline" className="border-rewear-green text-rewear-green hover:bg-rewear-green hover:text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Browse
                </Button>
              </Link>
              <Link to="/add-item">
                <Button className="bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  List Item
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-background/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-rewear-green to-rewear-coral text-white text-xl">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
                  <p className="text-foreground/60 text-sm mb-4">{profile.email}</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <MapPin className="w-4 h-4 text-foreground/40" />
                    <span className="text-sm text-foreground/60">{profile.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Calendar className="w-4 h-4 text-foreground/40" />
                    <span className="text-sm text-foreground/60">Joined {profile.joinDate}</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{profile.rating} Rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-background/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Total Swaps</span>
                  <span className="font-semibold">{profile.totalSwaps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Items Listed</span>
                  <span className="font-semibold">{stats?.itemsUploaded || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Points Earned</span>
                  <span className="font-semibold">{profile.points}</span>
                </div>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card className="bg-background/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Level Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-rewear-green">{profile.level}</h3>
                  <Progress value={getLevelProgress(profile.points)} className="mt-2" />
                </div>
                <div className="text-center text-sm text-foreground/60">
                  {profile.points} / {profile.level === "Eco Legend" ? "∞" : "Next Level"} points
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="items">My Items</TabsTrigger>
                <TabsTrigger value="swaps">Swaps</TabsTrigger>
                <TabsTrigger value="browse">Browse</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Welcome Section */}
                <Card className="bg-gradient-to-r from-rewear-green to-rewear-coral text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Welcome back, {profile.name.split(' ')[0]}!</h2>
                        <p className="text-white/90">
                          You've helped save the planet with {profile.totalSwaps} successful swaps.
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{profile.points}</div>
                        <div className="text-white/90">Total Points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="w-5 h-5" />
                        <span>Recent Items</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {items.length > 0 ? (
                        <div className="space-y-3">
                          {items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-background/50">
                              <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.title}</p>
                                <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                                  {item.status}
                                </Badge>
                              </div>
                              <div className="text-right text-xs text-foreground/60">
                                <div>{item.likes} likes</div>
                                <div>{item.views} views</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-foreground/60 text-center py-4">No items listed yet</p>
                      )}
                      <Link to="/add-item" className="block mt-4">
                        <Button variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          List New Item
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ArrowRightLeft className="w-5 h-5" />
                        <span>Recent Swaps</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {swaps.length > 0 ? (
                        <div className="space-y-3">
                          {swaps.slice(0, 3).map((swap) => (
                            <div key={swap.id} className="flex items-center space-x-3 p-3 rounded-lg bg-background/50">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={swap.otherUserAvatar} />
                                <AvatarFallback className="text-xs">
                                  {swap.otherUser.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{swap.itemTitle}</p>
                                <Badge className={`text-xs ${getStatusColor(swap.status)}`}>
                                  {swap.status}
                                </Badge>
                              </div>
                              <div className="text-right text-xs text-foreground/60">
                                {swap.date}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-foreground/60 text-center py-4">No swap requests yet</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="items" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5" />
                      <span>My Listed Items</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {items.length > 0 ? (
                      <div className="grid gap-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 rounded-lg bg-background/50">
                            <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover" />
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-foreground/60">
                                <span>Uploaded: {item.uploadDate}</span>
                                <span>{item.views} views</span>
                                <span>{item.likes} likes</span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
                        <h3 className="text-lg font-semibold mb-2">No items listed yet</h3>
                        <p className="text-foreground/60 mb-4">Start by listing your first item for swap!</p>
                        <Link to="/add-item">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            List Your First Item
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="swaps" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ArrowRightLeft className="w-5 h-5" />
                      <span>Swap Requests</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {swaps.length > 0 ? (
                      <div className="space-y-4">
                        {swaps.map((swap) => (
                          <div key={swap.id} className="flex items-center space-x-4 p-4 rounded-lg bg-background/50">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={swap.otherUserAvatar} />
                              <AvatarFallback>
                                {swap.otherUser.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">{swap.itemTitle}</h3>
                              <p className="text-sm text-foreground/60">Requested by {swap.otherUser}</p>
                              <p className="text-xs text-foreground/40">{swap.date}</p>
                            </div>
                            <Badge className={getStatusColor(swap.status)}>
                              {swap.status}
                            </Badge>
                            {swap.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <AlertCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
                        <h3 className="text-lg font-semibold mb-2">No swap requests yet</h3>
                        <p className="text-foreground/60">When someone requests to swap with you, it will appear here.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="browse" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Grid3X3 className="w-5 h-5" />
                      <span>Browse Items</span>
                    </CardTitle>
                    <CardDescription>
                      Discover items available for swap in the community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {browseItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {browseItems.map((item) => (
                          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-square overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h3>
                              <div className="flex items-center justify-between text-xs text-foreground/60 mb-2">
                                <span className="capitalize">{item.category}</span>
                                <span>{item.size}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-foreground/60 mb-3">
                                <span className="capitalize">{item.condition}</span>
                                <span>{item.likes} likes</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={item.uploaderAvatar} />
                                  <AvatarFallback className="text-xs">
                                    {item.uploader.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-foreground/60">{item.uploader}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
                        <h3 className="text-lg font-semibold mb-2">No items available</h3>
                        <p className="text-foreground/60 mb-4">Be the first to list an item for swap!</p>
                        <Link to="/add-item">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            List an Item
                          </Button>
                        </Link>
                      </div>
                    )}
                    <div className="mt-6 text-center">
                      <Link to="/browse">
                        <Button variant="outline" className="border-rewear-green text-rewear-green hover:bg-rewear-green hover:text-white">
                          <Search className="w-4 h-4 mr-2" />
                          View All Items
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;