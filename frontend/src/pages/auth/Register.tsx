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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, X, Plus, Loader, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mockData';

type Response = {
    success: boolean,
    data?: any,
    message?: string
}

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        role: '',
        password: '',
        password_confirmation: '',
    });

    const preventCopyPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
    };

    const handleSubmit = (e: React.FormEvent, asDraft = false) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.role) {
            toast({
                title: "Error",
                description: "Please select a role",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Error",
                description: "Please enter a valid email address",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        // Validate phone number format (254XXXXXXXXX)
        const phoneRegex = /^254\d{9}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            toast({
                title: "Error",
                description: "Phone number must be in the format 254XXXXXXXXX (e.g., 254712345678)",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({user: formData}),
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Response not okay", errorData);
                throw new Error(errorData.message || 'Registration failed');
            }

            return response.json();
        }).then(async (res) => {
            console.log(res)

            toast({
                title: "Success!",
                description: `Successfully registered as ${res.data.user.role}.`,
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'vendor') {
                const response = await createVendorStore(res.data.token);
                if (!response.success) {
                    toast({
                        title: "Error",
                        description: `Vendor store creation failed: ${response.message}`,
                        variant: "destructive",
                    });
                    console.log("Vendor store creation failed");
                    setLoading(false);
                    return;
                }
                navigate('/vendor/dashboard')
            }else{
                navigate('/')
            }
        }).catch((error) => {
            console.log(error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            setLoading(false);
            return;
        })

        // Validate then redirect
        // navigate('/vendor/products');
    };

    const createVendorStore = async (token): Promise<Response> => {
        return fetch(`${import.meta.env.VITE_BASE_URL}/api/vendor/stores`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(
               {
                    
                    "store": {
                    "name": formData.full_name + "'s Store",
                    "address": "Lurambi",
                    "latitude": -1.286389,
                    "longitude": 36.817223,
                    "category": "Liquor Store",
                    "logo": "https://imgs.search.brave.com/cHGH-sr8bodhPwBN8sLr2WN-5hpfY8GV6sDEtGdZMGE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9iYW5u/ZXItbGlxdW9yLXN0/b3JlLWdyYXBlcy1j/cm93bi12ZWN0b3It/YmFkZ2UtbGFiZWwt/aGFuZC1kcmF3bi1i/dW5jaGVzLWluc2Ny/aXB0aW9ucy1yZXRy/by1zdHlsZS1vdmFs/LWZyYW1lLTIwOTYy/ODQ5MC5qcGc",
                    "banner": "https://imgs.search.brave.com/nBH4o-TzIGoyMZwITrUSXHau877WmIWtlP2QQCtX-PQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RmLzJk/L2ZmL2RmMmRmZmY4/ODlmYzE4MWY3MmY3/NzQ1YTUyOGMyZjVk/LmpwZw"
                    }
                }
            ),
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Store creation response not okay", errorData);
                throw new Error(errorData.message || 'Store creation failed');
            }

            return response.json();
        }).then((data) => {
            return {
                success: true,
                data: data
            }
        }).catch((error) => {
           return {
                success: false,
                message: error.message
            }
        })
    }

    return (
        <div className="h-[100vh] w-full flex flex-col justify-center items-center">
            <div className='w-96'>
                <form onSubmit={handleSubmit} className='w-full'>
                    {/* Basic Information */}
                    <Card className='flex flex-col items-center pt-8'>
                        <CardContent className="space-y-4 w-full text-left">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full name *</Label>
                                <Input
                                    id="full_name"
                                    placeholder="e.g., John Doe"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    placeholder="e.g., user@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number *</Label>
                                <Input
                                    id="phone_number"
                                    placeholder="e.g., 254712345678"
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Role *</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vendor">Vendor</SelectItem>
                                        <SelectItem value="customer">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value, password_confirmation: e.target.value })}
                                        onCopy={preventCopyPaste}
                                        onPaste={preventCopyPaste}
                                        onCut={preventCopyPaste}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className='w-full'
                            >
                                {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Sign Up'}
                            </Button>
                        </CardContent>
                        <CardFooter className='text-sm text-muted-foreground justify-center'>
                            <span>Already have an account? </span>
                            <Button variant='link' className='p-0 ml-1' onClick={() => navigate('/auth/login')}>Login here</Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default Login;
