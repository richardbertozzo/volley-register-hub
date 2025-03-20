
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Game } from '@/types';
import { toast } from 'sonner';

export function useGames() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all games
  const { data: games, isLoading: isLoadingGames, error } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      console.log('Fetching games...');
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching games:', error);
        throw error;
      }
      
      console.log('Games fetched:', data);
      return data.map(game => ({
        id: game.id,
        date: game.date,
        location: game.location,
        maxPlayers: game.max_players,
        status: game.status as 'upcoming' | 'completed' | 'cancelled'
      }));
    }
  });

  // Create a new game
  const createGame = useMutation({
    mutationFn: async (newGame: Omit<Game, 'id'>) => {
      setIsLoading(true);
      console.log('Creating game:', newGame);
      const { data, error } = await supabase
        .from('games')
        .insert([
          {
            date: newGame.date,
            location: newGame.location,
            max_players: newGame.maxPlayers,
            status: newGame.status
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating game:', error);
        throw error;
      }
      
      console.log('Game created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('Jogo criado com sucesso');
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar jogo');
      setIsLoading(false);
    }
  });

  // Delete a game
  const deleteGame = useMutation({
    mutationFn: async (gameId: string) => {
      setIsLoading(true);
      console.log('Deleting game:', gameId);
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);
      
      if (error) {
        console.error('Error deleting game:', error);
        throw error;
      }
      
      console.log('Game deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('Jogo removido com sucesso');
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover jogo');
      setIsLoading(false);
    }
  });

  return {
    games,
    isLoadingGames: isLoadingGames || isLoading,
    error,
    createGame: createGame.mutate,
    deleteGame: deleteGame.mutate
  };
}

export function useGame(gameId: string | null) {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch a single game
  const { data: game, isLoading: isLoadingGame, error } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      
      console.log('Fetching single game:', gameId);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();
      
      if (error) {
        console.error('Error fetching game:', error);
        throw error;
      }
      
      console.log('Game fetched:', data);
      return {
        id: data.id,
        date: data.date,
        location: data.location,
        maxPlayers: data.max_players,
        status: data.status as 'upcoming' | 'completed' | 'cancelled'
      };
    },
    enabled: !!gameId
  });

  return {
    game,
    isLoadingGame: isLoadingGame || isLoading,
    error
  };
}
