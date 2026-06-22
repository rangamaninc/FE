import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import EmptyState from "../ui/EmptyState";

/** ActivityFeed — timeline list for recent user/system activity. */
export default function ActivityFeed({ items = [], title = "Recent Activity" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!items.length ? (
          <EmptyState title="No recent activity" />
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="border-l-2 border-primary pl-4">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

ActivityFeed.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
};
