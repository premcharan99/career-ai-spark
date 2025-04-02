
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, CreditCard, LogOut, Save, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="text-gray-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium">{formData.name}</h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Subscription</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Plan</span>
                      <Badge variant={user?.subscription === 'pro' ? 'default' : 'secondary'}>
                        {user?.subscription.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Usage</span>
                        <span>{user?.analysesCount} / {user?.analysesLimit}</span>
                      </div>
                      <Progress value={(user?.analysesCount / user?.analysesLimit) * 100} />
                    </div>
                    {user?.subscription !== 'pro' && (
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate('/pricing')}>
                        Upgrade Plan
                      </Button>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-destructive hover:text-destructive" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          disabled 
                        />
                        <p className="text-xs text-muted-foreground">
                          Your email cannot be changed. Contact support for assistance.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input 
                          id="password" 
                          name="password" 
                          type="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          type="password" 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>Manage your subscription and payment details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Current Subscription</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{user?.subscription.toUpperCase()} Plan</p>
                          <p className="text-sm text-muted-foreground">
                            {user?.subscription === 'free' ? 'Free forever' : 
                             user?.subscription === 'lite' ? '$5.99/month' : '$8.99/month'}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/pricing')}>
                          {user?.subscription === 'free' ? 'Upgrade' : 'Change Plan'}
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {user?.subscription !== 'free' && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Payment Method</h3>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Update
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {user?.subscription !== 'free' && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Billing History</h3>
                          <div className="text-sm">
                            <div className="flex justify-between py-2">
                              <span>Nov 1, 2023</span>
                              <span>${user?.subscription === 'lite' ? '5.99' : '8.99'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span>Oct 1, 2023</span>
                              <span>${user?.subscription === 'lite' ? '5.99' : '8.99'}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    {user?.subscription !== 'free' && (
                      <Button variant="outline" className="text-destructive hover:text-destructive">
                        Cancel Subscription
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Account;
