
import { GamePlayer, Team, TeamSize } from '@/types';

// Function to balance teams by gender
export function generateTeams(players: GamePlayer[], teamSize: TeamSize): GamePlayer[][] {
  if (!players.length) return [];
  
  // Clone players array to avoid modifying the original
  const shuffledPlayers = [...players];
  
  // Shuffle players using Fisher-Yates algorithm
  for (let i = shuffledPlayers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
  }
  
  // Separate by gender to balance
  const malePlayersArr = shuffledPlayers.filter(p => p.playerGender === 'male');
  const femalePlayersArr = shuffledPlayers.filter(p => p.playerGender === 'female');
  const otherPlayersArr = shuffledPlayers.filter(p => p.playerGender === 'other');
  
  // Calculate number of teams
  const numberOfTeams = Math.floor(shuffledPlayers.length / teamSize);
  if (numberOfTeams === 0) return [];
  
  // Initialize teams
  const teams: GamePlayer[][] = Array.from({ length: numberOfTeams }, () => []);
  
  // Helper function to distribute players
  const distributePlayersToTeams = (playersArray: GamePlayer[], teams: GamePlayer[][]) => {
    playersArray.forEach((player, index) => {
      const teamIndex = index % teams.length;
      if (teams[teamIndex].length < teamSize) {
        teams[teamIndex].push(player);
      }
    });
  };
  
  // Distribute male players
  distributePlayersToTeams(malePlayersArr, teams);
  
  // Distribute female players
  distributePlayersToTeams(femalePlayersArr, teams);
  
  // Distribute other players
  distributePlayersToTeams(otherPlayersArr, teams);
  
  // Make sure teams don't exceed team size
  teams.forEach(team => {
    team.players = team.slice(0, teamSize);
  });
  
  // Remove any teams that don't have exactly teamSize players
  return teams.filter(team => team.length === teamSize);
}
