/* =====================================================================
   DIGITAL CITIZEN LAB — HỒ SƠ GIAO NHIỆM VỤ
   Nạp sau dcl-api.js.

   Cách trình bày: học sinh chỉ thấy một lớp thông tin tại một thời điểm.
   Tệp này chỉ dựng năm hồ sơ đề tài ở mục Đề tài. Phần nhiệm vụ chung,
   quy cách sản phẩm và bảng minh chứng đã nằm sẵn trong index.html.
   ===================================================================== */

(function () {
  var css = document.createElement('style');
  css.textContent =
    '.nv-buoc{border:1px solid var(--line);border-radius:10px;margin-bottom:10px;background:#fff;' +
    'overflow:hidden;box-shadow:0 1px 2px rgba(23,33,43,.04)}' +
    '.nv-buoc>summary{list-style:none;cursor:pointer;padding:14px 16px;display:flex;gap:12px;' +
    'align-items:flex-start;font-weight:600;font-size:15px;min-height:52px}' +
    '.nv-buoc>summary::-webkit-details-marker{display:none}' +
    '.nv-buoc>summary:hover{background:var(--tint)}' +
    '.nv-buoc[open]>summary{background:var(--tint);border-bottom:1px solid var(--line)}' +
    '.nv-so{flex-shrink:0;width:26px;height:26px;border-radius:50%;background:var(--pri);color:#fff;' +
    'display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}' +
    '.nv-sum-txt{flex:1}' +
    '.nv-sum-txt small{display:block;font-weight:400;font-size:12.5px;color:var(--sub);margin-top:2px}' +
    '.nv-than{padding:14px 16px 4px}' +
    '.nv-than ol,.nv-than ul{margin:0 0 12px 20px}' +
    '.nv-than li{margin-bottom:7px;font-size:14px;line-height:1.6}' +
    '.nv-slide{border-left:3px solid var(--pri-l);background:var(--tint2);border-radius:0 8px 8px 0;' +
    'padding:10px 13px;margin-bottom:8px}' +
    '.nv-slide b{font-size:13px;color:var(--pri-d)}' +
    '.nv-slide p{font-size:13.5px;margin:3px 0 0;line-height:1.55}' +
    '.nv-ma{display:inline-block;background:var(--tint);border:1px solid #c9dcef;color:var(--pri-d);' +
    'border-radius:4px;padding:1px 7px;font-size:11px;font-weight:700;margin-left:6px}' +
    '.nv-canh{background:var(--warm);border:1px solid #e9d2a6;border-radius:8px;padding:12px 14px;' +
    'font-size:13.5px;margin-bottom:12px}' +
    '.nv-ho{background:var(--pri-d);color:#fff;border-radius:10px;padding:16px 18px;margin-bottom:14px}' +
    '.nv-ho .kicker{color:#9cc2e4}' +
    '.nv-hoso>summary{font-size:16.5px;padding:16px 18px}' +
    '.nv-hoso>summary .nv-so{background:var(--acc)}' +
    '.nv-ho h3{color:#fff;margin:2px 0 8px;font-size:20px}' +
    '.nv-ho p{color:#d7e6f3;margin:0;font-size:14.5px}';
  document.head.appendChild(css);
})();

