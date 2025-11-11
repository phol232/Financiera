import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Workers hooks
export function useAnalysts(microfinancieraId: string, search?: string) {
  return useQuery({
    queryKey: ['analysts', microfinancieraId, search],
    queryFn: () =>
      apiClient.get('/api/workers/analysts', {
        microfinancieraId,
        ...(search ? { search } : {}),
      }),
    enabled: !!microfinancieraId && !!search && search.trim().length > 0, // Solo busca cuando hay texto
  });
}

// Accounts hooks
export function useAccounts(microfinancieraId: string, filters?: any) {
  // Filtrar valores "all" para no enviarlos al backend
  const cleanFilters = filters ? Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== 'all' && value !== '')
  ) : {};
  
  return useQuery({
    queryKey: ['accounts', microfinancieraId, filters],
    queryFn: () =>
      apiClient.get('/api/accounts', {
        microfinancieraId,
        ...cleanFilters,
      }),
    enabled: !!microfinancieraId,
  });
}

export function useAccount(microfinancieraId: string, accountId: string) {
  return useQuery({
    queryKey: ['account', microfinancieraId, accountId],
    queryFn: () =>
      apiClient.get(`/api/accounts/${microfinancieraId}/${accountId}`),
    enabled: !!microfinancieraId && !!accountId,
  });
}

export function useApproveAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, accountId }: { microfinancieraId: string; accountId: string }) =>
      apiClient.post(`/api/accounts/${microfinancieraId}/${accountId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useRejectAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, accountId, reason }: { microfinancieraId: string; accountId: string; reason: string }) =>
      apiClient.post(`/api/accounts/${microfinancieraId}/${accountId}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useChangeAccountStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, accountId, status, reason }: { microfinancieraId: string; accountId: string; status: string; reason?: string }) =>
      apiClient.put(`/api/accounts/${microfinancieraId}/${accountId}/status`, { status, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

// Cards hooks
export function useCards(microfinancieraId: string, filters?: any) {
  // Filtrar valores "all" para no enviarlos al backend
  const cleanFilters = filters ? Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== 'all' && value !== '')
  ) : {};
  
  return useQuery({
    queryKey: ['cards', microfinancieraId, filters],
    queryFn: () =>
      apiClient.get('/api/cards', {
        microfinancieraId,
        ...cleanFilters,
      }),
    enabled: !!microfinancieraId,
  });
}

export function useCard(microfinancieraId: string, cardId: string) {
  return useQuery({
    queryKey: ['card', microfinancieraId, cardId],
    queryFn: () =>
      apiClient.get(`/api/cards/${microfinancieraId}/${cardId}`),
    enabled: !!microfinancieraId && !!cardId,
  });
}

export function useApproveCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, cardId }: { microfinancieraId: string; cardId: string }) =>
      apiClient.post(`/api/cards/${microfinancieraId}/${cardId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useRejectCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, cardId, reason, evidence }: { microfinancieraId: string; cardId: string; reason: string; evidence?: string }) =>
      apiClient.post(`/api/cards/${microfinancieraId}/${cardId}/reject`, { reason, evidence }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useSuspendCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, cardId, reason, evidence }: { microfinancieraId: string; cardId: string; reason: string; evidence?: string }) =>
      apiClient.put(`/api/cards/${microfinancieraId}/${cardId}/suspend`, { reason, evidence }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useReactivateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, cardId }: { microfinancieraId: string; cardId: string }) =>
      apiClient.put(`/api/cards/${microfinancieraId}/${cardId}/reactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useCloseCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, cardId, reason, evidence }: { microfinancieraId: string; cardId: string; reason: string; evidence?: string }) =>
      apiClient.put(`/api/cards/${microfinancieraId}/${cardId}/close`, { reason, evidence }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useActiveCards(microfinancieraId: string) {
  return useQuery({
    queryKey: ['cards', 'active', microfinancieraId],
    queryFn: () =>
      apiClient.get('/api/cards/active', { microfinancieraId }),
    enabled: !!microfinancieraId,
  });
}

// Applications hooks
export function useApplications(microfinancieraId: string, filters?: any) {
  // Filtrar valores "all" para no enviarlos al backend
  const cleanFilters = filters ? Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== 'all' && value !== '')
  ) : {};
  
  return useQuery({
    queryKey: ['applications', microfinancieraId, filters],
    queryFn: () =>
      apiClient.get('/api/applications', {
        microfinancieraId,
        ...cleanFilters,
      }),
    enabled: !!microfinancieraId,
  });
}

export function useApplication(microfinancieraId: string, applicationId: string) {
  return useQuery({
    queryKey: ['application', microfinancieraId, applicationId],
    queryFn: () =>
      apiClient.get(`/api/applications/${microfinancieraId}/${applicationId}`),
    enabled: !!microfinancieraId && !!applicationId,
  });
}

export function useAssignApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, applicationId, analystId }: { microfinancieraId: string; applicationId: string; analystId: string }) =>
      apiClient.post('/api/applications/assign', { microfinancieraId, applicationId, analystId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

// Scoring hooks
export function useScoringConfig(microfinancieraId: string) {
  return useQuery({
    queryKey: ['scoring-config', microfinancieraId],
    queryFn: () =>
      apiClient.get('/api/scoring/config', { microfinancieraId }),
    enabled: !!microfinancieraId,
  });
}

export function useScoringMetrics(microfinancieraId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['scoring-metrics', microfinancieraId, startDate, endDate],
    queryFn: () =>
      apiClient.get('/api/scoring/metrics', {
        microfinancieraId,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
    enabled: !!microfinancieraId,
  });
}

