
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { VolleyballIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, name, gender);
      // O AuthContext vai redirecionar
    } catch (error: any) {
      console.error('Erro de cadastro:', error);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-volleyball-800">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-volleyball-800">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-volleyball-800">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-volleyball-800">
                Gênero
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
              >
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Necessário para balanceamento dos times.
              </p>
            </div>
            
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
