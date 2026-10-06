/* =====================================================================
   DIGITAL CITIZEN LAB — KHU CHẤM ĐIỂM
   Nạp sau dcl-rubrics.js và dcl-api.js.

   Trình duyệt không tự quyết định vai. Mọi thao tác ghi đều kèm mã phiên
   và được máy chủ kiểm lại vai, lớp, nhóm.
   ===================================================================== */

var ADM_KEY   = 'dcl_phien_v2';
var ADM_LOP   = 'dcl_lop_gv_v1';
var ADM_U     = null;         // { vai, lop, nhom, hoTen, idHS }
var ADM_TAB   = '';
var ADM_HEN   = null;         // bộ hẹn giờ cho phiên Rubric 3

(function () {
  var css = document.createElement('style');
  css.textContent =
    '.adm-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}' +
    '.adm-tabs button{flex:1 1 150px;min-height:44px}' +
    '.adm-the{border:1px solid var(--line);border-radius:12px;padding:18px;background:#fff;' +
    'box-shadow:0 1px 3px rgba(23,33,43,.06)}' +
    '.adm-tien{height:6px;background:var(--line);border-radius:3px;overflow:hidden;margin:10px 0 14px}' +
    '.adm-tien i{display:block;height:100%;background:var(--pri);transition:width .25s}' +
    '.adm-muc{display:grid;grid-template-columns:1fr;gap:9px;margin-top:14px}' +
    '@media(min-width:700px){.adm-muc{grid-template-columns:1fr 1fr}}' +
    '.adm-nut{text-align:left;border:1px solid var(--line2);border-radius:9px;padding:12px 14px;' +
    'background:#fff;cursor:pointer;font:inherit;min-height:52px}' +
    '.adm-nut:hover{border-color:var(--pri-l);background:var(--tint)}' +
    '.adm-nut.chon{border-color:var(--pri);background:var(--tint);box-shadow:inset 0 0 0 1px var(--pri)}' +
    '.adm-nut b{display:block;font-size:13.5px;margin-bottom:3px}' +
    '.adm-nut span{font-size:12px;color:var(--sub);line-height:1.45}' +
    '.adm-dh{font-family:"JetBrains Mono",monospace;font-size:30px;font-weight:700;letter-spacing:.02em}' +
    '.adm-dh.het{color:var(--no)}' +
    '.adm-bang td,.adm-bang th{font-size:12.5px;padding:8px 9px}' +
    '.adm-co{display:inline-block;border-radius:999px;padding:2px 9px;font-size:11.5px;font-weight:700}' +
    '.adm-co.x{background:var(--okbg);color:var(--ok)}' +
    '.adm-co.o{background:#f1f3f6;color:var(--sub)}' +
    '.adm-co.c{background:var(--warm);color:var(--acc)}';
  document.head.appendChild(css);
})();

function admPhien() { try { return localStorage.getItem(ADM_KEY) || ''; } catch (e) { return ''; } }
function admLuu(p) { try { localStorage.setItem(ADM_KEY, p); } catch (e) {} }
function admXoa() { try { localStorage.removeItem(ADM_KEY); } catch (e) {} ADM_U = null; }
function admLopGV() { try { return localStorage.getItem(ADM_LOP) || ''; } catch (e) { return ''; } }
function admDatLopGV(l) { try { localStorage.setItem(ADM_LOP, l); } catch (e) {} }

function admGoi(action, data) {
  data = data || {};
  data.phien = admPhien();
  return dclGoi(action, data).then(function (r) {
    if (r && r.hetPhien) { admXoa(); admVe(); }
    return r;
  });
}
function admLaGV() { return ADM_U && ADM_U.vai === 'gv'; }
function admLaNhom() { return ADM_U && ADM_U.vai === 'nhom'; }
function admLaTruong() { return admLaNhom(); }
function admTenVai(v) {
  return { gv: 'Giáo viên', nhom: 'Nhóm' }[v] || 'Nhóm';
}

/* ---------- dựng mục ---------- */
function admKhoiTao() {
  if (dclEl('p-admin')) return;
  var main = document.querySelector('main');
  if (!main) return;
  var sec = document.createElement('section');
  sec.className = 'page';
  sec.id = 'p-admin';
  sec.innerHTML = '<div class="sec"><h2>Khu chấm điểm</h2><div class="rule"></div>'
    + '<div id="adm-body"></div></div>';
  main.insertBefore(sec, main.querySelector('.foot'));

  admDuongVao();
  if (!admPhien()) { admVe(); return; }
  admGoi('toiLaAi').then(function (r) {
    if (r && r.ok) { ADM_U = r.me; admSauDangNhap(); } else { admXoa(); }
    admVe();
  })['catch'](function () { admVe(); });
}

function admSauDangNhap() {
  if (!ADM_U || admLaGV()) return;
  if (typeof dclTaiTrungBay === 'function') dclTaiTrungBay(admPhien());
}

/* Khu chấm điểm là khu vận hành riêng: có đường vào từ thanh trạng thái,
   không nằm trên thanh điều hướng của học sinh. */
function admDuongVao() {
  /* index.html đã có nút "Đăng nhập bằng mã" sẵn trên thanh tiêu đề.
     Hàm này chỉ làm dự phòng cho bản giao diện cũ chưa có nút đó. */
  if (dclEl('adm-vao')) return;
  var bar = document.querySelector('.ieo-login') || document.querySelector('.quick-bar');
  if (!bar) return;
  var b = document.createElement('button');
  b.id = 'adm-vao';
  b.className = 'sm-btn pri';
  b.textContent = 'Đăng nhập bằng mã';
  b.onclick = function () { if (typeof go === 'function') go('admin'); };
  bar.appendChild(b);
}

/* ---------- đăng nhập ---------- */
function admVe() {
  var b = dclEl('adm-body');
  if (!b) return;
  if (!dclSan()) {
    b.innerHTML = '<p class="sm sub">Chưa nối với máy chủ nên khu chấm điểm chưa dùng được.</p>';
    return;
  }
  if (!ADM_U) { admFormDangNhap(b); return; }

  var tabs = admLaGV()
    ? [['td', 'Tiến độ lớp'], ['r2', 'Chấm sản phẩm'], ['r3', 'Điều hành báo cáo'],
       ['r1', 'Duyệt hoạt động nhóm'], ['th', 'Tổng hợp và công bố']]
    : [['r1', 'Chấm hoạt động nhóm'], ['nk', 'Nhật kí dự án'], ['th', 'Điểm của nhóm']];

  var co = false;
  for (var i = 0; i < tabs.length; i++) if (tabs[i][0] === ADM_TAB) co = true;
  if (!co) ADM_TAB = tabs[0][0];

  var h = '<div class="dcl-panel" style="display:flex;justify-content:space-between;'
    + 'align-items:center;gap:12px;flex-wrap:wrap"><div>'
    + '<div class="kicker">Đang đăng nhập</div><strong>' + dclEsc(ADM_U.hoTen) + '</strong> · '
    + admTenVai(ADM_U.vai)
    + (ADM_U.lop && ADM_U.lop !== '*' ? ' · ' + dclEsc(ADM_U.lop) : '')
    + (ADM_U.nhom ? ' · ' + dclEsc(ADM_U.nhom) : '')
    + '</div><button class="btn btn2" onclick="admDangXuat()">Đăng xuất</button></div>'
    + '<div class="adm-tabs">';
  for (i = 0; i < tabs.length; i++)
    h += '<button class="btn ' + (tabs[i][0] === ADM_TAB ? '' : 'btn2') + '" onclick="admMo(\''
       + tabs[i][0] + '\')">' + tabs[i][1] + '</button>';
  h += '</div><div id="adm-tab"></div>';
  b.innerHTML = h;
  admVeTab();
}
function admMo(t) { ADM_TAB = t; admVe(); }

