/* =====================================================================
   DIGITAL CITIZEN LAB — LỚP NỐI VỚI MÁY CHỦ
   Nạp sau dcl-rubrics.js, trước dcl-admin.js.

   Phần này lo những gì học sinh thấy khi chưa cần đăng nhập:
     1. Điểm danh trước vòng ôn tập bằng cách CHỌN lớp và CHỌN tên.
     2. Gửi điểm mỗi lượt chơi.
     3. Dựng trang Đánh giá từ dcl-rubrics.js (nguồn rubric duy nhất).
     4. Nhúng biểu mẫu nộp sản phẩm.
     5. Trang Trưng bày, chỉ hiện nhóm đã được giáo viên duyệt.
   ===================================================================== */

(function () {
  var css = document.createElement('style');
  css.textContent =
    '.dcl-panel{border:1px solid var(--line);border-radius:10px;padding:16px 18px;' +
    'margin-bottom:16px;background:#fff;box-shadow:0 1px 2px rgba(23,33,43,.04)}' +
    '.dcl-row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:10px}' +
    '.dcl-f{display:flex;flex-direction:column;gap:4px;flex:1 1 190px;min-width:150px}' +
    '.dcl-f label{font-size:12.5px;font-weight:600;color:var(--sub)}' +
    '.dcl-f input,.dcl-f select,.dcl-f textarea{border:1px solid var(--line2);border-radius:6px;' +
    'padding:9px 11px;font:inherit;font-size:14px;background:#fff;color:var(--ink);' +
    'width:100%;min-height:42px}' +
    '.dcl-msg{font-size:13px;font-weight:600;margin-top:10px;display:none;padding:10px 13px;border-radius:7px}' +
    '.dcl-msg.show{display:block}' +
    '.dcl-msg.ok{background:var(--okbg);color:var(--ok);border:1px solid #b4ddc3}' +
    '.dcl-msg.no{background:var(--nobg);color:var(--no);border:1px solid #efc3bf}' +
    '.dcl-msg.wait{background:var(--tint);color:var(--pri-d);border:1px solid #c9dcef}' +
    '.dcl-frame{border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-top:12px}' +
    '.dcl-frame iframe{display:block;width:100%;border:0;background:#fff}' +
    '.dcl-card{border:1px solid var(--line);border-radius:10px;padding:15px 17px;' +
    'margin-bottom:12px;background:#fff;box-shadow:0 1px 2px rgba(23,33,43,.04)}' +
    '.dcl-card h4{font-size:16.5px;margin-bottom:3px}' +
    '.rb-rubric{border:1px solid var(--line);border-radius:12px;margin-bottom:12px;background:#fff;' +
    'overflow:hidden;box-shadow:0 1px 2px rgba(23,33,43,.04)}' +
    '.rb-rubric>summary{list-style:none;cursor:pointer;padding:16px 18px;display:flex;' +
    'align-items:center;gap:14px;min-height:60px}' +
    '.rb-rubric>summary::-webkit-details-marker{display:none}' +
    '.rb-rubric>summary:hover{background:var(--tint2)}' +
    '.rb-rubric[open]>summary{background:var(--tint);border-bottom:1px solid var(--line)}' +
    '.rb-ma{flex-shrink:0;width:38px;height:38px;border-radius:9px;background:var(--pri);color:#fff;' +
    'display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800}' +
    '.rb-ten{flex:1;font-weight:700;font-size:16px;line-height:1.3}' +
    '.rb-ten small{display:block;font-weight:400;font-size:12.5px;color:var(--sub);margin-top:3px}' +
    '.rb-ts{flex-shrink:0;background:var(--warm);border:1px solid #e9d2a6;color:var(--acc);' +
    'border-radius:999px;padding:5px 13px;font-size:14px;font-weight:800}' +
    '.rb-than{padding:14px 16px 6px}' +
    '.rb-tc{border:1px solid var(--line);border-radius:9px;margin-bottom:9px;overflow:hidden}' +
    '.rb-tc>summary{list-style:none;cursor:pointer;background:var(--tint2);padding:11px 14px;' +
    'display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;' +
    'min-height:48px}' +
    '.rb-tc>summary::-webkit-details-marker{display:none}' +
    '.rb-tc>summary:hover{background:var(--tint)}' +
    '.rb-tc[open]>summary{background:var(--tint);border-bottom:1px solid var(--line)}' +
    '.rb-tc-ten{font-size:14.5px;font-weight:600}' +
    '.rb-diem{font-weight:400;opacity:.75}' +
    '.rb-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1px;background:var(--line)}' +
    '.rb-muc{background:#fff;padding:11px 13px}' +
    '.rb-muc .nhan{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;' +
    'color:var(--pri-d);margin-bottom:6px}' +
    '.rb-muc ul{margin:0 0 0 16px}' +
    '.rb-muc li{font-size:12.5px;margin-bottom:4px;line-height:1.5}';
  document.head.appendChild(css);
})();

