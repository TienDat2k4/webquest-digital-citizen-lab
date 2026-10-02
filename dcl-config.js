/* =====================================================================
   DIGITAL CITIZEN LAB — TỆP CẤU HÌNH
   Đây là tệp duy nhất giáo viên cần sửa. Sửa xong thì commit & push,
   GitHub Pages tự cập nhật sau khoảng một phút.
   ===================================================================== */

/* ---------- 1. Kết nối Google Sheets qua Apps Script ---------- */
var DCL_API = {
  // Link lấy ở bước Triển khai > Ứng dụng web trong Apps Script
  url:   "https://script.google.com/macros/s/AKfycbynSe_iwIEhEKKShviiOKBcwjiuEslkS1nBjikfzazd7WzQ2bep1ZJsv5aRnSv6MIheuw/exec",

  // Phải trùng hệt biến TOKEN trong tệp Code.gs
  token: "DOI_CHUOI_NAY_THANH_CUA_BAN",

  // Danh sách lớp, dùng cho ô điểm danh và bộ lọc trang Trưng bày
  lop:   ["10A1", "10A2", "10A3", "10A4", "10A5", "10A6", "10A7", "10A8"]
};

/* ---------- 2. Hai biểu mẫu Google ---------- */
(function () {
  if (typeof CONFIG === 'undefined') return;

  CONFIG.formDangKy = "https://forms.gle/WzMnKtkbQbMaWP5k6";
  CONFIG.formNop    = "https://forms.gle/S24gJ78Dg18hwBJx7";

  /* ---------- 3. Cơ chế mở khoá ---------- */
  CONFIG.diemDat           = 7;       // số hồ sơ đúng tối thiểu trên 10
  CONFIG.batBuocMoKhoa     = true;    // false = mở sẵn mọi mục, dùng khi trình bày
  CONFIG.choPhepBoQuaNhanh = false;   // true = hiện nút Bỏ qua
  CONFIG.maMoKhoaNhanh     = "HN1-DCL";  // mã dự phòng, giáo viên đọc cho lớp khi mạng hỏng
  CONFIG.hienMaThongHanh   = false;   // true = in mã lên màn hình kết quả của học sinh

  /* ---------- 4. Mốc thời gian ---------- */
  CONFIG.hanDangKy = "[NGÀY] · [GIỜ]";
  CONFIG.hanNop    = "[NGÀY] · 21h00";

  /* ---------- 5. Liên kết tài nguyên: dán link Drive đã mở quyền xem ---------- */
  CONFIG.mauTrinhChieu    = "#";
  CONFIG.mauInfographic   = "#";
  CONFIG.hocLieuPhapLy    = "#";
  CONFIG.huongDanGhiNguon = "#";
  CONFIG.khoAnh           = "#";
  CONFIG.mauNhatKy        = "#";
  CONFIG.mauBangDoiChieu  = "#";
  CONFIG.mauPhanHoiCheo   = "#";
  CONFIG.rubricPdf        = "#";
  CONFIG.nguonAnh         = "[TÊN NGUỒN ẢNH] — [GIẤY PHÉP SỬ DỤNG]";

  if (typeof applyConfig === 'function') applyConfig();
})();
