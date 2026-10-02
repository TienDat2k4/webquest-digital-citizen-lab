/* =====================================================================
   DIGITAL CITIZEN LAB — BẢNG ĐIỀU KHIỂN CHẤM ĐIỂM
   Nạp sau dcl-rubrics.js và dcl-api.js.

   Tệp này tự thêm mục "10. Chấm điểm" vào thanh điều hướng và dựng
   giao diện theo vai mà máy chủ trả về. Trình duyệt không tự quyết
   định vai: mọi thao tác ghi đều kèm mã phiên và được máy chủ kiểm lại.
   ===================================================================== */

var DCL_PHIEN_KEY = 'dcl_phien_v1';
var DCL_ME2 = null;          // { vai, lop, nhom, hoTen }
var DCL_TAB = 'r1';          // tab đang mở trong bảng điều khiển

/* ---------- tiện ích ---------- */
function admGoi(action, data) {
  data = data || {};
  if (DCL_ME2) data.phien = admPhien();
  return dclGoi(action, data).then(function (r) {
    if (r && r.hetPhien) { admXoaPhien(); admVe(); }
    return r;
  });
}
function admPhien() { try { return localStorage.getItem(DCL_PHIEN_KEY) || ''; } catch (e) { return ''; } }
function admLuuPhien(p) { try { localStorage.setItem(DCL_PHIEN_KEY, p); } catch (e) {} }
function admXoaPhien() { try { localStorage.removeItem(DCL_PHIEN_KEY); } catch (e) {} DCL_ME2 = null; }
function admEl(id) { return document.getElementById(id); }
function admBao(id, loai, text) { dclBao(admEl(id), loai, text); }
function admTenVai(v) {
  return v === 'gv' ? 'Giáo viên' : (v === 'truongnhom' ? 'Nhóm trưởng' : 'Thành viên');
}

/* ---------- dựng khung ---------- */
function admKhoiTao() {
  if (typeof TABS === 'undefined' || admEl('p-admin')) return;
  var sec = document.createElement('section');
  sec.className = 'page';
  sec.id = 'p-admin';
  sec.innerHTML = '<div class="sec"><h2>Bảng điều khiển chấm điểm</h2><div class="rule"></div>'
    + '<div id="adm-body"></div></div>';
  var main = document.querySelector('main');
  if (!main) return;
  main.insertBefore(sec, main.querySelector('.foot'));

  TABS.push(['admin', '10. Chấm điểm', false]);
  if (typeof buildNav === 'function') buildNav();

  var p = admPhien();
  if (!p) { admVe(); return; }
  admGoi('toiLaAi').then(function (r) {
    if (r && r.ok) { DCL_ME2 = r.me; admVe(); } else { admXoaPhien(); admVe(); }
  })['catch'](function () { admVe(); });
}

/* ---------- vẽ lại toàn bộ ---------- */
function admVe() {
  var b = admEl('adm-body');
  if (!b) return;
  if (!dclSan()) {
    b.innerHTML = '<p class="sm sub">Chưa bật kết nối Google Sheets nên bảng điều khiển chưa dùng được.</p>';
    return;
  }
  if (!DCL_ME2) { b.innerHTML = admFormDangNhap(); return; }

  var v = DCL_ME2.vai;
  var tabs = (v === 'gv')
    ? [['r2','Chấm sản phẩm'], ['r3','Chấm báo cáo'], ['r1','Duyệt hoạt động nhóm'],
       ['mc','Minh chứng'], ['th','Bảng tổng hợp']]
    : (v === 'truongnhom')
      ? [['r1','Chấm hoạt động nhóm'], ['ds','Danh sách thành viên'],
         ['mc','Nộp minh chứng'], ['r3','Chấm nhóm bạn'], ['th','Điểm của nhóm']]
      : [['r1','Chấm hoạt động nhóm'], ['th','Điểm của tôi']];

  var co = false;
  for (var i = 0; i < tabs.length; i++) if (tabs[i][0] === DCL_TAB) co = true;
  if (!co) DCL_TAB = tabs[0][0];

  var h = '<div class="dcl-panel" style="display:flex;justify-content:space-between;'
    + 'align-items:center;gap:12px;flex-wrap:wrap">'
    + '<div><div class="kicker">Đang đăng nhập</div><strong>' + dclEsc(DCL_ME2.hoTen) + '</strong>'
    + ' · ' + admTenVai(DCL_ME2.vai)
    + (DCL_ME2.lop && DCL_ME2.lop !== '*' ? ' · ' + dclEsc(DCL_ME2.lop) : '')
    + (DCL_ME2.nhom ? ' · ' + dclEsc(DCL_ME2.nhom) : '') + '</div>'
    + '<button class="btn btn2" onclick="admDangXuat()">Đăng xuất</button></div>'
    + '<div class="btns" style="margin:0 0 16px">';
  for (i = 0; i < tabs.length; i++)
    h += '<button class="btn ' + (tabs[i][0] === DCL_TAB ? '' : 'btn2')
       + '" onclick="admMo(\'' + tabs[i][0] + '\')">' + tabs[i][1] + '</button>';
  h += '</div><div id="adm-tab"></div>';
  b.innerHTML = h;
  admVeTab();
}

