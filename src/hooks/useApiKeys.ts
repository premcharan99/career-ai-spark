
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
        // Check if we have local copies (not secure, just for demo)
        const geminiKey = 'AIzaSyCG9gBUjZcBqS4sFiGn2-Mt3rYIu6gjgA0';
        const openaiKey = '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';
        
        setApiKeys({
          gemini: geminiKey || '',
          openai: openaiKey || ''
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
