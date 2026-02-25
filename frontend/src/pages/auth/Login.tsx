import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loginType, setLoginType] = useState('customer')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent, asDraft = false) => {
        setLoading(true);

        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        
        fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            return response.json();
        }).then((res) => {
            toast({
                title: "Success!",
                description: `Successfully logged in as ${res.data.user.role}.`,
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if(res.data.user.role == loginType){
                res.data.user.role == 'customer' ? navigate('/') : res.data.user.role == 'vendor' ? navigate('/vendor/dashboard'):navigate('/auth/login');
            }else{
                if(res.data.user.role == 'admin'){
                    navigate('/admin')
                    setLoading(false);
                    return;
                }

                toast({
                    title: "Error",
                    description: `You are trying to login as a ${loginType} but your account is registered as a ${res.data.user.role}.`,
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }
            
        }).catch((error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            setLoading(false);
            return;
        })
    };

    return (
        <div className="h-[100vh] w-full flex flex-col justify-center items-center">
            <div className='w-96'>
                <div className='grid grid-cols-2 w-full'>
                    <Button variant={loginType === 'vendor' ? 'active' : 'ghost'} onClick={() => setLoginType('vendor')} className='col-span-1 border-none'>Vendor Login</Button>
                    <Button variant={loginType === 'customer' ? 'active' : 'ghost'} onClick={() => setLoginType('customer')} className='col-span-1 border-none'>Customer Login</Button>
                </div>

                <form onSubmit={handleSubmit} className='w-full'>
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
                                {loading ? <Loader className="animate-spin h-5 w-5 mr-3" /> : 'Login'}
                            </Button>
                        </CardContent>
                        <CardFooter className='text-sm text-muted-foreground justify-center'>
                            <span>Don't have an account? </span>
                            <Button variant='link' className='p-0 ml-1' onClick={() => navigate('/auth/register')}>Register here</Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default Login;
