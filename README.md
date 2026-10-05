# HDT Study — v22 Final

HDT Study là website tĩnh cho kho tài liệu THPT, luyện thi tốt nghiệp THPT, ĐGNL và ĐGTD.

## Kiến trúc
- GitHub: mã nguồn website.
- Cloudflare Pages: hosting + auto-deploy từ `main`.
- Google Sheets: quản lý metadata tài liệu.
- Google Drive hoặc URL PDF công khai: nơi lưu file.

## Môn học
Toán, Ngữ Văn, Tiếng Anh, Vật Lý, Hóa Học, Sinh Học, Lịch Sử, Địa Lý, GDKT&PL, Tin Học, Công Nghệ.

## Kỳ thi
Tốt nghiệp THPT, ĐGNL ĐHQG-HCM (V-ACT), ĐGNL ĐHQGHN (HSA), ĐGTD TSA.

## Quản lý tài liệu
Thêm tài liệu bằng các cột chính: `title`, `grade`, `subject`, `type`, `desc`, `fileUrl`, `fileSize`, `hot`, `featured`. Website tự xử lý slug, icon môn, tìm kiếm và SEO nội dung cơ bản.

## Tìm kiếm
Tìm kiếm không dấu, ưu tiên tiêu đề/môn/loại/lớp, hiểu một số từ khóa tương đương cho THPTQG, ĐGNL, ĐGTD, V-ACT, HSA, TSA và có tolerant cho lỗi gõ nhẹ.

## Chạy local
Mở `index.html` bằng Live Server.

## Deploy
Commit vào branch `main`; Cloudflare Pages tự deploy.

## SEO
- `robots.txt` ở root.
- `sitemap.xml` + `sitemap.txt` ở root.
- Google Search Console đã xác minh property `https://hdt-study.pages.dev/`.

## Bản quyền / liên hệ
Xem `ban-quyen.html`, `lien-he.html`, `dieu-khoan.html` và `chinh-sach-bao-mat.html`.
