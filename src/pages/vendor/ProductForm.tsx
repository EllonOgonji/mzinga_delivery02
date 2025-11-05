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

const ProductForm = () => {
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
    preparationTime: existingProduct?.preparationTime?.toString() || '',
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
              onClick={() => navigate('/vendor/products')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isNew ? 'Add New Product' : 'Edit Product'}
              </h1>
              <p className="text-muted-foreground">
                {isNew ? 'Create a new product for your shop' : 'Update product information'}
              </p>
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
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Add up to 10 images. First image will be the primary image.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                        <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
                            Primary
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
                    {images.length < 10 && (
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
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1000x1000px, max 2MB per image
                  </p>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Fresh Organic Apples"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fast Food">Fast Food</SelectItem>
                        <SelectItem value="Groceries">Groceries</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Beauty & Personal Care">Beauty & Personal Care</SelectItem>
                        <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
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
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="pl-7"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="compareAtPrice">Compare at Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="compareAtPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.compareAtPrice}
                          onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>

                  {discountPercent > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        Discount: {discountPercent}% off
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Track Quantity</Label>
                      <p className="text-sm text-muted-foreground">
                        Manage stock levels for this product
                      </p>
                    </div>
                    <Switch
                      checked={formData.trackQuantity}
                      onCheckedChange={(checked) => setFormData({ ...formData, trackQuantity: checked })}
                    />
                  </div>

                  {formData.trackQuantity && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="stock">Stock Quantity *</Label>
                          <Input
                            id="stock"
                            type="number"
                            placeholder="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sku">SKU</Label>
                          <Input
                            id="sku"
                            placeholder="ABC-12345"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Category-Specific Fields */}
              {(formData.category === 'Fast Food' || formData.category === 'Groceries') && (
                <Card>
                  <CardHeader>
                    <CardTitle>Food Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="prepTime">Preparation Time (minutes)</Label>
                      <Input
                        id="prepTime"
                        type="number"
                        placeholder="30"
                        value={formData.preparationTime}
                        onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Dietary Information</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(dietary).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={value}
                              onCheckedChange={(checked) => 
                                setDietary({ ...dietary, [key]: checked as boolean })
                              }
                            />
                            <Label htmlFor={key} className="font-normal cursor-pointer">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
              {/* Product Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.status}
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
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-gray-500" />
                          Inactive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.status === 'active' 
                      ? 'This product will be visible to customers'
                      : 'This product will not be visible to customers'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Product Organization */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Featured Product</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="featured" />
                      <Label htmlFor="featured" className="font-normal cursor-pointer">
                        Show on shop homepage
                      </Label>
                    </div>
                  </div>
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
              onClick={() => navigate('/vendor/products')}
            >
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, true)}
              >
                Save as Draft
              </Button>
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

export default ProductForm;
