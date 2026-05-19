# Dashboard Feature

A clean, minimal dashboard UI that displays key business metrics in a responsive grid layout.

## Overview

The dashboard fetches and displays four key metrics from the API:
- **Pending Intents** - Count of pending intent requests
- **Special Interest Products** - Count of products marked as special interest
- **Silent Alerts** - Count of silent alerts (displayed as string)
- **Active Orders Today** - Count of orders placed today

## Architecture

```
src/features/dashboard/
├── api/
│   └── dashboardApi.ts          # RTK Query API endpoints
├── components/
│   ├── DashboardCard.tsx        # Reusable metric card component
│   ├── DashboardCard.test.tsx   # Card component tests
│   └── DashboardGrid.tsx        # Main grid layout & data fetching
├── types/
│   └── dashboard.types.ts       # TypeScript type definitions
├── index.ts                     # Public API exports
└── README.md                    # This file
```

## Components

### DashboardCard
A reusable card component that displays a single metric.

**Props:**
- `title` (string) - The metric label
- `value` (ReactNode) - The metric value to display
- `isLoading` (boolean, optional) - Shows a dash when loading

**Example:**
```tsx
<DashboardCard
  title="Pending Intents"
  value={42}
  isLoading={false}
/>
```

### DashboardGrid
The main dashboard component that fetches data and renders all metric cards in a responsive grid.

**Features:**
- Fetches data on mount using RTK Query
- 2x2 grid on desktop, stacked on mobile
- Loading state (shows dashes while fetching)
- Error handling with user-friendly message
- Null-safe value rendering

**Example:**
```tsx
import { DashboardGrid } from "@/features/dashboard";

export function DashboardPage() {
  return <DashboardGrid />;
}
```

## API Integration

The dashboard uses RTK Query for API calls. The endpoint is defined in `dashboardApi.ts`:

```
GET /api/superadmin/dashboard/dashboard/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "pending_intent_count": 12,
  "special_intrest_product_count": 5,
  "silent_alerts_count": "3",
  "active_orders_today": 28
}
```

The auth token is automatically attached to all requests via the `prepareHeaders` middleware.

## Styling

All styling uses Tailwind CSS utility classes:
- **Cards:** Minimal design with light border and subtle shadow
- **Typography:** Large bold values (text-3xl), smaller labels (text-sm)
- **Colors:** Neutral palette (white, gray, black)
- **Spacing:** Consistent 6-unit gap between cards

### Responsive Layout
- **Desktop (md+):** 2 columns (`grid-cols-2`)
- **Mobile:** 1 column (default `grid-cols-1`)

## Usage

### In a Page
```tsx
import { DashboardPage } from "@/pages/DashboardPage";

// Add to routes in AppRouter.tsx
<Route path="/dashboard" element={<DashboardPage />} />
```

### Standalone
```tsx
import { DashboardGrid } from "@/features/dashboard";

export function MyComponent() {
  return <DashboardGrid />;
}
```

## State Management

- **API State:** Managed by RTK Query (`dashboardApi`)
- **Loading/Error:** Automatically tracked by RTK Query hooks
- **Caching:** RTK Query caches results automatically

## Testing

Run tests with:
```bash
npm run test
```

The `DashboardCard` component includes basic smoke tests:
- Renders title and value
- Shows loading state
- Handles string values

## Constants & Messages

All user-facing strings are defined in `src/lib/messages.ts` under `APP_TEXT.DASHBOARD`:
- `PENDING_INTENTS`
- `SPECIAL_INTEREST_PRODUCTS`
- `SILENT_ALERTS`
- `ACTIVE_ORDERS_TODAY`
- `LOADING`
- `ERROR`

This makes the app easy to internationalize in the future.

## Error Handling

If the API request fails:
1. An error message is displayed: "Failed to load dashboard data. Please try again."
2. The error is styled with a red background for visibility
3. Users can refresh the page to retry

## Future Enhancements

- Add refresh button to manually reload data
- Add date range filtering
- Add export functionality
- Add real-time updates with polling
- Add individual metric drill-down pages