/* ---------- Phần chung ---------- */
var NV_HOSO = [
{ no: 1, ten: 'Bản tin lớp học đáng tin cậy',
  cauHoi: 'Làm thế nào để bản tin chia sẻ trong nhóm lớp vừa đáng tin cậy, vừa tôn trọng quyền đối với nội dung được sử dụng?',
  boiCanh: [
    'Sáng 10/10/2026, nhà trường đăng thông báo chính thức: học sinh vẫn học buổi chiều ngày 10/10/2026 theo thời khoá biểu.',
    'Khoảng 7h05, Minh chụp lại thông báo này, chỉnh sửa ảnh, thay ngày 10/10 thành 11/10, rồi đăng vào nhóm lớp kèm dòng "Mai trường nghỉ nha mọi người". Minh không nói cho các thành viên biết ảnh đã bị sửa. Sau đó một bạn khác chuyển tiếp ảnh sang nhóm chung của khối. Đến 7h45, giáo viên chủ nhiệm phát hiện thông tin sai và yêu cầu dừng chia sẻ.',
    'Trong bài đăng, Minh còn dùng một infographic do CLB Truyền thông của trường thực hiện.'],
  cotDuKien: ['Tài nguyên', 'Chủ thể quyền', 'Điều kiện được công bố', 'Thực tế đã xảy ra'],
  duKien: [
    ['Ảnh thông báo của nhà trường', 'Nhà trường', 'Thông báo chính thức, nội dung không được thay đổi khi chia sẻ lại', 'Bị sửa ngày tháng rồi lan truyền'],
    ['Infographic của CLB Truyền thông', 'CLB Truyền thông của trường', 'Giữ tên tác giả và logo khi chia sẻ hoặc sử dụng; chỉnh sửa phải có sự đồng ý của CLB', 'Minh xoá tên CLB và logo trước khi đăng']],
  huong: ['Quy định về đăng tải, chia sẻ thông tin sai sự thật trên mạng và trách nhiệm của người chia sẻ lại.',
    'Quyền của tác giả đối với tác phẩm: quyền đứng tên, quyền bảo vệ sự toàn vẹn của tác phẩm, và việc sửa đổi tác phẩm khi chưa được phép.',
    'Phân biệt nội dung được phép xem, được phép chia sẻ nguyên bản, và được phép chỉnh sửa — ba mức rất khác nhau trong tình huống này.'],
  lamRo: ['Ranh giới giữa nhầm lẫn khi chia sẻ và cố ý tạo thông tin sai: dữ kiện nào trong hồ sơ cho thấy sự khác biệt?',
    'Infographic bị xoá tên tác giả là vi phạm quyền gì, khác với việc dùng ảnh thông báo ở điểm nào?',
    'Checklist ở slide 9 nên là quy trình kiểm chứng trước khi bấm chia sẻ trong nhóm lớp.'] },

{ no: 2, ten: 'Ảnh lớp lên mạng',
  cauHoi: 'Trước khi đăng hoặc dùng lại một bức ảnh, học sinh cần kiểm tra những quyền và điều kiện nào?',
  boiCanh: [
    'Ngày 18/09/2026, lớp 10A2 đi ngoại khoá tại một bảo tàng. An là học sinh phụ trách chụp ảnh, chụp khoảng 80 bức.',
    '18h cùng ngày, An gửi ảnh cho lớp trưởng để làm báo cáo hoạt động và chia sẻ trong nhóm lớp. An nói rõ: nếu muốn đăng công khai lên mạng thì hỏi An trước.',
    'Ngày 19/09/2026, lớp trưởng chọn 12 bức và đăng công khai trên trang của lớp. Bài đăng kèm họ tên, trường, lớp và số điện thoại liên hệ của một học sinh phụ trách hoạt động. Một học sinh có mặt trong ảnh đã đề nghị không đăng bức ảnh có mình, nhưng bức ảnh vẫn được giữ trong bài đăng.',
    'Ngày 20/09/2026, nhóm truyền thông của trường lấy 3 bức để thiết kế poster giới thiệu hoạt động. Tên người chụp có trên ảnh gốc nhưng bị cắt khỏi poster. Nhóm chưa trao đổi với An về việc này.'],
  cotDuKien: ['Đối tượng', 'Ai có quyền', 'Điều kiện đã nêu', 'Thực tế đã xảy ra'],
  duKien: [
    ['80 bức ảnh ngoại khoá', 'An, người chụp', 'Dùng trong nhóm lớp và báo cáo; đăng công khai phải hỏi An trước', '12 bức được đăng công khai, không hỏi An'],
    ['Hình ảnh của từng học sinh trong ảnh', 'Chính học sinh đó', 'Một bạn đã đề nghị không đăng ảnh có mình', 'Ảnh vẫn được giữ trong bài đăng'],
    ['Họ tên, trường lớp, số điện thoại', 'Học sinh được nêu tên', 'Không có dữ kiện cho thấy bạn này đồng ý công khai số điện thoại', 'Được đăng công khai kèm bài'],
    ['3 bức dùng làm poster', 'An', 'Tên người chụp có trên ảnh gốc', 'Tên bị cắt khỏi poster, chưa trao đổi với An']],
  huong: ['Quyền của cá nhân đối với hình ảnh của mình: khi nào việc sử dụng cần có sự đồng ý, trường hợp nào không.',
    'Bảo vệ dữ liệu cá nhân: họ tên, lớp, số điện thoại gộp lại thì mức rủi ro khác với từng thông tin riêng lẻ ra sao.',
    'Quyền của người chụp đối với bức ảnh: quyền đứng tên và việc sử dụng lại ảnh cho mục đích khác với mục đích ban đầu.'],
  lamRo: ['Trên cùng một bức ảnh poster, có mấy chủ thể quyền và mỗi người bị ảnh hưởng ở quyền nào?',
    'Được gửi ảnh để làm báo cáo khác được đăng công khai và khác được dùng làm poster ở điểm nào — đây chính là chỗ vận dụng bảng sáu mức ở slide 5.',
    'Checklist ở slide 9 nên là quy trình kiểm tra trước khi đăng hoặc dùng lại một bức ảnh có người trong đó.'] },

{ no: 3, ten: 'Nhóm chat không gây tổn thương',
  cauHoi: 'Làm thế nào để tham gia nhóm chat mà không xâm phạm quyền của người khác, và biết xử lí khi có nội dung gây tổn thương?',
  boiCanh: [
    'Ngày 05/10/2026, nhóm chat của lớp 10A3 có 38 thành viên. Lúc 20h15, Khoa gửi ảnh bài tập của Nam vào nhóm kèm bình luận mang tính chế giễu. Một số thành viên tiếp tục bình luận theo hướng công kích Nam. Khoảng 20h30, Long chụp màn hình đoạn hội thoại và chuyển sang một nhóm khác có khoảng 100 học sinh.',
    'Cũng trong nhóm chat này, một thành viên lấy tranh minh hoạ "Bạn bè cùng học" do Mai, học sinh lớp 10B1, vẽ ngày 01/10/2026. Thành viên đó thêm dòng chữ chế giễu vào tranh, cắt phần chữ kí của Mai rồi gửi vào nhóm. Sau đó Long tiếp tục đưa phiên bản đã chỉnh sửa ra khỏi nhóm lớp.'],
  cotDuKien: ['Đối tượng', 'Ai có quyền', 'Điều kiện đã nêu', 'Thực tế đã xảy ra'],
  duKien: [
    ['Ảnh bài tập của Nam', 'Nam', 'Không có dữ kiện cho thấy Nam đồng ý cho đăng bài làm của mình', 'Được đăng vào nhóm 38 người kèm bình luận chế giễu'],
    ['Đoạn hội thoại trong nhóm lớp', 'Các thành viên tham gia hội thoại', 'Nội dung trao đổi trong phạm vi nhóm lớp', 'Bị chụp màn hình và đưa sang nhóm 100 người'],
    ['Tranh "Bạn bè cùng học"', 'Mai, lớp 10B1', 'Cho phép chia sẻ nguyên bản để giới thiệu hoạt động học tập; không cho phép chỉnh sửa nội dung', 'Bị thêm chữ chế giễu, bị cắt chữ kí, rồi đưa ra ngoài nhóm']],
  huong: ['Quy định về hành vi xúc phạm danh dự, nhân phẩm người khác trên mạng và trách nhiệm của người phát tán lại.',
    'Quy tắc ứng xử trên mạng xã hội, cùng nội quy nhà trường về giao tiếp trong các nhóm chat của lớp.',
    'Quyền bảo vệ sự toàn vẹn của tác phẩm: vì sao việc sửa tranh của Mai là vấn đề riêng, tách khỏi chuyện nội dung thêm vào mang tính chế giễu.'],
  lamRo: ['Tranh của Mai bị xâm phạm hai thứ cùng lúc: quyền được giữ chữ kí và quyền không bị sửa nội dung. Phân tích cả hai, đừng gộp làm một.',
    'Khi nào một lời đùa trong nhóm chat vượt sang phạm vi pháp lí: nhóm nêu tiêu chí phân biệt dựa trên căn cứ, không dựa trên cảm tính.',
    'Slide 9 nên là quy trình xử lí cho người chứng kiến: thấy nội dung gây tổn thương trong nhóm chat thì làm gì, theo thứ tự nào, báo cho ai.'] },

{ no: 4, ten: 'Sản phẩm học tập số đúng quyền',
  cauHoi: 'Làm thế nào để tạo và chia sẻ sản phẩm học tập hấp dẫn mà vẫn đúng nghĩa vụ với sản phẩm số của người khác?',
  boiCanh: [
    'Nhóm học sinh lớp 10A4 đang làm một sản phẩm học tập số chủ đề "An toàn thông tin cho học sinh THPT", dự định đăng toàn bộ lên WebQuest của lớp vào ngày 15/10/2026.'],
  cotDuKien: ['Tài nguyên', 'Nguồn và điều kiện được công bố', 'Nhóm đã làm gì'],
  duKien: [
    ['Hình ảnh', 'Lấy từ Wikimedia Commons, giấy phép CC BY 4.0; điều kiện: ghi nhận tác giả và nguồn', 'Đã dùng và cắt ảnh, chưa ghi thông tin tác giả'],
    ['Âm nhạc — bản "Study Night"', 'Đăng trên một kênh chia sẻ âm thanh; trang ghi rõ chỉ dùng để nghe cá nhân', 'Dùng khoảng 45 giây làm nhạc nền cho video, dự định đăng công khai'],
    ['Đoạn tài liệu', 'Tài liệu điện tử của một trung tâm giáo dục; trang ghi rõ chỉ dùng tham khảo cá nhân, không đăng lại toàn bộ hoặc một phần trên website khác', 'Sao chép 4 đoạn văn, chưa xin phép']],
  huong: ['Giấy phép Creative Commons: CC BY cho phép những gì, bắt buộc điều gì, và ghi công đúng cách trông ra sao.',
    'Phân biệt miễn phí tải về, được phép sử dụng lại, và được phép đăng công khai — ba chuyện khác nhau.',
    'Trích dẫn hợp lí trong học tập: dẫn một đoạn ngắn có ghi nguồn khác với sao chép nhiều đoạn rồi đăng lại ở điểm nào.',
    'Tìm nguồn thay thế: kho ảnh, nhạc và tài liệu có điều kiện sử dụng rõ ràng cho mục đích học tập.'],
  lamRo: ['Hồ sơ này khác bốn hồ sơ còn lại ở chỗ nhóm trong tình huống chưa đăng, vẫn còn sửa được. Vì vậy slide 8 phải so sánh ít nhất hai phương án xử lí thật sự khác nhau cho từng tài nguyên: bổ sung ghi công, xin phép, thay bằng nguồn khác, hoặc bỏ hẳn — rồi chọn và nói rõ căn cứ.',
    'Ba tài nguyên rơi vào ba mức khác nhau trong bảng sáu mức ở slide 5: một thứ được dùng nếu ghi công, một thứ chỉ được nghe cá nhân, một thứ chỉ được tham khảo chứ không được đăng lại. Đây là hồ sơ thuận lợi nhất để làm rõ Y4.',
    'Slide 9 nên là checklist kiểm tra tài nguyên trước khi đưa vào sản phẩm học tập số.'] },

{ no: 5, ten: 'Góc phần mềm học tập hợp pháp',
  cauHoi: 'Làm thế nào để lớp dùng được phần mềm cần thiết mà không sử dụng, sao chép hay chia sẻ vượt quyền được cấp?',
  boiCanh: [
    'Lớp 10A5 cần phần mềm EduDesign Pro để thiết kế sản phẩm học tập. Nhà trường đã mua 01 giấy phép sử dụng cho tài khoản 10A5-design@school.edu.vn.',
    'Ngày 09/10/2026, một học sinh tải bộ cài từ website chính thức và đề nghị gửi bộ cài cùng khoá kích hoạt vào nhóm lớp để mọi người cùng dùng. Khoá kích hoạt được gửi vào nhóm có 35 thành viên. Sau đó 6 học sinh dùng thông tin này để kích hoạt phần mềm trên tài khoản cá nhân.',
    'Nhóm còn dự định chụp màn hình phần mềm để đưa vào sản phẩm học tập. Ảnh chụp có thể nhìn thấy tên tài khoản lớp và một phần thông tin khoá kích hoạt.'],
  cotDuKien: ['Nội dung', 'Quy định cụ thể'],
  duKien: [
    ['Phạm vi', 'Giấy phép cấp cho 01 tài khoản được chỉ định'],
    ['Chia sẻ', 'Không được chia sẻ khoá kích hoạt hoặc thông tin đăng nhập cho tài khoản khác'],
    ['Thời hạn', '01/10/2026 đến 31/12/2026'],
    ['Tải bộ cài', 'Người được cấp phép có thể tải bộ cài từ website chính thức để cài trên thiết bị phục vụ việc sử dụng tài khoản được cấp']],
  huong: ['Quy định về quyền tác giả đối với chương trình máy tính và về sao chép, phân phối phần mềm vượt phạm vi được cấp phép.',
    'Điều khoản sử dụng phần mềm: giấy phép theo tài khoản, theo thiết bị, theo số lượt cài — khác nhau ở điểm nào.',
    'An toàn thông tin tài khoản: rủi ro khi để lộ thông tin đăng nhập hoặc mã kích hoạt của tài khoản do nhà trường quản lí.',
    'Giải pháp thay thế hợp pháp: bản dùng thử, giấy phép giáo dục, phần mềm nguồn mở, công cụ web miễn phí cho học sinh.'],
  lamRo: ['Phân biệt hành vi nằm trong phạm vi giấy phép và hành vi vượt phạm vi; slide 6 phải cho thấy sự phân biệt đó chứ không kết luận sai cho cả 5 hành vi.',
    'Hành vi 5 gây ra một loại rủi ro khác hẳn bốn hành vi trên: không phải chuyện bản quyền mà là lộ thông tin tài khoản. Phân tích riêng, đừng gộp.',
    'Slide 8 so sánh các phương án để cả lớp vẫn làm được sản phẩm: xin thêm giấy phép, dùng luân phiên trên tài khoản được cấp, hoặc chuyển sang công cụ khác.',
    'Slide 9 nên là checklist kiểm tra quyền sử dụng phần mềm trước khi cài đặt, sao chép hoặc chia sẻ.'] }
];

