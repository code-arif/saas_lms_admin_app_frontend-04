import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  ChevronLeft,
  Calendar,
  Download,
  Share2,
  ThumbsUp,
  MessageSquare,
  ListMusic,
  Maximize2,
  Volume2,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import {
  classService,
  categoryLabels,
  levelLabels,
  type ClassItem,
} from '@/features/classes/services/classService';

// ─── Helper Components ────────────────────────────────────────────

const RatingStars = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const cls = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';
  if (rating === 0) return <span className="text-xs text-muted-foreground">No ratings</span>;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
      <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

// ─── Video Player ─────────────────────────────────────────────────

const VideoPlayer = ({ videoUrl, title }: { videoUrl?: string; title: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden aspect-video group">
      {videoUrl ? (
        <video
          className="w-full h-full object-cover"
          src={videoUrl}
          controls={isPlaying}
          poster=""
          onClick={() => setIsPlaying(true)}
        />
      ) : null}

      {/* Play overlay when not playing */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={() => setIsPlaying(true)}>
          <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center transition-transform hover:scale-110">
            <Play className="h-7 w-7 text-foreground ml-1" />
          </div>
        </div>
      )}

      {/* Controls overlay */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-white hover:text-white/80 transition-colors">
                <Play className="h-5 w-5" />
              </button>
              <button className="text-white/70 hover:text-white transition-colors">
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-white/70 hover:text-white transition-colors">
                <Download className="h-4 w-4" />
              </button>
              <button className="text-white/70 hover:text-white transition-colors">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <div className="h-full w-1/3 bg-white rounded-full" />
          </div>
        </div>
      )}

      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent h-16 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-3">
          <Badge variant="secondary" className="text-[10px] bg-black/50 text-white border-0">
            <Play className="h-3 w-3 mr-1" /> Preview
          </Badge>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar Lesson / Info Panel ──────────────────────────────────

const LessonItem = ({ number, title, duration, isActive, onClick }: { number: number; title: string; duration: string; isActive?: boolean; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
    }`}>
    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/10 text-muted-foreground'
    }`}>
      {isActive ? <Play className="h-3 w-3" /> : number}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm truncate">{title}</p>
      <p className="text-xs text-muted-foreground">{duration}</p>
    </div>
    {isActive && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
  </div>
);

const mockLessons = [
  { number: 1, title: 'Introduction & Overview', duration: '12:30' },
  { number: 2, title: 'Core Concepts Explained', duration: '18:45' },
  { number: 3, title: 'Hands-on Practice Session', duration: '25:00' },
  { number: 4, title: 'Real-world Applications', duration: '20:15' },
  { number: 5, title: 'Quiz & Review', duration: '15:00' },
];

// ─── Main Class View Page ─────────────────────────────────────────

const ClassViewPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [classItem, setClassItem] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(1);

  useEffect(() => {
    if (!uuid) return;
    setLoading(true);
    classService.getByUuid(uuid).then((res) => {
      setClassItem(res.data);
      setLoading(false);
    });
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading class...</p>
        </div>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <p className="text-lg font-medium">Class not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/classes')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Classes
        </Button>
      </div>
    );
  }

  const c = classItem;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/classes')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Classes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Main Content ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer videoUrl={c.video_url} title={c.title} />

          {/* Title & Actions */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold">{c.title}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <Badge variant="secondary" className="capitalize">
                    {categoryLabels[c.category] || c.category}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {levelLabels[c.level] || c.level}
                  </Badge>
                  <Badge variant={
                    c.status === 'active' ? 'success' :
                    c.status === 'draft' ? 'secondary' : 'outline'
                  } className="capitalize">
                    {c.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="icon" title="Share">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Download">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Like">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {c.students_enrolled} students
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {c.duration_minutes} min
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {c.lessons_count} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Started {formatDate(c.start_date)}
              </span>
            </div>

            <div className="mt-3">
              <RatingStars rating={c.rating} size="md" />
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">About This Class</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {c.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator />

          {/* Instructor */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Instructor</h2>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{c.instructor}</p>
                <p className="text-sm text-muted-foreground">Course Instructor</p>
              </div>
            </div>
          </div>

          {/* Reviews placeholder */}
          <Separator />
          <div>
            <h2 className="text-lg font-semibold mb-3">Reviews</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>No reviews yet. Be the first to review this class.</span>
            </div>
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {c.price === 0 ? 'Free' : `$${c.price.toFixed(2)}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  One-time payment • Lifetime access
                </p>
              </div>
              <Button className="w-full" size="lg">
                {c.price === 0 ? 'Enroll Free' : 'Enroll Now'}
              </Button>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Full lifetime access
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {c.lessons_count} on-demand video lessons
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Certificate of completion
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Access on mobile & desktop
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <ListMusic className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Course Content</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {mockLessons.length} lessons
                </Badge>
              </div>
              <div className="space-y-1">
                {mockLessons.map((lesson) => (
                  <LessonItem
                    key={lesson.number}
                    {...lesson}
                    isActive={lesson.number === activeLesson}
                    onClick={() => setActiveLesson(lesson.number)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructor Card (Mobile) */}
          <Card className="lg:hidden">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{c.instructor}</p>
                  <p className="text-xs text-muted-foreground">Course Instructor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassViewPage;
