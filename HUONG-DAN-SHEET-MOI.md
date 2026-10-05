# HDT Study — Kết nối Google Sheets mới

Bản này đã dùng đúng cấu trúc của file `HDT_STUDY_CMS_V11.xlsx`.

## 1) Đưa file Excel lên Google Sheets

Google Drive → Mới → Tải tệp lên → chọn `HDT_STUDY_CMS_V11.xlsx` → Mở bằng Google Trang tính.

## 2) Kiểm tra tab `Documents`

Các cột chính:
- title
- grade
- subject
- type
- desc
- fileUrl
- fileSize
- hot
- featured

Ba tài liệu mẫu thật đã có sẵn trong file.

## 3) Xuất bản tab Documents dạng CSV

Trong Google Sheets:
Tệp → Chia sẻ → Xuất bản lên web → chọn `Documents` → chọn `Giá trị được phân tách bằng dấu phẩy (.csv)` → Xuất bản.

URL cần có đuôi `output=csv`.

## 4) Dán URL vào website (chỉ 1 lần)

Mở file `config.js` và sửa:

```js
const GOOGLE_SHEET_CSV_URL = '';
```

thành:

```js
const GOOGLE_SHEET_CSV_URL = 'LINK-CSV-CUA-BAN';
```

Lưu lại, sau đó Ctrl + F5.

## 5) Từ lần sau

Chỉ cần upload PDF lên Google Drive → lấy link PDF → thêm một dòng vào tab Documents.

Không sửa HTML/CSS/JS.