/* ---------- Dựng khối gấp ---------- */
function nvBuoc(so, ten, tom, than, mo) {
  return '<details class="nv-buoc"' + (mo ? ' open' : '') + '><summary>'
    + '<span class="nv-so">' + so + '</span>'
    + '<span class="nv-sum-txt">' + dclEsc(ten) + '<small>' + dclEsc(tom) + '</small></span>'
    + '</summary><div class="nv-than">' + than + '</div></details>';
}

function nvBang(cot, dong) {
  var h = '<div class="wrap"><table><thead><tr>';
  for (var i = 0; i < cot.length; i++) h += '<th>' + dclEsc(cot[i]) + '</th>';
  h += '</tr></thead><tbody>';
  for (i = 0; i < dong.length; i++) {
    h += '<tr>';
    for (var j = 0; j < dong[i].length; j++)
      h += '<td' + (j === 0 ? ' style="font-weight:600"' : '') + '>' + dclEsc(dong[i][j]) + '</td>';
    h += '</tr>';
  }
  return h + '</tbody></table></div>';
}

/* ---------- Mục Nhiệm vụ: phần chung ---------- */

/* ---------- Mục Đề tài: công khai cả năm hồ sơ ---------- */
/* Giáo viên quay số tại lớp, nhóm điền biểu mẫu để ghi nhận.
   Trang chỉ làm một việc: cho đọc hồ sơ. Không cần đăng nhập. */

