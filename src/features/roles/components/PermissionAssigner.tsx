import { useState, useEffect, useMemo } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Button } from '@/components/ui/Button';
import { Loader2, Search, Shield, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { usePermissions } from '@/features/permissions/hooks/usePermissions';
import { useRolePermissions, useAssignRolePermissions } from '@/features/roles/hooks/useRoles';

interface PermissionAssignerProps {
  roleUuid: string;
}

const PermissionAssigner = ({ roleUuid }: PermissionAssignerProps) => {
  const [search, setSearch] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [initialLoaded, setInitialLoaded] = useState(false);

  const { data: allPermissionsResponse, isLoading: loadingPermissions } = usePermissions({ per_page: 200 });
  const { data: rolePermissionsResponse, isLoading: loadingAssigned } = useRolePermissions(roleUuid);
  const assignMutation = useAssignRolePermissions();

  const allPermissions = allPermissionsResponse?.data || [];
  const assignedUuids = (rolePermissionsResponse?.data as string[]) || [];

  // Initialize selected permissions from server on load
  useEffect(() => {
    if (!initialLoaded && !loadingAssigned) {
      setSelectedPermissions(new Set(assignedUuids));
      setInitialLoaded(true);
    }
  }, [assignedUuids, loadingAssigned, initialLoaded]);

  // Group permissions by group
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, typeof allPermissions> = {};
    const filtered = allPermissions.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        p.group.toLowerCase().includes(search.toLowerCase())
    );

    filtered.forEach((perm) => {
      if (!groups[perm.group]) {
        groups[perm.group] = [];
      }
      groups[perm.group].push(perm);
    });

    return groups;
  }, [allPermissions, search]);

  const togglePermission = (uuid: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) {
        next.delete(uuid);
      } else {
        next.add(uuid);
      }
      return next;
    });
  };

  const selectAllInGroup = (group: string) => {
    const groupPerms = groupedPermissions[group];
    const allSelected = groupPerms.every((p) => selectedPermissions.has(p.uuid));

    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      groupPerms.forEach((p) => {
        if (allSelected) {
          next.delete(p.uuid);
        } else {
          next.add(p.uuid);
        }
      });
      return next;
    });
  };

  const isGroupFullySelected = (group: string) => {
    return groupedPermissions[group].every((p) => selectedPermissions.has(p.uuid));
  };

  const isGroupPartiallySelected = (group: string) => {
    const perms = groupedPermissions[group];
    const selected = perms.filter((p) => selectedPermissions.has(p.uuid)).length;
    return selected > 0 && selected < perms.length;
  };

  const handleSave = () => {
    assignMutation.mutate({
      uuid: roleUuid,
      permissionUuids: Array.from(selectedPermissions),
    });
  };

  const hasChanges =
    assignedUuids.length !== selectedPermissions.size ||
    !assignedUuids.every((uuid) => selectedPermissions.has(uuid));

  const totalSelected = selectedPermissions.size;

  if (loadingPermissions || loadingAssigned) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const groups = Object.entries(groupedPermissions);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search permissions..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {totalSelected} of {allPermissions.length} permissions selected
          </span>
        </div>
        {hasChanges && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
            Unsaved changes
          </Badge>
        )}
      </div>

      <Separator />

      {/* Permission groups */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No permissions found</p>
        </div>
      ) : (
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1">
          {groups.map(([group, perms]) => (
            <div key={group}>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => selectAllInGroup(group)}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  {isGroupFullySelected(group) ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : isGroupPartiallySelected(group) ? (
                    <Square className="h-4 w-4 text-primary/60" />
                  ) : (
                    <Square className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium capitalize">{group}</span>
                </button>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {perms.filter((p) => selectedPermissions.has(p.uuid)).length}/{perms.length}
                </Badge>
              </div>
              <div className="ml-6 space-y-1">
                {perms.map((perm) => (
                  <label
                    key={perm.uuid}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <Checkbox
                      checked={selectedPermissions.has(perm.uuid)}
                      onCheckedChange={() => togglePermission(perm.uuid)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-foreground">
                        {perm.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{perm.slug}</p>
                    </div>
                    {perm.description && (
                      <span className="text-xs text-muted-foreground hidden lg:block max-w-[200px] truncate">
                        {perm.description}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Separator />

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || assignMutation.isPending}
        >
          {assignMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              Saving...
            </>
          ) : (
            'Save Permissions'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PermissionAssigner;