function admMo(t) { DCL_TAB = t; admVe(); }

function admFormDangNhap() {
  return '<div class="dcl-panel">'
    + '<div class="kicker">Đăng nhập bằng mã truy cập</div>'
    + '<p class="sm sub" style="margin-bottom:12px">Giáo viên phát mã cho từng nhóm. '
    + 'Mã nhóm trưởng và mã thành viên khác nhau và mở ra những chức năng khác nhau.</p>'
    + '<div class="dcl-row">'
    + '<div class="dcl-f" style="flex:0 1 180px"><label for="adm-ma">Mã truy cập</label>'
    + '<input id="adm-ma" type="text" placeholder="VD: T-K7M2Q" style="text-transform:uppercase"></div>'
    + '<div class="dcl-f"><label for="adm-ten">Họ và tên (học sinh bắt buộc nhập)</label>'
    + '<input id="adm-ten" type="text" placeholder="Nguyễn Văn A"></div>'
    + '<div class="dcl-f" style="flex:0 0 auto"><button class="btn" onclick="admDangNhap()">Đăng nhập</button></div>'
    + '</div><div class="dcl-msg" id="adm-msg"></div></div>';
}

function admDangNhap() {
  var ma = admEl('adm-ma').value.trim();
  var ten = admEl('adm-ten').value.trim() || (typeof DCL_ME !== 'undefined' ? DCL_ME.hoTen : '');
  if (!ma) { admBao('adm-msg', 'no', 'Nhập mã truy cập.'); return; }
  admBao('adm-msg', 'wait', 'Đang kiểm tra…');
  dclGoi('dangNhap', { ma: ma, hoTen: ten }).then(function (r) {
    if (!r.ok) { admBao('adm-msg', 'no', r.loi || 'Không đăng nhập được'); return; }
    admLuuPhien(r.phien);
    DCL_ME2 = { vai: r.vai, lop: r.lop, nhom: r.nhom, hoTen: r.hoTen };
    DCL_TAB = (r.vai === 'gv') ? 'r2' : 'r1';
    admVe();
  })['catch'](function () { admBao('adm-msg', 'no', 'Không kết nối được máy chủ.'); });
}

function admDangXuat() {
  admGoi('dangXuat')['catch'](function () {});
  admXoaPhien();
  admVe();
}

/* ---------- phiếu chấm dùng chung ---------- */
function admPhieu(rubric, idPrefix) {
  var h = '<div class="wrap"><table><thead><tr><th style="width:230px">Tiêu chí</th>'
        + '<th style="width:56px">Tối đa</th>';
  for (var m = 0; m < DCL_MUC.length; m++) h += '<th>' + DCL_MUC[m] + '</th>';
  h += '</tr></thead><tbody>';
  for (var i = 0; i < rubric.tieuChi.length; i++) {
    var tc = rubric.tieuChi[i];
    h += '<tr><td class="sm">' + dclEsc(tc.ten) + '</td><td>' + tc.max + '</td>';
    for (m = 0; m < 4; m++) {
      h += '<td style="cursor:pointer" id="' + idPrefix + '-' + i + '-' + m
         + '" onclick="admChon(\'' + idPrefix + '\',' + i + ',' + m + ')">'
         + '<span class="xs">' + dclEsc(tc.goiY[m]) + '</span></td>';
    }
    h += '</tr>';
  }
  h += '</tbody></table></div>'
     + '<p><span class="pill">Tổng: <span id="' + idPrefix + '-tong">chưa chọn</span>/10</span></p>';
  return h;
}

