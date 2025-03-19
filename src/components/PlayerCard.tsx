
import { useState } from 'react';
import { GamePlayer, User } from '@/types';
import { CheckIcon, XIcon } from '@/components/Icons';
import { toast } from 'sonner';

interface PlayerCardProps {
  player: GamePlayer;
  currentUser: User | null;
  onPaymentUpdate: (playerId: string, hasPaid: boolean) => void;
  onRegisterClick?: () => void;
  onUnregisterClick?: (playerId: string) => void;
  registerMode?: boolean;
  index: number;
}

const PlayerCard = ({
  player,
  currentUser,
  onPaymentUpdate,
  onRegisterClick,
  onUnregisterClick,
  registerMode = false,
  index
}: PlayerCardProps) => {
  const [isPaying, setIsPaying] = useState(false);

  const handlePaymentToggle = async () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para atualizar o pagamento');
      return;
    }
    
    if (currentUser.id !== player.playerId && !currentUser.isAdmin) {
      toast.error('Você só pode atualizar seu próprio pagamento');
      return;
    }
    
    setIsPaying(true);
    try {
      await onPaymentUpdate(player.playerId, !player.hasPaid);
      toast.success(`Pagamento ${player.hasPaid ? 'removido' : 'confirmado'} com sucesso`);
    } catch (error) {
      toast.error('Erro ao atualizar pagamento');
      console.error(error);
    } finally {
      setIsPaying(false);
    }
  };

  const handleUnregister = async () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para cancelar o registro');
      return;
    }
    
    if (currentUser.id !== player.playerId && !currentUser.isAdmin) {
      toast.error('Você só pode cancelar seu próprio registro');
      return;
    }
    
    if (onUnregisterClick) {
      onUnregisterClick(player.playerId);
    }
  };

  // If in register mode and it's an empty slot, show register button
  if (registerMode) {
    return (
      <div 
        className="player-card cursor-pointer hover:shadow-md"
        style={{ '--index': index } as React.CSSProperties}
        onClick={onRegisterClick}
      >
        <div className="flex items-center justify-center h-full min-h-[100px]">
          <button className="flex flex-col items-center justify-center space-y-2 text-volleyball-600 hover:text-volleyball-800 transition-colors">
            <PlusIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Registrar-se</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="player-card" 
      style={{ '--index': index } as React.CSSProperties}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium text-volleyball-800">{player.playerName}</div>
        
        <div className="flex space-x-2">
          {currentUser && (currentUser.id === player.playerId || currentUser.isAdmin) && (
            <button
              onClick={handleUnregister}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              aria-label="Cancelar registro"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex items-center">
        <button
          onClick={handlePaymentToggle}
          disabled={isPaying || (!currentUser?.isAdmin && currentUser?.id !== player.playerId)}
          className={`
            flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium
            ${player.hasPaid 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } 
            transition-colors duration-200
            ${(!currentUser?.isAdmin && currentUser?.id !== player.playerId) ? 'cursor-default' : 'cursor-pointer'}
          `}
        >
          <CheckIcon className={`w-4 h-4 ${player.hasPaid ? 'text-green-600' : 'text-gray-400'}`} />
          <span>{player.hasPaid ? 'Pagamento verificado' : 'Marcar como pago'}</span>
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;

// Inline icon component
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
