import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader, Eye, EyeOff } from 'lucide-react';

const Reset = () => {
    const {token} = useParams()
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        token: token,
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const preventCopyPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
    };

    const handleSubmit = (e: React.FormEvent) => {
        setLoading(true);

        e.preventDefault();

        if (formData.password != formData.password_confirmation) {
            toast({
                title: "Error",
                description: "Ensure your passwords match",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        
        fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/reset_password`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Reset failed');
            }

            return response.json();
        }).then((res) => {
            toast({
                title: "Success!",
                description: `Your password has been reset successfully`,
            });

            navigate('/') 
            
        }).catch((error) => {
            toast({
                title: "Error",
                description: "An issue occured durng reset. Please try again",
                variant: "destructive",
            });
            setLoading(false);
            return;
        })
    };

    return (
        <div className="h-[100vh] w-full flex flex-col justify-center items-center">
            <div className='w-80 md:w-96'>
                <h1 className='text-center font-bold mb-4 text-lg'>Password Reset</h1>
                <form onSubmit={handleSubmit} className='w-full'>
                    {/* Basic Information */}
                    <Card className='flex flex-col items-center pt-8'>
                        <CardContent className="space-y-4 w-full text-left">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className={`${(formData.password != formData.password_confirmation) && "text-red-600"}`}>Password Confirmation</Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        onCopy={preventCopyPaste}
                                        onPaste={preventCopyPaste}
                                        onCut={preventCopyPaste}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className='w-full'
                            >
                                {loading ? <Loader className="animate-spin h-5 w-5 mr-3" /> : 'Reset'}
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

export default Reset;
