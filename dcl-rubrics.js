/* =====================================================================
   DIGITAL CITIZEN LAB — BA RUBRIC, NGUỒN DUY NHẤT
   Chép theo mục Đánh giá dự án của Kế hoạch bài dạy, bản báo cáo
   2627102_Report_Group05.
   Trang Đánh giá và mọi phiếu chấm đều dựng từ tệp này. 

   Thang chung: Xuất sắc 100% · Tốt 75% · Đạt 50% · Chưa đạt 25%
   của điểm tối đa tiêu chí. Tổng điểm tối đa mỗi rubric bằng 10. 
   ===================================================================== */

var DCL_MUC   = ['Xuất sắc', 'Tốt', 'Đạt', 'Chưa đạt'];
var DCL_HE_SO = [1, 0.75, 0.5, 0.25];

var DCL_R1 = {
  ma: 'R1', ten: 'Rubric 1 — Đánh giá hoạt động nhóm', trongSo: '10%',
  moTa: 'Mỗi học sinh tự chấm, nhóm chấm chéo từng thành viên theo đúng ba tiêu chí, lấy trung bình. '
      + 'Giáo viên đối chiếu với nhật kí và điều chỉnh nếu chênh quá một mức; điểm giáo viên duyệt là điểm cuối. '
      + 'Minh chứng duy nhất được dùng là nhật kí dự án của nhóm và lịch sử làm việc trên công cụ số.',
  tieuChi: [
    { ten: '1. Hoàn thành phần việc được giao', max: 4, mucDo: [
      ['Hoàn thành 100% đầu việc trong bảng phân công, đúng hoặc trước hạn nhóm đặt ra'],
      ['Hoàn thành 100% đầu việc, có 1 đầu việc trễ dưới 24 giờ'],
      ['Hoàn thành từ 60% đầu việc trở lên, hoặc có 2 đầu việc trễ từ 1 đến 3 ngày'],
      ['Hoàn thành dưới 60% đầu việc, hoặc có đầu việc trễ quá 3 ngày']
    ] },
    { ten: '2. Tham gia làm việc nhóm', max: 3, mucDo: [
      ['Có mặt ở 100% số buổi họp nhóm ghi trong nhật kí',
       'Tích cực phát biểu, đưa ra ý kiến giúp nhóm cải thiện sản phẩm hoặc tiến độ'],
      ['Có mặt từ 80% số buổi trở lên',
       'Có trao đổi, góp ý và hợp tác cùng các bạn'],
      ['Có mặt từ 60% số buổi trở lên',
       'Có mặt nhưng thụ động, rất ít khi lên tiếng đóng góp ý kiến'],
      ['Có mặt dưới 60% số buổi, hoặc không có sự tương tác với nhóm']
    ] },
    { ten: '3. Ý thức xây dựng nhóm', max: 3, mucDo: [
      ['Luôn tích cực, thân thiện, hợp tác tốt với các thành viên',
       'Chủ động hỗ trợ nhóm, góp phần tạo môi trường học tập tích cực'],
      ['Giao tiếp lịch sự, tôn trọng và phối hợp nghiêm túc với các thành viên'],
      ['Có hợp tác, nhưng còn rụt rè hoặc ít tham gia trao đổi'],
      ['Thái độ thiếu thiện chí hoặc gây ảnh hưởng tiêu cực đến nhóm']
    ], khongDemDuoc: true }
  ]
};

