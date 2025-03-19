
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import PlayerGrid from '@/components/PlayerGrid';
import TeamDisplay from '@/components/TeamDisplay';
import GameInfo from '@/components/GameInfo';
import { Game, GamePlayer, User, Team } from '@/types';
import { generateBalancedTeams } from '@/lib/team-generator';

const Index = () => {
  // Mock data for demonstration
  const [user, setUser] = useState<User | null>({
    id: '1',
    email: 'user@example.com',
    name: 'João Silva',
    gender: 'male',
    isAdmin: true
  });
  
  const [game, setGame] = useState<Game | null>({
    id: '1',
    date: new Date(2023, 6, 15, 19, 0, 0).toISOString(),
    location: 'Quadra Central - Rua das Palmeiras, 123',
    maxPlayers: 24,
    status: 'upcoming'
  });
  
  const [players, setPlayers] = useState<GamePlayer[]>([
    {
      id: '1',
      gameId: '1',
      playerId: '1',
      playerName: 'João Silva',
      playerGender: 'male',
      hasPaid: true
    },
    {
      id: '2',
      gameId: '1',
      playerId: '2',
      playerName: 'Maria Oliveira',
      playerGender: 'female',
      hasPaid: true
    },
    {
      id: '3',
      gameId: '1',
      playerId: '3',
      playerName: 'Pedro Santos',
      playerGender: 'male',
      hasPaid: false
    },
    {
      id: '4',
      gameId: '1',
      playerId: '4',
      playerName: 'Ana Costa',
      playerGender: 'female',
      hasPaid: true
    },
    {
      id: '5',
      gameId: '1',
      playerId: '5',
      playerName: 'Carlos Ferreira',
      playerGender: 'male',
      hasPaid: false
    },
    {
      id: '6',
      gameId: '1',
      playerId: '6',
      playerName: 'Juliana Lima',
      playerGender: 'female',
      hasPaid: true
    },
    {
      id: '7',
      gameId: '1',
      playerId: '7',
      playerName: 'Rafael Almeida',
      playerGender: 'male',
      hasPaid: true
    },
    {
      id: '8',
      gameId: '1',
      playerId: '8',
      playerName: 'Amanda Rocha',
      playerGender: 'female',
      hasPaid: false
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [teamsOf3, setTeamsOf3] = useState<Team[]>([]);
  const [teamsOf4, setTeamsOf4] = useState<Team[]>([]);

  // Generate teams on initial load and when players change
  useEffect(() => {
    generateTeams();
  }, [players]);

  const generateTeams = () => {
    // Only generate teams if there are enough players
    if (players.length >= 3) {
      const newTeamsOf3 = generateBalancedTeams(players, 3);
      setTeamsOf3(newTeamsOf3);
    } else {
      setTeamsOf3([]);
    }
    
    if (players.length >= 4) {
      const newTeamsOf4 = generateBalancedTeams(players, 4);
      setTeamsOf4(newTeamsOf4);
    } else {
      setTeamsOf4([]);
    }
  };

  const handlePaymentUpdate = (playerId: string, hasPaid: boolean) => {
    // Mock API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setPlayers(players.map(p => 
          p.playerId === playerId ? { ...p, hasPaid } : p
        ));
        resolve();
      }, 500);
    });
  };

  const handleRegister = () => {
    if (!user) {
      toast.error('Você precisa estar logado para se registrar');
      return;
    }
    
    // Check if user is already registered
    if (players.some(p => p.playerId === user.id)) {
      toast.error('Você já está registrado para este jogo');
      return;
    }
    
    // Mock registration
    setIsLoading(true);
    setTimeout(() => {
      const newPlayer: GamePlayer = {
        id: `${Date.now()}`,
        gameId: game?.id || '',
        playerId: user.id,
        playerName: user.name,
        playerGender: user.gender,
        hasPaid: false
      };
      
      setPlayers([...players, newPlayer]);
      setIsLoading(false);
      toast.success('Você foi registrado com sucesso!');
    }, 800);
  };

  const handleUnregister = (playerId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setPlayers(players.filter(p => p.playerId !== playerId));
      setIsLoading(false);
      toast.success('Registro cancelado com sucesso');
    }, 800);
  };

  const handleSignOut = () => {
    setUser(null);
    toast.success('Você saiu com sucesso');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-volleyball-50/70 to-white">
      <NavBar user={user} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 pt-24 pb-16 page-transition">
        <div className="text-center mb-10 animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-bold text-volleyball-800 mb-6">Larik Volei Club</h1>
          
          <GameInfo game={game} isLoading={isLoading} />
        </div>
        
        <div className="space-y-8">
          <PlayerGrid 
            players={players}
            maxPlayers={game?.maxPlayers || 24}
            currentUser={user}
            isLoading={isLoading}
            onPaymentUpdate={handlePaymentUpdate}
            onRegister={handleRegister}
            onUnregister={handleUnregister}
          />
          
          <hr className="border-gray-200 my-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamDisplay 
              teams={teamsOf3} 
              teamSize={3}
              isLoading={isLoading}
              onTeamRegenerate={generateTeams}
            />
            
            <TeamDisplay 
              teams={teamsOf4} 
              teamSize={4}
              isLoading={isLoading}
              onTeamRegenerate={generateTeams}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
