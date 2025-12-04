import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Eye,
  EyeOff,
  Search,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  content: string;
  video_url: string;
  duration: string;
  level: string;
  instructor_name: string;
  price: number;
  is_published: boolean;
  category_id: string;
  created_at: string;
  updated_at: string;
}

const AdminCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail_url: "",
    content: "",
    video_url: "",
    duration: "",
    level: "beginner",
    instructor_name: "",
    price: 0,
    is_published: false,
    category_id: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name_ar");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("فشل تحميل الفئات");
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("فشل تحميل الدورات");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        thumbnail_url: course.thumbnail_url || "",
        content: course.content || "",
        video_url: course.video_url || "",
        duration: course.duration || "",
        level: course.level || "beginner",
        instructor_name: course.instructor_name || "",
        price: course.price || 0,
        is_published: course.is_published || false,
        category_id: course.category_id || "",
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        thumbnail_url: "",
        content: "",
        video_url: "",
        duration: "",
        level: "beginner",
        instructor_name: "",
        price: 0,
        is_published: false,
        category_id: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from("courses")
          .update(formData)
          .eq("id", editingCourse.id);

        if (error) throw error;
        toast.success("تم تحديث الدورة بنجاح");
      } else {
        // Create new course
        const { error } = await supabase
          .from("courses")
          .insert([{ ...formData, created_by: user?.id }]);

        if (error) throw error;
        toast.success("تم إضافة الدورة بنجاح");
      }

      setIsDialogOpen(false);
      fetchCourses();
    } catch (error: any) {
      console.error("Error saving course:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ الدورة");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدورة؟")) return;

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;
      toast.success("تم حذف الدورة بنجاح");
      fetchCourses();
    } catch (error: any) {
      console.error("Error deleting course:", error);
      toast.error("فشل حذف الدورة");
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_published: !course.is_published })
        .eq("id", course.id);

      if (error) throw error;
      toast.success(
        course.is_published ? "تم إخفاء الدورة" : "تم نشر الدورة"
      );
      fetchCourses();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("فشل تحديث حالة النشر");
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.includes(searchQuery) ||
      course.description.includes(searchQuery) ||
      course.instructor_name.includes(searchQuery)
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name_ar : "غير محدد";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-gradient-gold">
            إدارة الدورات
          </h2>
          <p className="text-muted-foreground mt-1">
            إضافة وتعديل وحذف الدورات التدريبية
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="btn-gradient-gold text-background"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة دورة جديدة
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 bg-card/50 border-border/50">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ابحث عن دورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
      </Card>

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
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الفئة</TableHead>
                <TableHead className="text-right">المدرب</TableHead>
                <TableHead className="text-right">المستوى</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد دورات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(course.category_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.instructor_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          course.level === "beginner"
                            ? "border-green-500/50 text-green-400"
                            : course.level === "intermediate"
                            ? "border-yellow-500/50 text-yellow-400"
                            : "border-red-500/50 text-red-400"
                        }
                      >
                        {course.level === "beginner"
                          ? "مبتدئ"
                          : course.level === "intermediate"
                          ? "متوسط"
                          : "متقدم"}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.price} د.م</TableCell>
                    <TableCell>
                      <Badge
                        variant={course.is_published ? "default" : "secondary"}
                        className={
                          course.is_published
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {course.is_published ? "منشور" : "مسودة"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTogglePublish(course)}
                        >
                          {course.is_published ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(course)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(course.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-display">
              {editingCourse ? "تعديل الدورة" : "إضافة دورة جديدة"}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? "قم بتعديل بيانات الدورة"
                : "أضف دورة جديدة إلى المنصة"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الدورة *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">الفئة *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">المستوى *</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المستوى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">مبتدئ</SelectItem>
                    <SelectItem value="intermediate">متوسط</SelectItem>
                    <SelectItem value="advanced">متقدم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url">رابط الفيديو (YouTube/Vimeo)</Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url}
                onChange={(e) =>
                  setFormData({ ...formData, video_url: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">رابط صورة الغلاف</Label>
              <Input
                id="thumbnail_url"
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor_name">اسم المدرب *</Label>
                <Input
                  id="instructor_name"
                  value={formData.instructor_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructor_name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">المدة</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="مثال: 10 ساعات"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">السعر (د.م) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوى الدورة</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={4}
                placeholder="تفاصيل محتوى الدورة..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({ ...formData, is_published: e.target.checked })
                }
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="is_published" className="cursor-pointer">
                نشر الدورة (يمكن للطلاب رؤيتها)
              </Label>
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
                ) : editingCourse ? (
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

export default AdminCourses;
