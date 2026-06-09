import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { Edit, Trash2, Star } from 'lucide-react';

interface Plan {
  uuid: string;
  name: string;
  description?: string;
  monthly_price: number;
  yearly_price: number;
  is_popular: boolean;
  is_active: boolean;
  limits?: {
    students: number;
    instructors: number;
    courses: number;
    storage: number;
  };
  features?: string[];
}

interface PlanTableProps {
  plans: Plan[];
  onDelete?: (uuid: string) => void;
}

const PlanTable = ({ plans, onDelete }: PlanTableProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.uuid} className={plan.is_popular ? 'border-primary ring-2 ring-primary/20' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {plan.name}
                {plan.is_popular && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              </CardTitle>
              <Badge variant={plan.is_active ? 'success' : 'secondary'}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {plan.description && (
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{formatCurrency(plan.monthly_price)}</p>
              <p className="text-sm text-muted-foreground">/month</p>
              <p className="text-xs text-muted-foreground mt-1">
                or {formatCurrency(plan.yearly_price)}/year
              </p>
            </div>

            {plan.limits && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">{plan.limits.students}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instructors</span>
                  <span className="font-medium">{plan.limits.instructors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Courses</span>
                  <span className="font-medium">{plan.limits.courses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-medium">{plan.limits.storage} GB</span>
                </div>
              </div>
            )}

            {plan.features && plan.features.length > 0 && (
              <div className="space-y-1">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-4">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to={`/plans/${plan.uuid}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(plan.uuid)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlanTable;
