import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loginType, setLoginType] = useState('customer')
    const [formData, setFormData] = useState({
        email: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent, asDraft = false) => {
        setLoading(true);

        e.preventDefault();

        
        fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/forgot_password`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error('Sending mail failed');
            }

            return response.json();
        }).then((res) => {
            toast({
                title: "Success!",
                description: `An email with a reset link has been sent to you`,
            });

            navigate('/') 

        }).catch((error) => {
            toast({
                title: "Error",
                description: "There was an issue sending your email. Please try again",
                variant: "destructive",
            });
            setLoading(false);
            return;
        })
    };

    return (
        <div className="h-[100vh] w-full flex flex-col justify-center items-center">
            <div className='w-80 md:w-96'>
                <h1 className='text-center font-bold mb-4 text-lg'>Forgot Password</h1>
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

                            <Button
                                type="submit"
                                className='w-full'
                            >
                                {loading ? <Loader className="animate-spin h-5 w-5 mr-3" /> : 'Send Email'}
                            </Button>
                        </CardContent>
                        <CardFooter className='text-sm text-muted-foreground justify-center flex flex-col'>
                           <div>
                                <span>Back to </span>
                                <Button variant='link' className='p-0 ml-1' onClick={() => navigate('/')}>Login</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
