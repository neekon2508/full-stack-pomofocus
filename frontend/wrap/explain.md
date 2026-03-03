# Giải thích chi tiết: `code-page.tsx`

File này gộp 3 component gốc (`CodePage`, `CodeGroupGrid`, `CodeDetailGrid`) thành một file duy nhất, đồng thời loại bỏ hoàn toàn `CodeDetailGrid`. Dưới đây là phân tích từng phần của file.

---

## 1. Cấu trúc tổng quan

```
code-page.tsx
├── Imports (thư viện & nội bộ)
├── Interface: CodeGroupGridProps
├── Component: CodeGroupGrid  ← nội tuyến, không còn là file riêng
└── Component: CodePage       ← trang chính
```

---

## 2. Imports

### Thư viện giao diện

```tsx
import {
  Button,
  DataGrid,
  DataGridCellEditableRenderer,
  DataGridCellSwitch,
  DataGridCellTag,
  DataGridCellTooltip,
  FormItem,
  InputField,
  Radio,
  RadioGroup,
  SearchArea,
  useMessageBar,
} from "@amxis/design-system";
```

Tất cả component UI đến từ thư viện thiết kế nội bộ `@amxis/design-system`. Sau khi gộp file, `FormItem`, `InputField`, `Radio`, `RadioGroup`, `SearchArea` (vốn chỉ dùng ở `CodePage`) và các component grid (vốn chỉ dùng ở `CodeGroupGrid`) đều được import ở một chỗ.

```tsx
import {
  ControlConfirmIcon,
  ControlResetIcon,
} from "@amxis/design-system/icon";
```

Icon cho 2 nút **Lưu** và **Khởi tạo lại**.

### Thư viện quản lý dữ liệu & form

| Import                  | Mục đích                                 |
| ----------------------- | ---------------------------------------- |
| `useQueryClient`        | Invalidate (xóa cache) query sau khi lưu |
| `useForm`, `Controller` | Quản lý form tìm kiếm với validation     |
| `zodResolver`           | Kết nối Zod schema với react-hook-form   |
| `z` (zod)               | Định nghĩa schema validation             |

### AG Grid

```tsx
import {
  CellClickedEvent,
  CellEditingStoppedEvent,
  ColDef,
  EditableCallbackParams,
  ICellRendererParams,
  IRowNode,
  IsRowSelectable,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
```

Đây là thư viện bảng dữ liệu chính. Các kiểu type được import để TypeScript kiểm tra chính xác.

### Models & Constants

```tsx
import { CommonCodeGroup } from "models/admin/CommonCode"; // kiểu dữ liệu một hàng
import { CommonYN } from "models/common/Common"; // enum: 'Y' | 'N'
import { CrudCode } from "models/common/Edit"; // enum: CREATE | UPDATE | DELETE
```

### Hooks nội bộ

```tsx
import { useCommonCodeGroupsQuery }    // Lấy danh sách nhóm mã
import { useCommonCodeGroupsMutation } // Lưu thay đổi (C/U/D)
import { useCommonDialogStore }        // Hiển thị hộp thoại xác nhận/cảnh báo
import { useLanguageStore }            // Ngôn ngữ hiện tại cho AG Grid
```

---

## 3. Interface `CodeGroupGridProps`

```tsx
interface CodeGroupGridProps {
  sGrCd?: string; // Bộ lọc: mã nhóm
  sUseYn?: string; // Bộ lọc: sử dụng/không sử dụng
  sCode?: string; // Bộ lọc: mã code
  editable: boolean; // Hiển thị checkbox & nút thêm/xóa hàng
  callBack?: any; // Hàm callback khi click hàng (truyền cmnGrCd ra ngoài)
}
```

---

## 4. Component `CodeGroupGrid`

### 4.1 State & Refs

```tsx
const gridRef = useRef<AgGridReact<CommonCodeGroup>>(null);
```

Tham chiếu trực tiếp đến API của AG Grid (dùng để lấy dữ liệu hàng, dừng edit, v.v.).

```tsx
const [rowData, setRowData] = useState<CommonCodeGroup[]>([]);
```

Dữ liệu hiển thị trong bảng. Được đồng bộ từ server qua `useEffect`, nhưng **không** bị ghi đè khi đang ở chế độ chỉnh sửa.

```tsx
const isEditingRef = useRef(false);
```

