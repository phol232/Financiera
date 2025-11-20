# Dashboard Widgets

This directory contains reusable widget components for role-based dashboards.

## Components

### Base Widget (`Widget.tsx`)
Base component that handles loading, error, and empty states for all dashboard widgets.

**Features:**
- Loading state with spinner
- Error state with retry button
- Empty state with custom message
- Consistent styling across all widgets

**Usage:**
```tsx
<Widget
  title="Widget Title"
  isLoading={isLoading}
  error={error}
  isEmpty={!data}
  emptyMessage="No data available"
  onRetry={() => refetch()}
>
  {/* Widget content */}
</Widget>
```

### PendingAccountsWidget
Shows count and list of pending accounts for employee dashboard.

**Requirements:** 1.1, 1.2, 1.3, 1.4

**Props:**
- `microfinancieraId: string` - ID of the microfinanciera

**Features:**
- Displays total count of pending accounts
- Shows last 5 pending accounts
- Click to navigate to account detail page
- Auto-refresh every 30 seconds

### PendingCardsWidget
Shows count and list of pending cards for employee dashboard.

**Requirements:** 1.1, 1.2, 1.3, 1.4

**Props:**
- `microfinancieraId: string` - ID of the microfinanciera

**Features:**
- Displays total count of pending cards
- Shows last 5 pending cards
- Click to navigate to card detail page
- Auto-refresh every 30 seconds

### AssignedApplicationsWidget
Shows count and list of applications assigned to analyst.

**Requirements:** 2.1, 2.2, 2.4

**Props:**
- `microfinancieraId: string` - ID of the microfinanciera
- `analystId: string` - ID of the analyst

**Features:**
- Displays total count of assigned applications
- Shows last 5 assigned applications
- Click to navigate to application detail page
- Displays amount and status
- Auto-refresh every 30 seconds

### ApprovalRateWidget
Shows analyst's approval rate for the last 30 days.

**Requirements:** 2.1, 2.2, 2.3

**Props:**
- `microfinancieraId: string` - ID of the microfinanciera
- `analystId: string` - ID of the analyst

**Features:**
- Displays approval rate percentage
- Shows trend indicator (up/down)
- Displays approved and rejected counts
- Auto-refresh every 30 seconds

### SystemMetricsWidget
Shows system-wide metrics for admin dashboard.

**Requirements:** 3.1, 3.2

**Props:**
- `microfinancieraId: string` - ID of the microfinanciera

**Features:**
- Displays active accounts count
- Displays active cards count
- Displays applications in process count
- Displays total disbursed amount
- Responsive grid layout (2 cols mobile, 4 cols desktop)
- Auto-refresh every 30 seconds

## Data Fetching

All widgets use React Query for data fetching with the following configuration:
- **Stale Time:** 30 seconds
- **Retry:** 1 attempt
- **Timeout:** 5 seconds (handled by API client)

## Error Handling

All widgets handle three states:
1. **Loading:** Shows spinner
2. **Error:** Shows error message with retry button
3. **Empty:** Shows empty state message

## Navigation

Widgets with lists support click-to-navigate functionality:
- PendingAccountsWidget → `/accounts?id={accountId}`
- PendingCardsWidget → `/cards?id={cardId}`
- AssignedApplicationsWidget → `/applications?id={applicationId}`

## Styling

All widgets use:
- Tailwind CSS for styling
- shadcn/ui Card component
- Lucide React icons
- Responsive design patterns
