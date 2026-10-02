/* =====================================================================
   DIGITAL CITIZEN LAB — ĐỊNH NGHĨA BA RUBRIC
   Nạp trước dcl-admin.js. Mô tả đầy đủ bốn mức nằm ở trang Đánh giá;
   tệp này giữ bản rút gọn để dựng phiếu chấm.

   Thang chung: Xuất sắc 100% · Tốt 75% · Đạt 50% · Chưa đạt 25%
   của điểm tối đa tiêu chí. Tổng điểm tối đa mỗi rubric = 10.
   ===================================================================== */

var DCL_MUC      = ["Xuất sắc", "Tốt", "Đạt", "Chưa đạt"];
var DCL_HE_SO    = [1, 0.75, 0.5, 0.25];

var DCL_R1 = {
  ma: "R1",
  ten: "Rubric 1 — Hoạt động nhóm",
  trongSoDuAn: 0.10,
  tieuChi: [
    { ten: "Hoàn thành khối lượng công việc được giao", max: 4, goiY: [
      "100% đầu việc, đúng hạn, bàn giao dùng được ngay",
      "100% đầu việc, 1 việc trễ dưới 24 giờ, phải chỉnh sửa nhỏ",
      "60–99% đầu việc, 2 việc trễ 1–3 ngày, cần người khác hỗ trợ",
      "Dưới 60% đầu việc, có việc trễ quá 3 ngày hoặc không bàn giao" ] },
    { ten: "Tham gia hoạt động nhóm", max: 3, goiY: [
      "Có mặt 100% số buổi họp, phản hồi tin nhắn trong 24 giờ",
      "Có mặt 80–99%, có 1 lần phản hồi trễ quá 24 giờ",
      "Có mặt 60–79%, có 2–3 lần phản hồi trễ",
      "Có mặt dưới 60%, từ 4 lần trở lên không phản hồi" ] },
    { ten: "Đóng góp xây dựng nhóm, có ghi nhận", max: 3, goiY: [
      "Từ 4 lượt ghi nhận trở lên, có ít nhất 1 lần nhận thêm việc",
      "3 lượt ghi nhận, không nhận thêm việc ngoài phân công",
      "1–2 lượt ghi nhận, chỉ làm đúng phần việc của mình",
      "0 lượt ghi nhận, không góp ý, không phản hồi bản nháp của ai" ] }
  ]
};

var DCL_R2 = {
  ma: "R2",
  ten: "Rubric 2 — Sản phẩm",
  trongSoDuAn: 0.60,
  tieuChi: [
    { ten: "1. Nhận diện vấn đề, hành vi và các bên liên quan (Y1 · slide 1–2)", max: 1, goiY: [
      "Đủ câu phát biểu vấn đề, 100% hành vi, 4 nhóm chủ thể, tách riêng đạo đức và pháp lí",
      "Đủ hành vi, 3/4 nhóm chủ thể, đạo đức và pháp lí viết chung một mục",
      "Nêu vấn đề chưa rõ, 50–99% hành vi, 2/4 chủ thể, thiếu nhận định pháp lí",
      "Không nêu được vấn đề, dưới 50% hành vi, 0–1 chủ thể" ] },
    { ten: "2. Ví dụ bản quyền và khía cạnh pháp lí của thông tin số (Y2, Y4 · slide 5)", max: 2, goiY: [
      "Ví dụ đủ 4 yếu tố, có diễn biến và 2 hậu quả, bảng đủ 6 mức kèm ví dụ, 100% tài nguyên ghi nguồn và điều kiện",
      "Đủ 4 yếu tố, 1 hậu quả, bảng 4–5/6 mức, 1–2 tài nguyên thiếu điều kiện sử dụng",
      "2–3 yếu tố, không mô tả diễn biến, bảng 2–3/6 mức không ví dụ, 3–5 tài nguyên chưa ghi nguồn",
      "Dưới 2 yếu tố, không nêu hậu quả, không có bảng 6 mức, từ 6 tài nguyên không ghi nguồn" ] },
    { ten: "3. Trình bày và giải thích nội dung pháp luật (Y3 · slide 3–4)", max: 1.5, goiY: [
      "Đúng 2 văn bản, 0 đoạn chép quá 25 từ, 100% quy định ghi điều khoản, mỗi quy định có ví dụ",
      "Đúng 2 văn bản, 1 đoạn chép quá 25 từ, đủ điều khoản, 1 quy định thiếu ví dụ",
      "Chỉ 1 văn bản, 2–3 đoạn chép quá 25 từ, dưới 50% có điều khoản, không ví dụ",
      "Dẫn sai hoặc không dẫn văn bản, trên 3 đoạn chép, không ghi điều khoản" ] },
    { ten: "4. Vận dụng quy định để xác định tính hợp pháp (Y5 · slide 6 và 8)", max: 2.5, goiY: [
      "Bảng đủ 4 cột, 100% hành vi, kết luận đúng 100%, có chỉ ra dữ kiện còn thiếu",
      "Bảng đủ 4 cột, 100% hành vi, kết luận đúng 80–99%, không chỉ ra dữ kiện thiếu",
      "Bảng 2–3 cột, phân tích 50–79% hành vi, kết luận đúng 50–79%",
      "Bảng dưới 2 cột hoặc không có, dưới 50% hành vi, kết luận đúng dưới 50%" ] },
    { ten: "5. Tác hại và biện pháp an toàn (Y6, Y7 · slide 7, 9, 10 và infographic)", max: 2, goiY: [
      "Đủ 4 nhóm đối tượng, 100% gắn dữ kiện, checklist từ 3 bước có rẽ nhánh, thử nghiệm 2 người và ghi điều chỉnh",
      "Đủ 4 nhóm, 1–2 tác hại nêu chung, checklist 3 bước có ví dụ, thử nghiệm 1 người hoặc chưa ghi điều chỉnh",
      "2–3 nhóm đối tượng, tác hại nêu chung chung, checklist dưới 3 bước, không thử nghiệm",
      "0–1 nhóm đối tượng, không có checklist hay quy trình nào" ] },
    { ten: "6. Truyền đạt và tính nhất quán (cả hai sản phẩm)", max: 1, goiY: [
      "Đúng tên tệp, đúng 800×2000, đủ 10 slide, 0–2 lỗi, 0 mâu thuẫn, infographic đủ 7 khối",
      "Đúng tên tệp, lệch kích thước dưới 10%, lệch 1–2 slide, 3–4 lỗi, 0 mâu thuẫn, 6–7 khối",
      "Sai tên tệp 1 tệp, sai kích thước, lệch 3–5 slide, 5–8 lỗi, 1 điểm mâu thuẫn, 4–5 khối",
      "Sai tên tệp cả hai, sai kích thước và định dạng, lệch trên 5 slide, trên 8 lỗi, từ 2 mâu thuẫn" ] }
  ],
  chan: { tieuChi: 3, mucToiDa: 2,
    canhBao: "Nếu kết luận sai từ một nửa số hành vi trở lên, tiêu chí 4 không được quá mức Đạt." }
};

