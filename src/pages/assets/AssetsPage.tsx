import { useState, useEffect, useMemo, useCallback } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
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
  MoreHorizontal,
  Download,
  Trash2,
  Share2,
  Pencil,
  Eye,
  FileText,
  Video,
  Image,
  FileSpreadsheet,
  Presentation,
  Music,
  Archive,
  File,
  Link,
  Loader2,
  Upload,
  ChevronDown,
  X,
  FolderOpen,
  HardDrive,
} from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { assetService, type Asset } from '@/features/assets/services/assetService';

// ─── File type helpers ────────────────────────────────────────────

type ViewMode = 'grid' | 'list';

interface FileTypeConfig {
  icon: typeof FileText;
  color: string;
  bgColor: string;
  label: string;
}

const fileTypeConfig: Record<string, FileTypeConfig> = {
  pdf:     { icon: FileText,        color: 'text-red-600',       bgColor: 'bg-red-50',          label: 'PDF' },
  video:   { icon: Video,           color: 'text-purple-600',    bgColor: 'bg-purple-50',       label: 'Video' },
  image:   { icon: Image,           color: 'text-emerald-600',   bgColor: 'bg-emerald-50',      label: 'Image' },
  doc:     { icon: FileText,        color: 'text-blue-600',      bgColor: 'bg-blue-50',         label: 'Word' },
  docx:    { icon: FileText,        color: 'text-blue-700',      bgColor: 'bg-blue-50',         label: 'Word' },
  xlsx:    { icon: FileSpreadsheet, color: 'text-emerald-600',   bgColor: 'bg-emerald-50',      label: 'Spreadsheet' },
  pptx:    { icon: Presentation,    color: 'text-orange-600',    bgColor: 'bg-orange-50',       label: 'Presentation' },
  zip:     { icon: Archive,         color: 'text-amber-600',     bgColor: 'bg-amber-50',        label: 'Archive' },
  audio:   { icon: Music,           color: 'text-pink-600',      bgColor: 'bg-pink-50',         label: 'Audio' },
  txt:     { icon: FileText,        color: 'text-slate-600',     bgColor: 'bg-slate-50',        label: 'Text' },
  link:    { icon: Link,            color: 'text-teal-600',      bgColor: 'bg-teal-50',         label: 'Link' },
  other:   { icon: File,            color: 'text-muted-foreground', bgColor: 'bg-muted',         label: 'File' },
};

