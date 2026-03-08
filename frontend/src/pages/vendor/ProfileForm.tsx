import { useState, useEffect } from 'react';
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
import { ArrowLeft, Upload, X, Plus, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from "@tanstack/react-query";
import { getVendorShops } from "@/data/shopData";
import { uploadImage } from '@/lib/utils';
import { updateShopInfo } from "@/data/shopData";

const ProfileForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false)

  const { data: shopData } = useQuery({
    queryKey: ['store', 'index', JSON.parse(localStorage.getItem('user')).id],
    queryFn: async () => {
      const {data} = await getVendorShops(JSON.parse(localStorage.getItem('user')).id)
      return data.data[0]
    }
  });

  const [formData, setFormData] = useState({
    name: shopData?.name,
    banner: shopData?.banner,
    logo: shopData?.logo,
    address: shopData?.address
  })

  useEffect(() => {
    if (shopData) {
      setFormData({
        name: shopData.name || '',
        banner: shopData.banner || '',
        logo: shopData.logo || '',
        address: shopData.address || '',
      })
    }
  }, [shopData])

  const [banner, setBanner] = useState<string[]>(shopData?.banner || []);
  const [logo, setLogo] = useState<string[]>(shopData?.logo || []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type) => {
    const files = e.target.files;
    if (!files) {
      toast({
        title: "Error",
        description: "Please select at least one file",
        variant: "destructive",
      });

      return 
    }

    try {
      const url = await uploadImage(files[0]);

      if (!url){
        throw new Error("An error ocurred in the image upload function")
      }

      switch (type){
        case "banner":
          setFormData({...formData, banner: url})
        case "logo":
          setFormData({...formData, logo: url})
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      toast({
        title: "Error",
        description: "An error occured during image upload. Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    setLoading(true)

    const {status} = await updateShopInfo(formData)

    if (!status){
      toast({
        title: "Error",
        description: `An error ocurred whil updating store information. Please try again`,
        variant: "destructive"
      });
      setLoading(false)
      return
    }

    toast({
      title: "Success",
      description: `Store Information updated successfully`,
    });
    
    setLoading(false)
    navigate('/vendor/shop-profile');
  };

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
                  <p className="text-xs text-muted-foreground">
                    Banner
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.banner &&
                      <>
                        <div className="relative aspect-square border overflow-hidden group">
                          <img src={formData.banner} alt={`${formData.name} Banner`} className="w-full h-full object-cover" />
                          {/* <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="h-4 w-4" />
                          </button> */}
                        </div>
                      </>
                    }

                    <label className="aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Banner</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {handleImageUpload(e, "banner")}}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Logo
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.banner &&
                      <>
                        <div className="relative aspect-square rounded-lg border overflow-hidden group">
                          <img src={formData.logo} alt={`${formData.name} Banner`} className="w-full h-full object-cover" />
                          {/* <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="h-4 w-4" />
                          </button> */}
                        </div>
                      </>
                    }

                    <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload Logo</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {handleImageUpload(e, "logo")}}
                        className="hidden"
                      />
                    </label>          
                  </div>
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

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
              <Button type="submit" className="w-[4em]">
                {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
};

export default ProfileForm;