var DCL_R3 = {
  ma: "R3",
  ten: "Rubric 3 — Báo cáo và phản biện",
  trongSoDuAn: 0.30,
  trongSoGV: 0.7,
  trongSoNhomBan: 0.3,
  tieuChi: [
    { ten: "1. Nội dung báo cáo", max: 3.5, goiY: [
      "Đủ 5 chặng, giải thích trực tiếp 1 hành vi, giới thiệu infographic kèm ví dụ, không phải đính chính",
      "Đủ 5 chặng, phần lập luận đọc theo slide, chưa nêu cách dùng infographic, đính chính 1 chi tiết",
      "3–4 chặng, đọc slide phần lớn thời lượng, chỉ chiếu infographic, đính chính 2 chi tiết",
      "Dưới 3 chặng, không rõ kết luận về tính hợp pháp, đính chính từ 3 chi tiết" ] },
    { ten: "2. Phong cách thuyết trình và thời gian", max: 2.5, goiY: [
      "10 phút lệch dưới 1 phút, dưới 20% đọc slide, nghe rõ hoàn toàn, từ 2 lần tương tác",
      "Lệch 1–2 phút, 20–40% đọc slide, 1 lần phải nhắc lại, 1 lần tương tác",
      "Lệch 2–4 phút, 40–70% đọc slide, 2–3 lần phải nhắc lại, không tương tác",
      "Lệch trên 4 phút, trên 70% đọc slide, từ 4 lần phải nhắc lại" ] },
    { ten: "3. Trả lời chất vấn và phản biện", max: 3, goiY: [
      "Trả lời 100% câu hỏi, từ 80% có căn cứ, 0 câu sai căn cứ, nêu được điểm sẽ điều chỉnh",
      "Trả lời 100% câu hỏi, 50–79% có căn cứ, 0 câu sai căn cứ, có nêu điểm điều chỉnh",
      "Trả lời 50–99% câu hỏi, dưới 50% có căn cứ, 1 câu sai phải đính chính",
      "Trả lời dưới 50% hoặc né tránh, từ 2 câu sai căn cứ" ] },
    { ten: "4. Phối hợp đồng đội khi báo cáo", max: 1, goiY: [
      "100% thành viên tham gia, chuyển phần dưới 10 giây, có hỗ trợ khi bạn lúng túng",
      "80–99% thành viên tham gia, 1 lần chuyển phần gián đoạn quá 10 giây",
      "50–79% thành viên tham gia, 2–3 lần gián đoạn không ai hỗ trợ",
      "Dưới 50% thành viên tham gia, một người gánh toàn bộ" ] }
  ]
};

var DCL_RUBRICS = { R1: DCL_R1, R2: DCL_R2, R3: DCL_R3 };

function dclTongDiem(rubric, muc) {
  var t = 0;
  for (var i = 0; i < rubric.tieuChi.length; i++) {
    var m = muc[i];
    if (m === null || m === undefined || m < 0 || m > 3) return null;
    t += rubric.tieuChi[i].max * DCL_HE_SO[m];
  }
  return Math.round(t * 100) / 100;
}
