import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const SkeletonCard = () => {
  return (
    <Card className="h-full overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

export default SkeletonCard;
