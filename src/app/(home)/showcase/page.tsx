"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Database, TrendingUp, Users, FileText, Activity, Download,
  SlidersHorizontal, LayoutGrid, Navigation, Bell, Wrench
} from "lucide-react"

// Category 1
import { SearchInput } from "@/components/common/search-input"
import { DataTableGeneric, type ColumnDef } from "@/components/common/data-table-generic"
import { DataTableToolbar } from "@/components/common/data-table-toolbar"
import { CustomPagination } from "@/components/common/custom-pagination"
import { SortHeader } from "@/components/common/sort-header"
import { SelectionBar } from "@/components/common/selection-bar"
import { TableRowSkeleton } from "@/components/common/table-row-skeleton"

// Category 2
import { ExcelExportButton, type ExcelColumn } from "@/components/common/excel-export-button"

// Category 3
import { FiltersModal, type FilterFieldConfig } from "@/components/common/filters-modal"
import { DateRangePicker } from "@/components/common/date-range-picker"
import { ActiveFilters, type ActiveFilter } from "@/components/common/active-filters"
import { FilterBadge } from "@/components/common/filter-badge"
import { DatePicker } from "@/components/common/date-picker"

// Category 4
import { FormModal } from "@/components/common/form-modal"
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog"
import { DetailDrawer } from "@/components/common/detail-drawer"
import { TextField, DateField, SelectField, TextAreaField } from "@/components/common/form-fields"

// Category 5
import { StatCard } from "@/components/common/stat-card"
import { StatCardGrid } from "@/components/common/stat-card-grid"
import { StatusBadge } from "@/components/common/status-badge"
import { AvatarWithName } from "@/components/common/avatar-with-name"
import { JsonViewer } from "@/components/common/json-viewer"
import { FileUploadZone } from "@/components/common/file-upload-zone"

// Category 6
import { PageHeader } from "@/components/common/page-header"
import { BreadcrumbBuilder } from "@/components/common/breadcrumb-builder"
import { TabLayout } from "@/components/common/tab-layout"

// Category 7
import { LoadingOverlay } from "@/components/common/loading-overlay"
import { CopyButton } from "@/components/common/copy-button"
import { toastSuccess, toastError, toastWarning, toastInfo, toastLoading } from "@/components/common/toast-wrapper"

// Category 8
import { RTLProvider } from "@/components/common/rtl-provider"
import { DebouncedInput } from "@/components/common/debounced-input"
import { FormattedMessage } from "@/components/common/formatted-message"

// ─── Demo data ──────────────────────────────────────────────────────────────────

interface DemoRecord {
  id: number
  name: string
  status: string
  date: string
  amount: number
}

const DEMO_DATA: DemoRecord[] = [
  { id: 1, name: "أحمد محمد", status: "active", date: "2024-01-15", amount: 1500 },
  { id: 2, name: "فاطمة علي", status: "pending", date: "2024-02-20", amount: 2300 },
  { id: 3, name: "خالد حسن", status: "rejected", date: "2024-03-10", amount: 870 },
  { id: 4, name: "نورة سعد", status: "approved", date: "2024-04-05", amount: 3200 },
  { id: 5, name: "عمر يوسف", status: "inactive", date: "2024-05-18", amount: 410 },
]

const DEMO_COLUMNS: ColumnDef<DemoRecord>[] = [
  { key: "name", label: "الاسم", sortable: true },
  { key: "status", label: "الحالة", sortable: true, render: (row) => <StatusBadge variant={row.status as "active" | "inactive" | "pending" | "approved" | "rejected"} /> },
  { key: "date", label: "التاريخ", sortable: true },
  { key: "amount", label: "المبلغ", sortable: true, render: (row) => `${row.amount.toLocaleString()} ر.س` },
]

const EXCEL_COLUMNS: ExcelColumn[] = [
  { key: "name", header: "الاسم", width: 24 },
  { key: "status", header: "الحالة", width: 16 },
  { key: "date", header: "التاريخ", width: 16 },
  { key: "amount", header: "المبلغ", width: 14 },
]

