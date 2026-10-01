/* =====================================================================
   DIGITAL CITIZEN LAB — LỚP NỐI VỚI GOOGLE SHEETS
   Nạp sau dcl-config.js. Không sửa tệp này trừ khi đổi logic.

   Tệp này tự chèn thêm giao diện vào trang, không đụng tới phần game:
     1. Ô điểm danh Họ tên + Lớp ở mục 2, tra sổ để mở khoá theo tên.
     2. Gửi điểm mỗi lượt chơi về Google Sheets.
     3. Form đăng kí tự thiết kế, tự khoá đề tài đã có nhóm trong lớp.
     4. Form nộp bài tự thiết kế.
     5. Nút gửi kết quả nhóm tự chấm rubric.
   ===================================================================== */

(function () {
  var css = document.createElement('style');
  css.textContent =
    '.dcl-panel{border:1px solid var(--line);border-left:4px solid var(--navy-l);' +
    'border-radius:4px;padding:14px 16px;margin-bottom:16px;background:#fff}' +
    '.dcl-row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:10px}' +
    '.dcl-f{display:flex;flex-direction:column;gap:4px;flex:1 1 180px;min-width:150px}' +
    '.dcl-f label{font-size:12.5px;font-weight:600;color:var(--sub)}' +
    '.dcl-f input,.dcl-f select,.dcl-f textarea{border:1px solid #8c8f94;border-radius:4px;' +
    'padding:8px 10px;font:inherit;font-size:14px;background:#fff;color:var(--ink);width:100%}' +
    '.dcl-f textarea{min-height:68px;resize:vertical}' +
    '.dcl-msg{font-size:13px;font-weight:600;margin-top:8px;display:none;padding:9px 12px;border-radius:4px}' +
    '.dcl-msg.show{display:block}' +
    '.dcl-msg.ok{background:var(--okbg);color:var(--ok);border:1px solid #a7dcb2}' +
    '.dcl-msg.no{background:var(--nobg);color:var(--no);border:1px solid #f0b3b4}' +
    '.dcl-msg.wait{background:var(--tint2);color:var(--sub);border:1px solid var(--line)}' +
    '.dcl-who{font-size:12.5px;color:var(--sub);margin-top:6px}' +
    '.dcl-req{color:#b32d2e}';
  document.head.appendChild(css);
})();

/* ---------- Gọi API ---------- */
function dclSan() {
  return typeof DCL_API !== 'undefined' && DCL_API.url && DCL_API.url.indexOf('http') === 0
    && DCL_API.url.indexOf('DAN_MA_TRIEN_KHAI') === -1;
}

function dclGoi(action, data) {
  if (!dclSan()) return Promise.reject(new Error('Chưa cấu hình DCL_API.url'));
  // Body là chuỗi thuần, KHÔNG đặt Content-Type: application/json.
  // Apps Script không xử lí được preflight CORS; đặt header JSON sẽ làm request hỏng.
  return fetch(DCL_API.url, {
    method: 'POST',
    body: JSON.stringify({ action: action, token: DCL_API.token, data: data || {} })
  }).then(function (r) { return r.json(); });
}

function dclBao(el, loai, text) {
  if (!el) return;
  el.className = 'dcl-msg show ' + loai;
  el.textContent = text;
}

/* ---------- Danh tính học sinh ---------- */
var DCL_ME = { hoTen: '', lop: '' };
var DCL_KEY_ME = 'dcl_me_v1';

function dclLuuMe() { try { localStorage.setItem(DCL_KEY_ME, JSON.stringify(DCL_ME)); } catch (e) {} }
function dclDocMe() {
  try {
    var raw = localStorage.getItem(DCL_KEY_ME);
    if (raw) DCL_ME = JSON.parse(raw);
  } catch (e) {}
}

function dclDungLopSelect(sel, chon) {
  if (!sel) return;
  var h = '<option value="">— Chọn lớp —</option>';
  for (var i = 0; i < DCL_API.lop.length; i++) {
    var l = DCL_API.lop[i];
    h += '<option value="' + l + '"' + (l === chon ? ' selected' : '') + '>' + l + '</option>';
  }
  sel.innerHTML = h;
}

