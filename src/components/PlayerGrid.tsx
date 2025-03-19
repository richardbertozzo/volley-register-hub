
import { GamePlayer, User } from '@/types';
import PlayerCard from './PlayerCard';

interface PlayerGridProps {
  players: GamePlayer[];
  maxPlayers: number;
  currentUser: User | null;
  isLoading: boolean;
  onPaymentUpdate: (playerId: string, hasPaid: boolean) => void;
  onRegister: () => void;
  onUnregister: (playerId: string) => void;
}

const PlayerGrid = ({ 
  players,
  maxPlayers,
  currentUser,
  isLoading,
  onPaymentUpdate,
  onRegister,
  onUnregister
}: PlayerGridProps) => {
  // Calculate spots left
  const spotsLeft = Math.max(0, maxPlayers - players.length);
  
  // Create array for empty slots to fill remaining grid
  const emptySlots = Array(spotsLeft).fill(null);
  
  // Check if current user is already registered
  const isUserRegistered = currentUser ? players.some(p => p.playerId === currentUser.id) : false;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-volleyball-800">Jogadores</h2>
        <p className="text-volleyball-600 font-medium">
          {spotsLeft} {spotsLeft === 1 ? 'vaga restante' : 'vagas restantes'}
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-[120px] bg-gray-100 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              currentUser={currentUser}
              onPaymentUpdate={onPaymentUpdate}
              onUnregisterClick={onUnregister}
              index={index}
            />
          ))}
          
          {emptySlots.map((_, index) => (
            <PlayerCard
              key={`empty-${index}`}
              player={{
                id: `empty-${index}`,
                gameId: '',
                playerId: '',
                playerName: '',
                playerGender: 'other',
                hasPaid: false
              }}
              currentUser={currentUser}
              onPaymentUpdate={onPaymentUpdate}
              onRegisterClick={!isUserRegistered ? onRegister : undefined}
              registerMode={true}
              index={players.length + index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerGrid;