var ADM_CHON = {};
function admChon(prefix, i, m) {
  if (!ADM_CHON[prefix]) ADM_CHON[prefix] = [];
  var rub = admRubricCua(prefix);
  for (var k = 0; k < 4; k++) {
    var o = admEl(prefix + '-' + i + '-' + k);
    if (o) { o.style.background = ''; o.style.boxShadow = ''; }
  }
  var c = admEl(prefix + '-' + i + '-' + m);
  if (c) { c.style.background = '#e2edf8'; c.style.boxShadow = 'inset 0 0 0 2px #2b76c4'; }
  ADM_CHON[prefix][i] = m;
  var t = dclTongDiem(rub, ADM_CHON[prefix]);
  var el = admEl(prefix + '-tong');
  if (el) el.textContent = (t === null) ? 'chưa chọn đủ' : String(t).replace('.', ',');
}
function admRubricCua(prefix) {
  if (prefix.indexOf('r1') === 0) return DCL_R1;
  if (prefix.indexOf('r2') === 0) return DCL_R2;
  return DCL_R3;
}
function admReset(prefix) {
  ADM_CHON[prefix] = [];
  var rub = admRubricCua(prefix);
  for (var i = 0; i < rub.tieuChi.length; i++)
    for (var m = 0; m < 4; m++) {
      var o = admEl(prefix + '-' + i + '-' + m);
      if (o) { o.style.background = ''; o.style.boxShadow = ''; }
    }
  var el = admEl(prefix + '-tong');
  if (el) el.textContent = 'chưa chọn';
}

/* ---------- vẽ từng tab ---------- */
function admVeTab() {
  var t = admEl('adm-tab');
  if (!t) return;
  if (DCL_TAB === 'r1') return admTabR1(t);
  if (DCL_TAB === 'r2') return admTabR2(t);
  if (DCL_TAB === 'r3') return admTabR3(t);
  if (DCL_TAB === 'ds') return admTabDs(t);
  if (DCL_TAB === 'mc') return admTabMc(t);
  if (DCL_TAB === 'th') return admTabTongHop(t);
}

/* --- Rubric 1 --- */
function admTabR1(t) {
  var laGv = DCL_ME2.vai === 'gv';
  t.innerHTML = '<div class="dcl-panel">'
    + '<div class="kicker">' + (laGv ? 'Duyệt Rubric 1' : 'Chấm Rubric 1 — hoạt động nhóm') + '</div>'
    + '<p class="sm sub">' + (laGv
        ? 'Phiếu của giáo viên ghi đè trung bình phiếu của nhóm. Chọn lớp, nhóm rồi chọn học sinh.'
        : 'Chấm cho từng bạn trong nhóm, kể cả chính em. Mỗi người chấm giữ một phiếu cho mỗi bạn, chấm lại sẽ thay phiếu cũ.')
    + ' Minh chứng duy nhất được dùng là nhật kí dự án.</p>'
    + (laGv ? admChonLopNhom('r1', 'admTaiTV()') : '')
    + '<div class="dcl-row"><div class="dcl-f"><label for="r1-ai">Người được chấm</label>'
    + '<select id="r1-ai"><option value="">— đang tải —</option></select></div></div>'
    + admPhieu(DCL_R1, 'r1')
    + '<div class="btns"><button class="btn" onclick="admGuiR1()">Gửi phiếu</button>'
    + '<button class="btn btn2" onclick="admReset(\'r1\')">Xoá lựa chọn</button></div>'
    + '<div class="dcl-msg" id="r1-msg"></div></div>';
  admReset('r1');
  admTaiTV();
}

function admChonLopNhom(prefix, onchange) {
  var h = '<div class="dcl-row">'
    + '<div class="dcl-f" style="flex:0 1 160px"><label for="' + prefix + '-lop">Lớp</label>'
    + '<select id="' + prefix + '-lop" onchange="' + onchange + '"></select></div>'
    + '<div class="dcl-f" style="flex:0 1 180px"><label for="' + prefix + '-nhom">Nhóm</label>'
    + '<select id="' + prefix + '-nhom" onchange="' + onchange + '">';
  for (var n = 1; n <= 5; n++) h += '<option>Nhóm ' + n + '</option>';
  h += '</select></div></div>';
  setTimeout(function () { dclLopSelect(admEl(prefix + '-lop'), DCL_ME.lop); }, 0);
  return h;
}

