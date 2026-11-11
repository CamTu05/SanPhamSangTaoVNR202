# History Ebook

Sách lịch sử tương tác “Hành trình độc lập | Việt Nam 1945–1975” bằng React, TypeScript, Vite và `react-pageflip`.

## Điều kiện cục bộ

Dự án giữ nguyên dependency `react-pageflip` tại `file:../react-pageflip`. Thư mục package sibling và bản build của package phải sẵn sàng; dự án này không sửa package đó.

## Lệnh dự án

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Kiến trúc

- `docs/noi_dung_ebook_lich_su_1945_1975.md`: bản thảo nội dung được duyệt
- `src/types/book.ts`: mô hình trang, chương, nguồn, action và media manifest
- `src/data/mediaManifest.ts`: manifest asset/requirement theo semantic page ID; chín media cục bộ được tái sử dụng, requirement chưa duyệt giữ `pending`, hồ sơ cũ giữ `legacy`
- `src/data/bookPages.ts`: 52 page records với layout có chủ ý, toàn bộ copy/sự kiện/thẻ/nguồn lịch sử, chương và validator chạy khi module được nạp
- `src/components/BookPage.tsx`: bộ chọn layout exhaustive, không chứa nội dung lịch sử
- `src/components/layouts/PageLayouts.tsx`: layout dữ liệu dùng chung cho bài viết, thẻ, timeline, sơ đồ, so sánh, tab chiến lược, mục lục và nguồn
- `src/components/HistoryBook.tsx`: PageFlip, parity bìa/spread, TOC, bàn phím và trạng thái `onFlip`
- `src/components/media/`: các tương tác timeline, media và popup tái sử dụng

## Quy ước chú giải ảnh

Mọi ảnh và minh họa được đánh số theo thứ tự xuất hiện trong ebook và dùng cấu trúc APA thống nhất: `Hình [số]. [Tiêu đề ngắn gọn]. Nguồn: [Tác giả] ([Năm]).` Nếu chưa xác định được năm, ghi `không rõ năm`; không tự suy đoán tác giả hoặc niên đại.

## Trạng thái nội dung

Luồng phát hành có đúng 52 trang vật lý: bìa trước ở index 0, 50 trang nội dung ở index 1–50 và bìa sau ở index 51. `showCover` tạo 25 spread nội dung `[1,2]` đến `[49,50]`. Toàn bộ media chưa được cung cấp được thể hiện bằng placeholder rõ ràng; không có stock image, video mẫu, bản đồ giả hoặc video player vô hiệu.

`validateBookDefinition` kiểm tra đúng 52/50/25/4/9, range phần và chương, parity, dữ liệu bắt buộc theo layout, TOC/action, tương tác timeline–map, đường dẫn local, display page và liên kết hai chiều giữa trang với manifest. Mô hình nội dung giữ toàn bộ dữ kiện trong TypeScript, còn JSX chỉ render layout; tài liệu biên tập Markdown chứa kiểm kê và bản thảo đầy đủ 52 trang.