const FILTER_FIELDS: FilterFieldConfig[] = [
  { key: "name", label: "الاسم", type: "text", placeholder: "ابحث بالاسم..." },
  { key: "status", label: "الحالة", type: "select", options: [
    { value: "active", label: "نشط" },
    { value: "inactive", label: "غير نشط" },
    { value: "pending", label: "قيد الانتظار" },
  ]},
  { key: "dateRange", label: "نطاق التاريخ", type: "dateRange" },
]

// ─── Section helper ──────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

// ─── Tab contents ────────────────────────────────────────────────────────────────

function TableDataTab() {
  const [searchValue, setSearchValue] = useState("")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set())

  return (
    <div className="space-y-6" dir="rtl">
      <Section title="SearchInput - حقل البحث">
        <SearchInput onSearch={setSearchValue} placeholder="ابحث بالاسم أو الرقم..." />
        <p className="text-xs text-muted-foreground">القيمة الحالية: {searchValue || "(فارغ)"}</p>
      </Section>

      <Section title="DataTableGeneric - جدول بيانات عام">
        <DataTableGeneric
          columns={DEMO_COLUMNS}
          data={DEMO_DATA}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={(row) => toastInfo(`تعديل: ${row.name}`)}
          onDelete={(row) => toastWarning(`حذف: ${row.name}`)}
          emptyMessage="لا توجد بيانات"
        />
      </Section>

      <Section title="DataTableToolbar - شريط أدوات الجدول">
        <DataTableToolbar
          onSearch={(v) => toastInfo(`بحث: ${v}`)}
          searchPlaceholder="ابحث في السجلات..."
          onFilterClick={() => toastInfo("فتح الفلاتر")}
          hasActiveFilters={false}
          onExportClick={() => toastInfo("تصدير")}
          onAddClick={() => toastInfo("إضافة جديد")}
          addLabel="إضافة سجل"
        />
      </Section>

      <Section title="CustomPagination - ترقيم الصفحات">
        <CustomPagination
          currentPage={page}
          totalPages={10}
          perPage={10}
          onPageChange={setPage}
          onPerPageChange={() => {}}
        />
      </Section>

      <Section title="SortHeader - رأس عمود قابل للترتيب">
        <table className="w-full border rounded-md">
          <thead>
            <tr>
              <SortHeader label="الاسم" active direction="asc" onSort={() => {}} />
              <SortHeader label="التاريخ" active={false} onSort={() => {}} />
              <SortHeader label="المبلغ" active direction="desc" onSort={() => {}} />
            </tr>
          </thead>
        </table>
      </Section>

      <Section title="SelectionBar - شريط التحديد">
        <SelectionBar
          count={3}
          onClear={() => {}}
          actions={[
            { label: "حذف", variant: "destructive" as const, onClick: () => toastWarning("حذف 3 عناصر") },
          ]}
        />
      </Section>

      <Section title="TableRowSkeleton - هيكل تحميل الجدول">
        <TableRowSkeleton columns={4} rows={4} showCheckbox showActions />
      </Section>
    </div>
  )
}

function ExportPrintTab() {
  return (
    <div className="space-y-6" dir="rtl">
      <Section title="ExcelExportButton - زر تصدير Excel">
        <ExcelExportButton
          columns={EXCEL_COLUMNS}
          data={DEMO_DATA.map((d) => ({
            name: d.name,
            status: d.status,
            date: d.date,
            amount: d.amount,
          }))}
          filename="بيانات-تجريبية"
        />
        <p className="text-xs text-muted-foreground mt-2">يقوم بتصدير البيانات المعروضة أعلاه إلى ملف Excel</p>
      </Section>

      <Section title="PrintButton - زر الطباعة">
        <Button onClick={() => toastInfo("يتم تشغيل الطباعة عبر PrintButton مع contentRef")}>
          <Download className="ml-2 h-4 w-4" />
          محاكاة الطباعة
        </Button>
        <p className="text-xs text-muted-foreground mt-2">يستخدم react-to-print لطباعة محتوى ref محدد</p>
      </Section>

      <Section title="PdfExportButton - زر تصدير PDF">
        <Button variant="outline" onClick={() => toastInfo("يتم تصدير PDF عبر PdfExportButton مع targetRef")}>
          محاكاة تصدير PDF
        </Button>
        <p className="text-xs text-muted-foreground mt-2">يستخدم html2canvas + jsPDF لتصدير أي عنصر كـ PDF</p>
      </Section>
    </div>
  )
}