function admPhamVi(prefix) {
  if (DCL_ME2.vai !== 'gv') return {};
  var l = admEl(prefix + '-lop'), n = admEl(prefix + '-nhom');
  return { lop: l ? l.value : '', nhom: n ? n.value : '' };
}

function admTaiTV() {
  var sel = admEl('r1-ai');
  if (!sel) return;
  admGoi('dsThanhVien', admPhamVi('r1')).then(function (r) {
    if (!r.ok || !r.ds.length) {
      sel.innerHTML = '<option value="">— chưa có danh sách thành viên —</option>';
      return;
    }
    var h = '<option value="">— chọn bạn —</option>';
    for (var i = 0; i < r.ds.length; i++) h += '<option>' + dclEsc(r.ds[i]) + '</option>';
    sel.innerHTML = h;
  })['catch'](function () { sel.innerHTML = '<option value="">— không tải được —</option>'; });
}

function admGuiR1() {
  var ai = admEl('r1-ai').value;
  if (!ai) { admBao('r1-msg', 'no', 'Chọn người được chấm.'); return; }
  var muc = ADM_CHON['r1'] || [];
  if (dclTongDiem(DCL_R1, muc) === null) { admBao('r1-msg', 'no', 'Chọn đủ 3 tiêu chí.'); return; }
  var d = admPhamVi('r1');
  d.nguoiDuocCham = ai; d.muc = muc;
  admBao('r1-msg', 'wait', 'Đang gửi…');
  admGoi('chamR1', d).then(function (r) {
    admBao('r1-msg', r.ok ? 'ok' : 'no',
      r.ok ? ('Đã lưu phiếu cho ' + ai + ': ' + String(r.tong).replace('.', ',') + '/10')
           : (r.loi || 'Không gửi được'));
  })['catch'](function () { admBao('r1-msg', 'no', 'Không kết nối được máy chủ.'); });
}

/* --- Rubric 2 --- */
function admTabR2(t) {
  t.innerHTML = '<div class="dcl-panel">'
    + '<div class="kicker">Chấm Rubric 2 — sản phẩm</div>'
    + '<p class="sm sub">Chỉ giáo viên chấm. Mỗi nhóm giữ một phiếu, chấm lại sẽ thay phiếu cũ.</p>'
    + admChonLopNhom('r2', '')
    + admPhieu(DCL_R2, 'r2')
    + '<div class="chk" style="margin-top:10px"><input type="checkbox" id="r2-chan">'
    + '<label for="r2-chan">Áp quy tắc chặn: kết luận sai từ một nửa số hành vi trở lên, '
    + 'tiêu chí 4 không được quá mức Đạt</label></div>'
    + '<div class="dcl-row"><div class="dcl-f"><label for="r2-nx">Nhận xét cho nhóm</label>'
    + '<input id="r2-nx" type="text" placeholder="Một hai câu để nhóm biết sửa gì"></div></div>'
    + '<div class="btns"><button class="btn" onclick="admGuiR2()">Lưu điểm sản phẩm</button>'
    + '<button class="btn btn2" onclick="admReset(\'r2\')">Xoá lựa chọn</button></div>'
    + '<div class="dcl-msg" id="r2-msg"></div></div>';
  admReset('r2');
}

function admGuiR2() {
  var muc = ADM_CHON['r2'] || [];
  if (dclTongDiem(DCL_R2, muc) === null) { admBao('r2-msg', 'no', 'Chọn đủ 6 tiêu chí.'); return; }
  var d = admPhamVi('r2');
  d.muc = muc;
  d.chanTC4 = admEl('r2-chan').checked;
  d.nhanXet = admEl('r2-nx').value;
  admBao('r2-msg', 'wait', 'Đang lưu…');
  admGoi('chamR2', d).then(function (r) {
    admBao('r2-msg', r.ok ? 'ok' : 'no',
      r.ok ? ('Đã lưu: ' + String(r.tong).replace('.', ',') + '/10'
              + (r.chan ? ' (đã áp quy tắc chặn ở tiêu chí 4)' : ''))
           : (r.loi || 'Không lưu được'));
  })['catch'](function () { admBao('r2-msg', 'no', 'Không kết nối được máy chủ.'); });
}

