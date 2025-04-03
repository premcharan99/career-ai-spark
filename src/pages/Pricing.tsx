
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  return (
    <PageLayout>
      <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Premium features coming soon! For now, enjoy our free plan with 15 analyses per day.
          </p>
          
          <div className="mt-10">
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Premium Features Coming Soon</DialogTitle>
            <DialogDescription className="text-center">
              We're currently developing our premium features. For now, all users can enjoy up to 15 analyses per day for free!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => { 
              setIsDialogOpen(false);
              navigate('/dashboard');
            }}>
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Pricing;
