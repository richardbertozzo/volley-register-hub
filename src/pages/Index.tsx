
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGames } from '@/hooks/useGames';
import { useGamePlayers } from '@/hooks/useGamePlayers';
import { Game, GamePlayer } from '@/types';
import NavBar from '@/components/NavBar';
import GameInfo from '@/components/GameInfo';
import PlayerGrid from '@/components/PlayerGrid';
import TeamDisplay from '@/components/TeamDisplay';
import { Button } from '@/components/ui/button';
import { TeamSize } from '@/types';
import { generateTeams } from '@/lib/team-generator';
import { toast } from 'sonner';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { games, isLoadingGames } = useGames();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [teams, setTeams] = useState<GamePlayer[][]>([]);
  const [teamSize, setTeamSize] = useState<TeamSize>(4);

  // Selecionamos o primeiro jogo por padrão quando os jogos são carregados
  useEffect(() => {
    if (games && games.length > 0 && !selectedGameId) {
      setSelectedGameId(games[0].id);
    }
  }, [games, selectedGameId]);

  const { 
    players, 
    isLoadingPlayers,
    registerPlayer,
    unregisterPlayer,
    updatePaymentStatus
  } = useGamePlayers(selectedGameId);

  const handleGenerateTeams = () => {
    if (!players || players.length < 2) {
      toast.error('Não há jogadores suficientes para gerar times');
      return;
    }
    
    const generatedTeams = generateTeams(players, teamSize);
    setTeams(generatedTeams);
    toast.success(`Times gerados com sucesso! (${teamSize}x${teamSize})`);
  };
  
  const handleRegister = () => {
    if (!user) {
      toast.error('Você precisa estar logado para se registrar');
      return;
    }
    
    if (!selectedGameId) {
      toast.error('Nenhum jogo selecionado');
      return;
    }
    
    registerPlayer(user);
  };
  
  const handleUnregister = (playerId: string) => {
    if (!selectedGameId) {
      toast.error('Nenhum jogo selecionado');
      return;
    }
    
    unregisterPlayer(playerId);
  };
  
  const handlePaymentUpdate = (playerId: string, hasPaid: boolean) => {
    if (!selectedGameId) {
      toast.error('Nenhum jogo selecionado');
      return;
    }
    
    updatePaymentStatus({ playerId, hasPaid });
  };

  const handleTeamSizeChange = (size: TeamSize) => {
    setTeamSize(size);
    if (teams.length > 0) {
      handleGenerateTeams();
    }
  };

  const selectedGame = games?.find(game => game.id === selectedGameId) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-volleyball-50/70 to-white">
      <NavBar user={user} onSignOut={signOut} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {isLoadingGames ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-volleyball-700"></div>
          </div>
        ) : games && games.length > 0 ? (
          <div className="space-y-10">
            {/* Game selection and info */}
            <div className="glass-card p-8 rounded-2xl shadow-sm animate-fade-in">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-volleyball-800">Próximos Jogos</h1>
                <p className="text-gray-600 mt-2">Escolha um jogo para ver detalhes e se registrar</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGameId(game.id)}
                    className={`text-left p-4 rounded-xl transition-all ${
                      selectedGameId === game.id
                        ? 'bg-volleyball-600 text-white shadow-md ring-2 ring-volleyball-300'
                        : 'bg-white hover:bg-volleyball-50 text-volleyball-800'
                    }`}
                  >
                    <div className="font-semibold">{new Date(game.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                    <div className={selectedGameId === game.id ? 'text-white/90' : 'text-gray-500'}>
                      {game.location}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {selectedGame && (
              <>
                {/* Game details */}
                <div className="glass-card p-8 rounded-2xl shadow-sm animate-fade-in">
                  <GameInfo 
                    game={selectedGame} 
                    isLoading={isLoadingGames} 
                  />
                </div>
                
                {/* Players grid */}
                <div className="glass-card p-8 rounded-2xl shadow-sm animate-fade-in">
                  <PlayerGrid
                    players={players || []}
                    maxPlayers={selectedGame.maxPlayers}
                    currentUser={user}
                    isLoading={isLoadingPlayers}
                    onPaymentUpdate={handlePaymentUpdate}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                  />
                </div>
                
                {/* Team generator */}
                {players && players.length >= 2 && (
                  <div className="glass-card p-8 rounded-2xl shadow-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-volleyball-800">Gerador de Times</h2>
                      <div className="flex space-x-2">
                        <Button
                          variant={teamSize === 3 ? "default" : "outline"}
                          onClick={() => handleTeamSizeChange(3)}
                          className="w-10 h-10 rounded-full"
                        >
                          3x3
                        </Button>
                        <Button
                          variant={teamSize === 4 ? "default" : "outline"}
                          onClick={() => handleTeamSizeChange(4)}
                          className="w-10 h-10 rounded-full"
                        >
                          4x4
                        </Button>
                        <Button onClick={handleGenerateTeams} className="ml-2">
                          Gerar times
                        </Button>
                      </div>
                    </div>
                    
                    {teams.length > 0 ? (
                      <div className="grid gap-6 lg:grid-cols-2">
                        {teams.map((team, index) => (
                          <TeamDisplay
                            key={index}
                            team={team}
                            teamNumber={index + 1}
                            teamSize={teamSize}
                            isLoading={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-600">Clique em "Gerar times" para criar times equilibrados</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl shadow-sm text-center">
            <h1 className="text-2xl font-bold text-volleyball-800 mb-4">Não há jogos disponíveis</h1>
            <p className="text-gray-600">Fique atento para os próximos anúncios de jogos</p>
            {user?.isAdmin && (
              <Button 
                className="mt-6"
                onClick={() => navigate('/admin')}
              >
                Área Administrativa
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