/* ---------- gọi máy chủ ---------- */
function dclSan() {
  return typeof DCL_API !== 'undefined' && DCL_API.url
    && DCL_API.url.indexOf('http') === 0
    && DCL_API.url.indexOf('DAN_MA_TRIEN_KHAI') === -1;
}
function dclGoi(action, data) {
  if (!dclSan()) return Promise.reject(new Error('Chưa cấu hình DCL_API.url'));
  // Body là chuỗi thuần, KHÔNG đặt Content-Type: Apps Script không xử lí preflight CORS.
  return fetch(DCL_API.url, {
    method: 'POST',
    body: JSON.stringify({ action: action, token: DCL_API.token, data: data || {} })
  }).then(function (r) { return r.json(); });
}
function dclEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}
function dclBao(el, loai, text) {
  if (!el) return;
  el.className = 'dcl-msg show ' + loai;
  el.textContent = text;
}
function dclEl(id) { return document.getElementById(id); }

/* ---------- danh tính dùng chung giữa game và bảng chấm ---------- */
var DCL_ME = { lop: '', idHS: '', hoTen: '' };
var DCL_KEY_ME = 'dcl_me_v2';
function dclLuuMe() { try { localStorage.setItem(DCL_KEY_ME, JSON.stringify(DCL_ME)); } catch (e) {} }
function dclDocMe() {
  try { var r = localStorage.getItem(DCL_KEY_ME); if (r) DCL_ME = JSON.parse(r); } catch (e) {}
}

var DCL_DS_LOP = [];
var DCL_LOI_LOP = '';     // vì sao danh sách lớp rỗng
function dclTaiDsLop() {
  if (!dclSan()) {
    DCL_LOI_LOP = 'chưa cấu hình DCL_API.url trong dcl-config.js';
    return Promise.resolve([]);
  }
  return dclGoi('dsLop').then(function (r) {
    if (!r || !r.ok) {
      DCL_DS_LOP = [];
      DCL_LOI_LOP = (r && r.loi) ? r.loi : 'máy chủ trả về lỗi';
      return [];
    }
    DCL_DS_LOP = r.ds || [];
    DCL_LOI_LOP = DCL_DS_LOP.length ? '' :
      'chưa có lớp nào. Giáo viên dán danh sách vào tab DanhSachHS rồi chạy hàm nhapDanhSach';
    return DCL_DS_LOP;
  })['catch'](function (e) {
    DCL_DS_LOP = [];
    DCL_LOI_LOP = 'không gọi được máy chủ. Kiểm tra link /exec, TOKEN, '
      + 'và nhớ Triển khai > Phiên bản Mới sau khi sửa Code.gs';
    return [];
  });
}
function dclDoLop(sel, chon, nhan) {
  if (!sel) return;
  if (!DCL_DS_LOP.length) {
    sel.innerHTML = '<option value="">— chưa có lớp —</option>';
    var bao = sel.parentNode ? sel.parentNode.parentNode : null;
    if (bao && !dclEl('lop-loi')) {
      var p = document.createElement('p');
      p.id = 'lop-loi';
      p.className = 'xs';
      p.style.color = 'var(--no)';
      p.style.margin = '6px 0 0';
      p.textContent = 'Không nạp được danh sách lớp: ' + (DCL_LOI_LOP || 'chưa rõ nguyên nhân') + '.';
      bao.appendChild(p);
    }
    return;
  }
  var cu = dclEl('lop-loi'); if (cu) cu.remove();
  var h = '<option value="">' + (nhan || '— Chọn lớp —') + '</option>';
  for (var i = 0; i < DCL_DS_LOP.length; i++) {
    var l = DCL_DS_LOP[i];
    h += '<option value="' + dclEsc(l) + '"' + (l === chon ? ' selected' : '') + '>' + dclEsc(l) + '</option>';
  }
  sel.innerHTML = h;
}