Cờ để biết người dùng đang chỉnh sửa hay không. Dùng `useRef` thay vì `useState` vì không cần re-render khi thay đổi. Khi `true`, dữ liệu từ server sẽ không ghi đè lên `rowData`.

```tsx
const tempIdCounterRef = useRef(0);
```

Bộ đếm để sinh ID tạm thời cho các hàng mới (chưa lưu vào server). Đảm bảo mỗi hàng mới có ID duy nhất.

### 4.2 Data Fetching

```tsx
const { data: fetchedCommonCodeGroups, refetch } = useCommonCodeGroupsQuery({
  cmnGrCd: props.sGrCd || "",
  cmnCd: props.sCode || "",
  useYn: props.sUseYn ?? "",
});
```

Hook này (React Query bên trong) tự động gọi lại API khi `props` thay đổi. `refetch` được dùng thủ công trong chức năng **Khởi tạo lại**.

```tsx
const { mutateAsync: saveCommonCodeGroups } = useCommonCodeGroupsMutation();
```

Hàm mutation để POST/PUT/DELETE lên server.

### 4.3 Định nghĩa cột (`columnDefs`)

| Cột               | Mô tả                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `checkColumn`     | Checkbox chọn hàng (ẩn khi `editable=false`)                                                                    |
| `crudKey`         | Trạng thái hàng: thêm/sửa/xóa. Chỉ hiển thị, không chỉnh sửa                                                    |
| `cmnGrCd`         | **Mã nhóm** — chỉ được nhập khi hàng là mới (CREATE)                                                            |
| `cmnGrCdNm`       | **Tên nhóm** — luôn có thể chỉnh sửa                                                                            |
| `cmnGrCdDesc`     | **Mô tả** — có tooltip khi nội dung bị cắt ngắn                                                                 |
| `msgCtn`          | **Mã thông báo** — dùng custom renderer `MessageCellRenderer`, nút chọn message hiện khi hàng không phải CREATE |
| `useYn`           | **Sử dụng/Không** — toggle switch, click trực tiếp thay đổi giá trị và đặt `crudKey=UPDATE`                     |
| `sortOrd`         | **Thứ tự sắp xếp** — validation: số nguyên 1–10,000                                                             |
| `optValNm1..5`    | Các trường tùy chọn mở rộng                                                                                     |
| `dataUpdUserName` | Người sửa cuối (chỉ đọc)                                                                                        |
| `dataUpdDtm`      | Thời gian sửa cuối (chỉ đọc)                                                                                    |

> **Lưu ý về `useYn`**: Thay vì dùng `editable` của AG Grid (sẽ mở cell editor), cột này dùng `onClick` trực tiếp trên cell renderer để toggle và gọi `redrawRows` — giúp cập nhật giao diện ngay lập tức mà không tạo ra event chỉnh sửa.

### 4.4 Chức năng Thêm hàng (`btnAddRow`)

```tsx
const btnAddRow = useCallback(() => {
  const tempId = `__temp_${Date.now()}_${++tempIdCounterRef.current}`;
  const newRow = {
    crudKey: CrudCode.CREATE,
    useYn: CommonYN.Y,
    _tempId: tempId,
  };
  isEditingRef.current = true;
  setRowData((prev) => [newRow, ...prev]);
  props.callBack?.("");
}, [props]);
```

- Tạo ID tạm thời duy nhất (`__temp_...`) để AG Grid có thể nhận dạng hàng qua `getRowId`.
- Đặt `crudKey = CREATE` để phân biệt với hàng đã có trong DB.
- Thêm hàng vào **đầu** danh sách.
- Gọi `callBack('')` để reset `searchDetailCd` (trong `CodePage`).

### 4.5 Chức năng Xóa hàng (`btnDelRow`)

Quy trình:

1. **Kiểm tra có chọn hàng không** → alert nếu chưa chọn.
2. **Kiểm tra hàng đã lưu có hạ tầng không** (`getCommonCodes`) → alert nếu có hạ tầng, không cho xóa.
3. **Confirm xóa** → với `crudKey = CREATE`: xóa khỏi state ngay; với hàng đã có: đánh dấu `crudKey = DELETE` (sẽ lưu khi nhấn nút Lưu).

