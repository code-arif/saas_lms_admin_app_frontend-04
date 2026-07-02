import type { AuditLog } from "../types/audit.types";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { cn } from "@/utils/cn";
import { formatDateTime } from "@/utils/formatDate";
import { eventCategoryColor, categoryLabels, userTypeVariant, formatUserType, methodColor } from "../utils/auditHelpers";
import { Calendar, User, Globe, Tag, ArrowUpDown, Info } from "lucide-react";

interface AuditDetailDialogProps {
  log: AuditLog | null;
  open: boolean;
  onClose: () => void;
}

export const AuditDetailDialog = ({ log, open, onClose }: AuditDetailDialogProps) => {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", eventCategoryColor(log.event_category))}>
              {log.event}
            </span>
          </DialogTitle>
          <DialogDescription>
            Audit log details — UUID:{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">{log.uuid}</code>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Event Category</p>
              <Badge variant="outline" className={cn("font-normal", eventCategoryColor(log.event_category))}>
                {categoryLabels[log.event_category] || log.event_category}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Timestamp</p>
              <p className="text-sm flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {formatDateTime(log.created_at)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Actor Info */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Actor
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p>
                  {log.user_email || <span className="text-muted-foreground italic">N/A</span>}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Type</p>
                {log.user_type ? (
                  <Badge variant={userTypeVariant(log.user_type)} className="text-xs">
                    {formatUserType(log.user_type)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground italic">N/A</span>
                )}
              </div>
              {log.user_id && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">User ID</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{log.user_id}</code>
                </div>
              )}
              {log.tenant_id && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tenant ID</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{log.tenant_id}</code>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* HTTP Context */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              HTTP Context
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">IP Address</p>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  {log.context?.ip_address || <span className="text-muted-foreground italic">N/A</span>}
                </code>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">HTTP Method</p>
                {log.context?.method ? (
                  <span className={cn("text-sm font-mono font-medium", methodColor(log.context.method))}>
                    {log.context.method}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">N/A</span>
                )}
              </div>
              {log.context?.url && (
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">URL</p>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono break-all block">
                    {log.context.url}
                  </code>
                </div>
              )}
              {log.context?.user_agent && (
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">User Agent</p>
                  <p className="text-xs text-muted-foreground break-all">{log.context.user_agent}</p>
                </div>
              )}
            </div>
          </div>

          {/* Auditable Entity */}
          {log.auditable && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Affected Entity
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      {log.auditable.type || "N/A"}
                    </code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ID</p>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{log.auditable.id}</code>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Changes */}
          {log.changes && (log.changes.old || log.changes.new) && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  Changes
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {log.changes.old && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">Previous Value</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32">
                        {JSON.stringify(log.changes.old, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.changes.new && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">New Value</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32">
                        {JSON.stringify(log.changes.new, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Metadata
                </h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-40">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditDetailDialog;
