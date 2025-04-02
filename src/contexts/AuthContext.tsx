
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '../components/ui/use-toast';

// Define the User type
export type User = {
  id: string;
  email: string;
  subscription: 'free' | 'lite' | 'pro';
  analysesCount: number;
  analysesLimit: number;
};

// Define the context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock user for development until Supabase is integrated
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      subscription: 'free',
      analysesCount: 0,
      analysesLimit: 5,
    };

    // Simulate loading delay
    const timer = setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Authentication functions (will be replaced with Supabase)
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Will implement Supabase auth here
      const mockUser: User = {
        id: '1',
        email,
        subscription: 'free',
        analysesCount: 0,
        analysesLimit: 5,
      };
      setUser(mockUser);
      toast({
        title: "Success",
        description: "You have successfully signed in",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Will implement Supabase auth here
      const mockUser: User = {
        id: '1',
        email,
        subscription: 'free',
        analysesCount: 0,
        analysesLimit: 5,
      };
      setUser(mockUser);
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Error",
        description: "Failed to create an account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Will implement Supabase auth here
      setUser(null);
      toast({
        title: "Success",
        description: "You have been logged out",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Will implement Supabase password reset
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a password reset link",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
