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
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        role: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent, asDraft = false) => {
        e.preventDefault();

        // Validation
        if (!formData.role) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
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
        }).then((res) => {
            console.log(res)

            toast({
                title: "Success!",
                description: `Successfully registered as ${res.data.user.role}.`,
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            res.data.user.role == 'customer' ? navigate('/') : navigate('/vendor/dashboard');
        }).catch((error) => {
            console.log(error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            return;
        })

        // Validate then redirect
        // navigate('/vendor/products');
    };

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
                                    placeholder="e.g., +1234567890"
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
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value, password_confirmation: e.target.value })}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className='w-full'
                            >
                                Sign Up
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
