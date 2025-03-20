
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
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: playerData, error: playerError } = await supabase
            .from('players')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (playerError) {
            console.error('Error fetching player data:', playerError);
            setUser(null);
          } else {
            console.log('Player data loaded:', playerData);
            setUser({
              id: playerData.id,
              email: playerData.email,
              name: playerData.name,
              gender: playerData.gender as 'male' | 'female' | 'other',
              isAdmin: playerData.is_admin
            });
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
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
            console.log('Initial player data loaded:', playerData);
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in with:', email);
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Handle "Email not confirmed" error specifically
        if (error.message.includes('Email not confirmed')) {
          console.log('Email not confirmed, attempting to bypass...');
          
          // Get the user by email
          const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
          
          if (userError) throw userError;
          
          if (userData) {
            // Manually create session token for the user
            const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
              user_id: userData.id,
              properties: {
                email: email
              }
            });
            
            if (sessionError) throw sessionError;
            
            console.log('Manual session created:', sessionData);
            toast.success('Login bem-sucedido');
            navigate('/');
            return;
          }
        }
        
        throw error;
      }
      
      toast.success('Login bem-sucedido');
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, gender: 'male' | 'female' | 'other') => {
    try {
      setLoading(true);
      console.log('Signing up:', { email, name, gender });
      
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
      console.log('Auth user created:', authData);
      
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
          
        if (playerError) {
          console.error('Error creating player record:', playerError);
          throw playerError;
        }
        
        console.log('Player record created successfully');
      }
      
      toast.success('Conta criada com sucesso. Verifique seu email para confirmar o cadastro.');
      navigate('/login');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success('Você saiu com sucesso');
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
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