function dclThemBangDanhTinh() {
  var sec = document.querySelector('#p-ontap .sec');
  if (!sec) return;
  var box = document.createElement('div');
  box.className = 'dcl-panel';
  box.innerHTML =
    '<div class="kicker">BƯỚC 1 · ĐIỂM DANH TRƯỚC KHI VÀO PHÒNG LAB</div>' +
    '<p class="sm sub" style="margin-bottom:10px">Nhập đúng họ tên và lớp. Điểm của em được ghi vào sổ của giáo viên. ' +
    'Nếu em đã đạt từ buổi trước, hệ thống tự mở khoá dù em đang dùng máy khác.</p>' +
    '<div class="dcl-row">' +
      '<div class="dcl-f"><label for="dcl-hoten">Họ và tên</label>' +
        '<input id="dcl-hoten" type="text" placeholder="Nguyễn Văn A"></div>' +
      '<div class="dcl-f" style="flex:0 1 150px"><label for="dcl-lop">Lớp</label>' +
        '<select id="dcl-lop"></select></div>' +
      '<div class="dcl-f" style="flex:0 0 auto">' +
        '<button class="btn" onclick="dclVaoLab()">Điểm danh &amp; kiểm tra</button></div>' +
    '</div>' +
    '<div class="dcl-msg" id="dcl-me-msg"></div>';

  var gate = document.getElementById('gate');
  if (gate && gate.nextSibling) sec.insertBefore(box, gate.nextSibling);
  else sec.insertBefore(box, sec.firstChild);

  dclDungLopSelect(document.getElementById('dcl-lop'), DCL_ME.lop);
  document.getElementById('dcl-hoten').value = DCL_ME.hoTen || '';
}

function dclVaoLab() {
  var msg = document.getElementById('dcl-me-msg');
  var ten = document.getElementById('dcl-hoten').value.trim();
  var lop = document.getElementById('dcl-lop').value;
  if (!ten || !lop) { dclBao(msg, 'no', 'Nhập đủ họ tên và chọn lớp.'); return; }

  DCL_ME.hoTen = ten; DCL_ME.lop = lop; dclLuuMe();

  var oDangKy = document.getElementById('dk-lop');
  if (oDangKy) { oDangKy.value = lop; if (typeof dclTaiDeTai === 'function') dclTaiDeTai(); }
  var oNop = document.getElementById('np-lop');
  if (oNop) oNop.value = lop;

  if (!dclSan()) {
    dclBao(msg, 'wait', 'Đã ghi nhận trên máy này. Chưa bật kết nối Google Sheets nên điểm không gửi về sổ.');
    return;
  }

  dclBao(msg, 'wait', 'Đang tra cứu sổ điểm…');
  dclGoi('kiemTraMo', { hoTen: ten, lop: lop }).then(function (r) {
    if (!r.ok) { dclBao(msg, 'no', 'Lỗi: ' + (r.loi || 'không tra cứu được')); return; }
    if (r.moKhoa) {
      window.unlocked = true;
      if (typeof saveState === 'function') saveState();
      if (typeof buildNav === 'function') buildNav();
      var gate = document.getElementById('gate');
      if (gate) gate.classList.remove('show');
      dclBao(msg, 'ok', 'Chào ' + ten + '. Em đã đạt ' + r.diemCao + '/10 ở lần trước nên toàn bộ nhiệm vụ đã mở. Vẫn chơi lại được để cải thiện điểm.');
      if (typeof pendingTab !== 'undefined' && pendingTab) {
        var dest = pendingTab; window.pendingTab = null; go(dest);
      }
    } else if (r.soLan > 0) {
      dclBao(msg, 'wait', 'Chào ' + ten + '. Điểm cao nhất của em là ' + r.diemCao + '/10, cần ' + r.diemDat + '/10 để mở khoá. Chơi lại bên dưới nhé.');
    } else {
      dclBao(msg, 'ok', 'Chào ' + ten + ' (' + lop + '). Em có thể bắt đầu vào phòng Lab bên dưới.');
    }
  })['catch'](function () {
    dclBao(msg, 'no', 'Không kết nối được máy chủ. Em vẫn chơi được, điểm sẽ không gửi về sổ.');
  });
}

