
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import { User, Game } from '@/types';
import { CalendarIcon, MapPinIcon, UsersIcon, XIcon } from '@/components/Icons';

const Admin = () => {
  const navigate = useNavigate();
  
  // Mock user data
  const [user, setUser] = useState<User | null>({
    id: '1',
    email: 'admin@example.com',
    name: 'Admin',
    gender: 'male',
    isAdmin: true
  });
  
  // Mock games data
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      date: new Date(2023, 6, 15, 19, 0, 0).toISOString(),
      location: 'Quadra Central - Rua das Palmeiras, 123',
      maxPlayers: 24,
      status: 'upcoming'
    },
    {
      id: '2',
      date: new Date(2023, 6, 22, 19, 0, 0).toISOString(),
      location: 'Quadra Esportiva - Avenida Brasil, 456',
      maxPlayers: 20,
      status: 'upcoming'
    }
  ]);
  
  // Form states
  const [newGame, setNewGame] = useState({
    date: '',
    time: '',
    location: '',
    maxPlayers: 24
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is admin
  if (!user?.isAdmin) {
    // Redirect non-admin users
    navigate('/');
    return null;
  }
  
  const handleSignOut = () => {
    setUser(null);
    toast.success('Você saiu com sucesso');
    navigate('/');
  };
  
  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGame.date || !newGame.time || !newGame.location) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsLoading(true);
    
    // Combine date and time
    const dateTime = new Date(`${newGame.date}T${newGame.time}`);
    
    // Mock creating a new game
    setTimeout(() => {
      const gameToAdd: Game = {
        id: Date.now().toString(),
        date: dateTime.toISOString(),
        location: newGame.location,
        maxPlayers: newGame.maxPlayers,
        status: 'upcoming'
      };
      
      setGames([...games, gameToAdd]);
      
      // Reset form
      setNewGame({
        date: '',
        time: '',
        location: '',
        maxPlayers: 24
      });
      
      setIsLoading(false);
      toast.success('Jogo criado com sucesso');
    }, 800);
  };
  
  const handleDeleteGame = (gameId: string) => {
    setIsLoading(true);
    
    // Mock delete game
    setTimeout(() => {
      setGames(games.filter(game => game.id !== gameId));
      setIsLoading(false);
      toast.success('Jogo removido com sucesso');
    }, 500);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-volleyball-50/70 to-white">
      <NavBar user={user} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 pt-24 pb-16 page-transition">
        <h1 className="text-3xl font-bold text-volleyball-800 mb-8">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create new game */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold text-volleyball-700 mb-6">Criar Novo Jogo</h2>
            
            <form onSubmit={handleCreateGame} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-volleyball-800">
                  Data
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  value={newGame.date}
                  onChange={(e) => setNewGame({...newGame, date: e.target.value})}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="block text-sm font-medium text-volleyball-800">
                  Horário
                </label>
                <input
                  id="time"
                  type="time"
                  required
                  value={newGame.time}
                  onChange={(e) => setNewGame({...newGame, time: e.target.value})}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-volleyball-800">
                  Local
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={newGame.location}
                  onChange={(e) => setNewGame({...newGame, location: e.target.value})}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="maxPlayers" className="block text-sm font-medium text-volleyball-800">
                  Número Máximo de Jogadores
                </label>
                <input
                  id="maxPlayers"
                  type="number"
                  min="3"
                  max="36"
                  required
                  value={newGame.maxPlayers}
                  onChange={(e) => setNewGame({...newGame, maxPlayers: parseInt(e.target.value)})}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-volleyball-500 focus:outline-none focus:ring-1 focus:ring-volleyball-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-volleyball-600 px-3 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-volleyball-700 focus:outline-none focus:ring-2 focus:ring-volleyball-500 focus:ring-offset-2 flex justify-center items-center"
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  'Criar Jogo'
                )}
              </button>
            </form>
          </div>
          
          {/* Games list */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold text-volleyball-700 mb-6">Jogos Agendados</h2>
            
            {games.length === 0 ? (
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
                <p>Nenhum jogo agendado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {games.map((game) => (
                  <div key={game.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-volleyball-800">
                        {formatDate(game.date)}
                      </h3>
                      <button
                        onClick={() => handleDeleteGame(game.id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Remover jogo"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPinIcon className="w-4 h-4 text-volleyball-500 flex-shrink-0" />
                      <span className="text-sm">{game.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <UsersIcon className="w-4 h-4 text-volleyball-500 flex-shrink-0" />
                      <span className="text-sm">Máximo de {game.maxPlayers} jogadores</span>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${game.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 
                          game.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          'bg-red-100 text-red-700'}`}
                      >
                        {game.status === 'upcoming' ? 'Agendado' : 
                         game.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </span>
                      
                      <button
                        className="text-sm text-volleyball-600 hover:text-volleyball-800 font-medium"
                        onClick={() => navigate(`/?game=${game.id}`)}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