/* --- Rubric 3 --- */
function admTabR3(t) {
  var laGv = DCL_ME2.vai === 'gv';
  var h = '<div class="dcl-panel"><div class="kicker">Chấm Rubric 3 — báo cáo và phản biện</div>';
  if (laGv) {
    h += '<p class="sm sub">Mở phiên chấm cho nhóm đang báo cáo thì bốn nhóm còn lại mới gửi phiếu được. '
       + 'Mỗi lớp chỉ mở một phiên tại một thời điểm.</p>'
       + admChonLopNhom('r3', '')
       + '<div class="btns" style="margin-top:0">'
       + '<button class="btn" onclick="admPhienR3(true)">Mở phiên cho nhóm này</button>'
       + '<button class="btn btn2" onclick="admPhienR3(false)">Đóng phiên của lớp</button></div>'
       + '<div class="dcl-msg" id="r3-phien"></div><hr style="margin:16px 0;border:none;border-top:1px solid var(--line)">'
       + '<p class="sm sub">Phiếu của giáo viên chiếm 70% điểm Rubric 3; trung bình phiếu bốn nhóm bạn chiếm 30%.</p>';
  } else {
    h += '<p class="sm sub" id="r3-trangthai">Đang kiểm tra phiên chấm…</p>';
  }
  h += admPhieu(DCL_R3, 'r3')
     + '<div class="btns"><button class="btn" onclick="admGuiR3()">Gửi phiếu chấm</button>'
     + '<button class="btn btn2" onclick="admReset(\'r3\')">Xoá lựa chọn</button></div>'
     + '<div class="dcl-msg" id="r3-msg"></div></div>';
  t.innerHTML = h;
  admReset('r3');
  if (!laGv) admKiemPhienR3();
}

var ADM_R3_MO = '';
function admKiemPhienR3() {
  admGoi('xemPhienR3').then(function (r) {
    var el = admEl('r3-trangthai');
    if (!r.ok) return;
    ADM_R3_MO = r.dangMo[DCL_ME2.lop] || '';
    if (!el) return;
    if (!ADM_R3_MO) el.textContent = 'Giáo viên chưa mở phiên chấm nào. Chờ tới lượt nhóm báo cáo rồi bấm Làm mới trang.';
    else if (dclChuan(ADM_R3_MO) === dclChuan(DCL_ME2.nhom))
      el.textContent = 'Nhóm em đang báo cáo nên không chấm phiếu này. Các nhóm khác đang chấm cho nhóm em.';
    else el.textContent = 'Đang chấm cho ' + ADM_R3_MO + '. Nhóm em gửi một phiếu duy nhất, nhóm trưởng là người gửi.';
  })['catch'](function () {});
}
function dclChuan(s) { return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' '); }

function admPhienR3(mo) {
  var d = admPhamVi('r3');
  d.mo = mo;
  admGoi('phienR3', d).then(function (r) {
    admBao('r3-phien', r.ok ? 'ok' : 'no',
      r.ok ? (mo ? ('Đã mở phiên chấm cho ' + d.nhom + ' ở lớp ' + d.lop)
                 : ('Đã đóng mọi phiên chấm của lớp ' + d.lop))
           : (r.loi || 'Không đổi được'));
  })['catch'](function () { admBao('r3-phien', 'no', 'Không kết nối được máy chủ.'); });
}

function admGuiR3() {
  var muc = ADM_CHON['r3'] || [];
  if (dclTongDiem(DCL_R3, muc) === null) { admBao('r3-msg', 'no', 'Chọn đủ 4 tiêu chí.'); return; }
  var d = { muc: muc };
  if (DCL_ME2.vai === 'gv') {
    var pv = admPhamVi('r3');
    d.lop = pv.lop; d.nhomDuocCham = pv.nhom;
  } else {
    if (!ADM_R3_MO) { admBao('r3-msg', 'no', 'Giáo viên chưa mở phiên chấm.'); return; }
    d.nhomDuocCham = ADM_R3_MO;
  }
  admBao('r3-msg', 'wait', 'Đang gửi…');
  admGoi('chamR3', d).then(function (r) {
    admBao('r3-msg', r.ok ? 'ok' : 'no',
      r.ok ? ('Đã gửi phiếu: ' + String(r.tong).replace('.', ',') + '/10')
           : (r.loi || 'Không gửi được'));
  })['catch'](function () { admBao('r3-msg', 'no', 'Không kết nối được máy chủ.'); });
}

