import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';
import type { CourseCategory, CourseCategoryFormData } from '../types/courseCategory.types';

const courseCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().nullable(),
  icon_url: z.string().nullable(),
  color: z.string().nullable(),
  parent_id: z.number().nullable(),
  sort_order: z.number().min(0).default(0),
  is_active: z.boolean().default(true),
});

type CourseCategoryFormValues = z.infer<typeof courseCategorySchema>;

interface CourseCategoryFormProps {
  initialData?: CourseCategory | null;
  parentOptions?: { label: string; value: number | null }[];
  onSubmit: (data: CourseCategoryFormData) => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  isDropdownLoading?: boolean;
}

const CourseCategoryForm = ({
  initialData,
  parentOptions = [],
  onSubmit,
  isLoading,
  mode = 'create',
  isDropdownLoading = false,
}: CourseCategoryFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseCategoryFormValues>({
    resolver: zodResolver(courseCategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || null,
      icon_url: initialData?.icon_url || null,
      color: initialData?.color || null,
      parent_id: initialData?.parent_id || null,
      sort_order: initialData?.sort_order || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name', {
              onChange: (e) => {
                if (mode === 'create') {
                  setValue('slug', generateSlug(e.target.value));
                }
              },
            })}
            placeholder="e.g., Web Development"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register('slug')} placeholder="e.g., web-development" />
          {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Brief description of this category..."
          rows={3}
        />
      </div>

      {/* Color & Icon URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color (Hex)</Label>
          <div className="flex items-center gap-3">
            <Input
              id="color"
              type="color"
              className="w-12 h-10 p-1 cursor-pointer"
              value={watch('color') || '#000000'}
              onChange={(e) => setValue('color', e.target.value)}
            />
            <Input
              placeholder="#RRGGBB"
              className="font-mono"
              value={watch('color') || ''}
              onChange={(e) => setValue('color', e.target.value || null)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon_url">Icon URL</Label>
          <Input id="icon_url" {...register('icon_url')} placeholder="https://..." />
        </div>
      </div>

      {/* Parent Category & Sort Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="parent_id">Parent Category</Label>
          <Select
            value={watch('parent_id')?.toString() || 'none'}
            onValueChange={(value) => setValue('parent_id', value === 'none' ? null : Number(value))}
          >
            <SelectTrigger id="parent_id">
              <SelectValue placeholder="None (top-level)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (top-level)</SelectItem>
              {isDropdownLoading ? (
                <div className="flex items-center justify-center gap-2 px-2 py-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading categories...
                </div>
              ) : parentOptions.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  No other categories available
                </div>
              ) : (
                parentOptions
                  .filter((opt) => opt.value !== initialData?.id)
                  .map((opt) => (
                    <SelectItem key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
          {parentOptions.length === 0 && !isTreeLoading && (
            <p className="text-xs text-muted-foreground">
              Create other categories first to set a parent
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            min={0}
            {...register('sort_order', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="is_active"
          checked={watch('is_active')}
          onCheckedChange={(checked) => setValue('is_active', checked === true)}
        />
        <Label htmlFor="is_active" className="cursor-pointer">
          Active
        </Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            mode === 'create' ? 'Create Category' : 'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CourseCategoryForm;