/* ---------- 1. Điểm danh trước vòng ôn tập ---------- */
function dclBangDanhTinh() {
  var sec = document.querySelector('#p-ontap .sec');
  if (!sec) return;
  var box = document.createElement('div');
  box.className = 'dcl-panel';
  box.innerHTML =
    '<div class="kicker">Bước 1 · điểm danh trước khi vào phòng Lab</div>' +
    '<p class="sm sub" style="margin-bottom:10px">Chọn lớp rồi chọn tên của em trong danh sách. ' +
    'Điểm được ghi vào sổ của giáo viên, và nếu em đã đạt từ buổi trước thì hệ thống tự mở khoá ' +
    'dù em đang dùng máy khác.</p>' +
    '<div class="dcl-row">' +
      '<div class="dcl-f" style="flex:0 1 160px"><label for="dn-lop">Lớp</label>' +
        '<select id="dn-lop" onchange="dclTaiTenHS()"></select></div>' +
      '<div class="dcl-f"><label for="dn-ten">Họ và tên</label>' +
        '<select id="dn-ten"><option value="">— chọn lớp trước —</option></select></div>' +
      '<div class="dcl-f" style="flex:0 0 auto">' +
        '<button class="btn" onclick="dclDiemDanh()">Điểm danh</button></div>' +
    '</div><div class="dcl-msg" id="dn-msg"></div>';

  var gate = dclEl('gate');
  if (gate && gate.nextSibling) sec.insertBefore(box, gate.nextSibling);
  else sec.insertBefore(box, sec.firstChild);

  dclTaiDsLop().then(function () {
    dclDoLop(dclEl('dn-lop'), DCL_ME.lop);
    if (DCL_ME.lop) dclTaiTenHS(DCL_ME.idHS);
  });
}

function dclTaiTenHS(chonId) {
  var sel = dclEl('dn-ten'), lop = dclEl('dn-lop').value;
  if (!sel) return;
  if (!lop) { sel.innerHTML = '<option value="">— chọn lớp trước —</option>'; return; }
  sel.innerHTML = '<option value="">— đang tải —</option>';
  dclGoi('dsHocSinh', { lop: lop }).then(function (r) {
    if (!r.ok || !r.ds.length) {
      sel.innerHTML = '<option value="">— lớp chưa có danh sách —</option>'; return;
    }
    var h = '<option value="">— chọn tên —</option>';
    for (var i = 0; i < r.ds.length; i++) {
      var x = r.ds[i];
      var nhan = x.hoTen + (x.maHS ? ' (' + x.maHS + ')' : '');
      h += '<option value="' + dclEsc(x.id) + '"' + (x.id === chonId ? ' selected' : '') + '>'
         + dclEsc(nhan) + '</option>';
    }
    sel.innerHTML = h;
  })['catch'](function () { sel.innerHTML = '<option value="">— không tải được —</option>'; });
}

