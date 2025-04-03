
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Update the user profile to reflect the subscription change
    updateProfile();
  }, [updateProfile]);

  return (
    <PageLayout>
      <div className="max-w-md mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Your subscription has been successfully upgraded. You now have access to all the features included in your new plan.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/account')}>
              View Account
            </Button>
            <Button variant="outline" onClick={() => navigate('/analysis')}>
              Start Analyzing
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PaymentSuccess;