var DCL_R2 = {
  ma: 'R2', ten: 'Rubric 2 — Đánh giá sản phẩm', trongSo: '60%',
  moTa: 'Giáo viên chấm dựa trên hai sản phẩm của nhóm: bài trình chiếu và infographic.',
  tieuChi: [
    { ten: '1. Nội dung bài trình chiếu', max: 3, mucDo: [
      ['Trình bày đầy đủ các nội dung cốt lõi của hồ sơ',
       'Thông tin chính xác, bám dữ kiện; lập luận thể hiện rõ mạch dữ kiện đến quy định đến đối chiếu đến kết luận',
       'Phân tích có chiều sâu, liên kết được khía cạnh đạo đức và văn hoá với pháp lí, đề xuất giải pháp phù hợp tình huống',
       'Mỗi quy định kèm ít nhất 1 ví dụ minh hoạ'],
      ['Nội dung cơ bản đầy đủ và đúng trọng tâm; còn thiếu một vài chi tiết nhỏ nhưng không làm thay đổi kết luận chính',
       'Căn cứ và lập luận nhìn chung chính xác; một số chỗ đối chiếu hoặc giải thích chưa sâu',
       'Giải pháp phù hợp nhưng phần dự đoán, điều chỉnh hoặc minh chứng còn chưa rõ',
       'Có ít nhất 1 quy định không có ví dụ minh hoạ'],
      ['Trình bày được các nội dung chính nhưng còn thiếu một số phần hoặc liên kết giữa các phần chưa rõ',
       'Có căn cứ pháp lí nhưng việc giải thích và đối chiếu còn thiên về mô tả; xuất hiện một số nhận định chưa chính xác nhưng chưa làm sai hoàn toàn hướng xử lí',
       'Giải pháp còn chung, chưa thể hiện rõ quy trình hành động',
       'Có ví dụ minh hoạ nhưng chưa phù hợp'],
      ['Thiếu nhiều nội dung cốt lõi hoặc trình bày sai bản chất tình huống',
       'Căn cứ pháp lí không phù hợp, thiếu nguồn hoặc kết luận chủ yếu dựa trên cảm tính, không có đối chiếu',
       'Không làm rõ được tác hại, phương án xử lí hoặc khuyến nghị an toàn và hợp pháp',
       'Không có ví dụ minh hoạ']
    ] },
    { ten: '2. Nội dung Infographic', max: 3, mucDo: [
      ['Cô đọng đúng các thông tin quan trọng từ kết quả nghiên cứu, không sao chép nguyên bài trình chiếu',
       'Người đọc có thể hiểu độc lập: nhận diện được vấn đề và rủi ro, biết điều nên làm và không nên làm, xác định được hành động tiếp theo',
       'Checklist hoặc quy trình rõ ràng, khả thi; nội dung hoàn toàn thống nhất với kết luận của bài trình chiếu'],
      ['Tóm tắt đúng và tương đối đầy đủ các thông tin cốt lõi; còn một vài chi tiết chưa thật cô đọng hoặc chưa được trực quan hoá tốt',
       'Checklist hoặc quy trình sử dụng được; thông điệp chính rõ và không mâu thuẫn với bài trình chiếu'],
      ['Có các thông tin chính nhưng còn dài dòng, thiên về chép chữ từ bài trình chiếu hoặc chưa tập trung vào hành động',
       'Checklist hoặc quy trình còn đơn giản; một số thông tin khó xác định nhanh hoặc chưa liên kết rõ với tình huống'],
      ['Thiếu hoặc sai các thông tin cốt lõi; thông điệp không rõ hoặc có mâu thuẫn với bài trình chiếu',
       'Không hình thành được checklist hoặc quy trình có thể sử dụng; infographic không thực hiện được chức năng hướng dẫn hành động']
    ] },
    { ten: '3. Hình thức sản phẩm', max: 1, mucDo: [
      ['Tên tệp được đặt đúng theo cú pháp quy định',
       'Infographic đúng kích thước yêu cầu',
       'Bài trình chiếu có số lượng slide đúng quy định',
       'Không có lỗi chính tả, dùng từ hoặc trình bày; câu chữ rõ ràng, thống nhất'],
      ['Tên tệp đúng cú pháp',
       'Kích thước infographic chỉ sai lệch nhẹ so với yêu cầu',
       'Số lượng slide chênh lệch không quá 1 đến 2 slide so với quy định',
       'Có một vài lỗi nhỏ về chính tả hoặc diễn đạt'],
      ['Tên tệp chưa hoàn toàn đúng cú pháp',
       'Infographic không đúng kích thước quy định',
       'Số lượng slide chênh lệch khoảng 3 đến 4 slide so với yêu cầu',
       'Có một số lỗi chính tả, dùng từ hoặc diễn đạt; tuy nhiên nội dung chính vẫn có thể hiểu được'],
      ['Tên tệp sai rõ so với cú pháp quy định',
       'Infographic sai kích thước rõ rệt',
       'Số lượng slide chênh lệch lớn, từ 5 slide trở lên so với yêu cầu',
       'Có nhiều lỗi chính tả, dùng từ hoặc diễn đạt, gây khó khăn cho việc đọc hiểu và làm giảm chất lượng sản phẩm']
    ] },
    { ten: '4. Bố cục, màu sắc và tính trực quan', max: 1, mucDo: [
      ['Bố cục rõ ràng, có thứ bậc thông tin; chữ, bảng, hình và khoảng trắng phối hợp hợp lí',
       'Màu sắc hài hoà, có độ tương phản phù hợp, thống nhất giữa các thành phần và hỗ trợ làm nổi bật thông tin quan trọng',
       'PowerPoint hỗ trợ lập luận; infographic trực quan, cô đọng và dễ sử dụng'],
      ['Bố cục nhìn chung rõ, dễ đọc; màu sắc tương đối hài hoà và thống nhất',
       'Còn một vài vị trí dày chữ, thiếu điểm nhấn, phối màu chưa tối ưu hoặc chưa cân đối nhưng không cản trở việc hiểu'],
      ['Bố cục và màu sắc ở mức cơ bản; một số phần dày chữ, chữ và hình chưa cân đối, tương phản hoặc thứ bậc thông tin chưa rõ',
       'Người xem vẫn nhận biết được nội dung chính'],
      ['Bố cục rối hoặc thiếu nhất quán; màu sắc gây khó đọc, tương phản kém hoặc dùng quá nhiều màu làm phân tán chú ý',
       'Hình và bảng không hỗ trợ nội dung, gây khó khăn đáng kể cho việc theo dõi và sử dụng sản phẩm']
    ] },
    { ten: '5. Nguồn tài liệu và quyền sử dụng', max: 1, mucDo: [
      ['Các thông tin, số liệu và căn cứ pháp lí quan trọng có nguồn chính thống và đáng tin cậy, truy xuất được và ghi nhất quán',
       'Hình ảnh, icon, mẫu thiết kế hoặc tài nguyên bên ngoài có nguồn và điều kiện sử dụng phù hợp; không dùng tài nguyên vượt quyền cho phép'],
      ['Nguồn nhìn chung uy tín và kiểm chứng được; còn một vài thiếu sót nhỏ về cách ghi nguồn hoặc điều kiện sử dụng nhưng không ảnh hưởng các kết luận chính'],
      ['Có ghi nguồn nhưng chưa nhất quán; một số nguồn hoặc tài nguyên chưa làm rõ độ tin cậy, quyền sử dụng và cần kiểm tra bổ sung'],
      ['Nhiều thông tin quan trọng không có nguồn hoặc dựa chủ yếu vào nguồn khó kiểm chứng; sử dụng tài nguyên không rõ nguồn và quyền, hoặc có dấu hiệu vượt phạm vi cho phép']
    ] },
    { ten: '6. Thời hạn nộp sản phẩm', max: 1, mucDo: [
      ['Nộp đầy đủ 02 sản phẩm trước hoặc đúng thời hạn cuối được công bố'],
      ['Nộp đầy đủ 02 sản phẩm trễ không quá 2 giờ so với thời hạn cuối'],
      ['Nộp đầy đủ 02 sản phẩm trễ trên 2 giờ đến không quá 6 giờ so với thời hạn cuối'],
      ['Nộp trễ trên 6 giờ đến không quá 12 giờ. Không nộp sản phẩm thì phần sản phẩm không có minh chứng được tính 0 điểm theo quy định']
    ], tuDongTheoGio: true }
  ]
};

