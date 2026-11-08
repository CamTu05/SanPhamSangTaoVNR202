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
- `src/data/bookPages.ts`: 54 page records với layout có chủ ý, toàn bộ copy/sự kiện/thẻ/nguồn lịch sử, chương và validator chạy khi module được nạp
- `src/components/BookPage.tsx`: bộ chọn layout exhaustive, không chứa nội dung lịch sử
- `src/components/layouts/PageLayouts.tsx`: layout dữ liệu dùng chung cho bài viết, thẻ, timeline, sơ đồ, so sánh, tab chiến lược, mục lục và nguồn
- `src/components/HistoryBook.tsx`: PageFlip, parity bìa/spread, TOC, bàn phím và trạng thái `onFlip`
- `src/components/media/`: các tương tác timeline, media và popup tái sử dụng

## Trạng thái nội dung

Luồng phát hành có đúng 54 trang vật lý: bìa trước ở index 0, 52 trang nội dung ở index 1–52 và bìa sau ở index 53. `showCover` tạo 26 spread nội dung `[1,2]` đến `[51,52]`. Toàn bộ media chưa được cung cấp được thể hiện bằng placeholder rõ ràng; không có stock image, video mẫu, bản đồ giả hoặc video player vô hiệu.

`validateBookDefinition` kiểm tra đúng 54/52/26/4/9, range phần và chương, parity, dữ liệu bắt buộc theo layout, TOC/action, tương tác timeline–map, đường dẫn local, display page và liên kết hai chiều giữa trang với manifest. Mô hình nội dung giữ toàn bộ dữ kiện trong TypeScript, còn JSX chỉ render layout; tài liệu biên tập Markdown chứa kiểm kê và bản thảo đầy đủ 54 trang.
