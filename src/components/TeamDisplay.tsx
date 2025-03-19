
import { Team, TeamSize } from '@/types';
import { ShuffleIcon } from './Icons';

interface TeamDisplayProps {
  teams: Team[];
  teamSize: TeamSize;
  isLoading: boolean;
  onTeamRegenerate?: () => void;
  className?: string;
}

const TeamDisplay = ({ 
  teams, 
  teamSize, 
  isLoading,
  onTeamRegenerate,
  className = ""
}: TeamDisplayProps) => {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse ${className}`}>
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4 text-volleyball-700 flex items-center">
          Times com {teamSize} jogadores
        </h3>
        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
          <p>Registre-se para o jogo para ver os times.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`team-card p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-volleyball-700">
          Times com {teamSize} jogadores
        </h3>
        {onTeamRegenerate && (
          <button
            onClick={onTeamRegenerate}
            className="text-volleyball-600 hover:text-volleyball-800 p-1 rounded-full hover:bg-volleyball-50 transition-colors"
            aria-label="Embaralhar times"
          >
            <ShuffleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-volleyball-50 rounded-lg p-3 border border-volleyball-100">
            <h4 className="text-sm font-medium text-volleyball-700 mb-2">Time {team.id}</h4>
            <div className="grid grid-cols-1 gap-2">
              {team.players.map((player) => (
                <div key={player.id} className="flex justify-between items-center px-3 py-2 bg-white rounded-md shadow-sm">
                  <span className="font-medium text-volleyball-800">{player.playerName}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-volleyball-100 text-volleyball-700">
                    {player.playerGender === 'male' ? 'M' : player.playerGender === 'female' ? 'F' : 'O'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDisplay;
