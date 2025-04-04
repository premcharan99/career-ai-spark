
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState({
    openai: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKeys = async () => {
      setIsLoading(true);
      try {
        // We don't actually store API keys in the frontend
        // The API keys are stored in Supabase Edge Function secrets
        setApiKeys({
          openai: 'API Key stored securely on server'
        });
      } catch (error) {
        console.error('Error fetching API keys:', error);
        toast({
          title: "Error fetching API keys",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const setOpenAIApiKey = (key: string) => {
    toast({
      title: "API Key Management",
      description: "API keys are managed on the server for security reasons.",
      variant: "default",
    });
  };

  return {
    apiKeys,
    isLoading,
    setOpenAIApiKey,
    hasAllKeys: true // We're assuming keys are managed on the server side
  };
};
