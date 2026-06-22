import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Button, EmptyState, TableFooter, TableLayout } from "../../components/ui";
import {
  getTableRowClassName,
  TABLE_BODY_CELL_CLASS,
  TABLE_CLASS,
  TABLE_HEAD_CELL_CLASS,
  TABLE_WRAPPER_CLASS,
} from "../../components/ui/tableStyles";

export default function ClientHierarchyTable({
  managers,
  isAdmin,
  onEdit,
  onDelete,
  onRefresh,
  isRefreshing,
  onExcelDownload,
  className,
}) {
  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (managerId) => {
    setExpanded((prev) => ({ ...prev, [managerId]: !prev[managerId] }));
  };

  const footer = (
    <TableFooter
      onRefresh={onRefresh}
      onExcelDownload={onExcelDownload}
      isRefreshing={isRefreshing}
    />
  );

  if (!managers.length) {
    return (
      <TableLayout className={className} footer={footer}>
        <EmptyState
          title="No clients found"
          description="Add a captive manager to get started."
        />
      </TableLayout>
    );
  }

  return (
    <TableLayout className={className} footer={footer}>
      <div className={TABLE_WRAPPER_CLASS}>
        <table className={TABLE_CLASS}>
          <thead className="bg-muted/60">
            <tr>
              <th className={`${TABLE_HEAD_CELL_CLASS} w-12`} />
              <th className={TABLE_HEAD_CELL_CLASS}>Name</th>
              <th className={TABLE_HEAD_CELL_CLASS}>Code</th>
              <th className={TABLE_HEAD_CELL_CLASS}>Type</th>
              {isAdmin ? (
                <th className={TABLE_HEAD_CELL_CLASS}>Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {managers.map((manager, managerIndex) => {
              const captives = manager.captives ?? [];
              const isOpen = Boolean(expanded[manager.id]);
              const hasCaptives = captives.length > 0;

              return (
                <Fragment key={manager.id}>
                  <tr className={getTableRowClassName(managerIndex)}>
                    <td className={TABLE_BODY_CELL_CLASS}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(manager.id)}
                        aria-label={
                          isOpen ? "Collapse captives" : "Expand captives"
                        }
                        title={isOpen ? "Collapse captives" : "Expand captives"}
                      >
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className={`${TABLE_BODY_CELL_CLASS} font-medium`}>
                      {manager.name}
                    </td>
                    <td className={TABLE_BODY_CELL_CLASS}>{manager.code}</td>
                    <td className={TABLE_BODY_CELL_CLASS}>
                      {manager.type || "Captive Manager"}
                    </td>
                    {isAdmin ? (
                      <td className={TABLE_BODY_CELL_CLASS}>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(manager)}
                            aria-label="Edit manager"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete?.(manager)}
                            aria-label="Delete manager"
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                  {isOpen && hasCaptives
                    ? captives.map((captive, captiveIndex) => (
                        <tr
                          key={captive.id}
                          className={getTableRowClassName(
                            managerIndex + captiveIndex + 1
                          )}
                        >
                          <td className={TABLE_BODY_CELL_CLASS} />
                          <td
                            className={`${TABLE_BODY_CELL_CLASS} pl-10 text-muted-foreground`}
                          >
                            {captive.name}
                          </td>
                          <td className={TABLE_BODY_CELL_CLASS}>
                            {captive.code}
                          </td>
                          <td className={TABLE_BODY_CELL_CLASS}>
                            {captive.type || "Captive"}
                          </td>
                          {isAdmin ? (
                            <td className={TABLE_BODY_CELL_CLASS}>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit?.(captive)}
                                  aria-label="Edit captive"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete?.(captive)}
                                  aria-label="Delete captive"
                                  title="Delete"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          ) : null}
                        </tr>
                      ))
                    : null}
                  {isOpen && !hasCaptives ? (
                    <tr className="border-t border-border bg-muted/20">
                      <td className={TABLE_BODY_CELL_CLASS} />
                      <td
                        colSpan={isAdmin ? 4 : 3}
                        className={`${TABLE_BODY_CELL_CLASS} pl-10 text-sm text-muted-foreground`}
                      >
                        No linked captives.
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </TableLayout>
  );
}

ClientHierarchyTable.propTypes = {
  managers: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onRefresh: PropTypes.func,
  isRefreshing: PropTypes.bool,
  onExcelDownload: PropTypes.func,
  className: PropTypes.string,
};