function getFileConfig(type: string): FileTypeConfig {
  return fileTypeConfig[type] || fileTypeConfig.other;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ─── Filter chips ─────────────────────────────────────────────────

interface FilterChip {
  label: string;
  value: string;
  icon: typeof FileText;
}

const filterChips: FilterChip[] = [
  { label: 'All',       value: 'all',   icon: FolderOpen },
  { label: 'PDFs',      value: 'pdf',   icon: FileText },
  { label: 'Videos',    value: 'video', icon: Video },
  { label: 'Images',    value: 'image', icon: Image },
  { label: 'Docs',      value: 'doc',   icon: FileText },
  { label: 'Sheets',    value: 'xlsx',  icon: FileSpreadsheet },
  { label: 'Slides',    value: 'pptx',  icon: Presentation },
  { label: 'Audio',     value: 'audio', icon: Music },
  { label: 'Archives',  value: 'zip',   icon: Archive },
];

// ─── Sort options ─────────────────────────────────────────────────

const sortOptions = [
  { label: 'Name',       value: 'name' },
  { label: 'Size',       value: 'size' },
  { label: 'Last Modified', value: 'updated_at' },
];

// ─── Asset Card (Grid view) ───────────────────────────────────────

interface AssetCardProps {
  asset: Asset;
  onDelete: (uuid: string) => void;
}

const AssetCard = ({ asset, onDelete }: AssetCardProps) => {
  const config = getFileConfig(asset.type);
  const IconComponent = config.icon;

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30">
      <CardContent className="p-0">
        {/* Thumbnail area */}
        <div className={`h-32 flex items-center justify-center ${config.bgColor} relative`}>
          <IconComponent size={48} className={config.color} />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium truncate flex-1" title={asset.name}>
              {asset.name}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" /> Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil className="h-4 w-4 mr-2" /> Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(asset.uuid)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{formatFileSize(asset.size)}</span>
            <span>•</span>
            <span>{formatDate(asset.updated_at)}</span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {asset.uploaded_by}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Asset Row (List view) ────────────────────────────────────────

interface AssetRowProps {
  asset: Asset;
  onDelete: (uuid: string) => void;
}

const AssetRow = ({ asset, onDelete }: AssetRowProps) => {
  const config = getFileConfig(asset.type);
  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
      {/* Icon */}
      <div className={`h-9 w-9 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
        <IconComponent size={18} className={config.color} />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{asset.name}</p>
      </div>

      {/* Type */}
      <div className="hidden sm:block w-24 shrink-0">
        <Badge variant="secondary" className="text-[10px]">
          {config.label}
        </Badge>
      </div>

      {/* Size */}
      <div className="hidden md:block w-20 shrink-0 text-right">
        <span className="text-xs text-muted-foreground">{formatFileSize(asset.size)}</span>
      </div>

      {/* Modified */}
      <div className="hidden lg:block w-32 shrink-0">
        <span className="text-xs text-muted-foreground">{formatDate(asset.updated_at)}</span>
      </div>

      {/* Uploaded by */}
      <div className="hidden xl:block w-28 shrink-0">
        <span className="text-xs text-muted-foreground truncate block">{asset.uploaded_by}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Preview">
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Download">
          <Download className="h-3.5 w-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" /> Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(asset.uuid)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

// ─── Upload Dialog ────────────────────────────────────────────────

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadDialog = ({ open, onOpenChange }: UploadDialogProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    // Mock upload
    setTimeout(() => {
      setFiles([]);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Assets</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse. Supports PDFs, videos, images, documents, and more.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium">
              {dragOver ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse
            </p>
            <input
              id="file-upload-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                {files.length} file{files.length > 1 ? 's' : ''} selected
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1.5">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatFileSize(file.size)}
                    </span>
                    <button onClick={() => removeFile(i)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setFiles([]); onOpenChange(false); }}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0}>
              <Upload className="h-4 w-4 mr-1.5" />
              Upload {files.length > 0 ? `(${files.length})` : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Assets Page ─────────────────────────────────────────────

const AssetsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sort, setSort] = useState('updated_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  // Load assets
  useEffect(() => {
    assetService.getAll({ per_page: 100 }).then((res) => {
      setAssets(res.data);
      setLoading(false);
    });
  }, []);

  // Filtered & sorted assets
  const displayedAssets = useMemo(() => {
    let filtered = [...assets];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(q));
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter((a) => a.type === typeFilter);
    }

    filtered.sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name) * dir;
        case 'size': return (a.size - b.size) * dir;
        case 'updated_at':
        default:
          return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * dir;
      }
    });

    return filtered;
  }, [assets, search, typeFilter, sort, sortDir]);

  const handleDelete = (uuid: string) => {
    setAssets((prev) => prev.filter((a) => a.uuid !== uuid));
  };

  const toggleSortDir = () => {
    setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Storage stats
  const totalSize = useMemo(() => assets.reduce((sum, a) => sum + a.size, 0), [assets]);
  const usedPercent = Math.min((totalSize / 5_000_000_000) * 100, 100); // 5GB mock limit

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageTitle title="Assets" subtitle="Manage all your files, videos, documents, and more">
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </PageTitle>

      {/* Storage bar */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
        <HardDrive className="h-4 w-4 shrink-0" />
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <span className="shrink-0">
          {formatFileSize(totalSize)} / 5 GB used
        </span>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
        {filterChips.map((chip) => {
          const ChipIcon = chip.icon;
          const isActive = typeFilter === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => setTypeFilter(chip.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <ChipIcon size={13} />
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={toggleSortDir}
            title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                sortDir === 'asc' ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-px h-8 bg-border" />

        {/* View toggle */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
            title="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Separator />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : displayedAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No assets found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {search ? 'Try a different search term' : 'Upload your first asset to get started'}
          </p>
          {!search && (
            <Button variant="outline" className="mt-4" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-1.5" />
              Upload Assets
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid view */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayedAssets.map((asset) => (
            <AssetCard key={asset.uuid} asset={asset} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-0.5">
          {/* List header */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground">
            <div className="w-9 shrink-0" />
            <div className="flex-1">Name</div>
            <div className="hidden sm:block w-24 shrink-0">Type</div>
            <div className="hidden md:block w-20 shrink-0 text-right">Size</div>
            <div className="hidden lg:block w-32 shrink-0">Modified</div>
            <div className="hidden xl:block w-28 shrink-0">Uploaded by</div>
            <div className="w-24 shrink-0" />
          </div>
          {displayedAssets.map((asset) => (
            <AssetRow key={asset.uuid} asset={asset} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && displayedAssets.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {displayedAssets.length} of {assets.length} assets
        </p>
      )}

      {/* Upload Dialog */}
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
};

export default AssetsPage;
