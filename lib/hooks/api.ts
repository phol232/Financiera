import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Workers hooks
export function useAnalysts(microfinancieraId: string, search?: string) {
  return useQuery<{ analysts: any[] }>({
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
    queryKey: ['accounts', microfinancieraId, cleanFilters],
    queryFn: () =>
      apiClient.get('/api/accounts', {
        microfinancieraId,
        ...cleanFilters,
      }),
    enabled: !!microfinancieraId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos en caché
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

export function useCustomerAccounts(microfinancieraId: string, userId?: string, status: string = 'active') {
  return useQuery({
    queryKey: ['accounts', 'customer', microfinancieraId, userId, status],
    queryFn: () =>
      apiClient.get('/api/accounts', {
        microfinancieraId,
        status,
        ...(userId ? { userId } : {}),
      }),
    enabled: !!microfinancieraId && !!userId,
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

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, accountId, reason, confirmation }: { microfinancieraId: string; accountId: string; reason: string; confirmation: string }) =>
      apiClient.delete(`/api/accounts/${microfinancieraId}/${accountId}`, { reason, confirmation }),
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
  
  return useQuery<{ cards: any[] }>({
    queryKey: ['cards', microfinancieraId, cleanFilters],
    queryFn: () =>
      apiClient.get('/api/cards', {
        microfinancieraId,
        ...cleanFilters,
      }),
    enabled: !!microfinancieraId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos en caché
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
  
  return useQuery<{ applications: any[] }>({
    queryKey: ['applications', microfinancieraId, cleanFilters],
    queryFn: () =>
      apiClient.get('/api/applications', {
        microfinancieraId,
        ...cleanFilters,
      }),
    enabled: !!microfinancieraId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos en caché
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

export function useCalculateScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, applicationId }: { microfinancieraId: string; applicationId: string }) =>
      apiClient.post(`/api/scoring/calculate`, { microfinancieraId, applicationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useApproveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, applicationId, comments }: { microfinancieraId: string; applicationId: string; comments?: string }) =>
      apiClient.post(`/api/decisions/manual`, { 
        microfinancieraId, 
        applicationId, 
        result: 'approved',
        comments: comments || 'Aprobado'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, applicationId, reason }: { microfinancieraId: string; applicationId: string; reason: string }) =>
      apiClient.post(`/api/decisions/manual`, { 
        microfinancieraId, 
        applicationId, 
        result: 'rejected',
        comments: reason
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useConditionApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ microfinancieraId, applicationId, conditions }: { microfinancieraId: string; applicationId: string; conditions: string }) =>
      apiClient.post(`/api/decisions/manual`, { 
        microfinancieraId, 
        applicationId, 
        result: 'observed',
        comments: conditions
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useDisburseLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      microfinancieraId,
      applicationId,
      accountId,
      requestId,
      branchId,
    }: {
      microfinancieraId: string;
      applicationId: string;
      accountId: string;
      requestId: string;
      branchId?: string;
    }) =>
      apiClient.post('/api/disbursements/disburse', {
        microfinancieraId,
        applicationId,
        accountId,
        requestId,
        ...(branchId ? { branchId } : {}),
      }),
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

// Microfinancieras hooks
export function useMicrofinancieras() {
  return useQuery({
    queryKey: ['microfinancieras'],
    queryFn: () => apiClient.get('/api/microfinancieras'),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
}

// Products hooks (admin)
export function useProducts(microfinancieraId: string) {
  return useQuery<{ products: any[] }>({
    queryKey: ['products', microfinancieraId],
    queryFn: () => apiClient.get('/api/products', { microfinancieraId }),
    enabled: !!microfinancieraId,
    staleTime: 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      microfinancieraId,
      productId,
      data,
    }: {
      microfinancieraId: string;
      productId: string;
      data: any;
    }) => apiClient.put(`/api/products/${microfinancieraId}/${productId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      microfinancieraId,
      productId,
    }: {
      microfinancieraId: string;
      productId: string;
    }) => apiClient.delete(`/api/products/${microfinancieraId}/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Admin users hooks
export function useAdminUsers(microfinancieraId: string, status?: string) {
  return useQuery<{ users: any[] }>({
    queryKey: ['users', 'admin-list', microfinancieraId, status],
    queryFn: () =>
      apiClient.get('/api/users/list', {
        microfinancieraId,
        ...(status ? { status } : {}),
      }),
    enabled: !!microfinancieraId,
    staleTime: 60 * 1000,
  });
}

// Workers (admin)
export function useWorkers(microfinancieraId: string) {
  return useQuery<{ workers: any[] }>({
    queryKey: ['worker', microfinancieraId],
    queryFn: () => apiClient.get('/api/workers', { microfinancieraId }),
    enabled: !!microfinancieraId,
    staleTime: 60 * 1000,
  });
}

// Employee Dashboard hooks
/**
 * Hook to fetch pending accounts for employee dashboard
 * Requirements: 1.1, 1.2, 4.1, 4.2, 4.3
 */
export function usePendingAccounts(microfinancieraId: string) {
  return useQuery({
    queryKey: ['accounts', microfinancieraId, 'pending'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get('/api/accounts', {
          microfinancieraId,
          status: 'pending',
          limit: 5,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to fetch pending cards for employee dashboard
 * Requirements: 1.1, 1.2, 4.1, 4.2, 4.3
 */
export function usePendingCards(microfinancieraId: string) {
  return useQuery({
    queryKey: ['cards', microfinancieraId, 'pending'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get('/api/cards', {
          microfinancieraId,
          status: 'pending',
          limit: 5,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

// Analyst Dashboard hooks

/**
 * Hook to fetch applications assigned to a specific analyst
 * Requirements: 2.1, 2.2, 4.1, 4.2
 */
export function useAssignedApplications(microfinancieraId: string, analystId: string) {
  return useQuery({
    queryKey: ['applications', microfinancieraId, 'assigned', analystId],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get(`/api/applications`, {
          microfinancieraId,
          assignedUserId: analystId,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId && !!analystId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to fetch analyst statistics including approval rate
 * Requirements: 2.1, 2.2, 2.3, 4.1, 4.2
 */
export function useAnalystStats(microfinancieraId: string, analystId: string) {
  return useQuery({
    queryKey: ['analyst-stats', microfinancieraId, analystId],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get(`/api/applications/stats`, {
          microfinancieraId,
          agentId: analystId,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId && !!analystId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to fetch applications currently in evaluation by the analyst
 * Requirements: 2.1, 2.3, 4.1, 4.2
 */
export function useApplicationsInEvaluation(microfinancieraId: string, analystId: string) {
  return useQuery({
    queryKey: ['applications', microfinancieraId, 'in-evaluation', analystId],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get(`/api/applications`, {
          microfinancieraId,
          assignedUserId: analystId,
          status: 'observed',
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId && !!analystId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

// Admin Dashboard hooks

/**
 * Hook to fetch system-wide metrics for admin dashboard
 * Requirements: 3.1, 3.2, 3.3, 4.1
 */
export function useSystemMetrics(microfinancieraId: string) {
  return useQuery({
    queryKey: ['system-metrics', microfinancieraId],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get(
          `/api/microfinancieras/${microfinancieraId}/metrics`
        );
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to fetch application trends (approved vs rejected) over time
 * Requirements: 3.4, 4.1
 */
export function useApplicationTrends(microfinancieraId: string, period: string = 'last_6_months') {
  return useQuery({
    queryKey: ['application-trends', microfinancieraId, period],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get(
          `/api/microfinancieras/${microfinancieraId}/trends`,
          { period }
        );
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to fetch top performing analysts
 * Requirements: 3.5, 4.1
 */
export function useTopAnalysts(microfinancieraId: string, limit: number = 5) {
  return useQuery({
    queryKey: ['top-analysts', microfinancieraId, limit],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get(
          `/api/microfinancieras/${microfinancieraId}/analysts/top`,
          { limit }
        );
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Hook to fetch status distribution of applications
 * Requirements: 3.5, 4.1
 */
export function useStatusDistribution(microfinancieraId: string) {
  return useQuery({
    queryKey: ['status-distribution', microfinancieraId],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await apiClient.get(
          `/api/microfinancieras/${microfinancieraId}/applications/status-distribution`
        );
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!microfinancieraId,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}