/* ---------- Gửi điểm khi kết thúc một lượt ---------- */
function dclBocQNext() {
  if (typeof qNext !== 'function') return;
  var goc = qNext;
  window.qNext = function () {
    var cuoi = (typeof qi !== 'undefined' && typeof order !== 'undefined' && qi >= order.length - 1);
    goc.apply(this, arguments);
    if (!cuoi || !dclSan()) return;
    if (!DCL_ME.hoTen || !DCL_ME.lop) return;
    dclGoi('luuDiem', {
      hoTen: DCL_ME.hoTen, lop: DCL_ME.lop,
      diem: qScore, tong: order.length,
      xp: (typeof gXP !== 'undefined' ? gXP : 0),
      chuoi: (typeof gBestStreak !== 'undefined' ? gBestStreak : 0)
    })['catch'](function () {});
  };
}

/* ---------- Form đăng kí ---------- */
function dclThayFormDangKy() {
  var khung = document.querySelector('#p-topics .form-wrap');
  if (!khung) return;
  var box = document.createElement('div');
  box.className = 'dcl-panel';
  box.innerHTML =
    '<div class="kicker">PHIẾU ĐĂNG KÍ ĐỀ TÀI</div>' +
    '<div class="dcl-row">' +
      '<div class="dcl-f" style="flex:0 1 160px"><label for="dk-lop">Lớp <span class="dcl-req">*</span></label>' +
        '<select id="dk-lop" onchange="dclTaiDeTai()"></select></div>' +
      '<div class="dcl-f"><label for="dk-nhom">Tên nhóm <span class="dcl-req">*</span></label>' +
        '<input id="dk-nhom" type="text" placeholder="Nhóm 3 — Tổ pháp lí số"></div>' +
    '</div>' +
    '<div class="dcl-row">' +
      '<div class="dcl-f"><label for="dk-truong">Họ tên nhóm trưởng <span class="dcl-req">*</span></label>' +
        '<input id="dk-truong" type="text"></div>' +
      '<div class="dcl-f"><label for="dk-email">Email liên hệ <span class="dcl-req">*</span></label>' +
        '<input id="dk-email" type="email"></div>' +
    '</div>' +
    '<div class="dcl-row"><div class="dcl-f">' +
      '<label for="dk-tv">Danh sách thành viên, mỗi dòng một bạn <span class="dcl-req">*</span></label>' +
      '<textarea id="dk-tv"></textarea></div></div>' +
    '<div class="dcl-row">' +
      '<div class="dcl-f"><label for="dk-dt">Đề tài đăng kí <span class="dcl-req">*</span></label>' +
        '<select id="dk-dt"></select>' +
        '<div class="dcl-who" id="dk-who">Chọn lớp để xem đề tài nào còn trống.</div></div>' +
      '<div class="dcl-f"><label for="dk-dp">Đề tài dự phòng</label>' +
        '<select id="dk-dp"></select></div>' +
    '</div>' +
    '<div class="chk" style="margin-top:4px"><input type="checkbox" id="dk-ck">' +
      '<label for="dk-ck">Nhóm cam kết tự làm sản phẩm và ghi nguồn đầy đủ cho mọi tài nguyên sử dụng.</label></div>' +
    '<div class="btns">' +
      '<button class="btn" onclick="dclGuiDangKy()">Gửi đăng kí</button>' +
      '<button class="btn btn2" onclick="dclTaiDeTai()">Làm mới danh sách đề tài</button></div>' +
    '<div class="dcl-msg" id="dk-msg"></div>';

  khung.parentNode.replaceChild(box, khung);
  dclDungLopSelect(document.getElementById('dk-lop'), DCL_ME.lop);
  dclDungDeTai({});
  if (DCL_ME.lop) dclTaiDeTai();
}

