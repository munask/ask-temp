# Backend Integration Guide

This guide explains how to connect UI components (filters, sorting, search, pagination) to your backend API using the `useApiData` hook.

## Overview

- **API Hook**: `useApiData<T>` from `@/hooks/useApi`
- **HTTP Client**: Axios at `@/lib/axiosClients`
- **Types**: `@/types/common` (`ApiResponse`, `ApiParams`, `Pagination`)
- **Auto-fetch**: When `enableFetch: true`, the hook automatically refetches when params change

---

## API Types

```typescript
// src/types/common.ts

interface ApiParams {
  page?: number | null;
  limit?: number | null;
  search?: string;
  [key: string]: unknown; // Any filter/sort params pass through
}

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: {
    items: T[];
    pagination: Pagination;
  };
}

interface Pagination {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}
```

---

## useApiData Hook API

### Initialization

```typescript
const api = useApiData<YourType>("/api/endpoint", {
  enableFetch: true,       // Auto-fetch when params change
  pagination: true,         // Adds page param automatically
  limitItems: 20,           // Per-page limit
  initialParams: {},        // Default filter/sort params
  retryCount: 1,
  retryDelay: 1000,
  enableOptimisticUpdates: false,
  infiniteScroll: false,
})
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `data` | `ApiResponse<T> \| null` | Response with items + pagination |
| `params` | `ApiParams` | Current query params |
| `loading` | `boolean` | Fetch in progress |
| `fetchError` | `string \| null` | Error message |
| `hasFetchError` | `boolean` | Has error |
| `get(customEndpoint?)` | `function` | Manual fetch |
| `post({ data, onSuccess, onError })` | `function` | Create |
| `put({ data, onSuccess, onError })` | `function` | Update |
| `patch({ data, onSuccess, onError })` | `function` | Partial update |
| `delete({ onSuccess, onError })` | `function` | Delete |
| `updateParams(newParams)` | `function` | Update query params (triggers auto-fetch) |
| `updatePage(page)` | `function` | Change page number |
| `loadMore()` | `function` | Next page (infinite scroll) |
| `refetch()` | `function` | Alias for get() |
| `reset()` | `function` | Clear all state |
| `cancel()` | `function` | Abort current request |

---

## Expected Backend API Format

The backend should accept query parameters and return:

```
GET /api/records?page=1&search=أحمد&status=active&sort=name&order=asc&limit=20
```

Response:

```json
{
  "status": "success",
  "data": {
    "items": [
      { "id": 1, "name": "أحمد محمد", "status": "active", "created_at": "2024-01-15" }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_items": 150,
      "total_pages": 8
    }
  }
}
```

---

## How URL Building Works

`buildFetchURL` in `src/hooks/useApi/utils.ts` converts params to query string:

- Every **non-empty, non-null** param from `updateParams()` or `initialParams` becomes a URL query parameter
- `page` is added when `pagination: true`
- `limit` is added when `limitItems` is set
- Search debounce: **300ms delay** when `params.search` is non-empty
- Custom sort/filter params pass through as-is

---

## Complete Integration Example

This is a full working example showing how to wire up all UI components to the backend.

```tsx
"use client"

import { useState, useCallback } from "react"
import { useApiData } from "@/hooks/useApi"
import { DataTableGeneric, type ColumnDef } from "@/components/common/data-table-generic"
import { DataTableToolbar } from "@/components/common/data-table-toolbar"
import { CustomPagination } from "@/components/common/custom-pagination"
import { LoadingOverlay } from "@/components/common/loading-overlay"
import { FiltersModal, type FilterFieldConfig } from "@/components/common/filters-modal"
import { ActiveFilters, type ActiveFilter } from "@/components/common/active-filters"
import { SelectionBar } from "@/components/common/selection-bar"
import { FormModal } from "@/components/common/form-modal"
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog"
import { DetailDrawer } from "@/components/common/detail-drawer"
import { StatusBadge } from "@/components/common/status-badge"
import { TextField, SelectField } from "@/components/common/form-fields"
import { Button } from "@/components/ui/button"
import { toastSuccess, toastError } from "@/components/common/toast-wrapper"

// ─── 1. Define your data type ────────────────────────────────────────────

interface Record {
  id: number
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  created_at: string
}

// ─── 2. Define table columns ─────────────────────────────────────────────

const COLUMNS: ColumnDef<Record>[] = [
  { key: "name", label: "الاسم", sortable: true },
  { key: "email", label: "البريد الإلكتروني", sortable: true },
  {
    key: "status",
    label: "الحالة",
    sortable: true,
    render: (row) => <StatusBadge variant={row.status} />,
  },
  { key: "created_at", label: "تاريخ الإنشاء", sortable: true },
]

// ─── 3. Define filter fields ─────────────────────────────────────────────

