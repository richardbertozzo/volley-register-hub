
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Game } from '@/types';
import { MapPinIcon, CalendarIcon } from './Icons';

interface GameInfoProps {
  game: Game | null;
  isLoading: boolean;
}

const GameInfo = ({ game, isLoading }: GameInfoProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum jogo agendado.</p>
      </div>
    );
  }

  // Format date for display
  const gameDate = new Date(game.date);
  const formattedDate = format(gameDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(gameDate, "HH:mm", { locale: ptBR });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        <div className="glass-card p-4 flex items-center space-x-3 rounded-xl">
          <div className="bg-volleyball-100 p-2 rounded-lg">
            <MapPinIcon className="w-6 h-6 text-volleyball-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Local</p>
            <p className="font-medium text-volleyball-800">{game.location}</p>
          </div>
        </div>
        
        <div className="glass-card p-4 flex items-center space-x-3 rounded-xl">
          <div className="bg-volleyball-100 p-2 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-volleyball-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Data e Hora</p>
            <p className="font-medium text-volleyball-800 capitalize">{formattedDate} às {formattedTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