function dclDiemDanh() {
  var msg = dclEl('dn-msg');
  var lop = dclEl('dn-lop').value;
  var sel = dclEl('dn-ten');
  var id = sel.value;
  if (!lop || !id) { dclBao(msg, 'no', 'Chọn lớp và chọn tên của em.'); return; }
  var ten = sel.options[sel.selectedIndex].text.replace(/\s*\(.*\)$/, '');

  DCL_ME = { lop: lop, idHS: id, hoTen: ten };
  dclLuuMe();

  dclBao(msg, 'wait', 'Đang tra cứu sổ điểm…');
  dclGoi('kiemTraMo', { lop: lop, hoTen: ten }).then(function (r) {
    if (!r.ok) { dclBao(msg, 'no', 'Lỗi: ' + (r.loi || 'không tra cứu được')); return; }
    if (r.moKhoa) {
      window.unlocked = true;
      if (typeof saveState === 'function') saveState();
      if (typeof buildNav === 'function') buildNav();
      var g = dclEl('gate'); if (g) g.classList.remove('show');
      dclBao(msg, 'ok', 'Chào ' + ten + '. Em đã đạt ' + r.diemCao
        + '/10 ở lần trước nên các mục đã mở. Vẫn chơi lại được.');
      if (typeof pendingTab !== 'undefined' && pendingTab) {
        var d = pendingTab; window.pendingTab = null; go(d);
      }
    } else if (r.soLan > 0) {
      dclBao(msg, 'wait', 'Chào ' + ten + '. Điểm cao nhất của em là ' + r.diemCao
        + '/10, cần ' + r.diemDat + '/10 để mở khoá. Chơi lại bên dưới nhé.');
    } else {
      dclBao(msg, 'ok', 'Chào ' + ten + ' (' + lop + '). Em bắt đầu được rồi.');
    }
  })['catch'](function () {
    dclBao(msg, 'no', 'Không kết nối được máy chủ. Em vẫn chơi được, điểm sẽ không gửi về sổ.');
  });
}

/* ---------- 2. Gửi điểm sau mỗi lượt ---------- */
function dclBocQNext() {
  if (typeof qNext !== 'function') return;
  var goc = qNext;
  window.qNext = function () {
    var cuoi = (typeof qi !== 'undefined' && typeof order !== 'undefined' && qi >= order.length - 1);
    goc.apply(this, arguments);
    if (!cuoi || !dclSan() || !DCL_ME.hoTen || !DCL_ME.lop) return;
    dclGoi('luuDiem', { lop: DCL_ME.lop, hoTen: DCL_ME.hoTen, diem: qScore,
      xp: (typeof gXP !== 'undefined' ? gXP : 0),
      chuoi: (typeof gBestStreak !== 'undefined' ? gBestStreak : 0) })['catch'](function () {});
  };
}

/* ---------- 3. Trang Đánh giá, dựng từ dcl-rubrics.js ---------- */
function dclVeRubric(rubric) {
  var h = '<details class="rb-rubric"><summary>'
    + '<span class="rb-ma">' + dclEsc(rubric.ma) + '</span>'
    + '<span class="rb-ten">' + dclEsc(rubric.ten.replace(/^Rubric \d+ — /, ''))
    + '<small>' + rubric.tieuChi.length + ' tiêu chí · tổng 10 điểm</small></span>'
    + '<span class="rb-ts">' + dclEsc(rubric.trongSo) + '</span>'
    + '</summary><div class="rb-than">'
    + '<p class="sm sub">' + dclEsc(rubric.moTa) + '</p>';

  for (var i = 0; i < rubric.tieuChi.length; i++) {
    var tc = rubric.tieuChi[i];
    h += '<details class="rb-tc"><summary>'
       + '<span class="rb-tc-ten">' + dclEsc(tc.ten) + '</span>'
       + '<span class="pill">' + String(tc.max).replace('.', ',') + ' điểm'
       + (tc.yccd ? ' · ' + dclEsc(tc.yccd) : '') + '</span>'
       + '</summary><div class="rb-grid">';
    for (var m = 0; m < 4; m++) {
      h += '<div class="rb-muc"><div class="nhan">' + DCL_MUC[m]
         + ' <span class="rb-diem">' + String(tc.max * DCL_HE_SO[m]).replace('.', ',')
         + ' đ</span></div><ul>';
      for (var k = 0; k < tc.mucDo[m].length; k++)
        h += '<li>' + dclEsc(tc.mucDo[m][k]) + '</li>';
      h += '</ul></div>';
    }
    h += '</div></details>';
  }

  if (rubric.chan)
    h += '<div class="card warm"><p class="sm" style="margin:0">' + dclEsc(rubric.chan) + '</p></div>';
  return h + '</div></details>';
}


