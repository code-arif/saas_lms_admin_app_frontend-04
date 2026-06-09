import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const planSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  monthly_price: z.number().min(0, 'Monthly price is required'),
  yearly_price: z.number().min(0, 'Yearly price is required'),
  student_limit: z.number().min(0),
  instructor_limit: z.number().min(0),
  course_limit: z.number().min(0),
  storage_limit: z.number().min(0),
  trial_days: z.number().min(0),
  is_popular: z.boolean(),
  is_active: z.boolean(),
  features: z.array(z.string()),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const PlanForm = ({ initialData, onSubmit, isLoading }: PlanFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      monthly_price: initialData?.monthly_price ? initialData.monthly_price / 100 : 0,
      yearly_price: initialData?.yearly_price ? initialData.yearly_price / 100 : 0,
      student_limit: initialData?.limits?.students || 0,
      instructor_limit: initialData?.limits?.instructors || 0,
      course_limit: initialData?.limits?.courses || 0,
      storage_limit: initialData?.limits?.storage || 0,
      trial_days: initialData?.trial_days || 0,
      is_popular: initialData?.is_popular || false,
      is_active: initialData?.is_active ?? true,
      features: initialData?.features || [],
    },
  });

  const handleFormSubmit = (data: PlanFormValues) => {
    onSubmit({
      ...data,
      monthly_price: data.monthly_price * 100,
      yearly_price: data.yearly_price * 100,
      limits: {
        students: data.student_limit,
        instructors: data.instructor_limit,
        courses: data.course_limit,
        storage: data.storage_limit,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g., Pro Plan" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} placeholder="e.g., pro" />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Plan description..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_price">Monthly Price ($)</Label>
              <Input id="monthly_price" type="number" step="0.01" {...register('monthly_price', { valueAsNumber: true })} />
              {errors.monthly_price && <p className="text-sm text-destructive">{errors.monthly_price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearly_price">Yearly Price ($)</Label>
              <Input id="yearly_price" type="number" step="0.01" {...register('yearly_price', { valueAsNumber: true })} />
              {errors.yearly_price && <p className="text-sm text-destructive">{errors.yearly_price.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_limit">Student Limit</Label>
              <Input id="student_limit" type="number" {...register('student_limit', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor_limit">Instructor Limit</Label>
              <Input id="instructor_limit" type="number" {...register('instructor_limit', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_limit">Course Limit</Label>
              <Input id="course_limit" type="number" {...register('course_limit', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage_limit">Storage Limit (GB)</Label>
              <Input id="storage_limit" type="number" {...register('storage_limit', { valueAsNumber: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial_days">Trial Days</Label>
            <Input id="trial_days" type="number" {...register('trial_days', { valueAsNumber: true })} className="w-32" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_popular"
              checked={watch('is_popular')}
              onCheckedChange={(checked: boolean) => setValue('is_popular', checked === true)}
            />
            <Label htmlFor="is_popular">Popular Badge</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked: boolean) => setValue('is_active', checked === true)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
};

export default PlanForm;
