import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import EmptyState from "../ui/EmptyState";

/** TaskList — dashboard task summary widget. */
export default function TaskList({ tasks = [], title = "Tasks" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!tasks.length ? (
          <EmptyState title="No tasks assigned" />
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <span className="text-sm">{task.title}</span>
                <span className="text-xs text-muted-foreground">{task.status}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.array,
  title: PropTypes.string,
};