/* Nhóm tự lấy mã sau khi nhóm trưởng đã nộp biểu mẫu đăng kí.
   Giáo viên không phải gọi từng nhóm lên phát mã. */
function dclKhoiNhanMa() {
  var box = dclEl('eval-body');
  if (!box || !dclSan() || dclEl('nm-lop')) return;
  var h = '<div class="dcl-panel"><div class="kicker">Nhận mã nhóm</div>'
    + '<p class="sm sub" style="margin-bottom:10px">Sau khi nhóm trưởng đã nộp biểu mẫu đăng kí, '
    + 'nhóm lấy mã ở đây. Mã dùng chung cho cả nhóm, dùng để mở phần chấm Rubric 1 và phần Trưng bày. '
    + 'Giữ mã trong nhóm, không đưa cho nhóm khác.</p>'
    + '<div class="dcl-row">'
    + '<div class="dcl-f" style="flex:0 1 150px"><label for="nm-lop">Lớp</label>'
    + '<select id="nm-lop" onchange="dclNhanMaNhomDs()"></select></div>'
    + '<div class="dcl-f" style="flex:0 1 160px"><label for="nm-nhom">Nhóm</label>'
    + '<select id="nm-nhom"><option value="">— chọn lớp trước —</option></select></div>'
    + '<div class="dcl-f"><label for="nm-ten">Họ tên nhóm trưởng đã khai</label>'
    + '<input id="nm-ten" type="text" placeholder="Gõ đúng như trong biểu mẫu"></div>'
    + '<div class="dcl-f" style="flex:0 0 auto"><button class="btn" onclick="dclNhanMa()">Lấy mã</button></div>'
    + '</div><div class="dcl-msg" id="nm-msg"></div></div>';
  box.insertAdjacentHTML('afterbegin', h);
  dclTaiDsLop().then(function () { dclDoLop(dclEl('nm-lop')); });
}

function dclNhanMaNhomDs() {
  var lop = dclEl('nm-lop').value, sel = dclEl('nm-nhom');
  if (!lop) { sel.innerHTML = '<option value="">— chọn lớp trước —</option>'; return; }
  var h = '';
  for (var i = 1; i <= 9; i++) h += '<option value="Nhóm ' + i + '">Nhóm ' + i + '</option>';
  sel.innerHTML = '<option value="">— chọn nhóm —</option>' + h;
}

function dclNhanMa() {
  var msg = dclEl('nm-msg');
  var lop = dclEl('nm-lop').value, nhom = dclEl('nm-nhom').value, ten = dclEl('nm-ten').value.trim();
  if (!lop || !nhom || !ten) { dclBao(msg, 'no', 'Chọn lớp, chọn nhóm và nhập họ tên nhóm trưởng.'); return; }
  dclBao(msg, 'wait', 'Đang tra cứu…');
  dclGoi('layMaNhom', { lop: lop, nhom: nhom, nhomTruong: ten }).then(function (r) {
    if (!r.ok) { dclBao(msg, 'no', r.loi || 'Không lấy được mã'); return; }
    dclBao(msg, 'ok', 'Mã nhóm của ' + r.nhom + ' lớp ' + r.lop + ' là: ' + r.ma
      + '. Dùng mã này để đăng nhập ở khu Chấm điểm.');
  })['catch'](function () { dclBao(msg, 'no', 'Không kết nối được máy chủ.'); });
}