function dclDungDeTai(daNhan) {
  var dt = document.getElementById('dk-dt');
  var dp = document.getElementById('dk-dp');
  if (!dt) return;
  var h1 = '<option value="">— Chọn 1 trong 5 —</option>';
  var h2 = '<option value="">— Không chọn —</option>';
  for (var i = 0; i < TOPICS.length; i++) {
    var t = TOPICS[i], ma = 'DT' + t.no, nhom = daNhan[ma];
    var nhan = t.no + '. ' + t.name + (nhom ? '  (đã có ' + nhom + ')' : '');
    var attr = nhom ? ' disabled' : '';
    h1 += '<option value="' + ma + '"' + attr + '>' + nhan + '</option>';
    h2 += '<option value="' + ma + '"' + attr + '>' + nhan + '</option>';
  }
  dt.innerHTML = h1;
  dp.innerHTML = h2;
}

function dclTaiDeTai() {
  var sel = document.getElementById('dk-lop');
  if (!sel) return;
  var lop = sel.value;
  var who = document.getElementById('dk-who');
  if (!lop) { dclDungDeTai({}); who.textContent = 'Chọn lớp để xem đề tài nào còn trống.'; return; }
  if (!dclSan()) { dclDungDeTai({}); who.textContent = 'Chưa bật kết nối Google Sheets nên không kiểm tra được đề tài đã có nhóm nhận.'; return; }

  who.textContent = 'Đang kiểm tra đề tài còn trống của lớp ' + lop + '…';
  dclGoi('dsDeTai', { lop: lop }).then(function (r) {
    if (!r.ok) { who.textContent = 'Không tải được danh sách: ' + (r.loi || ''); return; }
    var daNhan = r.daNhan || {};
    dclDungDeTai(daNhan);
    var con = 0;
    for (var i = 0; i < TOPICS.length; i++) if (!daNhan['DT' + TOPICS[i].no]) con++;
    who.textContent = 'Lớp ' + lop + ' còn ' + con + '/5 đề tài trống. Đề tài đã có nhóm nhận bị khoá, không chọn được.';
  })['catch'](function () { who.textContent = 'Không kết nối được máy chủ.'; });
}

function dclGuiDangKy() {
  var msg = document.getElementById('dk-msg');
  var lop = document.getElementById('dk-lop').value;
  var nhom = document.getElementById('dk-nhom').value.trim();
  var truong = document.getElementById('dk-truong').value.trim();
  var email = document.getElementById('dk-email').value.trim();
  var tv = document.getElementById('dk-tv').value.trim();
  var ma = document.getElementById('dk-dt').value;
  var dp = document.getElementById('dk-dp').value;
  var ck = document.getElementById('dk-ck').checked;

  if (!lop || !nhom || !truong || !email || !tv || !ma) { dclBao(msg, 'no', 'Điền đủ các trường có dấu sao.'); return; }
  if (!ck) { dclBao(msg, 'no', 'Nhóm phải tích vào ô cam kết.'); return; }
  if (!dclSan()) { dclBao(msg, 'no', 'Chưa cấu hình kết nối Google Sheets. Báo giáo viên.'); return; }

  var ten = '';
  for (var i = 0; i < TOPICS.length; i++) if ('DT' + TOPICS[i].no === ma) ten = TOPICS[i].name;

  dclBao(msg, 'wait', 'Đang gửi đăng kí…');
  dclGoi('dangKy', {
    lop: lop, tenNhom: nhom, nhomTruong: truong, email: email, thanhVien: tv,
    maDeTai: ma, tenDeTai: ten, duPhong: dp, camKet: ck
  }).then(function (r) {
    if (r.ok) {
      dclBao(msg, 'ok', 'Đã đăng kí thành công đề tài "' + ten + '" cho ' + nhom + ' (' + lop + ').');
      dclTaiDeTai();
    } else if (r.lyDo === 'deTaiDaCo') {
      dclBao(msg, 'no', 'Đề tài này vừa được "' + r.nhomDaNhan + '" nhận trước. Danh sách đã cập nhật, nhóm chọn đề tài khác nhé.');
      dclTaiDeTai();
    } else if (r.lyDo === 'nhomDaDangKy') {
      dclBao(msg, 'no', 'Tên nhóm này đã đăng kí đề tài "' + r.deTaiCu + '". Nếu cần đổi, báo giáo viên.');
    } else {
      dclBao(msg, 'no', 'Lỗi: ' + (r.loi || 'không gửi được'));
    }
  })['catch'](function () { dclBao(msg, 'no', 'Không kết nối được máy chủ. Thử lại hoặc báo giáo viên.'); });
}

