
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GamePlayer, User } from '@/types';
import { toast } from 'sonner';

export function useGamePlayers(gameId: string | null) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all players for a game
  const { data: players, isLoading: isLoadingPlayers, error } = useQuery({
    queryKey: ['game-players', gameId],
    queryFn: async () => {
      if (!gameId) return [];
      
      console.log('Fetching players for game:', gameId);
      const { data, error } = await supabase
        .from('game_players')
        .select(`
          id,
          has_paid,
          players:player_id (
            id,
            name,
            email,
            gender
          )
        `)
        .eq('game_id', gameId);
      
      if (error) {
        console.error('Error fetching game players:', error);
        throw error;
      }
      
      console.log('Game players fetched:', data);
      return data.map(record => ({
        id: record.id,
        gameId,
        playerId: record.players.id,
        playerName: record.players.name,
        playerGender: record.players.gender as 'male' | 'female' | 'other',
        hasPaid: record.has_paid
      }));
    },
    enabled: !!gameId
  });

  // Register for a game
  const registerPlayer = useMutation({
    mutationFn: async (user: User) => {
      if (!gameId) throw new Error('Game ID is required');
      
      setIsLoading(true);
      console.log('Registering player for game:', { gameId, playerId: user.id });
      const { data, error } = await supabase
        .from('game_players')
        .insert([
          {
            game_id: gameId,
            player_id: user.id
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error registering player:', error);
        throw error;
      }
      
      console.log('Player registered:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-players', gameId] });
      toast.success('Você foi registrado com sucesso!');
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao registrar-se para o jogo');
      setIsLoading(false);
    }
  });

  // Unregister from a game
  const unregisterPlayer = useMutation({
    mutationFn: async (playerId: string) => {
      if (!gameId) throw new Error('Game ID is required');
      
      setIsLoading(true);
      console.log('Unregistering player from game:', { gameId, playerId });
      const { error } = await supabase
        .from('game_players')
        .delete()
        .eq('game_id', gameId)
        .eq('player_id', playerId);
      
      if (error) {
        console.error('Error unregistering player:', error);
        throw error;
      }
      
      console.log('Player unregistered');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-players', gameId] });
      toast.success('Registro cancelado com sucesso');
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cancelar registro');
      setIsLoading(false);
    }
  });

  // Update payment status
  const updatePaymentStatus = useMutation({
    mutationFn: async ({ playerId, hasPaid }: { playerId: string, hasPaid: boolean }) => {
      if (!gameId) throw new Error('Game ID is required');
      
      setIsLoading(true);
      console.log('Updating payment status:', { gameId, playerId, hasPaid });
      const { error } = await supabase
        .from('game_players')
        .update({ has_paid: hasPaid })
        .eq('game_id', gameId)
        .eq('player_id', playerId);
      
      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }
      
      console.log('Payment status updated');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-players', gameId] });
      toast.success('Status de pagamento atualizado');
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar status de pagamento');
      setIsLoading(false);
    }
  });

  return {
    players,
    isLoadingPlayers: isLoadingPlayers || isLoading,
    error,
    registerPlayer: registerPlayer.mutate,
    unregisterPlayer: unregisterPlayer.mutate,
    updatePaymentStatus: updatePaymentStatus.mutate
  };
}