var DCL_R3 = {
  ma: 'R3', ten: 'Rubric 3 — Đánh giá trình bày sản phẩm', trongSo: '30%',
  moTa: 'Giáo viên chấm dựa trên phần thuyết trình sản phẩm của các nhóm. '
      + 'Các nhóm bạn vẫn gửi phiếu theo rubric này để luyện kĩ năng đánh giá, '
      + 'nhưng phiếu của nhóm bạn là tham khảo, không tính vào điểm.',
  tieuChi: [
    { ten: '1. Nội dung báo cáo', max: 4, mucDo: [
      ['Trình bày mạch lạc, bám đúng trọng tâm, làm nổi bật được đủ 5 nội dung chính: tình huống, hành vi và các bên, căn cứ pháp lí, kết luận về tính hợp pháp, giải pháp'],
      ['Trình bày rõ và đủ 5 nội dung chính, nhưng có lúc sa vào chi tiết phụ, chưa thật tập trung'],
      ['Trình bày được khoảng 80% nội dung chính của sản phẩm'],
      ['Trình bày qua loa, chưa đi vào nội dung chính của sản phẩm, từ 3 trong 5 nội dung trở xuống']
    ] },
    { ten: '2. Phong cách thuyết trình và thời gian', max: 3, mucDo: [
      ['Thời lượng 10 phút, lệch không quá 1 phút',
       'Tự tin, lưu loát, diễn đạt tự nhiên, ngôn ngữ phù hợp',
       'Có tương tác tích cực với người nghe'],
      ['Thời lượng lệch 1 đến 2 phút',
       'Tự tin, rõ ràng, ngôn ngữ phù hợp',
       'Có giao tiếp với người nghe nhưng còn lúng túng'],
      ['Thời lượng lệch 2 đến 4 phút',
       'Giọng rõ nhưng đôi lúc còn vấp, phụ thuộc slide hoặc kịch bản ở phần lớn bài',
       'Ít giao tiếp với người nghe'],
      ['Thời lượng lệch trên 4 phút',
       'Thiếu tự tin, đọc lại toàn bộ nội dung',
       'Không tương tác với người nghe']
    ] },
    { ten: '3. Trả lời chất vấn và phản biện', max: 3, mucDo: [
      ['Trả lời chính xác, logic và đầy đủ câu hỏi'],
      ['Trả lời đúng phần lớn câu hỏi, lập luận hợp lí'],
      ['Trả lời được các câu hỏi cơ bản'],
      ['Không trả lời được hoặc trả lời sai nội dung']
    ] }
  ]
};

var DCL_RUBRICS = { R1: DCL_R1, R2: DCL_R2, R3: DCL_R3 };

function dclMilli(x) { return Math.round(Number(x) * 1000); }
function dclTongDiem(rubric, muc) {
  var m = 0;
  for (var i = 0; i < rubric.tieuChi.length; i++) {
    var v = muc[i];
    if (v === null || v === undefined || v < 0 || v > 3) return null;
    m += dclMilli(rubric.tieuChi[i].max * DCL_HE_SO[v]);
  }
  return m / 1000;
}
function dclSo(x) {
  if (x === null || x === undefined || x === '') return '—';
  var m = dclMilli(x), am = Math.abs(m);
  var cents = Math.floor(am / 10) + (am % 10 >= 5 ? 1 : 0);
  if (m < 0) cents = -cents;
  return (cents / 100).toFixed(2).replace('.', ',');
}