function FiltersTab() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { key: "status", label: "الحالة", value: "نشط" },
    { key: "date", label: "التاريخ", value: "2024-01 - 2024-06" },
  ])
  const [dateFrom, setDateFrom] = useState("2024-01-01")
  const [dateTo, setDateTo] = useState("2024-06-30")
  const [selectedDate, setSelectedDate] = useState("")

  return (
    <div className="space-y-6" dir="rtl">
      <Section title="FiltersModal - نافذة الفلاتر العامة">
        <FiltersModal
          fields={FILTER_FIELDS}
          values={{}}
          onApply={() => toastSuccess("تم تطبيق الفلاتر")}
          onReset={() => toastInfo("تم إعادة تعيين الفلاتر")}
        />
      </Section>

      <Section title="DatePicker - منتقي التاريخ">
        <div className="max-w-xs space-y-3">
          <DatePicker
            label="اختر التاريخ"
            value={selectedDate}
            onChange={setSelectedDate}
          />
          <p className="text-xs text-muted-foreground">
            القيمة المختارة: {selectedDate || "(لم يتم الاختيار)"}
          </p>
        </div>
      </Section>

      <Section title="DateRangePicker - منتقي نطاق التاريخ">
        <DateRangePicker
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
        />
        <p className="text-xs text-muted-foreground">
          من: {dateFrom} | إلى: {dateTo}
        </p>
      </Section>

      <Section title="ActiveFilters - الفلاتر النشطة">
        <ActiveFilters
          filters={activeFilters}
          onRemove={(key) => setActiveFilters((prev) => prev.filter((f) => f.key !== key))}
          onClearAll={() => setActiveFilters([])}
        />
      </Section>

      <Section title="FilterBadge - شارة فلتر">
        <div className="flex gap-2 flex-wrap">
          <FilterBadge label="الاسم" value="أحمد" onRemove={() => {}} />
          <FilterBadge label="الحالة" value="نشط" onRemove={() => {}} />
          <FilterBadge label="التاريخ" value="2024" onRemove={() => {}} />
        </div>
      </Section>
    </div>
  )
}

