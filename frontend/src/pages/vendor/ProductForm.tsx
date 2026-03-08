import { useEffect, useState } from 'react';
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
import { useQuery } from "@tanstack/react-query";
import { getVendorShops } from "@/data/shopData";
import { addProduct, getSingleProduct, updateProduct } from '@/data/productData';
import { uploadImage } from '@/lib/utils';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === 'new';

  const { data: shopData = {} } = useQuery({
    queryKey: ['store', 'index', JSON.parse(localStorage.getItem('user')).id],
    queryFn: async() => {
      const {data} = await getVendorShops(JSON.parse(localStorage.getItem('user')).id)
      return data.data[0]
    }
  });

  const { data: existingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getSingleProduct(Number(id)),
    enabled: !isNew
  });

  useEffect(() => {
    if (shopData?.id) {
      setFormData(prev => ({
        ...prev,
        store_id: shopData.id
      }));
    }

    if (existingProduct) {
      setSpecificationKeys(Object.keys(existingProduct.specifications))
      setSpecificationValues(Object.values(existingProduct.specifications))
      setFormData({
        store_id: existingProduct.store.id,
        name: existingProduct.name,
        description: existingProduct.description,
        price: existingProduct.price,
        compare_at_price: existingProduct.compare_at_price,
        stock: existingProduct.stock,
        image_url: existingProduct.image_url,
        category: existingProduct.category,
        status: existingProduct.status,
        specifications: existingProduct.specifications
      });
    }
  }, [shopData?.id, existingProduct]);

  const [formData, setFormData] = useState({
    store_id: shopData?.id,
    name: existingProduct?.name || "",
    description: existingProduct?.description || "",
    price: existingProduct?.price || 0,
    compare_at_price: existingProduct?.compare_at_price || 0,
    stock: existingProduct?.stock || 0,
    image_url: existingProduct?.image_url || "https://imgs.search.brave.com/fIIKBiOnACoNHRZZXHWhUDSA32lMdoNl73aLuVUVScA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/bGlxdW9yc2hhY2su/Y28ua2Uvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDMvS2Vu/eWEtQ2FuZS1TbW9v/dGgtUnVtLTI1MG1s/LmpwZw",
    category: existingProduct?.category || "",
    status: existingProduct?.status || "active",
    specifications: existingProduct?.specifications || {}
  });

  const [specificationKeys, setSpecificationKeys] = useState<string[]>(Object.keys(existingProduct?.specifications || {}));
  const [specificationValues, setSpecificationValues] = useState<string[]>(Object.values(existingProduct?.specifications || {}));
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  const addProductSpecification = () => {
    if (newSpecKey.trim() === "" || newSpecValue.trim() === "") {
      toast({
        title: "Error",
        description: "Specification title and description cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setSpecificationKeys([...specificationKeys, newSpecKey]);
    setSpecificationValues([...specificationValues, newSpecValue]);
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [newSpecKey]: newSpecValue
      }
    });
    setNewSpecKey("");
    setNewSpecValue("");
  }

  const [dietary, setDietary] = useState({
    vegan: false,
    vegetarian: false,
    halal: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
  });

  const [images, setImages] = useState([])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      try {
        const url = await uploadImage(files[0]);

        console.log('Uploaded image URL:', url);

        setImages([...images, url]);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let res

    console.log({...formData, image_url: JSON.stringify(images)})

    if (!isNew){
      res = await updateProduct(Number(id), {...formData, image_url: JSON.stringify(images)})
    }else{
      res = await addProduct({...formData, image_url: JSON.stringify(images)}) 
    }

    if (!res.status){
      toast({
        title: "Error",
        description: res.error || "An error occurred",
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

  const discountPercent = formData.compare_at_price && formData.price 
    ? Math.round((1 - Number(formData.price) / Number(formData.compare_at_price) * 100))
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
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>
                    
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.length > 1 ?
                      <>
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
                      </>
                    :  
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
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1000x1000px, max 2MB per image
                  </p>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
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
                        <SelectItem value="Alcohol">Alcohol</SelectItem>
                        <SelectItem value="Beverages">Beverages</SelectItem>                        
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

                  <div className="space-y-2">
                    <Label htmlFor="name">Stock *</Label>
                    <Input
                      id="stock"
                      type='number'
                      placeholder=""
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value)})}
                      required
                    />
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
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">KES. </span>
                        <Input
                          id="price"
                          type="number"
                          step="1"
                          placeholder="1"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="pl-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="compareAtPrice">Compare at Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">KES. </span>
                        <Input
                          id="compareAtPrice"
                          type="number"
                          step="1"
                          placeholder="1"
                          value={formData.compare_at_price}
                          onChange={(e) => setFormData({ ...formData, compare_at_price: Number(e.target.value)})}
                          className="pl-12"
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

              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Label >Title</Label>
                      <Label >Description</Label>
                    </div>
                    {specificationKeys.map((key, index) =>  (
                      <div className="grid gap-4 sm:grid-cols-3" key={index}>
                        <div className="space-y-2">
                          <div className="relative">
                            <Input
                              id="keyTitle"
                              type="text"
                              step="1"
                              placeholder="1"
                              value={specificationKeys[index]}
                              onChange={(e) => {
                                const newKeys = [...specificationKeys];
                                newKeys[index] = e.target.value;
                                setSpecificationKeys(newKeys);
                              }}                              
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="relative">
                            <Input
                              id="keyDescription"
                              type="text"
                              step="1"
                              placeholder="1"
                              value={specificationValues[index]}
                              onChange={(e) => {
                                const newValues = [...specificationValues];
                                newValues[index] = e.target.value;
                                setSpecificationValues(newValues);
                              }}                              
                            />
                          </div>
                        </div>
                      </div>))
                    }

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">                        
                          <Input
                            id="keyTitle"
                            type="text"   
                            placeholder='New spec title'     
                            value={newSpecKey}                    
                            onChange={(e) => {
                              setNewSpecKey(e.target.value);
                            }}
                          />
                      </div>

                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            id="keyDescription"
                            type="text"  
                            placeholder='New spec description'     
                            value={newSpecValue}                          
                            onChange={(e) => {
                              setNewSpecValue(e.target.value);  
                            }}
                          />
                        </div>
                      </div>

                      <Button onClick={(e) => {
                        e.preventDefault();
                        addProductSpecification();
                      }}><Plus></Plus>
                      </Button>
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

              {/* SEO */}
              {/* <Card>
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
              </Card> */}
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

              {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border overflow-hidden">
                      {images[0] && (
                        <div className="aspect-square bg-muted">
                          <img src={images[0]} alt={formData.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold line-clamp-2">{formData.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary">
                            KES. {formData.price}
                          </span>
                          {formData.compare_at_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              KES. {formData.compare_at_price}
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
