import PropTypes from "prop-types";
import { cn } from "../../utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

/** StatsCard — KPI metric tile for dashboards. */
export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
}) {
  const changeColor = {
    up: "text-success",
    down: "text-error",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {change ? <p className={cn("mt-1 text-xs", changeColor)}>{change}</p> : null}
      </CardContent>
    </Card>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(["up", "down", "neutral"]),
  icon: PropTypes.elementType,
  className: PropTypes.string,
};
