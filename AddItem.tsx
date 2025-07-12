import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { itemsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Leaf,
  Camera,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface FormData {
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  brand: string;
  material: string;
  color: string;
  location: string;
  estimatedValue: number;
  tags: string[];
}

const AddItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    brand: "",
    material: "",
    color: "",
    location: "",
    estimatedValue: 0,
    tags: []
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData & { images: string }>>({});

  const categories = [
    "tops", "bottoms", "dresses", "outerwear", "shoes", "accessories", "other"
  ];

  const sizes = [
    "XS", "S", "M", "L", "XL", "XXL", "One Size", "Other"
  ];

  const conditions = [
    "new", "like-new", "good", "fair", "poor"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (images.length + validFiles.length > 6) {
      toast({
        title: "Too many images",
        description: "Maximum 6 images allowed",
        variant: "destructive"
      });
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Clear image error if exists
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData & { images: string }> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.size) newErrors.size = "Size is required";
    if (!formData.condition) newErrors.condition = "Condition is required";
    if (!formData.color.trim()) newErrors.color = "Color is required";
    if (images.length === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to list an item",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert images to base64 strings for now (in production, use proper file upload)
      const imageUrls = await Promise.all(
        images.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      const itemData = {
        ...formData,
        images: imageUrls,
        estimatedValue: formData.estimatedValue || 0
      };

      const response = await itemsAPI.create(itemData);
      
      toast({
        title: "Item listed successfully!",
        description: "Your item is pending approval and will be visible soon.",
      });

      // Navigate to the user's dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error creating item:', error);
      toast({
        title: "Error creating item",
        description: error.response?.data?.error || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
              <h1 className="text-2xl font-bold">List an Item</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-rewear-green" />
              <span className="text-sm text-foreground/60">Sustainable Fashion</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                  <CardDescription>
                    Tell us about your item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Item Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Vintage Denim Jacket"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.category}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="size">Size *</Label>
                      <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                        <SelectTrigger className={errors.size ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.size && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.size}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                        <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map(condition => (
                            <SelectItem key={condition} value={condition}>
                              {condition.charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.condition && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.condition}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
                      <Input
                        id="estimatedValue"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.estimatedValue}
                        onChange={(e) => handleInputChange('estimatedValue', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        placeholder="e.g., Levi's, Nike"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        placeholder="e.g., 100% Cotton"
                        value={formData.material}
                        onChange={(e) => handleInputChange('material', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Color *</Label>
                      <Input
                        id="color"
                        placeholder="e.g., Blue, Black"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className={errors.color ? 'border-red-500' : ''}
                      />
                      {errors.color && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.color}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., New York, NY"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          id="tags"
                          placeholder="Add a tag (e.g., vintage, sustainable)"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} disabled={!newTag.trim() || formData.tags.length >= 5}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-rewear-green-light text-rewear-green">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-foreground/60">
                        {formData.tags.length}/5 tags • Press Enter to add
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Image Upload */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="w-5 h-5" />
                    <span>Photos</span>
                  </CardTitle>
                  <CardDescription>
                    Upload up to 6 images
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-rewear-green/50 transition-colors relative">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-foreground/40" />
                    <p className="text-sm text-foreground/60 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-foreground/40">
                      PNG, JPG up to 5MB each
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.images && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.images}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card className="bg-background/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Listing Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-rewear-green mt-0.5" />
                    <p className="text-sm text-foreground/70">
                      Ensure your item is clean and in good condition
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-rewear-green mt-0.5" />
                    <p className="text-sm text-foreground/70">
                      Take clear, well-lit photos from multiple angles
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-rewear-green mt-0.5" />
                    <p className="text-sm text-foreground/70">
                      Be honest about any flaws or damage
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-rewear-green mt-0.5" />
                    <p className="text-sm text-foreground/70">
                      Set fair values based on condition and demand
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rewear-green to-rewear-coral hover:from-rewear-green/90 hover:to-rewear-coral/90 text-white py-6 text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Listing Item...
                  </div>
                ) : (
                  <>
                    <Leaf className="w-5 h-5 mr-2" />
                    List Item
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;