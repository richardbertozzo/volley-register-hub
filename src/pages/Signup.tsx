
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { VolleyballIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema
const signupSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  gender: z.enum(['male', 'female', 'other'])
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      gender: 'male'
    }
  });

  const handleSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      await signUp(values.email, values.password, values.name, values.gender);
      toast.success('Conta criada com sucesso! Por favor, verifique seu email.');
      navigate('/login');
    } catch (error: any) {
      console.error('Erro de cadastro:', error);
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-volleyball-50/70 to-white p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <VolleyballIcon className="w-10 h-10 text-volleyball-600" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-volleyball-800">Cadastre-se no Larik Volei Club</h1>
          <p className="mt-2 text-gray-600">Crie sua conta para participar dos jogos</p>
        </div>
        
        <div className="glass-card p-8 rounded-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-volleyball-800">
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-volleyball-800">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        className="rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-volleyball-800">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password"
                        className="rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-volleyball-800">
                      Gênero
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
                      >
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                      </select>
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                      Necessário para balanceamento dos times.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-volleyball-600 px-3 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-volleyball-700 focus:outline-none focus:ring-2 focus:ring-volleyball-500 focus:ring-offset-2 flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  'Cadastrar'
                )}
              </button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Já tem uma conta?</span>{' '}
            <Link to="/login" className="font-medium text-volleyball-600 hover:text-volleyball-800">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