function nvVeMotHoSo(hs, mo) {
  var tBc = '';
  for (var k = 0; k < hs.boiCanh.length; k++)
    tBc += '<p class="sm">' + dclEsc(hs.boiCanh[k]) + '</p>';

  var tH = '<ul>';
  for (k = 0; k < hs.huong.length; k++) tH += '<li>' + dclEsc(hs.huong[k]) + '</li>';
  tH += '</ul><p class="xs" style="color:var(--acc)">Mỗi nhóm phải kiểm tra văn bản mình dẫn '
     + 'còn hiệu lực hay đã được thay thế. Đây là một phần của việc kiểm chứng nguồn, '
     + 'và chính là điều Y3 yêu cầu.</p>';

  var tL = '<ul>';
  for (k = 0; k < hs.lamRo.length; k++) tL += '<li>' + dclEsc(hs.lamRo[k]) + '</li>';
  tL += '</ul>';

  var than = '<p class="sm sub" style="margin-bottom:14px"><strong>Câu hỏi tình huống:</strong> '
    + dclEsc(hs.cauHoi) + '</p>'
    + nvBuoc(1, 'Bối cảnh', 'Chuyện gì đã xảy ra, vào lúc nào.', tBc, true)
    + nvBuoc(2, 'Dữ kiện về quyền và điều kiện sử dụng',
        'Bảng này là căn cứ cho slide 5 và slide 6. Không tự thêm dữ kiện ngoài bảng.',
        nvBang(hs.cotDuKien, hs.duKien))
    + nvBuoc(3, 'Hướng tìm hiểu', 'Gợi ý tìm căn cứ, không phải đáp án.', tH)
    + nvBuoc(4, 'Riêng hồ sơ này phải làm rõ',
        'Những chỗ nhóm hay bỏ sót và sẽ bị trừ điểm.', tL);

  return '<details class="nv-buoc nv-hoso"' + (mo ? ' open' : '') + '><summary>'
    + '<span class="nv-so">0' + hs.no + '</span>'
    + '<span class="nv-sum-txt">' + dclEsc(hs.ten)
    + '<small>' + dclEsc(hs.cauHoi) + '</small></span>'
    + '</summary><div class="nv-than">' + than + '</div></details>';
}

function nvKhoiHoSo() {
  var box = dclEl('detai-body');
  if (!box) return;
  var h = '';
  for (var i = 0; i < NV_HOSO.length; i++) h += nvVeMotHoSo(NV_HOSO[i], false);
  h += '<p class="xs sub" style="margin-top:14px">Mọi tình huống đều hư cấu, phục vụ học tập. '
     + 'Không dùng tên, hình ảnh hay hội thoại thật của bạn học để phân tích.</p>';
  box.innerHTML = h;
}

(function () {
  function start() { setTimeout(nvKhoiHoSo, 40); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