```tsx
// Hàng mới (chưa lưu) → loại bỏ khỏi mảng
if (selectedIds.includes(rowId) && row.crudKey === CrudCode.CREATE)
  return false;

// Hàng đã lưu → đánh dấu DELETE
if (selectedIds.includes(rowId) && row.crudKey !== CrudCode.CREATE)
  return { ...row, crudKey: CrudCode.DELETE };
```

### 4.6 Chức năng Khởi tạo lại (`btnRefresh`)

- Nếu không có gì thay đổi và không có hàng được chọn → alert.
- Nếu không có thay đổi nhưng có hàng được chọn → alert.
- Nếu có thay đổi → confirm → gọi `refetch()` để lấy lại dữ liệu gốc từ server, đặt lại `isEditingRef = false`.

### 4.7 Chức năng Lưu (`btnSave`)

Quy trình chi tiết:

```
stopEditing()           ← dừng cell đang edit để lấy giá trị mới nhất
↓
Duyệt tất cả hàng trong grid
↓
Nếu hàng không có crudKey → so sánh với dữ liệu gốc
  Nếu có thay đổi → đặt crudKey = UPDATE
↓
Validation (bắt buộc điền mã nhóm, tên nhóm cho hàng CREATE/UPDATE)
↓
Lọc ra saveRows (có crudKey và không phải hàng DELETE mới tạo chưa lưu)
↓
Kiểm tra trùng mã nhóm
↓
Xóa dấu phẩy trong sortOrd
↓
Gọi saveCommonCodeGroups(saveRows)
↓
Hiển thị thông báo thành công / thất bại
↓
invalidateQueries → React Query tự động fetch lại
```

> **Tại sao kiểm tra thay đổi thủ công?** AG Grid không tự track thay đổi khi toggle `useYn` qua `redrawRows`. Đoạn so sánh field-by-field bù đắp cho điều đó, đảm bảo không bỏ sót thay đổi khi lưu.

### 4.8 Xử lý sự kiện

#### `onCellClicked`

```tsx
const onCellClicked = (event: CellClickedEvent) => {
  props.callBack && props.callBack(event.data.cmnGrCd);
};
```

Khi click vào hàng bất kỳ, truyền `cmnGrCd` qua callback. Trong `CodePage`, callback này được truyền là `() => {}` vì đã loại bỏ `CodeDetailGrid`.

#### `onCellEditingStopped`

Xử lý sau khi người dùng kết thúc chỉnh sửa một ô:

- Bỏ qua nếu giá trị không thay đổi (`!valueChanged`).
- Bỏ qua nếu là cột `crudKey`.
- **Tự động điền `msgCtn`** khi nhập `cmnGrCd`: `com.code.{cmnGrCd}`.
- **Validate `sortOrd`**: phải là số nguyên 1–10,000. Nếu sai → alert + khôi phục giá trị cũ.
- Đặt `crudKey = UPDATE` nếu hàng không phải CREATE.
- Cập nhật `rowData` bằng object mới (kích hoạt re-render).

### 4.9 `useEffect` đồng bộ dữ liệu

```tsx
useEffect(() => {
  if (!fetchedCommonCodeGroups) return;
  if (isEditingRef.current) return; // không ghi đè khi đang chỉnh sửa
  setRowData(fetchedCommonCodeGroups);
}, [fetchedCommonCodeGroups]);
```

Khi `fetchedCommonCodeGroups` thay đổi (do search hoặc invalidateQuery), cập nhật `rowData` — nhưng chỉ khi người dùng không đang chỉnh sửa.

### 4.10 `getRowId`

```tsx
getRowId={(params) =>
  (params.data as any)._tempId || params.data.cmnGrCd || `temp-${Date.now()}-${Math.random()}`
}
```

AG Grid cần ID duy nhất để theo dõi hàng. Ưu tiên: ID tạm thời → mã nhóm từ DB → fallback ngẫu nhiên.

---

## 5. Component `CodePage`

### 5.1 Schema & Form

```tsx
const searchDataSchema = z.object({
  cmnGrCd: z.string().optional(),
  cmnCd: z.string().optional(),
  useYn: z.string().optional(),
});
```

Zod schema — tất cả trường là tùy chọn (tìm kiếm không bắt buộc điền gì).

```tsx
const { handleSubmit, control } = useForm<SearchData>({
  resolver: zodResolver(searchDataSchema),
  defaultValues: { cmnGrCd: "", cmnCd: "", useYn: "" },
});
```

