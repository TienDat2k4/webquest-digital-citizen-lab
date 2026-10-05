/* =====================================================================
   DIGITAL CITIZEN LAB — TỆP CẤU HÌNH
   Đây là tệp DUY NHẤT giáo viên cần sửa trong kho GitHub.

   Danh sách lớp, danh sách học sinh, hạn nộp, số nhóm, mã nhóm đều nằm
   trên máy chủ Google Sheets, không khai ở đây.

   Nguyên tắc: tệp này nạp SAU index.html nên mọi dòng ở đây sẽ GHI ĐÈ
   giá trị trong index.html. Vì vậy chỉ mở dòng nào thật sự muốn đổi.
   Dòng nào để nguyên dấu chú thích thì index.html giữ giá trị sẵn có.
   ===================================================================== */


/* ---------------------------------------------------------------------
   PHẦN BẮT BUỘC SỬA — nối trang với máy chủ
   --------------------------------------------------------------------- */

var DCL_API = {

  // Link lấy ở bước Triển khai > Ứng dụng web trong Apps Script.
  // Phải kết thúc bằng /exec, không phải /dev.
  url:   "https://script.google.com/macros/s/AKfycbynSe_iwIEhEKKShviiOKBcwjiuEslkS1nBjikfzazd7WzQ2bep1ZJsv5aRnSv6MIheuw/exec",

  // Phải trùng HỆT biến TOKEN ở đầu tệp Code.gs.
  token: "DOI_CHUOI_NAY_THANH_CUA_BAN"

};


/* ---------------------------------------------------------------------
   PHẦN TUỲ CHỌN — bỏ dấu // ở đầu dòng nào muốn đổi
   --------------------------------------------------------------------- */

(function () {
  if (typeof CONFIG === 'undefined') return;

  /* --- Vòng ôn tập --- */

  // Số hồ sơ phải giải đúng để mở khoá. Mặc định 7 trên 10.
  // CONFIG.diemDat = 7;

  // Đặt false nếu muốn mở sẵn mọi mục, không bắt chơi vòng ôn tập.
  // Dùng khi dạy thử hoặc khi lớp không kịp thời gian.
  // CONFIG.batBuocMoKhoa = true;


  /* --- Hai sản phẩm mẫu của giáo viên ---
     index.html đã có sẵn link Canva. Chỉ mở hai dòng dưới nếu đổi link. */

  // CONFIG.mauTrinhChieu  = "https://...";
  // CONFIG.mauInfographic = "https://...";


  /* --- Thư mục học liệu ---
     index.html đã có sẵn bốn link Drive ở mục Tài nguyên.
     Chỉ mở dòng nào nếu đổi thư mục. */

  // CONFIG.hocLieuPhapLy = "https://drive.google.com/...";
  // CONFIG.quyentacgia   = "https://drive.google.com/...";
  // CONFIG.ungxu         = "https://drive.google.com/...";
  // CONFIG.video         = "https://drive.google.com/...";


  /* --- Biểu mẫu ---
     Hai biểu mẫu đang gắn thẳng trong index.html ở mục Đề tài và Nộp bài.
     Đổi link thì sửa ngay trong index.html, không sửa ở đây. */


  /* Gọi lại để các thay đổi phía trên có hiệu lực trên giao diện. */
  if (typeof applyConfig === 'function') applyConfig();
})();
