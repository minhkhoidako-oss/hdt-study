# HDT Study – Deploy miễn phí với GitHub + Cloudflare Pages

## 1) Tạo GitHub repository
- Đăng nhập GitHub.
- Chọn New repository.
- Repository name: `hdt-study`.
- Chọn Public.
- Không cần thêm README/.gitignore vì project đã có sẵn.
- Tạo repository.

## 2) Upload code
- Mở repository vừa tạo.
- Chọn Add file → Upload files.
- Mở thư mục project trên máy và chọn toàn bộ file + thư mục bên trong.
- Kéo thả vào GitHub.
- Commit changes.

## 3) Kết nối Cloudflare Pages
- Đăng nhập Cloudflare.
- Vào Workers & Pages → Create application.
- Chọn Pages → Import an existing Git repository.
- Kết nối GitHub và chọn `hdt-study`.
- Production branch: `main`.
- Build command: để trống vì đây là static HTML.
- Build output directory: `/` (thư mục gốc repository).
- Bấm Save and Deploy.

## 4) Sau khi deploy
Cloudflare sẽ cấp một URL `*.pages.dev`.
- Mở URL và kiểm tra homepage.
- Kiểm tra tìm kiếm, lọc, tài liệu và nút Zalo.
- Kiểm tra 3 PDF.

## 5) Sitemap
- Mở `sitemap-template.xml`.
- Thay `https://YOUR-SITE.pages.dev` bằng URL Cloudflare thật.
- Đổi tên file thành `sitemap.xml`.
- Commit lên GitHub.
- Cloudflare sẽ tự deploy lại.

## 6) Sau này sửa website
Mỗi khi code được commit/push lên GitHub, Cloudflare Pages sẽ tự tạo deployment mới.

## Lưu ý
PDF vẫn để trên Google Drive và dữ liệu vẫn quản lý bằng Google Sheets. Không upload PDF vào GitHub.
