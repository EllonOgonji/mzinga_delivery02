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
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mockData';

const Login = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isNew = id === 'new';

    const [show, setShow] = useState({
        vendorLogin: true,
        customerLogin: false,
    })

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent, asDraft = false) => {
        e.preventDefault();

        // Validation
        if (!formData.email || !formData.password) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        
        fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({user: formData}),
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            return response.json();
        }).then((data) => {
            toast({
                title: "Success!",
                description: `Successfully logged in as ${data.user.role}.`,
            });
            localStorage.setItem('token', data.user.token);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('user', JSON.stringify(data.user));
            data.user.role == 'customer' ? navigate('/') : navigate('/vendor/dashboard');
        }).catch((error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            return;
        })
    };

    return (
        <div className="h-[100vh] w-full flex flex-col justify-center items-center">
            <div className='w-96'>
                <div className='grid grid-cols-2 w-full'>
                    <Button variant={show.vendorLogin ? 'active' : 'ghost'} onClick={() => setShow({...show, vendorLogin: true, customerLogin: false})} className='col-span-1 border-none'>Vendor Login</Button>
                    <Button variant={show.customerLogin ? 'active' : 'ghost'} onClick={() => setShow({...show, vendorLogin: false, customerLogin: true})} className='col-span-1 border-none'>Customer Login</Button>
                </div>

                {show.vendorLogin && (<form onSubmit={handleSubmit} className='w-full'>
                    {/* Basic Information */}
                    <Card className='flex flex-col items-center pt-8'>
                        <CardContent className="space-y-4 w-full text-left">
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
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className='w-full'
                            >
                                Login
                            </Button>
                        </CardContent>
                        <CardFooter className='text-sm text-muted-foreground justify-center'>
                            <span>Don't have an account? </span>
                            <Button variant='link' className='p-0 ml-1' onClick={() => navigate('/auth/register')}>Register here</Button>
                        </CardFooter>
                    </Card>
                </form>)}

                {show.customerLogin && (<form onSubmit={handleSubmit} className='w-full'>
                    {/* Basic Information */}
                    <Card className='flex flex-col items-center pt-8'>
                        <CardContent className="space-y-4 w-full text-left">
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
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className='w-full'
                            >
                                Login
                            </Button>
                        </CardContent>
                    </Card>
                </form>)}
            </div>
        </div>
    );
};

export default Login;
