import PropTypes from "prop-types";
import { Card, CardContent, Spinner } from "../../components/ui";

export default function WorkingPapersPageLayout({
  title,
  subtitle,
  action,
  filters,
  loading = false,
  loadingLabel = "Loading...",
  children,
}) {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>

      {filters ? (
        <div className="flex max-w-full flex-wrap items-center gap-4">
          {filters}
        </div>
      ) : null}

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col pt-6">
          {loading ? (
            <div className="flex min-h-[200px] flex-1 items-center justify-center">
              <Spinner label={loadingLabel} />
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </div>
  );
}

WorkingPapersPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  filters: PropTypes.node,
  loading: PropTypes.bool,
  loadingLabel: PropTypes.string,
  children: PropTypes.node,
};