function FormsTab() {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="space-y-6" dir="rtl">
      <Section title="FormModal - نافذة النموذج">
        <Button onClick={() => setFormOpen(true)}>فتح نموذج</Button>
        <FormModal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={() => { toastSuccess("تم الحفظ"); setFormOpen(false) }}
          title="إضافة سجل جديد"
        >
          <TextField label="الاسم" value="" onChange={() => {}} placeholder="أدخل الاسم..." required />
          <DateField label="التاريخ" value="" onChange={() => {}} />
          <SelectField label="النوع" value="" onChange={() => {}} options={[
            { value: "type1", label: "نوع 1" },
            { value: "type2", label: "نوع 2" },
          ]} />
          <TextAreaField label="ملاحظات" value="" onChange={() => {}} placeholder="أضف ملاحظات..." />
        </FormModal>
      </Section>

      <Section title="DeleteConfirmDialog - نافذة تأكيد الحذف">
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>حذف عنصر</Button>
        <DeleteConfirmDialog
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={() => { toastSuccess("تم الحذف"); setDeleteOpen(false) }}
          message="هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."
          itemName="سجل أحمد محمد #1234"
        />
      </Section>

      <Section title="DetailDrawer - درج التفاصيل">
        <Button variant="outline" onClick={() => setDrawerOpen(true)}>عرض التفاصيل</Button>
        <DetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="تفاصيل السجل"
          description="معلومات مفصلة عن السجل المحدد"
          fields={[
            { label: "الرقم", value: "#1234" },
            { label: "الاسم", value: "أحمد محمد" },
            { label: "البريد الإلكتروني", value: "ahmed@example.com" },
            { label: "الحالة", value: <StatusBadge variant="active" /> },
            { label: "تاريخ الإنشاء", value: "2024-01-15" },
          ]}
          actions={
            <div className="flex gap-2 w-full">
              <Button className="flex-1" onClick={() => { toastInfo("تعديل"); setDrawerOpen(false) }}>تعديل</Button>
              <Button variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>إغلاق</Button>
            </div>
          }
        />
      </Section>

      <Section title="FormFields - حقول النموذج">
        <div className="space-y-3">
          <TextField label="حقل نصي" value="قيمة تجريبية" onChange={() => {}} placeholder="نص..." />
          <DateField label="حقل تاريخ" value="2024-06-15" onChange={() => {}} />
          <SelectField label="حقل اختيار" value="opt1" onChange={() => {}} options={[
            { value: "opt1", label: "الخيار الأول" },
            { value: "opt2", label: "الخيار الثاني" },
          ]} />
          <TextAreaField label="حقل نص طويل" value="نص تجريبي للعرض" onChange={() => {}} rows={2} />
          <TextField label="حقل مع خطأ" value="" onChange={() => {}} error="هذا الحقل مطلوب" required />
        </div>
      </Section>
    </div>
  )
}

function DisplayTab() {
  return (
    <div className="space-y-6" dir="rtl">
      <Section title="StatCard + StatCardGrid - بطاقات الإحصائيات">
        <StatCardGrid>
          <StatCard title="إجمالي السجلات" value="1,247" change="+12.5%" changeLabel="من الشهر الماضي" trend="up" icon={Database} />
          <StatCard title="المستخدمين" value="84" change="+3.2%" changeLabel="من الشهر الماضي" trend="up" icon={Users} />
          <StatCard title="التقارير" value="156" change="-1.4%" changeLabel="من الشهر الماضي" trend="down" icon={FileText} />
          <StatCard title="النشاط" value="94.2%" change="+8.1%" changeLabel="من الشهر الماضي" trend="up" icon={Activity} />
        </StatCardGrid>
      </Section>

      <Section title="StatusBadge - شارات الحالة">
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant="active" />
          <StatusBadge variant="inactive" />
          <StatusBadge variant="pending" />
          <StatusBadge variant="approved" />
          <StatusBadge variant="rejected" />
          <StatusBadge variant="warning" />
          <StatusBadge variant="default" label="مخصص" />
          <StatusBadge variant="active" label="مخصص" dot={false} />
        </div>
      </Section>

      <Section title="AvatarWithName - صورة مع اسم">
        <div className="space-y-3">
          <AvatarWithName name="أحمد محمد" subtitle="مدير النظام" size="lg" />
          <AvatarWithName name="فاطمة علي" subtitle="محلل بيانات" size="md" />
          <AvatarWithName name="خالد" size="sm" />
        </div>
      </Section>

      <Section title="JsonViewer - عارض JSON">
        <JsonViewer
          data={{ id: 1, name: "أحمد", roles: ["admin", "editor"], settings: { theme: "dark", lang: "ar" } }}
          title="بيانات المستخدم"
          defaultExpanded
        />
      </Section>

      <Section title="FileUploadZone - منطقة رفع الملفات">
        <FileUploadZone
          onFilesSelected={(files) => toastSuccess(`تم اختيار ${files.length} ملف`)}
          accept=".png,.jpg,.pdf"
          description="PNG, JPG, PDF حتى 10MB"
        />
      </Section>
    </div>
  )
}

