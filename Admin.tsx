import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { itemsAPI, usersAPI } from "@/services/api";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Trash2,
  ArrowLeft,
  Users,
  Package,
  Flag,
  TrendingUp,
  Settings,
  LogOut
} from "lucide-react";

interface PendingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadedBy: string;
  userAvatar: string;
  uploadDate: string;
  image: string;
  points: number;
  status: "pending" | "approved" | "rejected";
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  status: "active" | "suspended" | "banned";
  totalSwaps: number;
  rating: number;
  reportedCount: number;
}

const Admin = () => {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/login');
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
    }
  }, [user, isAdmin, navigate, toast]);

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      const [pendingRes, usersRes, statsRes] = await Promise.all([
        itemsAPI.getPending(),
        usersAPI.getAllUsers({ limit: 20 }),
        usersAPI.getDashboard()
      ]);

      setPendingItems(pendingRes.data.items.map((item: any) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        category: item.category,
        uploadedBy: item.uploader?.name || 'Unknown',
        userAvatar: item.uploader?.avatar || '',
        uploadDate: new Date(item.createdAt).toLocaleDateString(),
        image: Array.isArray(item.images) ? (item.images[0] || "/src/assets/placeholder.svg") : "/src/assets/placeholder.svg",
        points: (item.views || 0) * 10,
        status: item.status
      })));

      setUsers(usersRes.data.users.map((user: any) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        status: user.isBanned ? "banned" : "active",
        totalSwaps: user.stats?.successfulSwaps || 0,
        rating: 4.5, // Mock rating
        reportedCount: 0 // Mock reported count
      })));

      setDashboardStats(statsRes.data.stats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin()) {
      fetchAdminData();
    }
  }, [user]);

  // Fix approve/reject to use correct statuses
  const approveItem = async (itemId: string) => {
    try {
      await itemsAPI.updateStatus(itemId, "approved");
      setPendingItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Success",
        description: "Item approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve item",
        variant: "destructive",
      });
    }
  };

  const rejectItem = async (itemId: string) => {
    try {
      await itemsAPI.updateStatus(itemId, "rejected");
      setPendingItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Success",
        description: "Item rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject item",
        variant: "destructive",
      });
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      await usersAPI.banUser(userId, true, "Suspended by admin");
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: "suspended" } : user
      ));
      toast({
        title: "Success",
        description: "User suspended successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend user",
        variant: "destructive",
      });
    }
  };

  const banUser = async (userId: string) => {
    try {
      await usersAPI.banUser(userId, true, "Banned by admin");
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: "banned" } : user
      ));
      toast({
        title: "Success",
        description: "User banned successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      case "banned": return "bg-red-100 text-red-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Fix logout to redirect
  const handleLogout = () => {
    logout();
    navigate('/login');
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
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-rewear-green" />
                <h1 className="text-2xl font-bold">Admin Panel</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-rewear-green-light text-rewear-green">
                Admin Access
              </Badge>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-background/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Pending Items</p>
                  <p className="text-2xl font-bold">{dashboardStats?.pendingItems || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Total Users</p>
                  <p className="text-2xl font-bold">{dashboardStats?.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Total Items</p>
                  <p className="text-2xl font-bold">{dashboardStats?.totalItems || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flag className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Available Items</p>
                  <p className="text-2xl font-bold">{dashboardStats?.availableItems || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">Pending Items</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Pending Item Approvals</h2>
              <Badge variant="outline">
                {pendingItems.filter(item => item.status === "pending").length} items pending
              </Badge>
            </div>

            <div className="space-y-4">
              {pendingItems.map((item) => (
                <Card key={item.id} className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex space-x-6">
                      <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <p className="text-foreground/70 mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-foreground/60">
                            <span>Category: {item.category}</span>
                            <span>Points: {item.points}</span>
                            <span>Uploaded: {new Date(item.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={item.userAvatar} />
                            <AvatarFallback>{item.uploadedBy.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{item.uploadedBy}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        {item.status === "pending" && (
                          <>
                            <Button
                              onClick={() => approveItem(item.id)}
                              className="bg-rewear-green hover:bg-rewear-green/90 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => rejectItem(item.id)}
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="bg-background/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-foreground/60">{user.email}</p>
                          </div>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-foreground/60">
                          <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                          <span>Swaps: {user.totalSwaps}</span>
                          <span>Rating: {user.rating}/5</span>
                          {user.reportedCount > 0 && (
                            <span className="text-red-500">Reports: {user.reportedCount}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {user.status === "active" && (
                          <>
                            <Button
                              onClick={() => suspendUser(user.id)}
                              variant="outline"
                              size="sm"
                              className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                            >
                              Suspend
                            </Button>
                            <Button
                              onClick={() => banUser(user.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                              Ban
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;