/* ---------- Form nộp bài ---------- */
function dclThayFormNop() {
  var khung = document.querySelector('#p-submit .form-wrap');
  if (!khung) return;
  var box = document.createElement('div');
  box.className = 'dcl-panel';
  box.innerHTML =
    '<div class="kicker">PHIẾU NỘP SẢN PHẨM</div>' +
    '<div class="dcl-row">' +
      '<div class="dcl-f" style="flex:0 1 150px"><label for="np-lop">Lớp <span class="dcl-req">*</span></label>' +
        '<select id="np-lop"></select></div>' +
      '<div class="dcl-f"><label for="np-nhom">Tên nhóm <span class="dcl-req">*</span></label>' +
        '<input id="np-nhom" type="text"></div>' +
      '<div class="dcl-f"><label for="np-dt">Đề tài <span class="dcl-req">*</span></label>' +
        '<select id="np-dt"></select></div>' +
    '</div>' +
    '<div class="dcl-row">' +
      '<div class="dcl-f"><label for="np-tc">Link bài trình chiếu <span class="dcl-req">*</span></label>' +
        '<input id="np-tc" type="url" placeholder="Link Drive đã mở quyền xem"></div>' +
      '<div class="dcl-f"><label for="np-ig">Link infographic <span class="dcl-req">*</span></label>' +
        '<input id="np-ig" type="url"></div>' +
    '</div>' +
    '<div class="dcl-row"><div class="dcl-f"><label for="np-nk">Link nhật kí dự án</label>' +
      '<input id="np-nk" type="url"></div></div>' +
    '<div class="chk"><input type="checkbox" id="np-xn">' +
      '<label for="np-xn">Nhóm xác nhận đã ghi nguồn đầy đủ cho mọi tài nguyên sử dụng.</label></div>' +
    '<div class="btns"><button class="btn" onclick="dclGuiNopBai()">Nộp sản phẩm</button></div>' +
    '<div class="dcl-msg" id="np-msg"></div>' +
    '<p class="xs sub" style="margin-top:10px">Nhớ mở quyền xem cho link Drive, nếu không giáo viên sẽ không mở được bài.</p>';

  khung.parentNode.replaceChild(box, khung);
  dclDungLopSelect(document.getElementById('np-lop'), DCL_ME.lop);
  var h = '<option value="">— Chọn 1 trong 5 —</option>';
  for (var i = 0; i < TOPICS.length; i++) h += '<option value="DT' + TOPICS[i].no + '">' + TOPICS[i].no + '. ' + TOPICS[i].name + '</option>';
  document.getElementById('np-dt').innerHTML = h;
}

function dclGuiNopBai() {
  var msg = document.getElementById('np-msg');
  var lop = document.getElementById('np-lop').value;
  var nhom = document.getElementById('np-nhom').value.trim();
  var ma = document.getElementById('np-dt').value;
  var tc = document.getElementById('np-tc').value.trim();
  var ig = document.getElementById('np-ig').value.trim();
  var nk = document.getElementById('np-nk').value.trim();
  var xn = document.getElementById('np-xn').checked;

  if (!lop || !nhom || !ma || !tc || !ig) { dclBao(msg, 'no', 'Điền đủ các trường có dấu sao.'); return; }
  if (!xn) { dclBao(msg, 'no', 'Nhóm phải xác nhận đã ghi nguồn.'); return; }
  if (!dclSan()) { dclBao(msg, 'no', 'Chưa cấu hình kết nối Google Sheets. Báo giáo viên.'); return; }

  dclBao(msg, 'wait', 'Đang nộp…');
  dclGoi('nopBai', {
    lop: lop, tenNhom: nhom, maDeTai: ma,
    linkTrinhChieu: tc, linkInfographic: ig, linkNhatKy: nk, xacNhan: xn
  }).then(function (r) {
    if (r.ok) dclBao(msg, 'ok', 'Đã nộp thành công lúc ' + new Date().toLocaleString('vi-VN') + '. Nhóm nộp lại được, giáo viên lấy bản cuối.');
    else dclBao(msg, 'no', 'Lỗi: ' + (r.loi || 'không nộp được'));
  })['catch'](function () { dclBao(msg, 'no', 'Không kết nối được máy chủ.'); });
}

