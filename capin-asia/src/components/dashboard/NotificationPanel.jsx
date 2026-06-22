import PropTypes from "prop-types";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import EmptyState from "../ui/EmptyState";

/** NotificationPanel — in-app notification list widget. */
export default function NotificationPanel({ notifications = [], onMarkRead }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!notifications.length ? (
          <EmptyState title="No notifications" />
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => onMarkRead?.(notification.id)}
              className="flex w-full items-start justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/40"
            >
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground">
                  {notification.message}
                </p>
              </div>
              {!notification.read ? <Badge variant="secondary">New</Badge> : null}
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
}

NotificationPanel.propTypes = {
  notifications: PropTypes.array,
  onMarkRead: PropTypes.func,
};
