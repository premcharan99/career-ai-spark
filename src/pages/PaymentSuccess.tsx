
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after a delay
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageLayout>
      <div className="max-w-md mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Redirecting...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You are being redirected to the dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PaymentSuccess;