/* --- danh sách thành viên --- */
function admTabDs(t) {
  t.innerHTML = '<div class="dcl-panel">'
    + '<div class="kicker">Danh sách thành viên nhóm</div>'
    + '<p class="sm sub">Nhóm trưởng nhập một lần, mỗi dòng một bạn. Danh sách này là nguồn tên cho phiếu chấm Rubric 1, '
    + 'nên nhập sai tên thì bạn đó sẽ không có điểm.</p>'
    + '<div class="dcl-row"><div class="dcl-f">'
    + '<label for="ds-ta">Mỗi dòng một họ tên</label>'
    + '<textarea id="ds-ta" rows="8" style="border:1px solid var(--line2);border-radius:6px;'
    + 'padding:10px;font:inherit;font-size:14px;width:100%"></textarea></div></div>'
    + '<div class="btns"><button class="btn" onclick="admLuuDs()">Lưu danh sách</button></div>'
    + '<div class="dcl-msg" id="ds-msg"></div></div>';
  admGoi('dsThanhVien', {}).then(function (r) {
    if (r.ok && r.ds.length) admEl('ds-ta').value = r.ds.join('\n');
  })['catch'](function () {});
}
function admLuuDs() {
  var ds = admEl('ds-ta').value.split('\n').map(function (s) { return s.trim(); })
    .filter(function (s) { return s; });
  if (!ds.length) { admBao('ds-msg', 'no', 'Danh sách trống.'); return; }
  admBao('ds-msg', 'wait', 'Đang lưu…');
  admGoi('luuThanhVien', { ds: ds }).then(function (r) {
    admBao('ds-msg', r.ok ? 'ok' : 'no',
      r.ok ? ('Đã lưu ' + r.ds.length + ' thành viên.') : (r.loi || 'Không lưu được'));
  })['catch'](function () { admBao('ds-msg', 'no', 'Không kết nối được máy chủ.'); });
}

/* --- minh chứng Rubric 1 --- */
function admTabMc(t) {
  var laGv = DCL_ME2.vai === 'gv';
  t.innerHTML = '<div class="dcl-panel">'
    + '<div class="kicker">Minh chứng cho Rubric 1</div>'
    + '<p class="sm sub">Nhật kí dự án và biên bản họp nhóm. Dán link Google Docs hoặc Drive đã mở quyền xem cho giáo viên. '
    + 'Điều gì không có trong nhật kí thì không được tính khi chấm Rubric 1.</p>'
    + (laGv ? admChonLopNhom('mc', 'admTaiMc()') :
        '<div class="dcl-row">'
        + '<div class="dcl-f" style="flex:0 1 200px"><label for="mc-loai">Loại minh chứng</label>'
        + '<select id="mc-loai"><option>Nhật kí dự án</option><option>Biên bản họp nhóm</option>'
        + '<option>Lịch sử làm việc trên công cụ số</option></select></div>'
        + '<div class="dcl-f"><label for="mc-link">Link</label>'
        + '<input id="mc-link" type="url" placeholder="https://..."></div></div>'
        + '<div class="dcl-row"><div class="dcl-f"><label for="mc-gc">Ghi chú</label>'
        + '<input id="mc-gc" type="text" placeholder="VD: nhật kí tuần 1 và tuần 2"></div></div>'
        + '<div class="btns"><button class="btn" onclick="admNopMc()">Nộp minh chứng</button></div>'
        + '<div class="dcl-msg" id="mc-msg"></div>')
    + '<h4 style="margin-top:18px;font-size:16px">Đã nộp</h4><div id="mc-ds"><p class="sm sub">Đang tải…</p></div></div>';
  admTaiMc();
}
function admNopMc() {
  var link = admEl('mc-link').value.trim();
  if (link.indexOf('http') !== 0) { admBao('mc-msg', 'no', 'Link phải bắt đầu bằng http.'); return; }
  admBao('mc-msg', 'wait', 'Đang nộp…');
  admGoi('nopMinhChung', { loai: admEl('mc-loai').value, link: link, ghiChu: admEl('mc-gc').value })
    .then(function (r) {
      admBao('mc-msg', r.ok ? 'ok' : 'no', r.ok ? 'Đã nộp minh chứng.' : (r.loi || 'Không nộp được'));
      if (r.ok) { admEl('mc-link').value = ''; admEl('mc-gc').value = ''; admTaiMc(); }
    })['catch'](function () { admBao('mc-msg', 'no', 'Không kết nối được máy chủ.'); });
}
function admTaiMc() {
  var box = admEl('mc-ds');
  if (!box) return;
  admGoi('dsMinhChung', admPhamVi('mc')).then(function (r) {
    if (!r.ok || !r.ds.length) { box.innerHTML = '<p class="sm sub">Chưa có minh chứng nào.</p>'; return; }
    var h = '<div class="wrap"><table><thead><tr><th>Lúc</th><th>Nhóm</th><th>Loại</th>'
          + '<th>Link</th><th>Ghi chú</th></tr></thead><tbody>';
    for (var i = 0; i < r.ds.length; i++) {
      var m = r.ds[i];
      h += '<tr><td class="xs">' + dclEsc(m.luc) + '</td><td class="xs">' + dclEsc(m.lop + ' ' + m.nhom)
         + '</td><td class="xs">' + dclEsc(m.loai) + '</td>'
         + '<td class="xs"><a target="_blank" rel="noopener" href="' + dclEsc(m.link) + '">mở</a></td>'
         + '<td class="xs">' + dclEsc(m.ghiChu) + '</td></tr>';
    }
    box.innerHTML = h + '</tbody></table></div>';
  })['catch'](function () { box.innerHTML = '<p class="sm sub">Không tải được.</p>'; });
}