function NavigationTab() {
  return (
    <div className="space-y-6" dir="rtl">
      <Section title="PageHeader - رأس الصفحة">
        <PageHeader
          title="عنوان الصفحة"
          description="وصف مختصر للصفحة"
          actions={
            <>
              <Button variant="outline">تصدير</Button>
              <Button>إضافة جديد</Button>
            </>
          }
        />
        <Separator />
        <PageHeader title="صفحة بدون أزرار" description="رأس صفحة بسيط بدون إجراءات" />
      </Section>

      <Section title="BreadcrumbBuilder - مسار التنقل">
        <BreadcrumbBuilder />
        <p className="text-xs text-muted-foreground">يتم إنشاؤه تلقائياً من مسار URL الحالي</p>
      </Section>

      <Section title="TabLayout - تخطيط التبويبات">
        <TabLayout
          tabs={[
            { value: "tab1", label: "التبويب الأول", content: <p className="text-sm text-muted-foreground p-4">محتوى التبويب الأول</p> },
            { value: "tab2", label: "التبويب الثاني", content: <p className="text-sm text-muted-foreground p-4">محتوى التبويب الثاني</p> },
            { value: "tab3", label: "التبويب الثالث", content: <p className="text-sm text-muted-foreground p-4">محتوى التبويب الثالث</p> },
          ]}
        />
      </Section>

      <Section title="CommandPalette - لوحة الأوامر">
        <Badge variant="outline" className="gap-1">
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">Ctrl</kbd>
          <span>+</span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">K</kbd>
          <span className="text-xs">لفتح لوحة البحث</span>
        </Badge>
        <p className="text-xs text-muted-foreground">اضغط Ctrl+K في أي صفحة لفتح لوحة الأوامر</p>
      </Section>
    </div>
  )
}

function FeedbackTab() {
  const [loading, setLoading] = useState(false)

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Section title="LoadingOverlay - غطاء التحميل">
        <div className="flex gap-2">
          <Button onClick={simulateLoading} disabled={loading}>
            {loading ? "جاري التحميل..." : "محاكاة التحميل"}
          </Button>
        </div>
        <div className="relative border rounded-md p-6 min-h-[120px]">
          <LoadingOverlay isLoading={loading} label="جاري تحميل البيانات...">
            <p className="text-sm text-muted-foreground text-center">محتوى المنطقة</p>
          </LoadingOverlay>
        </div>
      </Section>

      <Section title="Toast Notifications - إشعارات">
        <div className="flex flex-wrap gap-2">
          <Button variant="default" onClick={() => toastSuccess("تمت العملية بنجاح!")}>
            نجاح
          </Button>
          <Button variant="destructive" onClick={() => toastError("حدث خطأ!")}>
            خطأ
          </Button>
          <Button variant="outline" onClick={() => toastWarning("تحذير مهم!")}>
            تحذير
          </Button>
          <Button variant="secondary" onClick={() => toastInfo("معلومة إضافية")}>
            معلومة
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const id = toastLoading("جاري المعالجة...", { description: "يرجى الانتظار" })
              setTimeout(() => {
                import("sonner").then(({ toast }) => toast.dismiss(id))
                toastSuccess("تمت المعالجة!")
              }, 3000)
            }}
          >
            تحميل
          </Button>
        </div>
      </Section>

      <Section title="CopyButton - زر النسخ">
        <div className="flex items-center gap-3">
          <CopyButton value="نص قابل للنسخ" />
          <CopyButton value="12345" label="نسخ الرقم" copiedLabel="تم!" showTooltip={false} />
        </div>
      </Section>

      <Section title="ProgressIndicator - مؤشر التقدم">
        <p className="text-xs text-muted-foreground">
          شريط تقدم علوي يظهر أثناء التنقل بين الصفحات أو تحميل البيانات
        </p>
        <Button variant="outline" size="sm" onClick={simulateLoading}>
          محاكاة مؤشر التقدم
        </Button>
      </Section>
    </div>
  )
}

