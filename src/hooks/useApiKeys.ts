
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openai: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKeys = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would get the keys from Supabase edge functions
        // For now, we simulate fetching the keys from local storage (not recommended in production)
        const geminiKey = localStorage.getItem('gemini_api_key');
        const openaiKey = localStorage.getItem('openai_api_key');
        
        setApiKeys({
          gemini: geminiKey || '',
          openai: openaiKey || ''
        });
      } catch (error) {
        console.error('Error fetching API keys:', error);
        toast({
          title: "Error fetching API keys",
          description: "Please set your API keys in account settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const setGeminiApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKeys(prev => ({ ...prev, gemini: key }));
  };

  const setOpenAIApiKey = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKeys(prev => ({ ...prev, openai: key }));
  };

  return {
    apiKeys,
    isLoading,
    setGeminiApiKey,
    setOpenAIApiKey,
    hasAllKeys: !!apiKeys.gemini && !!apiKeys.openai
  };
};
