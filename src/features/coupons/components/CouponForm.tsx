import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const couponSchema = z.object({
  code: z.string().min(1, 'Code is required').max(20),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().min(0, 'Discount value is required'),
  max_uses: z.number().nullable(),
  expires_at: z.string().nullable(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const CouponForm = ({ onSubmit, isLoading }: CouponFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      max_uses: null,
      expires_at: null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input id="code" {...register('code')} placeholder="e.g., SAVE20" className="uppercase" />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select value={watch('discount_type')} onValueChange={(value) => setValue('discount_type', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_value">Discount Value</Label>
              <Input id="discount_value" type="number" step="0.01" {...register('discount_value', { valueAsNumber: true })} />
              {errors.discount_value && <p className="text-sm text-destructive">{errors.discount_value.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_uses">Max Uses (leave empty for unlimited)</Label>
              <Input id="max_uses" type="number" {...register('max_uses', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at">Expiry Date (leave empty for no expiry)</Label>
            <Input id="expires_at" type="date" {...register('expires_at')} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Coupon'}
        </Button>
      </div>
    </form>
  );
};

export default CouponForm;
