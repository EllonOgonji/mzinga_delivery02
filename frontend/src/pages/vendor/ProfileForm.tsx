import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VendorLayout } from '@/components/vendor/VendorLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mockData';

const ProfileForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === 'new';
  
  // Get existing product data if editing
  const existingProduct = !isNew ? mockProducts.find(p => p.id === parseInt(id || '0')) : null;

  const [images, setImages] = useState<string[]>(existingProduct?.images || []);
  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    category: existingProduct?.category || '',
    description: existingProduct?.description || '',
    price: existingProduct?.price?.toString() || '',
    compareAtPrice: existingProduct?.compareAtPrice?.toString() || '',
    stock: existingProduct?.stock?.toString() || '',
    sku: '',
    trackQuantity: true,
    status: (existingProduct?.status || 'active') as 'active' | 'inactive',
  });

  const [dietary, setDietary] = useState({
    vegan: false,
    vegetarian: false,
    halal: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In real app, upload to server and get URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: `Product ${isNew ? 'created' : 'updated'} successfully`,
    });
    
    navigate('/vendor/products');
  };

  const discountPercent = formData.compareAtPrice && formData.price 
    ? Math.round((1 - parseFloat(formData.price) / parseFloat(formData.compareAtPrice)) * 100)
    : 0;

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/vendor/shop-profile')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                Update Shop Profile
              </h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Images */}
            <Card>
                <CardHeader>
                <CardTitle>Shop Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                        <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
                            Banner Image
                        </div>
                        )}
                        <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                        <X className="h-4 w-4" />
                        </button>
                    </div>
                    ))}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload</span>
                        <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        />
                    </label>              
                </div>
                <p className="text-xs text-muted-foreground">
                    
                </p>
                </CardContent>
            </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shop Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Shop Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Fresh Organic Apples"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length} characters (minimum 20)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Shop Location</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Lurambi Junction"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Engine Optimization</CardTitle>
                  <CardDescription>
                    Improve how this product appears in search results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      placeholder={formData.name || 'Product name will appear here'}
                      defaultValue={formData.name}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDesc">Meta Description</Label>
                    <Textarea
                      id="metaDesc"
                      placeholder="Brief description for search engines..."
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground">0 / 160 characters</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Shop Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Shop Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value="active"
                    onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          Active
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.status === 'active' 
                      ? 'This shop will be visible to customers'
                      : 'This shop will not be visible to customers'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Preview */}
              {formData.name && formData.price && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>How customers will see this product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      {images[0] && (
                        <div className="aspect-square bg-muted">
                          <img src={images[0]} alt={formData.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold line-clamp-2">{formData.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary">
                            ${formData.price}
                          </span>
                          {formData.compareAtPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${formData.compareAtPrice}
                            </span>
                          )}
                        </div>
                        {discountPercent > 0 && (
                          <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded w-fit">
                            {discountPercent}% OFF
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons - Sticky Footer */}
          <div className="sticky bottom-0 bg-background border-t mt-6 -mx-6 px-6 py-4 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vendor/shop-profile')}
            >
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button type="submit">
                {isNew ? 'Create Product' : 'Update Product'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
};

export default ProfileForm;
