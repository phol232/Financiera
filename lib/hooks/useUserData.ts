import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/lib/constants/permissions';

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  provider: 'google' | 'email';
  status: 'pending' | 'approved' | 'rejected';
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook to fetch current user data including role
 * Uses React Query for caching and automatic refetching
 */
export function useUserData() {
  const { user } = useAuth();

  return useQuery<UserData>({
    queryKey: ['user', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('No user authenticated');
      
      console.log('🔍 Fetching user data for:', user.uid);
      
      // Fetch user data from backend with refresh to bypass cache
      const response = await apiClient.get<UserData>('/api/users/me?refresh=true');
      
      console.log('📦 Backend response:', response);

      // Fallback: si el backend aún no retornó rol, usar el guardado al registrarse
      const storedRole =
        typeof window !== 'undefined' ? (localStorage.getItem('selectedRole') as UserRole | null) : null;

      const finalData = {
        ...response,
        role: (response.role || storedRole || 'employee') as UserRole,
      };
      
      console.log('✅ Final user data:', finalData);

      return finalData;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
