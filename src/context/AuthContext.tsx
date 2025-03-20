
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, gender: 'male' | 'female' | 'other') => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: playerData, error: playerError } = await supabase
            .from('players')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (playerError) {
            console.error('Error fetching player data:', playerError);
            setUser(null);
          } else {
            setUser({
              id: playerData.id,
              email: playerData.email,
              name: playerData.name,
              gender: playerData.gender as 'male' | 'female' | 'other',
              isAdmin: playerData.is_admin
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: playerData, error: playerError } = await supabase
          .from('players')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (playerError) {
          console.error('Error fetching player data:', playerError);
          setUser(null);
        } else {
          setUser({
            id: playerData.id,
            email: playerData.email,
            name: playerData.name,
            gender: playerData.gender as 'male' | 'female' | 'other',
            isAdmin: playerData.is_admin
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success('Login bem-sucedido');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, gender: 'male' | 'female' | 'other') => {
    try {
      setLoading(true);
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            gender
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Create player record
        const { error: playerError } = await supabase
          .from('players')
          .insert([
            { 
              id: authData.user.id,
              email,
              name,
              gender
            }
          ]);
          
        if (playerError) throw playerError;
      }
      
      toast.success('Conta criada com sucesso');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Você saiu com sucesso');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao sair');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