/* --- bảng tổng hợp --- */
function admTabTongHop(t) {
  var laGv = DCL_ME2.vai === 'gv';
  t.innerHTML = '<div class="dcl-panel">'
    + '<div class="kicker">Tổng hợp điểm dự án</div>'
    + '<p class="sm sub">Điểm dự án = 0,1 × Rubric 1 + 0,6 × Rubric 2 + 0,3 × Rubric 3. '
    + 'Rubric 3 của nhóm = 0,7 × điểm giáo viên + 0,3 × trung bình bốn nhóm bạn. '
    + 'Ô để trống nghĩa là chưa có đủ phiếu chấm.</p>'
    + (laGv ? admChonLopNhom('th', 'admTaiTongHop()').replace(/<div class="dcl-f" style="flex:0 1 180px">[\s\S]*?<\/div>/, '') : '')
    + '<div class="btns" style="margin-top:0"><button class="btn btn2" onclick="admTaiTongHop()">Làm mới</button></div>'
    + '<div id="th-ds" style="margin-top:14px"><p class="sm sub">Đang tải…</p></div></div>';
  admTaiTongHop();
}

function admTaiTongHop() {
  var box = admEl('th-ds');
  if (!box) return;
  var d = {};
  var l = admEl('th-lop');
  if (l && l.value) d.lop = l.value;
  box.innerHTML = '<p class="sm sub">Đang tải…</p>';
  admGoi('tongHop', d).then(function (r) {
    if (!r.ok) { box.innerHTML = '<p class="sm sub">' + dclEsc(r.loi || 'Không tải được') + '</p>'; return; }
    if (!r.ds.length) { box.innerHTML = '<p class="sm sub">Chưa có dữ liệu cho lớp này.</p>'; return; }
    var h = '<div class="wrap"><table><thead><tr><th>Nhóm</th><th>Họ tên</th>'
          + '<th>R1</th><th>R2</th><th>R3</th><th>Điểm dự án</th><th>Ghi chú</th>'
          + '</tr></thead><tbody>';
    for (var i = 0; i < r.ds.length; i++) {
      var x = r.ds[i];
      h += '<tr><td class="xs">' + dclEsc(x.nhom) + '</td><td class="sm">' + dclEsc(x.hoTen) + '</td>'
         + '<td>' + admSo(x.r1) + '</td><td>' + admSo(x.r2) + '</td><td>' + admSo(x.r3) + '</td>'
         + '<td><strong>' + admSo(x.duAn) + '</strong></td>'
         + '<td class="xs sub">' + (x.gvDuyetR1 ? 'R1 do GV duyệt' : (x.soPhieuR1 + ' phiếu R1')) + '</td></tr>';
    }
    box.innerHTML = h + '</tbody></table></div>';
  })['catch'](function () { box.innerHTML = '<p class="sm sub">Không kết nối được máy chủ.</p>'; });
}
function admSo(v) { return (v === null || v === undefined) ? '—' : String(v).replace('.', ','); }

/* ---------- khởi động ---------- */
(function () {
  function start() { setTimeout(admKhoiTao, 60); }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', start);
  else start();
})();
