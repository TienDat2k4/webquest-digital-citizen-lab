/* =====================================================================
   DIGITAL CITIZEN LAB — TỆP CẤU HÌNH
   Đây là tệp DUY NHẤT giáo viên cần sửa. Sửa xong thì commit & push,
   GitHub Pages tự cập nhật sau khoảng 1 phút.
   ===================================================================== */

/* ---------- 1. Kết nối Google Sheets qua Apps Script ---------- */
var DCL_API = {
  // Link lấy ở bước Triển khai > Ứng dụng web trong Apps Script
  url:   "https://script.google.com/macros/s/AKfycbzVbtAVhCip0oThZGxXrfSFJVBw8G7L7GOHxuGxApc0FgSeq94MStNVJtHBYiGfXziz/exec",

  // Phải trùng hệt biến TOKEN trong tệp Code.gs
  token: "DOI_CHUOI_NAY_THANH_CUA_BAN",

  // Danh sách lớp bạn dạy, hiện trong mọi ô chọn lớp
  lop:   ["10A1", "10A2", "10A3", "10A4"]
};

/* ---------- 2. Ghi đè các mục trong CONFIG của trang ----------
   Phần dưới chạy sau khi trang đã nạp CONFIG gốc, nên chỉ cần ghi
   những dòng muốn đổi. Dòng nào không cần thì xoá hoặc để nguyên.   */
(function () {
  if (typeof CONFIG === 'undefined') return;

  /* Ngưỡng mở khoá và cơ chế khoá */
  CONFIG.diemDat           = 7;       // số hồ sơ đúng tối thiểu trên 10
  CONFIG.batBuocMoKhoa     = true;    // false = mở sẵn mọi mục (dùng khi trình bày)
  CONFIG.choPhepBoQuaNhanh = false;   // true = hiện nút "Bỏ qua & mở trực tiếp"
  CONFIG.maMoKhoaNhanh     = "CD10";  // mã dự phòng khi mạng hỏng

  /* Mốc thời gian */
  CONFIG.hanDangKy = "[NGÀY] · [GIỜ]";
  CONFIG.hanNop    = "[NGÀY] · [GIỜ]";

  /* Liên kết tài nguyên — dán link Drive đã mở quyền xem */
  CONFIG.mauTrinhChieu    = "#";
  CONFIG.mauInfographic   = "#";
  CONFIG.hocLieuPhapLy    = "#";
  CONFIG.huongDanGhiNguon = "#";
  CONFIG.khoAnh           = "#";
  CONFIG.mauNhatKy        = "#";
  CONFIG.mauBangDoiChieu  = "#";
  CONFIG.mauPhanHoiCheo   = "#";
  CONFIG.rubricPdf        = "#";
  CONFIG.khuTrungBay      = "#";
  CONFIG.nguonAnh         = "[TÊN NGUỒN ẢNH] — [GIẤY PHÉP SỬ DỤNG]";

  /* Hai form Google cũ: để trống vì bản GitHub dùng form tự thiết kế.
     Nếu muốn quay lại dùng Google Form thì xoá tệp dcl-api.js khỏi
     index.html và điền hai link dưới đây. */
  // CONFIG.formDangKy = "";
  // CONFIG.formNop    = "";

  if (typeof applyConfig === 'function') applyConfig();
})();
