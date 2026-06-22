import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

/** AnalyticsCard — chart/metric container for dashboard analytics sections. */
export default function AnalyticsCard({ title, description, children, action }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

AnalyticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
};