const FILTER_FIELDS: FilterFieldConfig[] = [
  { key: "name", label: "الاسم", type: "text", placeholder: "ابحث بالاسم..." },
  {
    key: "status",
    label: "الحالة",
    type: "select",
    options: [
      { value: "active", label: "نشط" },
      { value: "inactive", label: "غير نشط" },
      { value: "pending", label: "قيد الانتظار" },
    ],
  },
  { key: "dateRange", label: "نطاق التاريخ", type: "dateRange" },
]

// ─── 4. Page component ───────────────────────────────────────────────────

export default function DataPage() {
  // Initialize the API hook
  const api = useApiData<Record>("/api/records", {
    enableFetch: true,
    pagination: true,
    limitItems: 20,
  })

  // Local UI state
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set())
  const [formOpen, setFormOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Record | null>(null)
  const [drawerItem, setDrawerItem] = useState<Record | null>(null)
  const [sortField, setSortField] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  // ─── 5. Search ─────────────────────────────────────────────────────────
  // Built-in 300ms debounce when params.search is non-empty
  const handleSearch = useCallback(
    (value: string) => {
      api.updateParams({ search: value })
    },
    [api]
  )

  // ─── 6. Filters ────────────────────────────────────────────────────────
  const handleFilterApply = useCallback(
    (values: Record<string, string>) => {
      const params: Record<string, unknown> = {}
      if (values.name) params.name = values.name
      if (values.status) params.status = values.status
      if (values.dateRange_from) params.date_from = values.dateRange_from
      if (values.dateRange_to) params.date_to = values.dateRange_to

      api.updateParams(params)
      api.updatePage(1) // Always reset to page 1 on filter change

      // Update active filters display
      const filters: ActiveFilter[] = []
      if (values.name) filters.push({ key: "name", label: "الاسم", value: values.name })
      if (values.status) filters.push({ key: "status", label: "الحالة", value: values.status })
      if (values.dateRange_from || values.dateRange_to)
        filters.push({ key: "date", label: "التاريخ", value: `${values.dateRange_from || "..."} - ${values.dateRange_to || "..."}` })
      setActiveFilters(filters)
    },
    [api]
  )

  const handleFilterReset = useCallback(() => {
    api.updateParams({
      name: undefined,
      status: undefined,
      date_from: undefined,
      date_to: undefined,
    })
    api.updatePage(1)
    setActiveFilters([])
  }, [api])

  // ─── 7. Sorting ────────────────────────────────────────────────────────
  // The DataTableGeneric has client-side sorting built in, but for server-side:
  // Pass sort/order params to the API instead
  const handleSort = useCallback(
    (key: string) => {
      const newOrder = sortField === key && sortOrder === "asc" ? "desc" : "asc"
      setSortField(key)
      setSortOrder(newOrder)
      api.updateParams({ sort: key, order: newOrder })
    },
    [api, sortField, sortOrder]
  )

  // ─── 8. Delete ─────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!deleteItem) return
    try {
      await api.delete({
        customEndpoint: `/api/records/${deleteItem.id}`,
        onSuccess: () => {
          toastSuccess("تم الحذف بنجاح")
          setDeleteItem(null)
          setSelectedIds((prev) => {
            const next = new Set(prev)
            next.delete(deleteItem.id)
            return next
          })
        },
        onError: () => toastError("فشل الحذف"),
      })
    } catch {
      // handled by onError
    }
  }, [api, deleteItem])

  // ─── 9. Derived data ───────────────────────────────────────────────────
  const items = api.data?.data?.items ?? []
  const pagination = api.data?.data?.pagination

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toolbar with search + filter + add */}
      <DataTableToolbar
        onSearch={handleSearch}
        searchPlaceholder="ابحث في السجلات..."
        onFilterClick={() => {}}
        hasActiveFilters={activeFilters.length > 0}
        onAddClick={() => setFormOpen(true)}
        addLabel="إضافة سجل"
      />

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <ActiveFilters
          filters={activeFilters}
          onRemove={(key) => {
            api.updateParams({ [key]: undefined })
            setActiveFilters((prev) => prev.filter((f) => f.key !== key))
          }}
          onClearAll={handleFilterReset}
        />
      )}

      {/* Selection bar */}
      {selectedIds.size > 0 && (
        <SelectionBar
          count={selectedIds.size}
          onClear={() => setSelectedIds(new Set())}
          actions={[
            { label: "حذف المحدد", variant: "destructive" as const, onClick: () => {} },
          ]}
        />
      )}

      {/* Table with loading overlay */}
      <div className="relative">
        <LoadingOverlay isLoading={api.loading}>
          <DataTableGeneric
            columns={COLUMNS}
            data={items}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onEdit={(row) => setDrawerItem(row)}
            onDelete={(row) => setDeleteItem(row)}
            onRowClick={(row) => setDrawerItem(row)}
            emptyMessage={api.loading ? "جاري التحميل..." : "لا توجد بيانات"}
          />
        </LoadingOverlay>
      </div>

      {/* Pagination */}
      {pagination && (
        <CustomPagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          perPage={pagination.per_page}
          onPageChange={(page) => api.updatePage(page)}
          onPerPageChange={(perPage) => api.updateParams({ limit: perPage })}
        />
      )}

      {/* Error state */}
      {api.hasFetchError && (
        <div className="text-center py-4">
          <p className="text-destructive text-sm mb-2">{api.fetchError}</p>
          <Button variant="outline" size="sm" onClick={() => api.refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {/* Modals */}
      <DeleteConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        message={`هل أنت متأكد من حذف "${deleteItem?.name}"؟`}
        itemName={deleteItem?.name || ""}
      />

      <DetailDrawer
        isOpen={!!drawerItem}
        onClose={() => setDrawerItem(null)}
        title="تفاصيل السجل"
        fields={
          drawerItem
            ? [
                { label: "الرقم", value: `#${drawerItem.id}` },
                { label: "الاسم", value: drawerItem.name },
                { label: "البريد", value: drawerItem.email },
                { label: "الحالة", value: <StatusBadge variant={drawerItem.status} /> },
                { label: "تاريخ الإنشاء", value: drawerItem.created_at },
              ]
            : []
        }
        actions={
          <div className="flex gap-2 w-full">
            <Button className="flex-1" onClick={() => { setDrawerItem(null); setFormOpen(true) }}>
              تعديل
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setDrawerItem(null)}>
              إغلاق
            </Button>
          </div>
        }
      />

      <FormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={() => {
          // Collect form data and call api.post()
          toastSuccess("تم الحفظ")
          setFormOpen(false)
        }}
        title="إضافة سجل جديد"
      >
        <TextField label="الاسم" value="" onChange={() => {}} placeholder="أدخل الاسم..." required />
        <SelectField
          label="الحالة"
          value=""
          onChange={() => {}}
          options={[
            { value: "active", label: "نشط" },
            { value: "inactive", label: "غير نشط" },
          ]}
        />
      </FormModal>
    </div>
  )
}
```

---

## Data Flow Diagram

```
User Action                  Hook Method              Backend Request
─────────────────────────────────────────────────────────────────────────
Type in search               updateParams({search})    ?search=value (debounced 300ms)
Click filter "تطبيق"         updateParams(filters)     ?status=active&date_from=...
Click filter "إعادة تعيين"   updateParams(clear)       ?page=1 (cleared filters)
Click page 3                 updatePage(3)             ?page=3
Click sort column            updateParams({sort,order})?sort=name&order=asc
Click add/save               post({data})              POST /api/records
Click edit/save              put({data})               PUT /api/records/:id
Click delete                 delete()                  DELETE /api/records/:id
```

---

## Best Practices

1. **Reset page on filter change** — Always call `updatePage(1)` after `updateParams(filters)` to avoid empty results on high pages.

2. **Use `enableFetch: true`** for auto-fetching when params change. Only use manual `get()` for one-off fetches.

3. **Handle loading states** — Wrap tables with `LoadingOverlay` using `api.loading`.

4. **Handle errors** — Check `api.hasFetchError` and show a retry button with `api.refetch()`.

5. **Use `resourceId` for single items** — Pass `resourceId` when fetching/updating/deleting a single resource.

6. **Use optimistic updates** — Set `enableOptimisticUpdates: true` for instant UI feedback on mutations.

7. **Search is auto-debounced** — Just call `updateParams({ search: value })`, the hook handles 300ms debounce.

8. **Type safety** — Always define a TypeScript interface for your data type: `useApiData<YourType>(...)`.

9. **Separate filter state** — Use `FiltersModal` local state, then map to API params only on "apply".

10. **Sort params are flexible** — Use any param names your backend expects (`sort`/`order`, `sortBy`/`sortDir`, etc.).

---

## Migration Checklist

Converting a dummy-data page to use the API:

- [ ] Define TypeScript interface for the data model
- [ ] Replace `useState` data with `useApiData` hook
- [ ] Replace local search with `updateParams({ search })`
- [ ] Replace local pagination with `updatePage()`
- [ ] Replace local filters with `updateParams(filterParams)`
- [ ] Add sort params via `updateParams({ sort, order })`
- [ ] Replace local CRUD with `post()`, `put()`, `delete()`
- [ ] Add loading states with `api.loading`
- [ ] Add error handling with `api.fetchError`
- [ ] Test pagination, search, filters, sorting together
- [ ] Verify backend response matches `ApiResponse<T>` format
