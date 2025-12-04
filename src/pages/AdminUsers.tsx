import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  Search,
  Loader2,
  RefreshCw,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  UserPlus,
  Upload,
  Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/context/AuthContext";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Manual user creation
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user" as "user" | "admin",
    status: "approved" as "pending" | "approved" | "rejected",
  });

  // Bulk import
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedUsers, setParsedUsers] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<{
    success: any[];
    errors: any[];
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, statusFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("فشل تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) throw error;

      toast.success(
        newStatus === "approved"
          ? "تم قبول المستخدم"
          : newStatus === "rejected"
          ? "تم رفض المستخدم"
          : "تم تحديث حالة المستخدم"
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setCreateLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("يجب تسجيل الدخول");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            users: [newUser],
          }),
        }
      );

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        toast.error(result.errors[0].error || "فشل إنشاء المستخدم");
      } else if (result.success && result.success.length > 0) {
        toast.success("تم إنشاء المستخدم بنجاح");
        setCreateDialogOpen(false);
        setNewUser({
          email: "",
          password: "",
          full_name: "",
          role: "user",
          status: "approved",
        });
        fetchUsers();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("حدث خطأ أثناء إنشاء المستخدم");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel columns to user data
        const users = jsonData.map((row: any) => ({
          email: row.email || row.Email || row.البريد || "",
          password: row.password || row.Password || row.كلمة_المرور || "",
          full_name: row.full_name || row.name || row.Name || row.الاسم || "",
          role: (row.role || row.Role || row.الدور || "user").toLowerCase(),
          status: (row.status || row.Status || row.الحالة || "approved").toLowerCase(),
        }));

        setParsedUsers(users);
        toast.success(`تم تحميل ${users.length} مستخدم من الملف`);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        toast.error("فشل قراءة ملف Excel");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleBulkImport = async () => {
    if (parsedUsers.length === 0) {
      toast.error("لا يوجد مستخدمين للاستيراد");
      return;
    }

    setBulkLoading(true);
    setImportResults(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("يجب تسجيل الدخول");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            users: parsedUsers,
          }),
        }
      );

      const result = await response.json();
      setImportResults(result);

      if (result.success && result.success.length > 0) {
        toast.success(`تم إنشاء ${result.success.length} مستخدم بنجاح`);
        fetchUsers();
      }

      if (result.errors && result.errors.length > 0) {
        toast.error(`فشل إنشاء ${result.errors.length} مستخدم`);
      }
    } catch (error) {
      console.error("Error bulk importing:", error);
      toast.error("حدث خطأ أثناء الاستيراد");
    } finally {
      setBulkLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        email: "user@example.com",
        password: "password123",
        full_name: "اسم المستخدم",
        role: "user",
        status: "approved",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users-template.xlsx");
    toast.success("تم تنزيل ملف النموذج");
  };

  const getInitials = (profile: Profile) => {
    if (profile.full_name) {
      const names = profile.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return profile.full_name.slice(0, 2).toUpperCase();
    }
    if (profile.email) {
      return profile.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="w-3 h-3 ml-1" />
            مقبول
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 ml-1" />
            مرفوض
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 ml-1" />
            قيد المراجعة
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = users.filter((u) => u.status === "pending").length;
  const approvedCount = users.filter((u) => u.status === "approved").length;
  const rejectedCount = users.filter((u) => u.status === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-display text-gradient-gold">
          إدارة المستخدمين
        </h2>
        <p className="text-muted-foreground mt-1">
          مراجعة وقبول أو رفض طلبات التسجيل
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-card/50 border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gradient-gold">
                {users.length}
              </div>
              <div className="text-sm text-muted-foreground">إجمالي المستخدمين</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {pendingCount}
              </div>
              <div className="text-sm text-muted-foreground">قيد المراجعة</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {approvedCount}
              </div>
              <div className="text-sm text-muted-foreground">مقبول</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {rejectedCount}
              </div>
              <div className="text-sm text-muted-foreground">مرفوض</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-4 bg-card/50 border-border/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد المراجعة</SelectItem>
              <SelectItem value="approved">مقبول</SelectItem>
              <SelectItem value="rejected">مرفوض</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={fetchUsers}
            className="border-border/50"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>

          {/* Create User Button */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient-gold">
                <UserPlus className="w-4 h-4 ml-2" />
                إضافة مستخدم
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                <DialogDescription>
                  إنشاء حساب مستخدم جديد في الأكاديمية
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">الاسم الكامل *</Label>
                  <Input
                    id="full_name"
                    placeholder="الاسم الكامل"
                    value={newUser.full_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">الدور</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: "user" | "admin") =>
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">مستخدم</SelectItem>
                        <SelectItem value="admin">مدير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(
                        value: "pending" | "approved" | "rejected"
                      ) => setNewUser({ ...newUser, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد المراجعة</SelectItem>
                        <SelectItem value="approved">مقبول</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  className="flex-1"
                  disabled={createLoading}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleCreateUser}
                  className="flex-1 btn-gradient-gold"
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "إنشاء المستخدم"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bulk Import Button */}
          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-secondary/50 text-secondary">
                <Upload className="w-4 h-4 ml-2" />
                استيراد جماعي
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>استيراد المستخدمين من Excel</DialogTitle>
                <DialogDescription>
                  قم برفع ملف Excel يحتوي على بيانات المستخدمين
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Download Template */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">قالب Excel</p>
                    <p className="text-sm text-muted-foreground">
                      قم بتنزيل القالب وملء بيانات المستخدمين
                    </p>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="w-4 h-4 ml-2" />
                    تنزيل القالب
                  </Button>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>رفع ملف Excel</Label>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {uploadedFile && (
                    <p className="text-sm text-muted-foreground">
                      الملف: {uploadedFile.name}
                    </p>
                  )}
                </div>

                {/* Preview */}
                {parsedUsers.length > 0 && (
                  <div className="space-y-2">
                    <Label>معاينة ({parsedUsers.length} مستخدم)</Label>
                    <div className="max-h-48 overflow-y-auto border border-border/50 rounded-lg p-3 bg-muted/20">
                      {parsedUsers.slice(0, 5).map((user, idx) => (
                        <div
                          key={idx}
                          className="text-sm py-1 border-b border-border/30 last:border-0"
                        >
                          <span className="font-medium">{user.full_name}</span>
                          <span className="text-muted-foreground mx-2">•</span>
                          <span dir="ltr" className="text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      ))}
                      {parsedUsers.length > 5 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          ...و {parsedUsers.length - 5} مستخدمين آخرين
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Import Results */}
                {importResults && (
                  <div className="space-y-2">
                    <Label>نتائج الاستيراد</Label>
                    <div className="space-y-2">
                      {importResults.success.length > 0 && (
                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-sm text-green-400 font-medium">
                            ✓ تم إنشاء {importResults.success.length} مستخدم
                          </p>
                        </div>
                      )}
                      {importResults.errors.length > 0 && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg max-h-32 overflow-y-auto">
                          <p className="text-sm text-red-400 font-medium mb-2">
                            ✗ فشل إنشاء {importResults.errors.length} مستخدم
                          </p>
                          {importResults.errors.map((err, idx) => (
                            <p key={idx} className="text-xs text-red-400/80">
                              • {err.email}: {err.error}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBulkDialogOpen(false);
                    setParsedUsers([]);
                    setUploadedFile(null);
                    setImportResults(null);
                  }}
                  className="flex-1"
                  disabled={bulkLoading}
                >
                  {importResults ? "إغلاق" : "إلغاء"}
                </Button>
                {!importResults && (
                  <Button
                    onClick={handleBulkImport}
                    className="flex-1 btn-gradient-gold"
                    disabled={bulkLoading || parsedUsers.length === 0}
                  >
                    {bulkLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الاستيراد...
                      </>
                    ) : (
                      "استيراد المستخدمين"
                    )}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
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
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ التسجيل</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all"
                        ? "لا توجد نتائج"
                        : "لا يوجد مستخدمين"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border/50">
                          <AvatarImage src={profile.avatar_url || undefined} />
                          <AvatarFallback className="bg-secondary/20 text-secondary text-sm">
                            {getInitials(profile)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {profile.full_name || "بدون اسم"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span dir="ltr">{profile.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          profile.role === "admin" ? "default" : "secondary"
                        }
                        className={
                          profile.role === "admin"
                            ? "bg-secondary text-background"
                            : ""
                        }
                      >
                        {profile.role === "admin" ? "مدير" : "مستخدم"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(profile.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(profile.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {profile.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleStatusChange(profile.id, "approved")
                            }
                            className="text-green-400 hover:text-green-400 hover:bg-green-500/10"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        {profile.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleStatusChange(profile.id, "rejected")
                            }
                            className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Results count */}
        {!loading && (
          <div className="p-4 text-sm text-muted-foreground border-t border-border/50">
            عرض {filteredUsers.length} من {users.length} مستخدم
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-card/50 border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-3">
          ملاحظات هامة
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            • الأكاديمية غير مفتوحة للجميع - يجب قبول المستخدمين يدوياً من هذه
            الصفحة
          </p>
          <p>• المستخدمون المرفوضون لن يتمكنوا من الوصول إلى محتوى الدورات</p>
          <p>• يمكن تغيير حالة المستخدم في أي وقت</p>
          <p>
            • لتغيير دور مستخدم إلى مدير، يجب تعديل الحقل "role" في قاعدة
            البيانات مباشرة
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;
