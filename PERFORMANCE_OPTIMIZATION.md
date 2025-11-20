# Optimizaciones de Rendimiento - Frontend

## Cambios Aplicados

### 1. Configuración de React Query Optimizada

**Antes:**
- `staleTime`: 60 segundos
- Sin configuración de `gcTime` (garbage collection)
- Refetch automático en varios eventos

**Después:**
- `staleTime`: 5 minutos - Los datos se consideran frescos por más tiempo
- `gcTime`: 10 minutos - Mantiene datos en caché por más tiempo
- `refetchOnMount`: false - No refetch automático al montar componentes
- `refetchOnReconnect`: false - No refetch al reconectar
- `retry`: 1 - Solo 1 reintento en caso de error
- `retryDelay`: 1000ms - Delay entre reintentos

### 2. Optimización de Hooks de API

Agregado `staleTime` y `gcTime` específicos para:
- `useAccounts`: 2 minutos stale, 5 minutos cache
- `useCards`: 2 minutos stale, 5 minutos cache
- `useApplications`: 2 minutos stale, 5 minutos cache

### 3. Fix en QueryKeys

Cambiado de `filters` a `cleanFilters` en las queryKeys para evitar invalidaciones innecesarias cuando los filtros no cambian realmente.

## Recomendaciones Adicionales

### 1. Implementar Paginación

Actualmente se cargan todos los registros. Implementar paginación en el backend y frontend:

```typescript
export function useAccounts(microfinancieraId: string, filters?: any, page: number = 1, limit: number = 20) {
  const cleanFilters = filters ? Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== 'all' && value !== '')
  ) : {};
  
  return useQuery({
    queryKey: ['accounts', microfinancieraId, cleanFilters, page, limit],
    queryFn: () =>
      apiClient.get('/api/accounts', {
        microfinancieraId,
        ...cleanFilters,
        page,
        limit,
      }),
    enabled: !!microfinancieraId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    keepPreviousData: true, // Mantener datos anteriores mientras carga nuevos
  });
}
```

### 2. Implementar Infinite Scroll

Para listas largas, usar `useInfiniteQuery`:

```typescript
export function useInfiniteAccounts(microfinancieraId: string, filters?: any) {
  return useInfiniteQuery({
    queryKey: ['accounts', 'infinite', microfinancieraId, filters],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get('/api/accounts', {
        microfinancieraId,
        ...filters,
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) {
        return pages.length + 1;
      }
      return undefined;
    },
    enabled: !!microfinancieraId,
  });
}
```

### 3. Optimizar Búsqueda con Debounce

La búsqueda por nombre actualmente filtra en el cliente. Moverla al servidor con debounce:

```typescript
import { useMemo } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';

export function useAccountsSearch(microfinancieraId: string, searchTerm: string) {
  const debouncedSearch = useDebounce(searchTerm, 500); // 500ms delay
  
  return useQuery({
    queryKey: ['accounts', microfinancieraId, 'search', debouncedSearch],
    queryFn: () =>
      apiClient.get('/api/accounts/search', {
        microfinancieraId,
        q: debouncedSearch,
      }),
    enabled: !!microfinancieraId && debouncedSearch.length >= 3,
    staleTime: 30 * 1000, // 30 segundos para búsquedas
  });
}
```

### 4. Implementar Virtualización para Listas Largas

Usar `react-window` o `react-virtual` para renderizar solo elementos visibles:

```bash
npm install react-window
```

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={accounts.length}
  itemSize={200}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <AccountCard account={accounts[index]} />
    </div>
  )}
</FixedSizeList>
```

### 5. Lazy Loading de Componentes

Cargar componentes pesados solo cuando se necesiten:

```typescript
import dynamic from 'next/dynamic';

const AccountDetailDialog = dynamic(() => import('@/components/AccountDetailDialog'), {
  loading: () => <div>Cargando...</div>,
});
```

### 6. Optimizar Imágenes

Si hay imágenes, usar Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src={account.photoUrl}
  alt={account.name}
  width={100}
  height={100}
  loading="lazy"
/>
```

### 7. Implementar Prefetching

Prefetch datos que probablemente se necesitarán:

```typescript
const queryClient = useQueryClient();

const prefetchAccount = (accountId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['account', microfinancieraId, accountId],
    queryFn: () => apiClient.get(`/api/accounts/${microfinancieraId}/${accountId}`),
  });
};

// Usar en hover
<div onMouseEnter={() => prefetchAccount(account.id)}>
  {account.name}
</div>
```

### 8. Optimizar el Backend

#### a. Agregar Índices en Firestore

```javascript
// En firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "accounts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "mfId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

#### b. Implementar Caché en el Backend

```typescript
// En el backend
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutos

app.get('/api/accounts', async (req, res) => {
  const cacheKey = `accounts_${req.query.microfinancieraId}_${JSON.stringify(req.query)}`;
  
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  const accounts = await getAccounts(req.query);
  cache.set(cacheKey, accounts);
  
  res.json(accounts);
});
```

#### c. Limitar Campos Retornados

```typescript
// Solo retornar campos necesarios
const accounts = await accountsRef
  .select('id', 'status', 'holderFirstName', 'holderLastName', 'balance')
  .get();
```

### 9. Monitoreo de Rendimiento

Agregar React Query Devtools en desarrollo:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### 10. Optimizar Renderizado

Usar `React.memo` para componentes que no cambian frecuentemente:

```typescript
const AccountCard = React.memo(({ account }: { account: Account }) => {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.account.id === nextProps.account.id &&
         prevProps.account.status === nextProps.account.status;
});
```

## Métricas a Monitorear

1. **Time to First Byte (TTFB)**: < 200ms
2. **First Contentful Paint (FCP)**: < 1.8s
3. **Largest Contentful Paint (LCP)**: < 2.5s
4. **Time to Interactive (TTI)**: < 3.8s
5. **Total Blocking Time (TBT)**: < 200ms

## Herramientas de Análisis

- Chrome DevTools Performance tab
- Lighthouse
- React Query Devtools
- Next.js Analytics
- Vercel Analytics (si está en Vercel)

## Próximos Pasos

1. ✅ Optimizar configuración de React Query
2. ✅ Agregar staleTime y gcTime a hooks principales
3. ⏳ Implementar paginación en backend
4. ⏳ Agregar debounce a búsquedas
5. ⏳ Implementar virtualización para listas largas
6. ⏳ Agregar índices en Firestore
7. ⏳ Implementar caché en backend
8. ⏳ Optimizar queries de Firestore
