import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import {
  Search,
  Grid3X3,
  List,
  Loader2,
  ChevronDown,
  X,
  Play,
  Clock,
  Users,  Star, BookOpen, Eye, Archive, Calendar,
} from 'lucide-react';
import {
  classService,
  categoryLabels,
  type ClassItem,
} from '@/features/classes/services/classService';
import { formatDate } from '@/utils/formatDate';

// ─── RatingStars ──────────────────────────────────────────────────

const RatingStars = ({ rating }: { rating: number }) => {
  if (rating === 0) return <span className="text-xs text-muted-foreground">No ratings</span>;
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// ─── Grid Card ────────────────────────────────────────────────────

const PreviousClassCard = ({ item }: { item: ClassItem }) => {
  const navigate = useNavigate();
  const isExpired = item.end_date && new Date(item.end_date) < new Date();

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30 cursor-pointer opacity-85 hover:opacity-100"
      onClick={() => navigate(`/classes/${item.uuid}`)}
    >
      <div className="relative h-40 bg-muted overflow-hidden">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
            <Play className="h-5 w-5 text-foreground ml-0.5" />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="text-[10px] px-1.5 capitalize flex items-center gap-1">
            <Archive className="h-3 w-3" />
            {isExpired ? 'Ended' : item.status}
          </Badge>
        </div>
        {item.end_date && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Ended {formatDate(item.end_date)}
          </div>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        <Badge variant="secondary" className="text-[10px] capitalize">
          {categoryLabels[item.category] || item.category}
        </Badge>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground">{item.instructor}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{item.students_enrolled}</span>
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{item.lessons_count}</span>
          </div>
          <RatingStars rating={item.rating} />
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold">{item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7"
            onClick={(e) => { e.stopPropagation(); navigate(`/classes/${item.uuid}`); }}
            title="View class"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── List Row ─────────────────────────────────────────────────────

const PreviousClassRow = ({ item }: { item: ClassItem }) => {
  const navigate = useNavigate();
  const isExpired = item.end_date && new Date(item.end_date) < new Date();

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer opacity-85 hover:opacity-100"
      onClick={() => navigate(`/classes/${item.uuid}`)}
    >
      <div className="h-12 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate">{item.title}</h3>
          <Badge variant="outline" className="text-[10px] capitalize shrink-0 flex items-center gap-1">
            <Archive className="h-3 w-3" />
            {isExpired ? 'Ended' : item.status}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span>{item.instructor}</span>
          <span>•</span>
          <span className="capitalize">{categoryLabels[item.category] || item.category}</span>
          {item.end_date && <><span>•</span><span>Ended {formatDate(item.end_date)}</span></>}
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{item.students_enrolled}</span>
        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{item.lessons_count}</span>
        <RatingStars rating={item.rating} />
      </div>
      <div className="hidden lg:block w-16 text-right shrink-0">
        <span className="text-sm font-medium">{item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.stopPropagation(); navigate(`/classes/${item.uuid}`); }} title="View"
      ><Eye className="h-3.5 w-3.5" /></Button>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────

const PreviousClassesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('updated_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    classService.getAll({ per_page: 100 }).then((res) => {
      setClasses(res.data);
      setLoading(false);
    });
  }, []);

  const previousClasses = useMemo(() => {
    const now = new Date();
    return classes.filter((c) =>
      c.status === 'inactive' ||
      c.status === 'archived' ||
      (c.end_date && new Date(c.end_date) < now)
    );
  }, [classes]);

  const displayedClasses = useMemo(() => {
    let filtered = [...previousClasses];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') filtered = filtered.filter((c) => c.category === categoryFilter);
    filtered.sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      switch (sort) {
        case 'title': return a.title.localeCompare(b.title) * dir;
        case 'rating': return (a.rating - b.rating) * dir;
        default: return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * dir;
      }
    });
    return filtered;
  }, [previousClasses, search, categoryFilter, sort, sortDir]);

  const categoryOptions = Object.entries(categoryLabels);
  const activeCount = previousClasses.length;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Previous Classes"
        subtitle={`${activeCount} class${activeCount !== 1 ? 'es' : ''} that have ended or been archived`}
      />

      {/* Info banner */}
      {activeCount > 0 && (
        <div className="flex items-center gap-3 text-sm bg-muted/50 rounded-lg px-4 py-3 text-muted-foreground">
          <Archive className="h-5 w-5 shrink-0" />
          <span>These classes are no longer active. You can still view their content and analytics.</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search previous classes..." className="pl-9" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_at">Last Modified</SelectItem>
            <SelectItem value="title">Name</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
          <ChevronDown className={`h-4 w-4 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
        </Button>
        <div className="hidden sm:block w-px h-8 bg-border" />
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`} title="Grid view">
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`} title="List view">
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Separator />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : displayedClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Archive className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No previous classes</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {search || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'No classes have ended yet'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedClasses.map((item) => (
            <PreviousClassCard key={item.uuid} item={item} />
          ))}
        </div>
      ) : (
        <div className="space-y-0.5">
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground">
            <div className="w-20 shrink-0" />
            <div className="flex-1">Title</div>
            <div className="hidden md:flex items-center gap-4 shrink-0">Stats</div>
            <div className="hidden lg:block w-16 text-right shrink-0">Price</div>
            <div className="w-8 shrink-0" />
          </div>
          {displayedClasses.map((item) => (
            <PreviousClassRow key={item.uuid} item={item} />
          ))}
        </div>
      )}

      {!loading && displayedClasses.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {displayedClasses.length} of {previousClasses.length} previous classes
        </p>
      )}
    </div>
  );
};

export default PreviousClassesPage;
