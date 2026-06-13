import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';
import type { Permission } from '@/features/permissions/services/permissionService';

const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  group: z.string().min(1, 'Group is required'),
  description: z.string().optional(),
  guard_name: z.string().optional(),
});

type PermissionFormValues = z.infer<typeof permissionSchema>;

const COMMON_GROUPS = [
  'Users',
  'Roles',
  'Permissions',
  'Tenants',
  'Plans',
  'Subscriptions',
  'Coupons',
  'Campaigns',
  'Analytics',
  'Settings',
  'Content',
  'Reports',
  'System',
];

interface PermissionFormProps {
  initialData?: Permission | null;
  onSubmit: (data: PermissionFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PermissionForm = ({ initialData, onSubmit, onCancel, isLoading }: PermissionFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      group: initialData?.group || 'System',
      description: initialData?.description || '',
      guard_name: initialData?.guard_name || 'web',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="perm-name">Permission Name *</Label>
          <Input
            id="perm-name"
            {...register('name')}
            placeholder="e.g., Create Users"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="perm-slug">Slug *</Label>
          <Input
            id="perm-slug"
            {...register('slug')}
            placeholder="e.g., create-users"
          />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="perm-group">Group *</Label>
          <Select
            defaultValue={initialData?.group || 'System'}
            onValueChange={(value) => setValue('group', value)}
          >
            <SelectTrigger id="perm-group">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.group && (
            <p className="text-sm text-destructive">{errors.group.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="perm-guard">Guard</Label>
          <Select
            defaultValue={initialData?.guard_name || 'web'}
            onValueChange={(value) => setValue('guard_name', value)}
          >
            <SelectTrigger id="perm-guard">
              <SelectValue placeholder="Select guard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="perm-description">Description</Label>
        <Textarea
          id="perm-description"
          {...register('description')}
          placeholder="Describe this permission..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update Permission' : 'Create Permission'
          )}
        </Button>
      </div>
    </form>
  );
};

export default PermissionForm;