/* ---------- Gửi kết quả tự chấm rubric ---------- */
function dclThemGuiRubric() {
  var bang = document.querySelector('#p-eval #rubric');
  if (!bang) return;
  var box = document.createElement('div');
  box.className = 'dcl-panel';
  box.style.marginTop = '14px';
  box.innerHTML =
    '<div class="kicker">GỬI KẾT QUẢ NHÓM TỰ CHẤM</div>' +
    '<p class="sm sub" style="margin-bottom:10px">Chọn đủ 6 dòng ở bảng trên rồi gửi. Kết quả này không thay điểm giáo viên, chỉ để đối chiếu khi chấm.</p>' +
    '<div class="dcl-row">' +
      '<div class="dcl-f" style="flex:0 1 150px"><label for="rb-lop">Lớp</label><select id="rb-lop"></select></div>' +
      '<div class="dcl-f"><label for="rb-nhom">Tên nhóm</label><input id="rb-nhom" type="text"></div>' +
      '<div class="dcl-f" style="flex:0 0 auto"><button class="btn" onclick="dclGuiRubric()">Gửi kết quả tự chấm</button></div>' +
    '</div><div class="dcl-msg" id="rb-msg"></div>';
  bang.parentNode.parentNode.insertBefore(box, bang.parentNode.nextSibling);
  dclDungLopSelect(document.getElementById('rb-lop'), DCL_ME.lop);
}

function dclGuiRubric() {
  var msg = document.getElementById('rb-msg');
  var lop = document.getElementById('rb-lop').value;
  var nhom = document.getElementById('rb-nhom').value.trim();
  if (!lop || !nhom) { dclBao(msg, 'no', 'Nhập lớp và tên nhóm.'); return; }
  if (typeof picked === 'undefined') { dclBao(msg, 'no', 'Chưa chấm được.'); return; }

  var nhan = [], tong = 0;
  for (var i = 0; i < RUBRIC.length; i++) {
    if (picked[i] === null || picked[i] === undefined) {
      dclBao(msg, 'no', 'Còn dòng ' + (i + 1) + ' chưa chọn mức.'); return;
    }
    nhan.push(LV_NAME[picked[i]]);
    tong += RUBRIC[i].w * LV_RATE[picked[i]];
  }
  if (!dclSan()) { dclBao(msg, 'no', 'Chưa cấu hình kết nối Google Sheets.'); return; }

  dclBao(msg, 'wait', 'Đang gửi…');
  dclGoi('luuRubric', { lop: lop, tenNhom: nhom, diem: nhan, tong: Math.round(tong) })
    .then(function (r) {
      if (r.ok) dclBao(msg, 'ok', 'Đã gửi kết quả tự chấm: ' + Math.round(tong) + '/100.');
      else dclBao(msg, 'no', 'Lỗi: ' + (r.loi || ''));
    })['catch'](function () { dclBao(msg, 'no', 'Không kết nối được máy chủ.'); });
}

/* ---------- Khởi động ---------- */
(function () {
  function khoiDong() {
    dclDocMe();
    dclThemBangDanhTinh();
    dclBocQNext();
    dclThayFormDangKy();
    dclThayFormNop();
    dclThemGuiRubric();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(khoiDong, 0); });
  } else {
    setTimeout(khoiDong, 0);
  }
})();
