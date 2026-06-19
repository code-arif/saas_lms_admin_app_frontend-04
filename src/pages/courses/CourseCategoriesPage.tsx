import { useState } from 'react';
import PageTitle from '@/components/common/PageTitle';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import CourseCategoryTable from '@/features/courseCategories/components/CourseCategoryTable';
import CourseCategoryForm from '@/features/courseCategories/components/CourseCategoryForm';
import {
  useCourseCategories,
  useCourseCategoryTree,
  useCreateCourseCategory,
  useUpdateCourseCategory,
  useDeleteCourseCategory,
  useToggleCourseCategory,
} from '@/features/courseCategories/hooks/useCourseCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { Plus } from 'lucide-react';
import type { CourseCategory, CourseCategoryFormData } from '@/features/courseCategories/types/courseCategory.types';

const CourseCategoriesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const [togglingUuid, setTogglingUuid] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data: response, isLoading } = useCourseCategories({
    page,
    per_page: 15,
    search: debouncedSearch || undefined,
    is_active: activeFilter === 'all' ? undefined : activeFilter === 'active',
  });

  const { data: treeResponse } = useCourseCategoryTree();
  const createMutation = useCreateCourseCategory();
  const updateMutation = useUpdateCourseCategory();
  const deleteMutation = useDeleteCourseCategory();
  const toggleMutation = useToggleCourseCategory();

  const categories = response?.data || [];
  const pagination = response?.pagination;

  // Build parent options from tree data for the form
  const parentOptions = (treeResponse?.data || []).map((cat: CourseCategory) => ({
    label: cat.name,
    value: cat.id,
  }));

  const handleCreate = (data: CourseCategoryFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        setEditingCategory(null);
      },
    });
  };

  const handleUpdate = (data: CourseCategoryFormData) => {
    if (!editingCategory) return;
    updateMutation.mutate(
      { uuid: editingCategory.uuid, data },
      {
        onSuccess: () => {
          setShowForm(false);
          setEditingCategory(null);
        },
      }
    );
  };

  const handleEdit = (category: CourseCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (deleteUuid) {
      deleteMutation.mutate(deleteUuid, {
        onSuccess: () => setDeleteUuid(null),
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Course Categories" subtitle="Organize courses with categories and subcategories">
        <Button size="sm" onClick={() => { setEditingCategory(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </PageTitle>

      <CourseCategoryTable
        categories={categories}
        isLoading={isLoading}
        totalCount={pagination?.total || 0}
        page={pagination?.current_page || page}
        perPage={pagination?.per_page || 15}
        onPageChange={setPage}
        onSearch={setSearch}
        onFilterActive={setActiveFilter}
        onEdit={handleEdit}
        onDelete={setDeleteUuid}
        onToggle={(uuid) => {
          setTogglingUuid(uuid);
          toggleMutation.mutate(uuid, {
            onSettled: () => setTogglingUuid(null),
          });
        }}
        togglingUuid={togglingUuid}
      />

      {/* Create / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditingCategory(null); } }}>
        <DialogContent className="max-w-full sm:max-w-2xl mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>
          <CourseCategoryForm
            initialData={editingCategory}
            parentOptions={parentOptions}
            mode={editingCategory ? 'edit' : 'create'}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(open) => !open && setDeleteUuid(null)}
        title="Delete Category"
        description="Are you sure you want to delete this course category? Categories with subcategories may be affected."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CourseCategoriesPage;