function admFormDangNhap(b) {
  b.innerHTML = '<div class="dcl-panel">'
    + '<div class="kicker">Đăng nhập</div>'
    + '<p class="sm sub" style="margin-bottom:12px">Nhóm dùng <strong>mã nhóm</strong> nhận được sau khi '
    + 'nộp biểu mẫu đăng kí, lấy ở mục Đánh giá. Giáo viên dùng mã riêng của mình. '
    + 'Mã nhóm dùng chung, mọi thành viên đều đăng nhập được.</p>'
    + '<div class="dcl-row">'
    + '<div class="dcl-f" style="flex:0 1 220px"><label for="dn2-ma">Mã truy cập</label>'
    + '<input id="dn2-ma" type="text" maxlength="6" placeholder="6 ký tự" '
    + 'style="text-transform:uppercase;font-family:\'JetBrains Mono\',monospace">'
    + '</div>'
    + '<div class="dcl-f" style="flex:0 0 auto"><button class="btn" onclick="admDangNhap()">Đăng nhập</button></div>'
    + '</div><div class="dcl-msg" id="dn2-msg"></div></div>';
}

function admDangNhap() {
  var ma = dclEl('dn2-ma').value.trim().toUpperCase();
  var id = '';
  if (!ma) { dclBao(dclEl('dn2-msg'), 'no', 'Nhập mã truy cập.'); return; }
  dclBao(dclEl('dn2-msg'), 'wait', 'Đang kiểm tra…');
  dclGoi('dangNhap', { ma: ma, idHS: id }).then(function (r) {
    if (!r.ok) { dclBao(dclEl('dn2-msg'), 'no', r.loi || 'Không đăng nhập được'); return; }
    admLuu(r.phien);
    ADM_U = { vai: r.vai, lop: r.lop, nhom: r.nhom, hoTen: r.hoTen, idHS: r.idHS };
    ADM_TAB = admLaGV() ? 'td' : (admLaTruong() ? 'nk' : 'r1');
    admSauDangNhap();
    admVe();
  })['catch'](function () { dclBao(dclEl('dn2-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

function admDangXuat() {
  admGoi('dangXuat')['catch'](function () {});
  admXoa();
  if (ADM_HEN) { clearInterval(ADM_HEN); ADM_HEN = null; }
  admVe();
}

/* ===================================================================
   PHIẾU CHẤM DẠNG THẺ: một tiêu chí một màn
   =================================================================== */
var PH = { rubric: null, muc: [], i: 0, dich: '', xong: null };

function admMoPhieu(rubric, dich, xong) {
  PH = { rubric: rubric, muc: [], i: 0, dich: dich, xong: xong };
  for (var i = 0; i < rubric.tieuChi.length; i++) PH.muc.push(null);
  admVePhieu();
}

function admVePhieu() {
  var box = dclEl('adm-phieu');
  if (!box || !PH.rubric) return;
  var tc = PH.rubric.tieuChi[PH.i];
  var daChon = 0;
  for (var k = 0; k < PH.muc.length; k++) if (PH.muc[k] !== null) daChon++;
  var tong = dclTongDiem(PH.rubric, PH.muc);

  var h = '<div class="adm-the">'
    + '<div class="kicker">' + dclEsc(PH.dich) + ' · tiêu chí ' + (PH.i + 1)
    + '/' + PH.rubric.tieuChi.length + '</div>'
    + '<h4 style="font-size:17px;margin:4px 0 2px">' + dclEsc(tc.ten) + '</h4>'
    + '<p class="xs sub" style="margin:0">Điểm tối đa ' + String(tc.max).replace('.', ',')
    + (tc.yccd ? ' · ' + dclEsc(tc.yccd) : '') + '</p>'
    + '<div class="adm-tien"><i style="width:' + Math.round(daChon / PH.muc.length * 100) + '%"></i></div>'
    + '<div class="adm-muc">';
  for (var m = 0; m < 4; m++) {
    h += '<button class="adm-nut' + (PH.muc[PH.i] === m ? ' chon' : '') + '" onclick="admChonMuc('
       + m + ')"><b>' + DCL_MUC[m] + ' · ' + String(tc.max * DCL_HE_SO[m]).replace('.', ',')
       + ' điểm</b><span>';
    for (var j = 0; j < tc.mucDo[m].length; j++)
      h += (j ? '<br>' : '') + '· ' + dclEsc(tc.mucDo[m][j]);
    h += '</span></button>';
  }
  h += '</div><div class="btns">'
    + (PH.i > 0 ? '<button class="btn btn2" onclick="admBuoc(-1)">Tiêu chí trước</button>' : '')
    + (PH.i < PH.rubric.tieuChi.length - 1
        ? '<button class="btn" onclick="admBuoc(1)">Tiêu chí sau</button>'
        : '<button class="btn" onclick="admGuiPhieu()">Gửi phiếu</button>')
    + '</div>'
    + '<p class="sm" style="margin-top:12px"><span class="pill">Đã chọn ' + daChon + '/'
    + PH.muc.length + ' · tổng ' + (tong === null ? 'chưa đủ' : dclSo(tong)) + '/10</span></p>'
    + '<div class="dcl-msg" id="ph-msg"></div></div>';
  box.innerHTML = h;
}
function admChonMuc(m) {
  PH.muc[PH.i] = m;
  if (PH.i < PH.rubric.tieuChi.length - 1) PH.i++;
  admVePhieu();
}
function admBuoc(d) {
  PH.i = Math.max(0, Math.min(PH.rubric.tieuChi.length - 1, PH.i + d));
  admVePhieu();
}
function admGuiPhieu() {
  var tong = dclTongDiem(PH.rubric, PH.muc);
  if (tong === null) {
    dclBao(dclEl('ph-msg'), 'no', 'Còn tiêu chí chưa chọn mức.');
    for (var i = 0; i < PH.muc.length; i++) if (PH.muc[i] === null) { PH.i = i; break; }
    admVePhieu();
    dclBao(dclEl('ph-msg'), 'no', 'Còn tiêu chí chưa chọn mức.');
    return;
  }
  PH.xong(PH.muc.slice());
}

/* ===================================================================
   TAB: NHẬT KÍ DỰ ÁN
   =================================================================== */
function admTabNhatKy(t) {
  t.innerHTML = '<div class="dcl-panel"><div class="kicker">Bảng phân công</div>'
    + '<p class="sm sub">Giờ bàn giao do máy chủ ghi, không sửa tay được. Rubric 1 tiêu chí 1 '
    + 'đếm theo bảng này.</p>'
    + (admLaTruong() || admLaGV()
      ? '<div class="dcl-row">'
        + '<div class="dcl-f"><label for="pc-viec">Đầu việc</label><input id="pc-viec" type="text"></div>'
        + '<div class="dcl-f"><label for="pc-ai">Giao cho</label><select id="pc-ai"></select></div>'
        + '<div class="dcl-f" style="flex:0 1 180px"><label for="pc-han">Hạn</label>'
        + '<input id="pc-han" type="date"></div>'
        + '<div class="dcl-f" style="flex:0 0 auto"><button class="btn" onclick="admThemViec()">Thêm</button></div>'
        + '</div>' : '')
    + '<div class="dcl-msg" id="pc-msg"></div><div id="pc-ds"></div></div>'
    + '<div class="dcl-panel"><div class="kicker">Biên bản họp</div>'
    + '<p class="sm sub">Điểm danh bằng cách tick tên. Rubric 1 tiêu chí 2 đếm theo số buổi có mặt.</p>'
    + '<div class="dcl-row"><div class="dcl-f" style="flex:0 1 180px"><label for="bb-ngay">Ngày họp</label>'
    + '<input id="bb-ngay" type="date"></div>'
    + '<div class="dcl-f"><label for="bb-nd">Nội dung</label><input id="bb-nd" type="text"></div></div>'
    + '<div id="bb-dd" class="sm"></div>'
    + '<div class="btns"><button class="btn" onclick="admThemBienBan()">Lưu biên bản</button></div>'
    + '<div class="dcl-msg" id="bb-msg"></div></div>'
    + '<div class="dcl-panel"><div class="kicker">Sổ ghi nhận</div>'
    + '<p class="sm sub">Thư kí hoặc nhóm trưởng ghi. Rubric 1 tiêu chí 3 đếm theo sổ này.</p>'
    + '<div class="dcl-row">'
    + '<div class="dcl-f"><label for="gn-ai">Ghi nhận cho</label><select id="gn-ai"></select></div>'
    + '<div class="dcl-f" style="flex:0 1 200px"><label for="gn-loai">Loại</label>'
    + '<select id="gn-loai"><option value="gopy">Góp ý nội dung</option>'
    + '<option value="phanhoi">Phản hồi bản nháp của bạn</option>'
    + '<option value="nhanthemviec">Nhận thêm việc ngoài phân công</option></select></div>'
    + '<div class="dcl-f"><label for="gn-nd">Nội dung ngắn</label><input id="gn-nd" type="text"></div>'
    + '<div class="dcl-f" style="flex:0 0 auto"><button class="btn" onclick="admThemGhiNhan()">Ghi</button></div>'
    + '</div><div class="dcl-msg" id="gn-msg"></div></div>';
  admTaiThanhVien(['pc-ai', 'gn-ai'], 'bb-dd');
  admTaiPhanCong();
}

/** Danh sách đầu việc, kèm nút bàn giao. Giờ bàn giao do máy chủ ghi. */
function admTaiPhanCong() {
  var box = dclEl('pc-ds');
  if (!box) return;
  box.innerHTML = '<p class="sm sub">Đang tải danh sách đầu việc…</p>';
  admGoi('dsPhanCong', {}).then(function (r) {
    if (!r || !r.ok) { box.innerHTML = ''; return; }
    if (!r.ds.length) { box.innerHTML = '<p class="sm sub">Nhóm chưa có đầu việc nào.</p>'; return; }
    var h = '<div class="wrap"><table class="adm-bang"><thead><tr><th>Đầu việc</th>'
          + '<th>Người nhận</th><th>Hạn</th><th>Trạng thái</th><th></th></tr></thead><tbody>';
    for (var i = 0; i < r.ds.length; i++) {
      var v = r.ds[i];
      h += '<tr><td>' + dclEsc(v.dauViec) + '</td><td>' + dclEsc(v.tenNguoiNhan || '—') + '</td>'
         + '<td>' + dclEsc(v.han || '—') + '</td>'
         + '<td>' + (v.xong
             ? '<span class="adm-co x">đã bàn giao</span><br><span class="xs">' + dclEsc(v.gioBanGiao || '') + '</span>'
             : '<span class="adm-co o">chưa xong</span>') + '</td>'
         + '<td>' + (v.xong ? '' : '<button class="sm-btn pri" onclick="admBanGiao(\'' + dclEsc(v.id) + '\')">Đã bàn giao</button>') + '</td></tr>';
    }
    box.innerHTML = h + '</tbody></table></div>';
  })['catch'](function () { box.innerHTML = ''; });
}

function admBanGiao(id) {
  var link = window.prompt('Dán link phần bàn giao (bản nháp, tệp, ảnh chụp). Để trống nếu chưa có:');
  if (link === null) return;
  admGoi('banGiao', { id: id, link: link }).then(function (r) {
    dclBao(dclEl('pc-msg'), r.ok ? 'ok' : 'no',
      r.ok ? 'Đã ghi bàn giao, giờ do máy chủ đóng dấu.' : (r.loi || 'Không ghi được'));
    admTaiPhanCong();
  })['catch'](function () { dclBao(dclEl('pc-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

var ADM_TV = [];
function admTaiThanhVien(selIds, ddId) {
  admGoi('dsThanhVien', {}).then(function (r) {
    if (!r.ok) return;
    ADM_TV = r.ds;
    var h = '<option value="">— chọn bạn —</option>';
    for (var i = 0; i < r.ds.length; i++)
      h += '<option value="' + dclEsc(r.ds[i].id) + '">' + dclEsc(r.ds[i].hoTen) + '</option>';
    for (i = 0; i < selIds.length; i++) { var s = dclEl(selIds[i]); if (s) s.innerHTML = h; }
    if (ddId && dclEl(ddId)) {
      var d = '<p class="sm" style="margin:6px 0 4px"><strong>Điểm danh</strong></p>';
      for (i = 0; i < r.ds.length; i++)
        d += '<div class="chk"><input type="checkbox" id="dd-' + dclEsc(r.ds[i].id) + '">'
           + '<label for="dd-' + dclEsc(r.ds[i].id) + '">' + dclEsc(r.ds[i].hoTen) + '</label></div>';
      dclEl(ddId).innerHTML = d;
    }
  })['catch'](function () {});
}

function admThemViec() {
  var v = dclEl('pc-viec').value.trim();
  if (!v) { dclBao(dclEl('pc-msg'), 'no', 'Nhập tên đầu việc.'); return; }
  admGoi('themPhanCong', { dauViec: v, idNguoiNhan: dclEl('pc-ai').value,
    han: dclEl('pc-han').value }).then(function (r) {
    dclBao(dclEl('pc-msg'), r.ok ? 'ok' : 'no',
      r.ok ? 'Đã thêm đầu việc.' : (r.loi || 'Không thêm được'));
    if (r.ok) { dclEl('pc-viec').value = ''; admTaiPhanCong(); }
  })['catch'](function () { dclBao(dclEl('pc-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

function admThemBienBan() {
  var coMat = [];
  for (var i = 0; i < ADM_TV.length; i++) {
    var c = dclEl('dd-' + ADM_TV[i].id);
    if (c && c.checked) coMat.push(ADM_TV[i].id);
  }
  admGoi('themBienBan', { ngay: dclEl('bb-ngay').value, noiDung: dclEl('bb-nd').value,
    idCoMat: coMat }).then(function (r) {
    dclBao(dclEl('bb-msg'), r.ok ? 'ok' : 'no',
      r.ok ? ('Đã lưu biên bản, ' + coMat.length + ' bạn có mặt.') : (r.loi || 'Không lưu được'));
  })['catch'](function () { dclBao(dclEl('bb-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

function admThemGhiNhan() {
  if (!dclEl('gn-ai').value) { dclBao(dclEl('gn-msg'), 'no', 'Chọn bạn được ghi nhận.'); return; }
  admGoi('themGhiNhan', { idDuocGhiNhan: dclEl('gn-ai').value, loai: dclEl('gn-loai').value,
    noiDung: dclEl('gn-nd').value }).then(function (r) {
    dclBao(dclEl('gn-msg'), r.ok ? 'ok' : 'no',
      r.ok ? 'Đã ghi nhận.' : (r.loi || 'Không ghi được'));
    if (r.ok) dclEl('gn-nd').value = '';
  })['catch'](function () { dclBao(dclEl('gn-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

/* ===================================================================
   TAB: RUBRIC 1 — NHÓM THỐNG NHẤT, MỘT MÁY NHẬP
   =================================================================== */
var R1_DS = [], R1_VT = 0, R1_QUYEN = false;

/* Mã thiết bị: dùng để giữ quyền nhập khi cả nhóm cùng mở một mã. */
function admThietBi() {
  var k = 'dcl_thietbi_v1';
  try {
    var v = localStorage.getItem(k);
    if (!v) { v = 'tb-' + Math.random().toString(36).slice(2, 10); localStorage.setItem(k, v); }
    return v;
  } catch (e) { return 'tb-tam'; }
}

function admTabR1(t) {
  t.innerHTML = '<div class="dcl-panel">'
    + '<div class="kicker">' + (admLaGV() ? 'Duyệt Rubric 1' : 'Rubric 1 — hoạt động nhóm') + '</div>'
    + '<p class="sm sub">' + (admLaGV()
      ? 'Xem điểm nhóm đã thống nhất, sửa được và mở khoá được khi nhóm báo nhầm.'
      : 'Cả nhóm cùng xem rubric, thảo luận và thống nhất mức cho từng bạn. '
        + 'Một máy giữ quyền nhập, các máy khác xem cùng. Thống nhất xong thì khoá lại.')
    + '</p>'
    + (admLaGV() ? admChonLopNhom('r1', 'admR1TaiBang()') : '')
    + (admLaGV() ? '' :
       '<div class="btns" style="margin-top:0">'
       + '<button class="btn" onclick="admGiuPhienR1()">Bắt đầu phiên chấm trên máy này</button>'
       + '<button class="btn btn2" onclick="admR1TaiBang()">Làm mới bảng</button></div>')
    + '<div class="dcl-msg" id="r1-phien"></div>'
    + '<div id="r1-bang" style="margin-top:12px"></div></div>'
    + '<div id="r1-cham"></div><div id="adm-phieu"></div>';
  admR1TaiBang();
}

function admGiuPhienR1() {
  admGoi('giuPhienR1', { thietBi: admThietBi() }).then(function (r) {
    if (!r.ok) { dclBao(dclEl('r1-phien'), 'no', r.loi || 'Không mở được phiên'); return; }
    R1_QUYEN = !!r.coQuyen;
    dclBao(dclEl('r1-phien'), r.coQuyen ? 'ok' : 'wait',
      r.coQuyen ? 'Máy này đang giữ quyền nhập điểm cho cả nhóm.'
                : (r.thongBao || 'Máy khác đang giữ quyền nhập.'));
    admR1TaiBang();
  })['catch'](function () { dclBao(dclEl('r1-phien'), 'no', 'Không kết nối được máy chủ.'); });
}

function admR1TaiBang() {
  var box = dclEl('r1-bang');
  if (!box) return;
  box.innerHTML = '<p class="sm sub">Đang tải…</p>';
  admGoi('bangR1', admPV('r1')).then(function (r) {
    if (!r.ok) { box.innerHTML = '<p class="sm sub">' + dclEsc(r.loi || '') + '</p>'; return; }
    R1_DS = r.ds;
    if (!admLaGV()) R1_QUYEN = (r.thietBiDangGiu === admThietBi());
    if (!r.ds.length) { box.innerHTML = '<p class="sm sub">Nhóm chưa có danh sách thành viên.</p>'; return; }

    var h = '<p class="sm"><span class="pill">' + dclEsc(r.lop) + ' · ' + dclEsc(r.nhom) + '</span> '
      + '<span class="pill">' + (r.hoanTat ? 'Đã khoá đủ cả nhóm' : 'Chưa khoá hết') + '</span></p>'
      + '<div class="wrap"><table class="adm-bang"><thead><tr><th>Thành viên</th>'
      + '<th>Nhóm thống nhất</th><th>Điểm</th><th>Trạng thái</th><th></th></tr></thead><tbody>';
    for (var i = 0; i < r.ds.length; i++) {
      var x = r.ds[i];
      var mucTxt = x.muc
        ? x.muc.map(function (m, k) { return 'TC' + (k + 1) + ' ' + DCL_MUC[m]; }).join(' · ')
        : '<em>chưa chấm</em>';
      h += '<tr><td><strong>' + dclEsc(x.hoTen) + '</strong></td>'
        + '<td>' + mucTxt + '</td>'
        + '<td><strong>' + x.hienThi + '</strong></td>'
        + '<td>' + (x.daKhoa ? '<span class="adm-co x">đã khoá</span>'
                             : '<span class="adm-co o">chưa khoá</span>') + '</td><td>';
      if (admLaGV()) {
        h += '<button class="sm-btn" onclick="admR1Cham(' + i + ')">Sửa</button>'
          + (x.daKhoa ? ' <button class="sm-btn" onclick="admMoKhoaR1(\'' + dclEsc(x.id) + '\')">Mở khoá</button>' : '');
      } else if (!x.daKhoa && R1_QUYEN) {
        h += '<button class="sm-btn pri" onclick="admR1Cham(' + i + ')">Nhập mức</button>'
          + (x.muc ? ' <button class="sm-btn" onclick="admKhoaR1(\'' + dclEsc(x.id) + '\')">Xác nhận &amp; khoá</button>' : '');
      } else if (!x.daKhoa) {
        h += '<span class="xs sub">chờ máy đang giữ quyền</span>';
      }
      h += '</td></tr>';
    }
    box.innerHTML = h + '</tbody></table></div>'
      + (admLaGV() ? '' : '<p class="xs sub" style="margin-top:8px">'
        + 'Khoá rồi thì nhóm không sửa được nữa. Sai sót phải nhờ giáo viên mở khoá.</p>');
  })['catch'](function () { box.innerHTML = '<p class="sm sub">Không kết nối được máy chủ.</p>'; });
}

function admR1Cham(i) {
  R1_VT = i;
  var x = R1_DS[i];
  var box = dclEl('r1-cham');
  box.innerHTML = '<div class="dcl-panel"><div class="kicker">Nhập mức đã thống nhất</div>'
    + '<p class="sm" style="margin:0">Đang chấm cho <strong>' + dclEsc(x.hoTen) + '</strong>. '
    + 'Cả nhóm cùng đọc mô tả bốn mức rồi thống nhất trước khi bấm.</p></div>';
  admMoPhieu(DCL_R1, 'Rubric 1 · ' + x.hoTen, admR1Gui);
  dclEl('adm-phieu').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function admR1Gui(muc) {
  var d = admPV('r1');
  d.idHS = R1_DS[R1_VT].id;
  d.muc = muc;
  d.thietBi = admThietBi();
  if (admLaGV()) d.lyDo = window.prompt('Lí do giáo viên sửa điểm Rubric 1:') || '';
  dclBao(dclEl('ph-msg'), 'wait', 'Đang lưu…');
  admGoi('chamR1', d).then(function (r) {
    if (!r.ok) { dclBao(dclEl('ph-msg'), 'no', r.loi || 'Không lưu được'); return; }
    dclBao(dclEl('ph-msg'), 'ok', 'Đã lưu ' + R1_DS[R1_VT].hoTen + ': ' + r.hienThi + '/10. '
      + (admLaGV() ? '' : 'Nhóm xem lại, thống nhất rồi bấm Xác nhận và khoá.'));
    admR1TaiBang();
  })['catch'](function () { dclBao(dclEl('ph-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

function admKhoaR1(id) {
  if (!window.confirm('Khoá điểm bạn này? Sau khi khoá nhóm không sửa lại được, phải nhờ giáo viên.')) return;
  admGoi('khoaR1', { idHS: id, thietBi: admThietBi() }).then(function (r) {
    dclBao(dclEl('r1-phien'), r.ok ? 'ok' : 'no', r.ok ? 'Đã khoá.' : (r.loi || 'Không khoá được'));
    admR1TaiBang();
  })['catch'](function () {});
}

function admMoKhoaR1(id) {
  var lyDo = window.prompt('Lí do mở khoá điểm Rubric 1:');
  if (!lyDo) return;
  var d = admPV('r1'); d.idHS = id; d.lyDo = lyDo;
  admGoi('moKhoaR1', d).then(function (r) {
    dclBao(dclEl('r1-phien'), r.ok ? 'ok' : 'no',
      r.ok ? 'Đã mở khoá, lí do ghi vào nhật kí thao tác.' : (r.loi || ''));
    admR1TaiBang();
  })['catch'](function () {});
}

/* ===================================================================
   TAB: RUBRIC 2
   =================================================================== */
function admTabR2(t) {
  t.innerHTML = '<div class="dcl-panel"><div class="kicker">Chấm Rubric 2 — sản phẩm</div>'
    + '<p class="sm sub">Mỗi nhóm giữ một phiếu, chấm lại sẽ thay phiếu cũ.</p>'
    + admChonLopNhom('r2', 'admR2Nhom()')
    + '<div id="r2-bai"></div>'
    + '<div class="chk" style="margin-top:8px"><input type="checkbox" id="r2-chan">'
    + '<label for="r2-chan">Áp quy tắc chặn: kết luận sai từ một nửa số hành vi trở lên thì '
    + 'tiêu chí 4 không được quá mức Đạt</label></div>'
    + '<div class="chk"><input type="checkbox" id="r2-khong" onchange="admR2Khong()">'
    + '<label for="r2-khong">Nhóm không nộp sản phẩm — ghi 0 điểm, ngoài thang</label></div>'
    + '<div class="dcl-row" style="margin-top:8px"><div class="dcl-f"><label for="r2-nx">Nhận xét cho nhóm</label>'
    + '<input id="r2-nx" type="text" placeholder="Một hai câu để nhóm biết sửa gì"></div></div>'
    + '<div class="dcl-msg" id="r2-msg"></div></div><div id="adm-phieu"></div>';
  admMoPhieu(DCL_R2, 'Rubric 2', admR2Gui);
}

function admR2Nhom() {
  var box = dclEl('r2-bai'), d = admPV('r2');
  if (!box || !d.nhom) return;
  admGoi('tienDo', { lop: d.lop }).then(function (r) {
    if (!r.ok) return;
    var g = r.ds.filter(function (x) { return x.nhom === d.nhom; })[0];
    if (!g) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="card tint"><div class="kicker">Bài của nhóm</div>'
      + '<p class="sm" style="margin-bottom:8px">' + dclEsc(g.deTai || 'Chưa có đề tài')
      + (g.daNop ? ' · nộp lúc ' + dclEsc(g.nopLuc) + (g.tre ? ' · <strong>trễ hạn</strong>' : '')
                 : ' · <strong>chưa nộp bài</strong>') + '</p>'
      + '<div class="btns" style="margin-top:0">'
      + (g.trinhChieu ? '<a class="btn btn2" target="_blank" rel="noopener" href="' + dclEsc(g.trinhChieu) + '">Mở bài trình chiếu</a>' : '')
      + (g.infographic ? '<a class="btn btn2" target="_blank" rel="noopener" href="' + dclEsc(g.infographic) + '">Mở infographic</a>' : '')
      + '</div></div>';
  })['catch'](function () {});
}
function admR2Khong() {
  var k = dclEl('r2-khong').checked;
  dclEl('adm-phieu').style.display = k ? 'none' : '';
  if (k) {
    var b = dclEl('adm-phieu');
    b.insertAdjacentHTML('beforebegin',
      '<div class="btns" id="r2-nutkhong"><button class="btn" onclick="admR2Gui(null)">Ghi 0 điểm cho nhóm</button></div>');
  } else {
    var n = dclEl('r2-nutkhong'); if (n) n.remove();
  }
}
function admR2Gui(muc) {
  var d = admPV('r2');
  if (!d.lop || !d.nhom) { dclBao(dclEl('r2-msg'), 'no', 'Chọn lớp và nhóm.'); return; }
  d.muc = muc;
  d.chanTC4 = dclEl('r2-chan').checked;
  d.khongNop = dclEl('r2-khong').checked;
  d.nhanXet = dclEl('r2-nx').value;
  dclBao(dclEl('r2-msg'), 'wait', 'Đang lưu…');
  admGoi('chamR2', d).then(function (r) {
    dclBao(dclEl('r2-msg'), r.ok ? 'ok' : 'no', r.ok
      ? ('Đã lưu ' + d.nhom + ': ' + r.hienThi + '/10'
         + (r.ngoaiThang ? ' (ngoài thang, nhóm không nộp)' : '')
         + (r.chan ? ' · đã áp quy tắc chặn ở tiêu chí 4' : ''))
      : (r.loi || 'Không lưu được'));
  })['catch'](function () { dclBao(dclEl('r2-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

/* ===================================================================
   TAB: RUBRIC 3 VÀ ĐỒNG HỒ
   =================================================================== */
var R3_MO = '', R3_MOLUC = null;

function admTabR3(t) {
  if (ADM_HEN) { clearInterval(ADM_HEN); ADM_HEN = null; }
  t.innerHTML = '<div class="dcl-panel"><div class="kicker">Rubric 3 — điều hành và chấm báo cáo</div>'
    + '<p class="sm sub">Mở phiên khi nhóm bắt đầu báo cáo để có đồng hồ 10 phút trình bày và '
    + '4 phút hỏi đáp. Đóng phiên để lấy thời lượng thực tế, dùng cho tiêu chí 2. '
    + 'Học sinh không chấm Rubric 3; các em chỉ xem điểm của nhóm mình ở tab Điểm.</p>'
    + admChonLopNhom('r3', '')
    + '<div class="btns" style="margin-top:0">'
    + '<button class="btn" onclick="admMoPhienR3(true)">Bắt đầu tính giờ</button>'
    + '<button class="btn btn2" onclick="admMoPhienR3(false)">Dừng và lấy thời lượng</button></div>'
    + '<div class="dcl-msg" id="r3-phien"></div>'
    + '<div id="r3-dongho" style="margin-top:12px"></div>'
    + '<div class="chk" style="margin-top:10px"><input type="checkbox" id="r3-khong">'
    + '<label for="r3-khong">Nhóm không báo cáo — ghi 0 điểm, ngoài thang</label></div>'
    + '<div class="dcl-msg" id="r3-msg"></div></div><div id="adm-phieu"></div>';
  admMoPhieu(DCL_R3, 'Rubric 3', admR3Gui);
  admKiemPhien();
  ADM_HEN = setInterval(admKiemPhien, 10000);
}

function admKiemPhien() {
  if (!dclEl('r3-dongho')) { if (ADM_HEN) { clearInterval(ADM_HEN); ADM_HEN = null; } return; }
  if (!admLaGV()) return;
  admGoi('xemPhienR3', { lop: (dclEl('r3-lop') ? dclEl('r3-lop').value : admLopGV()) })
    .then(function (r) {
      if (!r.ok) return;
      R3_MO = r.dangMo || '';
      R3_MOLUC = r.moLuc ? new Date(r.moLuc) : null;
      admVeDongHo();
    })['catch'](function () {});
}

function admVeDongHo() {
  var box = dclEl('r3-dongho');
  if (!box) return;
  if (!R3_MO || !R3_MOLUC) { box.innerHTML = ''; return; }
  var giay = Math.floor((new Date().getTime() - R3_MOLUC.getTime()) / 1000);
  var pha, conLai;
  if (giay < 600) { pha = 'Trình bày'; conLai = 600 - giay; }
  else if (giay < 840) { pha = 'Hỏi đáp'; conLai = 840 - giay; }
  else { pha = 'Đã quá giờ'; conLai = giay - 840; }
  var p = Math.floor(Math.abs(conLai) / 60), s = Math.abs(conLai) % 60;
  box.innerHTML = '<div class="card tint" style="text-align:center">'
    + '<div class="kicker">' + dclEsc(R3_MO) + ' · ' + pha + '</div>'
    + '<div class="adm-dh' + (pha === 'Đã quá giờ' ? ' het' : '') + '">'
    + (pha === 'Đã quá giờ' ? '+' : '') + p + ':' + (s < 10 ? '0' : '') + s + '</div>'
    + '<p class="xs sub" style="margin:6px 0 0">Đã trôi ' + Math.floor(giay / 60) + ' phút '
    + (giay % 60) + ' giây. Quy định 10 phút trình bày và 4 phút hỏi đáp.</p></div>';
}

function admMoPhienR3(mo) {
  var d = admPV('r3');
  if (!d.lop) { dclBao(dclEl('r3-phien'), 'no', 'Chọn lớp.'); return; }
  if (mo && !d.nhom) { dclBao(dclEl('r3-phien'), 'no', 'Chọn nhóm đang báo cáo.'); return; }
  admGoi(mo ? 'moPhienR3' : 'dongPhienR3', d).then(function (r) {
    dclBao(dclEl('r3-phien'), r.ok ? 'ok' : 'no', r.ok
      ? (mo ? ('Đã mở phiên cho ' + d.nhom)
            : ('Đã đóng phiên' + (r.thoiLuongGiay != null
               ? '. Thời lượng thực tế ' + Math.floor(r.thoiLuongGiay / 60) + ' phút '
                 + (r.thoiLuongGiay % 60) + ' giây.' : '')))
      : (r.loi || 'Không đổi được'));
    admKiemPhien();
  })['catch'](function () { dclBao(dclEl('r3-phien'), 'no', 'Không kết nối được máy chủ.'); });
}

function admR3Gui(muc) {
  var pv = admPV('r3');
  if (!pv.lop || !pv.nhom) { dclBao(dclEl('r3-msg'), 'no', 'Chọn lớp và nhóm.'); return; }
  var d = { lop: pv.lop, nhomDuocCham: pv.nhom, muc: muc, khongNop: dclEl('r3-khong').checked };
  dclBao(dclEl('r3-msg'), 'wait', 'Đang lưu…');
  admGoi('chamR3', d).then(function (r) {
    dclBao(dclEl('r3-msg'), r.ok ? 'ok' : 'no',
      r.ok ? ('Đã lưu điểm báo cáo cho ' + pv.nhom + ': ' + r.hienThi + '/10'
              + (r.ngoaiThang ? ' (ngoài thang, nhóm không báo cáo)' : ''))
           : (r.loi || 'Không lưu được'));
  })['catch'](function () { dclBao(dclEl('r3-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

/* ===================================================================
   TAB: TIẾN ĐỘ (giáo viên)
   =================================================================== */
function admTabTienDo(t) {
  t.innerHTML = '<div class="dcl-panel"><div class="kicker">Tiến độ theo lớp</div>'
    + admChonLopNhom('td', 'admTaiTienDo()').replace(
        /<div class="dcl-f" style="flex:0 1 180px">[\s\S]*?<\/select><\/div>/, '')
    + '<div class="btns" style="margin-top:0">'
    + '<button class="btn btn2" onclick="admTaiTienDo()">Làm mới</button>'
    + '<button class="btn btn2" onclick="admDongBoDangKy()">Đồng bộ đăng kí và cấp mã</button>'
    + '<button class="btn btn2" onclick="admDongBo()">Đồng bộ bài nộp</button>'
    + '</div>'
    + '<div class="dcl-msg" id="td-msg"></div>'
    + '<div id="td-ds" style="margin-top:14px"><p class="sm sub">Chọn lớp để xem.</p></div></div>';
  if (admLopGV()) setTimeout(admTaiTienDo, 400);
}

function admTaiTienDo() {
  var box = dclEl('td-ds');
  var lop = dclEl('td-lop') ? dclEl('td-lop').value : '';
  if (!box || !lop) return;
  box.innerHTML = '<p class="sm sub">Đang tải…</p>';
  admGoi('tienDo', { lop: lop }).then(function (r) {
    if (!r.ok) { box.innerHTML = '<p class="sm sub">' + dclEsc(r.loi || '') + '</p>'; return; }
    var h = '<p class="sm"><span class="pill">' + r.soNhom + ' nhóm · trạng thái: '
      + dclEsc(r.trangThai) + '</span> <span class="pill">Báo cáo cần '
      + r.thoiLuong.canPhut + ' phút, đang có ' + r.thoiLuong.coPhut + ' phút — '
      + dclEsc(r.thoiLuong.ghiChu) + '</span></p>'
      + '<div class="wrap"><table class="adm-bang"><thead><tr><th>Nhóm</th><th>Sĩ số</th>'
      + '<th>Mã nhóm</th><th>Đề tài</th><th>Nộp bài</th><th>R1</th><th>R2</th><th>R3</th>'
      + '<th>Thao tác</th></tr></thead><tbody>';
    for (var i = 0; i < r.ds.length; i++) {
      var g = r.ds[i];
      h += '<tr><td><strong>' + dclEsc(g.nhom) + '</strong></td><td>' + g.siSo + '</td>'
        + '<td>' + (g.maNhom
            ? '<code>' + dclEsc(g.maNhom) + '</code><br><button class="sm-btn" style="margin-top:4px" '
              + 'onclick="admCapLaiMa(\'' + dclEsc(g.nhom) + '\')">Cấp lại</button>'
            : '<span class="adm-co o">chưa đăng kí</span>') + '</td>'
        + '<td>' + dclEsc(g.deTai || '<em>chưa gán</em>')
        + '<br><button class="sm-btn" style="margin-top:4px" onclick="admDatDeTai(\'' + dclEsc(g.nhom)
        + '\')">Gán đề tài</button></td>'
        + '<td>' + (g.daNop
            ? (g.tre ? '<span class="adm-co c">trễ</span> ' : '<span class="adm-co x">đúng hạn</span> ') + dclEsc(g.nopLuc)
            : '<span class="adm-co o">chưa nộp</span>') + '</td>'
        + '<td>' + g.r1DaKhoa + '/' + g.siSo + ' đã khoá'
        + (g.r1HoanTat ? '<br><span class="adm-co x">xong</span>' : '') + '</td>'
        + '<td>' + (g.daChamR2 ? '<span class="adm-co x">đã chấm</span>' : '<span class="adm-co o">chưa</span>') + '</td>'
        + '<td>' + (g.coPhieuR3GV ? 'đã chấm' : 'chưa chấm') + '<br><span class="adm-co '
        + (g.r3TrangThai === 'Chính thức' ? 'x' : 'c') + '">' + dclEsc(g.r3TrangThai) + '</span></td>'
        + '<td><button class="sm-btn pri" onclick="admMoNhanh(\'' + dclEsc(g.nhom)
        + '\')">Mở phiên</button><br>'
        + '<button class="sm-btn" style="margin-top:4px" onclick="admDuyetTB(\'' + dclEsc(g.nhom)
        + '\',true)">Cho trưng bày</button></td></tr>';
    }
    box.innerHTML = h + '</tbody></table></div>';
  })['catch'](function () { box.innerHTML = '<p class="sm sub">Không kết nối được máy chủ.</p>'; });
}

/** Giáo viên quay số tại lớp rồi gán đề tài cho nhóm bằng nút này. */
function admDatDeTai(nhom) {
  var so = window.prompt('Nhóm ' + nhom + ' nhận đề tài số mấy? Nhập 1 đến 5:');
  if (!so) return;
  admGoi('datDeTai', { lop: dclEl('td-lop').value, nhom: nhom, soDeTai: so }).then(function (r) {
    dclBao(dclEl('td-msg'), r.ok ? 'ok' : 'no',
      r.ok ? ('Đã gán cho ' + nhom + ': ' + r.deTai) : (r.loi || 'Không gán được'));
    admTaiTienDo();
  })['catch'](function () { dclBao(dclEl('td-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

function admMoNhanh(nhom) {
  admGoi('moPhienR3', { lop: dclEl('td-lop').value, nhom: nhom }).then(function (r) {
    dclBao(dclEl('td-msg'), r.ok ? 'ok' : 'no',
      r.ok ? ('Đã mở phiên chấm cho ' + nhom + '. Sang tab Điều hành báo cáo để xem đồng hồ.')
           : (r.loi || 'Không mở được'));
  })['catch'](function () {});
}
function admDuyetTB(nhom, bat) {
  admGoi('datCoTrungBay', { lop: dclEl('td-lop').value, nhom: nhom, bat: bat }).then(function (r) {
    dclBao(dclEl('td-msg'), r.ok ? 'ok' : 'no',
      r.ok ? ('Đã bật trưng bày cho ' + nhom) : (r.loi || 'Không đổi được'));
  })['catch'](function () {});
}
function admDongBoDangKy() {
  dclBao(dclEl('td-msg'), 'wait', 'Đang đọc biểu mẫu đăng kí…');
  admGoi('dongBoDangKy', {}).then(function (r) {
    if (!r.ok) { dclBao(dclEl('td-msg'), 'no', r.loi || 'Không đồng bộ được'); return; }
    var tin = 'Đã đọc ' + r.tong + ' lượt đăng kí, sinh thêm ' + r.moi + ' mã nhóm, '
      + 'ghép được ' + r.ghep + ' học sinh vào nhóm theo đúng khai báo.';
    if (r.chuaKhop && r.chuaKhop.length)
      tin += ' Còn ' + r.chuaKhop.length + ' tên chưa ghép được: '
        + r.chuaKhop.slice(0, 8).join('; ')
        + (r.chuaKhop.length > 8 ? '…' : '') + '. Sửa lại tên trong biểu mẫu hoặc trong DanhSachHS rồi đồng bộ lại.';
    dclBao(dclEl('td-msg'), (r.chuaKhop && r.chuaKhop.length) ? 'wait' : 'ok', tin);
    admTaiTienDo();
  })['catch'](function () { dclBao(dclEl('td-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

function admCapLaiMa(nhom) {
  var lyDo = window.prompt('Lí do cấp lại mã cho ' + nhom + ' (ví dụ: mã bị lộ):');
  if (!lyDo) return;
  admGoi('capLaiMaNhom', { lop: dclEl('td-lop').value, nhom: nhom, lyDo: lyDo }).then(function (r) {
    dclBao(dclEl('td-msg'), r.ok ? 'ok' : 'no',
      r.ok ? ('Mã mới của ' + nhom + ' là ' + r.ma + '. Mã cũ và mọi phiên đang mở đã mất hiệu lực.')
           : (r.loi || 'Không cấp lại được'));
    admTaiTienDo();
  })['catch'](function () {});
}

function admDongBo() {
  dclBao(dclEl('td-msg'), 'wait', 'Đang đồng bộ bài nộp…');
  admGoi('dongBoNopBai', {}).then(function (r) {
    dclBao(dclEl('td-msg'), r.ok ? 'ok' : 'no', r.ok
      ? ('Đã đọc ' + r.tong + ' lượt nộp, ' + r.chuaGhep + ' lượt chưa ghép được vào nhóm.')
      : (r.loi || 'Không đồng bộ được'));
    admTaiTienDo();
  })['catch'](function () { dclBao(dclEl('td-msg'), 'no', 'Không kết nối được máy chủ.'); });
}
/* ===================================================================
   TAB: TỔNG HỢP
   =================================================================== */
function admTabTongHop(t) {
  t.innerHTML = '<div class="dcl-panel"><div class="kicker">Tổng hợp điểm dự án</div>'
    + '<p class="sm sub">Điểm dự án = 0,1 × Rubric 1 + 0,6 × Rubric 2 + 0,3 × Rubric 3. '
    + 'Rubric 3 của nhóm = 0,7 × phiếu giáo viên + 0,3 × trung bình phiếu các nhóm bạn. '
    + 'Chỉ dòng có Rubric 3 ở trạng thái Chính thức mới được công bố.</p>'
    + (admLaGV()
      ? admChonLopNhom('th', 'admTaiTongHop()').replace(
          /<div class="dcl-f" style="flex:0 1 180px">[\s\S]*?<\/select><\/div>/, '')
        + '<div class="btns" style="margin-top:0">'
        + '<button class="btn btn2" onclick="admTaiTongHop()">Làm mới</button>'
        + '<button class="btn btn2" onclick="admXuatCSV()">Xuất CSV</button>'
        + '<button class="btn btn2" onclick="admDoiTrangThai(\'Đã chốt\')">Chốt điểm lớp</button>'
        + '<button class="btn btn2" onclick="admDoiTrangThai(\'Đã công bố\')">Công bố</button>'
        + '<button class="btn btn2" onclick="admDoiTrangThai(\'Đang chấm\')">Mở lại</button></div>'
      : '')
    + '<div class="dcl-msg" id="th-msg"></div>'
    + '<div id="th-ds" style="margin-top:14px"><p class="sm sub">Đang tải…</p></div></div>';
  setTimeout(admTaiTongHop, admLaGV() ? 400 : 0);
}

function admTaiTongHop() {
  var box = dclEl('th-ds');
  if (!box) return;
  var d = {};
  if (admLaGV()) {
    var l = dclEl('th-lop');
    if (!l || !l.value) { box.innerHTML = '<p class="sm sub">Chọn lớp để xem.</p>'; return; }
    d.lop = l.value;
  }
  box.innerHTML = '<p class="sm sub">Đang tải…</p>';
  admGoi('tongHop', d).then(function (r) {
    if (!r.ok) { box.innerHTML = '<p class="sm sub">' + dclEsc(r.loi || '') + '</p>'; return; }
    if (!r.ds.length) { box.innerHTML = '<p class="sm sub">Chưa có dữ liệu.</p>'; return; }
    var h = '<p class="sm"><span class="pill">Lớp ' + dclEsc(r.lop) + ' · '
      + dclEsc(r.trangThai) + '</span></p>'
      + '<div class="wrap"><table class="adm-bang"><thead><tr><th>Nhóm</th><th>Họ tên</th>'
      + '<th>R1</th><th>R2</th><th>R3</th><th>Điểm dự án</th><th>Ghi chú</th></tr></thead><tbody>';
    for (var i = 0; i < r.ds.length; i++) {
      var x = r.ds[i], gc = [];
      gc.push(x.r1DaKhoa ? '<span class="adm-co x">R1 đã khoá</span>'
                         : '<span class="adm-co o">R1 chưa khoá</span>');
      if (x.nguoiNhapR1) gc.push(dclEsc(x.nguoiNhapR1));
      if (x.phatTre) gc.push('<span class="adm-co c">hạ 1 mức: ' + dclEsc(x.lyDoPhatTre) + '</span>');
      if (x.r2NgoaiThang || x.r3NgoaiThang) gc.push('<span class="adm-co c">ngoài thang</span>');
      h += '<tr><td>' + dclEsc(x.nhom) + '</td><td>' + dclEsc(x.hoTen) + '</td>'
        + '<td>' + x.r1HienThi + '</td><td>' + x.r2HienThi + '</td>'
        + '<td>' + x.r3HienThi + '<br><span class="adm-co '
        + (x.r3TrangThai === 'Chính thức' ? 'x' : 'c') + '">' + dclEsc(x.r3TrangThai) + '</span></td>'
        + '<td><strong>' + x.duAnHienThi + '</strong></td>'
        + '<td>' + gc.join('<br>') + '</td></tr>';
    }
    box.innerHTML = h + '</tbody></table></div>';
  })['catch'](function () { box.innerHTML = '<p class="sm sub">Không kết nối được máy chủ.</p>'; });
}

function admDoiTrangThai(tt) {
  var lop = dclEl('th-lop').value;
  if (!lop) { dclBao(dclEl('th-msg'), 'no', 'Chọn lớp.'); return; }
  admGoi('datTrangThaiLop', { lop: lop, trangThai: tt }).then(function (r) {
    if (r.ok) { dclBao(dclEl('th-msg'), 'ok', 'Lớp ' + lop + ' chuyển sang "' + tt + '".'); admTaiTongHop(); return; }
    if (r.canhBao) {
      var lyDo = window.prompt(r.loi + '\n\nNhập lí do để vẫn chuyển trạng thái:');
      if (!lyDo) { dclBao(dclEl('th-msg'), 'no', 'Đã huỷ.'); return; }
      admGoi('datTrangThaiLop', { lop: lop, trangThai: tt, boQuaCanhBao: true, lyDo: lyDo })
        .then(function (r2) {
          dclBao(dclEl('th-msg'), r2.ok ? 'ok' : 'no',
            r2.ok ? ('Đã chuyển sang "' + tt + '", lí do đã ghi vào nhật kí.') : (r2.loi || ''));
          admTaiTongHop();
        });
      return;
    }
    dclBao(dclEl('th-msg'), 'no', r.loi || 'Không đổi được');
  })['catch'](function () { dclBao(dclEl('th-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

function admXuatCSV() {
  var lop = dclEl('th-lop').value;
  if (!lop) { dclBao(dclEl('th-msg'), 'no', 'Chọn lớp.'); return; }
  admGoi('xuatCSV', { lop: lop }).then(function (r) {
    if (!r.ok) { dclBao(dclEl('th-msg'), 'no', r.loi || ''); return; }
    var blob = new Blob(['\ufeff' + r.csv], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'DiemDuAn_' + lop + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    dclBao(dclEl('th-msg'), 'ok', 'Đã tải tệp CSV.');
  })['catch'](function () { dclBao(dclEl('th-msg'), 'no', 'Không kết nối được máy chủ.'); });
}

/* ---------- điều phối tab ---------- */
function admVeTab() {
  var t = dclEl('adm-tab');
  if (!t) return;
  if (ADM_HEN && ADM_TAB !== 'r3') { clearInterval(ADM_HEN); ADM_HEN = null; }
  if (ADM_TAB === 'nk') return admTabNhatKy(t);
  if (ADM_TAB === 'r1') return admTabR1(t);
  if (ADM_TAB === 'r2') return admTabR2(t);
  if (ADM_TAB === 'r3') return admTabR3(t);
  if (ADM_TAB === 'td') return admTabTienDo(t);
  if (ADM_TAB === 'th') return admTabTongHop(t);
}

(function () {
  function start() { setTimeout(admKhoiTao, 80); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