function dclKhoiRubric() {
  var box = dclEl('eval-body');
  if (!box) return;
  var dau = '<div class="dcl-panel"><div class="kicker">Cơ cấu điểm dự án</div>'
    + '<div class="wrap"><table><thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ai chấm</th>'
    + '<th>Chấm cho</th></tr></thead><tbody>'
    + '<tr><td>Rubric 1 — Hoạt động nhóm</td><td>10%</td>'
    + '<td>Học sinh tự chấm và nhóm chấm chéo, giáo viên duyệt theo nhật kí</td><td>Từng cá nhân</td></tr>'
    + '<tr><td>Rubric 2 — Sản phẩm</td><td>60%</td><td>Giáo viên</td><td>Nhóm</td></tr>'
    + '<tr><td>Rubric 3 — Báo cáo và phản biện</td><td>30%</td><td>Giáo viên</td><td>Nhóm</td></tr>'
    + '</tbody></table></div>'
    + '<p class="sm" style="margin-bottom:6px"><strong>Điểm của mỗi học sinh</strong> = '
    + '0,1 × Rubric 1 (cá nhân) + 0,6 × Rubric 2 (nhóm) + 0,3 × Rubric 3 (nhóm).</p>'
    + '<p class="sm sub" style="margin:0">Mọi tiêu chí chấm trên cùng thang bốn mức: '
    + 'Xuất sắc 100%, Tốt 75%, Đạt 50%, Chưa đạt 25% của điểm tối đa tiêu chí. '
    + 'Mỗi rubric có tổng điểm tối đa bằng 10. Việc nộp trễ được chấm ở tiêu chí 6 của Rubric 2, '
    + 'không trừ thêm ở Rubric 1. Không nộp sản phẩm thì Rubric 2 và Rubric 3 tính 0 điểm.</p></div>';
  box.innerHTML = dau + dclVeRubric(DCL_R1) + dclVeRubric(DCL_R2) + dclVeRubric(DCL_R3);
}

/* ---------- 4. Đề tài ---------- */
/* Năm hồ sơ đề tài do dcl-nhiemvu.js dựng, công khai, không cần đăng nhập. */

/* ---------- 5. Biểu mẫu nộp sản phẩm ---------- */
function dclKhoiNopBai() {
  var box = dclEl('nop-body');
  if (!box) return;
  var url = CONFIG.formNop || '';
  var src = (url.indexOf('http') === 0) ? url + (url.indexOf('?') > -1 ? '&' : '?') + 'embedded=true' : '';
  box.innerHTML = '<div class="dcl-frame"><div class="form-head">Phiếu nộp sản phẩm</div>'
    + (src ? '<iframe src="' + dclEsc(src) + '" height="1100" loading="lazy" title="Phiếu nộp sản phẩm"></iframe>'
           : '<div class="form-body"><p class="sm sub" style="margin:0">Giáo viên chưa dán link biểu mẫu.</p></div>')
    + '</div>'
    + '<p class="xs sub" style="margin-top:8px">Ô <strong>Nhóm</strong> phải ghi đúng số nhóm của em, '
    + 'ví dụ "Nhóm 3". Biểu mẫu cần đăng nhập Google để tải tệp lên. Nếu không hiện, '
    + '<a target="_blank" rel="noopener" href="' + dclEsc(url || '#') + '">mở trong tab mới</a>. '
    + 'Nhóm nộp lại được; bản được chấm là bản cuối cùng trước hạn.</p>';
}

/* ---------- 6. Trưng bày ---------- */
/* Trưng bày không cần đăng nhập. Cửa duyệt duy nhất là cờ "Được trưng bày"
   do giáo viên bật cho từng nhóm trong bảng tiến độ. */
function dclKhoiTrungBay() {
  var box = dclEl('gallery');
  if (!box) return;
  if (!dclSan()){
    box.innerHTML = '<p class="sm sub">Chưa nối với máy chủ nên chưa hiện được sản phẩm.</p>';
    return;
  }
  dclTaiTrungBay();
}

