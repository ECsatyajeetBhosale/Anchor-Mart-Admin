/**
 * features/notifications/components/NotificationsPage.tsx
 *
 * Notifications page — displays all system notifications.
 */

export function NotificationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-gray-600">Stay updated with all your notifications</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-center gap-2 text-center py-12">
          <div className="text-4xl">🔔</div>
          <h2 className="text-xl font-semibold text-gray-900">No notifications yet</h2>
          <p className="text-gray-600">Check back later for updates and important notifications</p>
        </div>
      </div>
    </div>
  );
}
