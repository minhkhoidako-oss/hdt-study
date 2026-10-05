# HDT Study v16

Website tĩnh cho kho tài liệu ôn thi THPT.

## Điểm mới
- Trang chi tiết tài liệu riêng: `tai-lieu.html?slug=...`
- SEO title/description động theo tài liệu
- Xem PDF / Tải PDF / Chia sẻ link
- Dữ liệu tài liệu vẫn lấy từ Google Sheets CSV
- Không cần database
- Link PDF có thể là Google Drive hoặc URL PDF công khai

## Chạy local
Mở `index.html` bằng Live Server.

## Quản lý tài liệu
Thêm tài liệu trong Google Sheets theo các cột hiện có: `title`, `grade`, `subject`, `type`, `desc`, `fileUrl`, `fileSize`, `hot`, `featured`.

## Ghi chú
Sitemap chứa domain placeholder `https://hdt-study.example/`; trước khi public, đổi domain này thành domain thật.

## Deploy miễn phí
Xem `CLOUDFLARE-DEPLOY.md`.