/** Gọi lúc mở trang, và gọi lại sau khi đăng nhập nếu cần làm mới. */
function dclTaiTrungBay(phien) {
  var box = dclEl('gallery');
  if (!box) return;
  box.innerHTML = '<p class="sm sub">Đang tải…</p>';
  dclGoi('trungBayCongKhai', {}).then(function (r) {
    if (!r.ok) { box.innerHTML = '<p class="sm sub">' + dclEsc(r.loi || 'Không tải được') + '</p>'; return; }
    if (!r.ds.length) {
      box.innerHTML = '<p class="sm sub">Chưa có sản phẩm nào được giáo viên duyệt trưng bày. '
        + 'Khu này mở sau buổi báo cáo.</p>'; return;
    }
    var h = '<p class="sm sub">' + r.ds.length + ' nhóm đang được trưng bày.</p>';
    for (var i = 0; i < r.ds.length; i++) {
      var g = r.ds[i];
      h += '<div class="dcl-card"><div class="kicker">' + dclEsc(g.lop) + ' · ' + dclEsc(g.nhom) + '</div>'
         + '<h4>' + dclEsc(g.deTai || 'Chưa ghi tên đề tài') + '</h4>'
         + (g.nopLuc ? '<p class="xs sub" style="margin-bottom:10px">Nộp lúc ' + dclEsc(g.nopLuc) + '</p>' : '')
         + '<div class="btns" style="margin-top:4px">'
         + (g.trinhChieu ? '<a class="btn btn2" target="_blank" rel="noopener" href="' + dclEsc(g.trinhChieu) + '">Bài trình chiếu</a>' : '')
         + (g.infographic ? '<a class="btn btn2" target="_blank" rel="noopener" href="' + dclEsc(g.infographic) + '">Infographic</a>' : '')
         + '</div></div>';
    }
    box.innerHTML = h;
  })['catch'](function () { box.innerHTML = '<p class="sm sub">Không kết nối được máy chủ.</p>'; });
}

/* Tự kiểm sau khi trang đã dựng xong: báo thẳng tệp nào không nạp được,
   thay vì để người dùng nhìn mãi dòng "Đang tải". */
function dclTuKiem() {
  function keu(box, ten, viec) {
    if (!box) return;
    var t = (box.textContent || '').trim();
    if (t.length > 120) return;                 // đã dựng xong thì thôi
    box.innerHTML = '<div class="card warm"><p class="sm" style="margin:0">'
      + '<strong>Phần này chưa dựng được.</strong> Trang không nạp được tệp <code>' + ten + '</code>, '
      + 'nên ' + viec + ' không hiện. Kiểm tra ba điều: tệp đã tải lên GitHub chưa, '
      + 'tên tệp có đúng chữ hoa chữ thường không, và mở F12 tab Console xem có dòng đỏ nào.'
      + '</p></div>';
  }
  if (typeof NV_HOSO === 'undefined') {
    keu(dclEl('detai-body'), 'dcl-nhiemvu.js', 'năm hồ sơ đề tài');
    var t = document.querySelector('#p-task .sec');
    if (t && !dclEl('nv-chung')) keu(t.lastElementChild, 'dcl-nhiemvu.js', 'phần nhiệm vụ chung');
  }
  if (typeof DCL_RUBRICS === 'undefined')
    keu(dclEl('eval-body'), 'dcl-rubrics.js', 'ba bảng rubric');
}

/* ---------- khởi động ---------- */
(function () {
  function khoiDong() {
    dclDocMe();
    dclKhoiRubric();
    dclKhoiNhanMa();
    dclKhoiNopBai();
    dclKhoiTrungBay();
    if (dclSan()) { dclBangDanhTinh(); dclBocQNext(); }
    else {
      var sec = document.querySelector('#p-ontap .sec');
      if (sec) {
        var p = document.createElement('div');
        p.className = 'card warm';
        p.innerHTML = '<p class="sm" style="margin:0">Chưa nối với máy chủ nên phần điểm danh '
          + 'và chấm điểm chưa dùng được. Trò chơi vẫn chơi bình thường.</p>';
        sec.insertBefore(p, sec.firstChild);
      }
    }
    setTimeout(dclTuKiem, 1500);
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', function () { setTimeout(khoiDong, 0); });
  else setTimeout(khoiDong, 0);
})();
