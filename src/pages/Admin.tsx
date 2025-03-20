
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGames } from '@/hooks/useGames';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';

const formSchema = z.object({
  date: z.string().min(1, 'A data é obrigatória'),
  time: z.string().min(1, 'O horário é obrigatório'),
  location: z.string().min(3, 'Localização deve ter pelo menos 3 caracteres'),
  maxPlayers: z.coerce.number().min(4, 'Mínimo de 4 jogadores'),
  status: z.enum(['upcoming', 'completed', 'cancelled']),
});

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const { games, isLoadingGames, createGame, deleteGame } = useGames();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '19:00',
      location: '',
      maxPlayers: 24,
      status: 'upcoming',
    },
  });

  // Redirecionamento se não estiver logado ou não for admin
  if (!loading && (!user || !user.isAdmin)) {
    toast.error('Acesso restrito a administradores');
    navigate('/');
    return null;
  }

  const handleCreateGame = (values: z.infer<typeof formSchema>) => {
    const dateTime = new Date(`${values.date}T${values.time}`);
    
    createGame({
      date: dateTime.toISOString(),
      location: values.location,
      maxPlayers: values.maxPlayers,
      status: values.status,
    });
    
    setIsCreating(false);
    form.reset();
  };

  const handleCancel = () => {
    setIsCreating(false);
    form.reset();
  };

  const handleDelete = (gameId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
      deleteGame(gameId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-volleyball-50/70 to-white">
      <NavBar user={user} onSignOut={signOut} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="glass-card p-8 rounded-2xl shadow-sm animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-volleyball-800">Área Administrativa</h1>
            <Button onClick={() => setIsCreating(!isCreating)}>
              {isCreating ? 'Cancelar' : 'Novo Jogo'}
            </Button>
          </div>
          
          {isCreating && (
            <div className="mb-8 p-6 bg-white rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-volleyball-800 mb-4">Criar Novo Jogo</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateGame)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local</FormLabel>
                          <FormControl>
                            <Input placeholder="Arena XYZ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maxPlayers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número Máximo de Jogadores</FormLabel>
                          <FormControl>
                            <Input type="number" min="4" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="upcoming">Agendado</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Criar Jogo
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-bold text-volleyball-800 mb-4">Jogos Cadastrados</h2>
            
            {isLoadingGames ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-volleyball-700"></div>
              </div>
            ) : games && games.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-volleyball-100 text-volleyball-800">
                      <th className="text-left p-3 rounded-tl-lg">Data</th>
                      <th className="text-left p-3">Local</th>
                      <th className="text-left p-3">Vagas</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-right p-3 rounded-tr-lg">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game) => (
                      <tr key={game.id} className="border-b border-gray-200 hover:bg-volleyball-50/50">
                        <td className="p-3">
                          {new Date(game.date).toLocaleDateString('pt-BR')} {' '}
                          {new Date(game.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3">{game.location}</td>
                        <td className="p-3">{game.maxPlayers}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            game.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                            game.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {game.status === 'upcoming' ? 'Agendado' :
                             game.status === 'completed' ? 'Concluído' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(game.id)}
                          >
                            Excluir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">Nenhum jogo cadastrado</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