`control` dùng để kết nối `Controller` với từng input field.

### 5.2 State tìm kiếm

```tsx
const [filterChipUseYn, setFilterChipUseYn] = useState(""); // giá trị RadioGroup (UI)
const [searchGrCd, setSearchGrCd] = useState(""); // truyền xuống CodeGroupGrid
const [searchCode, setSearchCode] = useState("");
const [searchUseYn, setSearchUseYn] = useState("");
```

`filterChipUseYn` là giá trị tức thời khi người dùng chọn Radio. `searchUseYn` là giá trị **được áp dụng** khi nhấn Tìm kiếm.

> **Khác biệt so với file gốc**: File gốc có thêm state `searchDetailCd` để truyền cho `CodeDetailGrid`. State này đã được **loại bỏ** cùng với toàn bộ logic liên quan.

### 5.3 `onSubmit`

```tsx
const onSubmit = handleSubmit(async ({ cmnGrCd, cmnCd }) => {
  openLoading(true);
  setSearchGrCd(cmnGrCd || "");
  setSearchUseYn(filterChipUseYn);
  setSearchCode(cmnCd || "");
  openLoading(false);
});
```

Khi nhấn nút **Tìm kiếm**:

1. Bật loading overlay.
2. Cập nhật 3 state tìm kiếm → kích hoạt `useCommonCodeGroupsQuery` trong `CodeGroupGrid` fetch lại dữ liệu.
3. Tắt loading overlay.

### 5.4 JSX — `SearchArea`

```tsx
<SearchArea onSearch={onSubmit} ...>
  <Grid item xs={4}> Groud Code/Name Input </Grid>
  <Grid item xs={4}> Code/Name Input </Grid>
  <Grid item xs={4}> Use RadioGroup </Grid>
</SearchArea>
```

Bố cục 3 cột. Mỗi `Controller` kết nối input với react-hook-form. Phím `Enter` trên input kích hoạt `onSubmit`.

`RadioGroup` cập nhật cả `filterChipUseYn` (UI) và `searchUseYn` (filter thực tế) ngay lập tức khi thay đổi — không cần nhấn nút tìm kiếm.

### 5.5 JSX — `CodeGroupGrid`

```tsx
<CodeGroupGrid
  sGrCd={searchGrCd}
  sCode={searchCode}
  sUseYn={searchUseYn}
  editable={true}
  callBack={() => {}} // ← callback rỗng, không cần truyền dữ liệu xuống detail grid
/>
```

`callBack` được đổi từ hàm `listener` (gốc) thành `() => {}` vì không còn `CodeDetailGrid` để nhận `cmnGrCd`.

---

## 6. Những thay đổi so với code gốc

| Hạng mục                         | Code gốc                          | Sau khi gộp              |
| -------------------------------- | --------------------------------- | ------------------------ |
| Số file                          | 3 file riêng biệt                 | 1 file duy nhất          |
| `CodeDetailGrid`                 | Có đầy đủ                         | **Loại bỏ hoàn toàn**    |
| `searchDetailCd` state           | Có                                | **Loại bỏ**              |
| Hàm `listener`                   | Có (truyền cmnGrCd cho detail)    | **Loại bỏ**              |
| `callBack` trong `CodeGroupGrid` | Hàm `listener`                    | `() => {}` (rỗng)        |
| Import `CodeGroupGrid`           | `import CodeGroupGrid from '...'` | Inline trong cùng file   |
| `configureSearchUseYn()`         | Hàm riêng                         | Gộp thẳng vào `onSubmit` |

---

## 7. Luồng dữ liệu tổng thể

```
[Người dùng nhập điều kiện tìm kiếm]
        ↓
   onSubmit() → cập nhật searchGrCd, searchCode, searchUseYn
        ↓
   CodeGroupGrid nhận props mới
        ↓
   useCommonCodeGroupsQuery tự động fetch lại
        ↓
   useEffect đồng bộ → setRowData(fetchedData)
        ↓
   AG Grid hiển thị danh sách nhóm mã
        ↓
[Người dùng chỉnh sửa hàng]
   onCellEditingStopped → đánh dấu crudKey = UPDATE/CREATE
        ↓
[Người dùng nhấn Lưu]
   btnSave() → validate → saveCommonCodeGroups() → invalidateQueries
        ↓
   React Query fetch lại → useEffect → setRowData (đã cập nhật)
```
