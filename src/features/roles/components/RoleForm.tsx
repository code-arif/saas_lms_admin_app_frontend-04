import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';
import type { Role } from '@/features/roles/services/roleService';

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  guard_name: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  initialData?: Role | null;
  onSubmit: (data: RoleFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RoleForm = ({ initialData, onSubmit, onCancel, isLoading }: RoleFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      guard_name: initialData?.guard_name || 'web',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role-name">Role Name *</Label>
          <Input
            id="role-name"
            {...register('name')}
            placeholder="e.g., Editor"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="role-slug">Slug *</Label>
          <Input
            id="role-slug"
            {...register('slug')}
            placeholder="e.g., editor"
          />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role-description">Description</Label>
        <Textarea
          id="role-description"
          {...register('description')}
          placeholder="Describe this role's purpose..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role-guard">Guard</Label>
        <Select
          defaultValue={initialData?.guard_name || 'web'}
          onValueChange={(value) => setValue('guard_name', value)}
        >
          <SelectTrigger id="role-guard">
            <SelectValue placeholder="Select guard" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="api">API</SelectItem>
          </SelectContent>
        </Select>
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
            initialData ? 'Update Role' : 'Create Role'
          )}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;