function UtilityTab() {
  const [debouncedValue, setDebouncedValue] = useState("")

  return (
    <div className="space-y-6" dir="rtl">
      <Section title="RTLProvider - مزود الاتجاه">
        <RTLProvider>
          <div className="border rounded-md p-3">
            <p className="text-sm">هذا المحتوى يتم عرضه من اليمين لليسار تلقائياً</p>
          </div>
        </RTLProvider>
      </Section>

      <Section title="DebouncedInput - حقل إدخال مؤجل">
        <DebouncedInput
          onChange={setDebouncedValue}
          placeholder="اكتب هنا..."
          debounceMs={500}
        />
        <p className="text-xs text-muted-foreground">
          القيمة المؤجلة: {debouncedValue || "(فارغ)"} — يتم التحديث بعد 500ms
        </p>
      </Section>

      <Section title="FormattedMessage - نص منسق">
        <FormattedMessage as="h3" className="text-lg font-bold">
          عنوان منسق بـ RTL
        </FormattedMessage>
        <FormattedMessage as="p" className="text-sm text-muted-foreground">
          نص عادي مع تنسيق تلقائي للاتجاه من اليمين لليسار
        </FormattedMessage>
        <FormattedMessage as="span" className="text-xs bg-muted px-2 py-1 rounded">
          span inline منسق
        </FormattedMessage>
      </Section>

      <Section title="PermissionGuard - حارس الصلاحيات">
        <p className="text-xs text-muted-foreground">
          يتحكم في ظهور المحتوى بناءً على دور المستخدم. يتكامل مع useAuthStore.
        </p>
        <Badge variant="outline">{"<PermissionGuard allowedRoles={['admin']}>...</PermissionGuard>"}</Badge>
      </Section>
    </div>
  )
}

// ─── Main Showcase Page ──────────────────────────────────────────────────────────

export default function ShowcasePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="عرض المكونات المشتركة"
        description="جميع المكونات المشتركة الـ 36 المعرفة في النظام معروضة هنا للمراجعة والاختبار"
      />

      <Tabs defaultValue="table" dir="rtl">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="table" className="gap-1.5 text-xs">
            <Database className="h-3.5 w-3.5" />
            البيانات والجداول
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            التصدير والطباعة
          </TabsTrigger>
          <TabsTrigger value="filters" className="gap-1.5 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            الفلاتر
          </TabsTrigger>
          <TabsTrigger value="forms" className="gap-1.5 text-xs">
            <LayoutGrid className="h-3.5 w-3.5" />
            النماذج
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-1.5 text-xs">
            <TrendingUp className="h-3.5 w-3.5" />
            العرض
          </TabsTrigger>
          <TabsTrigger value="navigation" className="gap-1.5 text-xs">
            <Navigation className="h-3.5 w-3.5" />
            التنقل
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" />
            الملاحظات
          </TabsTrigger>
          <TabsTrigger value="utility" className="gap-1.5 text-xs">
            <Wrench className="h-3.5 w-3.5" />
            الأدوات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6"><TableDataTab /></TabsContent>
        <TabsContent value="export" className="mt-6"><ExportPrintTab /></TabsContent>
        <TabsContent value="filters" className="mt-6"><FiltersTab /></TabsContent>
        <TabsContent value="forms" className="mt-6"><FormsTab /></TabsContent>
        <TabsContent value="display" className="mt-6"><DisplayTab /></TabsContent>
        <TabsContent value="navigation" className="mt-6"><NavigationTab /></TabsContent>
        <TabsContent value="feedback" className="mt-6"><FeedbackTab /></TabsContent>
        <TabsContent value="utility" className="mt-6"><UtilityTab /></TabsContent>
      </Tabs>
    </div>
  )
}
