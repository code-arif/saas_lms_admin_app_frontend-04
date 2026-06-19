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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
}

const CourseCategoryForm = ({
  initialData,
  parentOptions = [],
  onSubmit,
  isLoading,
  mode = 'create',
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Category Details' : 'Edit Category'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of this category..."
              rows={3}
            />
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent Category</Label>
              <Select
                value={watch('parent_id')?.toString() || 'none'}
                onValueChange={(value) => setValue('parent_id', value === 'none' ? null : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {parentOptions.filter((opt) => opt.value !== initialData?.id).map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? mode === 'create' ? 'Creating...' : 'Saving...'
            : mode === 'create' ? 'Create Category' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default CourseCategoryForm;
