import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Tag,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  icon: string;
  description: string;
  created_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    slug: "",
    icon: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name_ar");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("فشل تحميل الفئات");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        name_ar: category.name_ar,
        slug: category.slug,
        icon: category.icon || "",
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        name_ar: "",
        slug: "",
        icon: "",
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Auto-generate slug if empty
      const slug = formData.slug || generateSlug(formData.name);

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update({ ...formData, slug })
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        // Create new category
        const { error } = await supabase
          .from("categories")
          .insert([{ ...formData, slug }]);

        if (error) throw error;
        toast.success("تم إضافة الفئة بنجاح");
      }

      setIsDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      if (error.code === "23505") {
        toast.error("هذا الاسم أو المعرف موجود مسبقاً");
      } else {
        toast.error(error.message || "حدث خطأ أثناء حفظ الفئة");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟ سيتم إزالة ارتباطها بالدورات.")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
      toast.success("تم حذف الفئة بنجاح");
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error("فشل حذف الفئة");
    }
  };

  const iconOptions = [
    "Camera",
    "Film",
    "Video",
    "Mic",
    "Palette",
    "Lightbulb",
    "Sparkles",
    "BookOpen",
    "Award",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-gradient-gold">
            إدارة الفئات
          </h2>
          <p className="text-muted-foreground mt-1">
            إضافة وتعديل فئات الدورات التدريبية
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="btn-gradient-gold text-background"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة فئة جديدة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card/50 border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Tag className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gradient-gold">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground">إجمالي الفئات</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card/50 border-border/50">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الأيقونة</TableHead>
                <TableHead className="text-right">الاسم بالعربية</TableHead>
                <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                <TableHead className="text-right">المعرف (Slug)</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد فئات</p>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {category.icon}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {category.name_ar}
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(category.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg glass border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-display">
              {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "قم بتعديل بيانات الفئة"
                : "أضف فئة جديدة للدورات"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name_ar">الاسم بالعربية *</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) =>
                  setFormData({ ...formData, name_ar: e.target.value })
                }
                required
                placeholder="مثال: التصوير الفوتوغرافي"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">الاسم بالإنجليزية *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: formData.slug || generateSlug(name),
                  });
                }}
                required
                placeholder="Example: Photography"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">المعرف (Slug) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                placeholder="photography"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                يستخدم في الروابط (حروف إنجليزية صغيرة وشرطات فقط)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">الأيقونة</Label>
              <select
                id="icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">اختر أيقونة</option>
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="وصف مختصر للفئة..."
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="btn-gradient-gold text-background"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : editingCategory ? (
                  "تحديث"
                ) : (
                  "إضافة"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
