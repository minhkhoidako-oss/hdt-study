# HDT Study – Quản lý tài liệu bằng Google Sheets (miễn phí)

Mục tiêu: sau khi thiết lập 1 lần, bạn chỉ cần thêm dòng mới vào Google Sheets. Website sẽ tự đọc dữ liệu khi tải lại trang; không cần nhờ ChatGPT sửa từng tài liệu.

## 1) Tạo Google Sheet

Tạo 1 Google Sheet tên **HDT STUDY – Tài liệu**. Đổi tên tab đầu tiên thành **Documents**.

Các cột hàng 1 phải đúng thứ tự/tên sau:

`id | title | grade | subject | type | desc | fileUrl | fileSize | hot | featured`

Bạn có thể mở file `HDT_TAI_LIEU_TEMPLATE.csv` trong thư mục này rồi import vào Google Sheets để lấy mẫu.

## 2) Điền dữ liệu

Mỗi hàng = 1 tài liệu.

- `id`: số hoặc mã riêng.
- `title`: tên tài liệu.
- `grade`: 10 / 11 / 12.
- `subject`: Toán / Ngữ Văn / Tiếng Anh / Vật Lý / Hóa Học / Sinh Học / Địa Lý / Lịch Sử / GDKT&PL.
- `type`: Chuyên đề / Tổng ôn / Đề thi / Bài tập...
- `desc`: mô tả ngắn.
- `fileUrl`: link chia sẻ PDF từ Google Drive.
- `fileSize`: ví dụ `5 MB`.
- `hot`: `true` nếu muốn hiện HOT, ngược lại `false`.
- `featured`: `true` nếu muốn ưu tiên tài liệu nổi bật.

## 3) Chia sẻ PDF trên Drive

Với mỗi PDF: Chuột phải → Chia sẻ → Quyền truy cập chung → **Bất kỳ ai có đường liên kết** → **Người xem** → Sao chép đường liên kết.

## 4) Publish Google Sheet thành CSV

Trong Google Sheets: **Tệp → Chia sẻ → Xuất bản lên web (Publish to web)**.

- Chọn riêng tab **Documents** nếu Google Sheets cho phép chọn trang tính.
- Chọn định dạng **CSV**.
- Bấm **Xuất bản / Publish** và xác nhận.

Google sẽ tạo URL dạng gần giống:

`https://docs.google.com/spreadsheets/d/e/XXXXXXXX/pub?gid=0&single=true&output=csv`

## 5) Kết nối website

Mở file `script.js`.

Tìm dòng:

`const GOOGLE_SHEET_CSV_URL = '';`

Dán URL CSV vào giữa dấu nháy:

`const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/XXXXXXXX/pub?gid=0&single=true&output=csv';`

Lưu file và tải lại website bằng **Ctrl + F5**.

## 6) Từ nay thêm tài liệu

1. Upload PDF lên folder **HDT STUDY** trong Google Drive.
2. Bật quyền **Bất kỳ ai có đường liên kết → Người xem**.
3. Copy link PDF.
4. Thêm 1 dòng mới vào Google Sheet.
5. F5 website.

Không cần sửa `index.html`, `styles.css` hay `script.js` mỗi khi thêm tài liệu.

## Lưu ý

- Website hiện có dữ liệu mẫu local làm phương án dự phòng nếu Google Sheet chưa được cấu hình hoặc tạm lỗi.
- Nếu Google Sheet không tải được, website vẫn hiển thị dữ liệu local.
- Không đăng tài liệu mà bạn không có quyền chia sẻ.


## Trạng thái hiện tại
Bạn đã xuất bản tab `Documents` dưới dạng CSV. Website HDT đã được gắn sẵn URL CSV nên không cần dán lại trong `script.js` ở bản này.
