/* =====================================================================
   DIGITAL CITIZEN LAB — LỚP NỐI VỚI GOOGLE SHEETS
   Nạp sau dcl-config.js.

   Tệp này tự chèn thêm vào trang, không đụng tới phần game:
     1. Ô điểm danh Họ tên + Lớp ở mục 2, tra sổ để mở khoá theo tên.
     2. Gửi điểm mỗi lượt chơi về Google Sheets.
     3. Nhúng hai biểu mẫu Google thật ở mục 5 và mục 8.
     4. Bảng đề tài đã có nhóm nhận, lọc theo lớp.
     5. Trang Trưng bày đọc trực tiếp từ phiếu nộp bài.
   ===================================================================== */

(function () {
  var css = document.createElement('style');
  css.textContent =
    '.dcl-panel{border:1px solid var(--line);border-radius:10px;padding:16px 18px;' +
    'margin-bottom:16px;background:#fff;box-shadow:0 1px 2px rgba(23,33,43,.04)}' +
    '.dcl-row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:10px}' +
    '.dcl-f{display:flex;flex-direction:column;gap:4px;flex:1 1 190px;min-width:155px}' +
    '.dcl-f label{font-size:12.5px;font-weight:600;color:var(--sub)}' +
    '.dcl-f input,.dcl-f select{border:1px solid var(--line2);border-radius:6px;' +
    'padding:9px 11px;font:inherit;font-size:14px;background:#fff;color:var(--ink);width:100%;min-height:42px}' +
    '.dcl-msg{font-size:13px;font-weight:600;margin-top:10px;display:none;padding:10px 13px;border-radius:7px}' +
    '.dcl-msg.show{display:block}' +
    '.dcl-msg.ok{background:var(--okbg);color:var(--ok);border:1px solid #b4ddc3}' +
    '.dcl-msg.no{background:var(--nobg);color:var(--no);border:1px solid #efc3bf}' +
    '.dcl-msg.wait{background:var(--tint);color:var(--pri-d);border:1px solid #c9dcef}' +
    '.dcl-form-frame{border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-top:12px}' +
    '.dcl-form-frame iframe{display:block;width:100%;border:0;background:#fff}' +
    '.dcl-slot{display:flex;justify-content:space-between;align-items:center;gap:10px;' +
    'flex-wrap:wrap;border:1px solid var(--line);border-radius:8px;padding:10px 13px;margin-bottom:8px}' +
    '.dcl-slot.taken{background:var(--tint2);color:var(--sub)}' +
    '.dcl-tag{font-size:11.5px;font-weight:700;border-radius:999px;padding:3px 10px;' +
    'background:var(--okbg);color:var(--ok);border:1px solid #b4ddc3}' +
    '.dcl-tag.no{background:#f1f3f6;color:var(--sub);border-color:var(--line2)}' +
    '.dcl-card{border:1px solid var(--line);border-radius:10px;padding:15px 17px;' +
    'margin-bottom:12px;background:#fff;box-shadow:0 1px 2px rgba(23,33,43,.04)}' +
    '.dcl-card h4{font-size:16.5px;margin-bottom:3px}';
  document.head.appendChild(css);
})();

/* ---------- Gọi API ---------- */
function dclSan() {
  return typeof DCL_API !== 'undefined' && DCL_API.url
    && DCL_API.url.indexOf('http') === 0
    && DCL_API.url.indexOf('DAN_MA_TRIEN_KHAI') === -1;
}
function dclGoi(action, data) {
  if (!dclSan()) return Promise.reject(new Error('Chưa cấu hình DCL_API.url'));
  // Body là chuỗi thuần, KHÔNG đặt Content-Type: application/json.
  // Apps Script không xử lí được preflight CORS; đặt header JSON sẽ làm hỏng request.
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
function dclEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
  });
}
function dclFormSrc(url) {
  if (!url || url.indexOf('http') !== 0) return '';
  return url + (url.indexOf('?') > -1 ? '&' : '?') + 'embedded=true';
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
function dclLopSelect(sel, chon, nhanTatCa) {
  if (!sel) return;
  var h = '<option value="">' + (nhanTatCa || '— Chọn lớp —') + '</option>';
  for (var i = 0; i < DCL_API.lop.length; i++) {
    var l = DCL_API.lop[i];
    h += '<option value="' + l + '"' + (l === chon ? ' selected' : '') + '>' + l + '</option>';
  }
  sel.innerHTML = h;
}

function dclBangDanhTinh() {
  var sec = document.querySelector('#p-ontap .sec');
  if (!sec) return;
  var box = document.createElement('div');
  box.className = 'dcl-panel';
  box.innerHTML =
    '<div class="kicker">Bước 1 · điểm danh trước khi vào phòng Lab</div>' +
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

  dclLopSelect(document.getElementById('dcl-lop'), DCL_ME.lop);
  document.getElementById('dcl-hoten').value = DCL_ME.hoTen || '';
}

function dclVaoLab() {
  var msg = document.getElementById('dcl-me-msg');
  var ten = document.getElementById('dcl-hoten').value.trim();
  var lop = document.getElementById('dcl-lop').value;
  if (!ten || !lop) { dclBao(msg, 'no', 'Nhập đủ họ tên và chọn lớp.'); return; }

  DCL_ME.hoTen = ten; DCL_ME.lop = lop; dclLuuMe();

  var oDK = document.getElementById('dk-lop');
  if (oDK) { oDK.value = lop; dclTaiDeTai(); }
  var oTB = document.getElementById('tb-lop');
  if (oTB) { oTB.value = lop; dclTaiTrungBay(); }

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
      var g = document.getElementById('gate'); if (g) g.classList.remove('show');
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
      hoTen: DCL_ME.hoTen, lop: DCL_ME.lop, diem: qScore,
      xp: (typeof gXP !== 'undefined' ? gXP : 0),
      chuoi: (typeof gBestStreak !== 'undefined' ? gBestStreak : 0)
    })['catch'](function () {});
  };
}

/* ---------- Mục 5: tình trạng đề tài + biểu mẫu đăng kí ---------- */
function dclKhoiDangKy() {
  var khung = document.querySelector('#p-topics .form-wrap');
  if (!khung) return;
  var box = document.createElement('div');
  box.innerHTML =
    '<div class="dcl-panel">' +
      '<div class="kicker">Đề tài đã có nhóm nhận</div>' +
      '<p class="sm sub" style="margin-bottom:10px">Đề tài được giao bằng <strong>bốc thăm</strong> tại lớp; biểu mẫu bên dưới chỉ để xác nhận kết quả. Bảng này giúp nhóm kiểm lại mình có gõ nhầm đề tài của nhóm khác không.</p>' +
      '<div class="dcl-row">' +
        '<div class="dcl-f" style="flex:0 1 170px"><label for="dk-lop">Xem theo lớp</label>' +
          '<select id="dk-lop" onchange="dclTaiDeTai()"></select></div>' +
        '<div class="dcl-f" style="flex:0 0 auto">' +
          '<button class="btn btn2" onclick="dclTaiDeTai()">Làm mới</button></div>' +
      '</div>' +
      '<div id="dk-slots"><p class="sm sub" style="margin:0">Chọn lớp để xem.</p></div>' +
    '</div>' +
    '<div class="dcl-form-frame">' +
      '<div class="form-head">Phiếu xác nhận đề tài · hạn ' + dclEsc(CONFIG.hanDangKy) + '</div>' +
      '<div id="dk-frame"></div>' +
    '</div>' +
    '<p class="xs sub" style="margin-top:8px">Nếu biểu mẫu không hiện, ' +
      '<a target="_blank" rel="noopener" href="' + dclEsc(CONFIG.formDangKy || '#') + '">mở trong tab mới</a>.</p>';

  khung.parentNode.replaceChild(box, khung);
  dclLopSelect(document.getElementById('dk-lop'), DCL_ME.lop);

  var src = dclFormSrc(CONFIG.formDangKy);
  document.getElementById('dk-frame').innerHTML = src
    ? '<iframe src="' + dclEsc(src) + '" height="900" loading="lazy" title="Phiếu đăng kí đề tài"></iframe>'
    : '<div class="form-body"><p class="sm sub" style="margin:0">Giáo viên chưa dán link biểu mẫu đăng kí.</p></div>';

  if (DCL_ME.lop) dclTaiDeTai();
}

function dclTaiDeTai() {
  var sel = document.getElementById('dk-lop');
  var box = document.getElementById('dk-slots');
  if (!sel || !box) return;
  var lop = sel.value;
  if (!lop) { box.innerHTML = '<p class="sm sub" style="margin:0">Chọn lớp để xem.</p>'; return; }
  if (!dclSan()) { box.innerHTML = '<p class="sm sub" style="margin:0">Chưa bật kết nối Google Sheets nên không tra được.</p>'; return; }

  box.innerHTML = '<p class="sm sub" style="margin:0">Đang tra lớp ' + dclEsc(lop) + '…</p>';
  dclGoi('dsDeTai', { lop: lop }).then(function (r) {
    if (!r.ok) { box.innerHTML = '<p class="sm sub" style="margin:0">Không tải được: ' + dclEsc(r.loi || '') + '</p>'; return; }
    var daNhan = r.daNhan || {}, h = '', con = 0;
    for (var i = 0; i < TOPICS.length; i++) {
      var t = TOPICS[i], nhom = daNhan['DT' + t.no];
      if (!nhom) con++;
      h += '<div class="dcl-slot' + (nhom ? ' taken' : '') + '">' +
           '<span class="sm"><strong>Đề tài ' + t.no + '</strong> — ' + dclEsc(t.name) + '</span>' +
           '<span class="dcl-tag' + (nhom ? ' no' : '') + '">' +
           (nhom ? 'đã có ' + dclEsc(nhom) : 'còn trống') + '</span></div>';
    }
    h += '<p class="xs sub" style="margin:8px 0 0">Lớp ' + dclEsc(lop) + ' còn ' + con + '/5 đề tài trống. Bảng cập nhật sau mỗi lần có nhóm gửi phiếu.</p>';
    box.innerHTML = h;
  })['catch'](function () {
    box.innerHTML = '<p class="sm sub" style="margin:0">Không kết nối được máy chủ.</p>';
  });
}

/* ---------- Mục 8: biểu mẫu nộp bài ---------- */
function dclKhoiNopBai() {
  var khung = document.querySelector('#p-submit .form-wrap');
  if (!khung) return;
  var src = dclFormSrc(CONFIG.formNop);
  var box = document.createElement('div');
  box.innerHTML =
    '<div class="dcl-form-frame">' +
      '<div class="form-head">Phiếu nộp sản phẩm · hạn ' + dclEsc(CONFIG.hanNop) + '</div>' +
      (src
        ? '<iframe src="' + dclEsc(src) + '" height="1100" loading="lazy" title="Phiếu nộp sản phẩm"></iframe>'
        : '<div class="form-body"><p class="sm sub" style="margin:0">Giáo viên chưa dán link biểu mẫu nộp bài.</p></div>') +
    '</div>' +
    '<p class="xs sub" style="margin-top:8px">Biểu mẫu yêu cầu đăng nhập Google để tải tệp lên. Nếu không hiện, ' +
      '<a target="_blank" rel="noopener" href="' + dclEsc(CONFIG.formNop || '#') + '">mở trong tab mới</a>. ' +
      'Nhóm nộp lại được, giáo viên lấy bản cuối cùng.</p>';
  khung.parentNode.replaceChild(box, khung);
}

/* ---------- Mục 9: trưng bày sản phẩm ---------- */
function dclKhoiTrungBay() {
  var ctrl = document.getElementById('gallery-controls');
  if (!ctrl) return;
  ctrl.innerHTML =
    '<div class="dcl-row" style="margin-bottom:14px">' +
      '<div class="dcl-f" style="flex:0 1 180px"><label for="tb-lop">Xem sản phẩm của lớp</label>' +
        '<select id="tb-lop" onchange="dclTaiTrungBay()"></select></div>' +
      '<div class="dcl-f" style="flex:0 0 auto">' +
        '<button class="btn btn2" onclick="dclTaiTrungBay()">Làm mới</button></div>' +
    '</div>';
  dclLopSelect(document.getElementById('tb-lop'), DCL_ME.lop, '— Tất cả các lớp —');
  dclTaiTrungBay();
}

function dclTaiTrungBay() {
  var box = document.getElementById('gallery');
  if (!box) return;
  if (!dclSan()) {
    box.innerHTML = '<p class="sm sub">Chưa bật kết nối Google Sheets nên chưa đọc được danh sách nộp bài.</p>';
    return;
  }
  var sel = document.getElementById('tb-lop');
  var lop = sel ? sel.value : '';
  box.innerHTML = '<p class="sm sub">Đang tải danh sách sản phẩm…</p>';

  dclGoi('dsSanPham', { lop: lop }).then(function (r) {
    if (!r.ok) { box.innerHTML = '<p class="sm sub">Không tải được: ' + dclEsc(r.loi || '') + '</p>'; return; }
    var ds = r.ds || [];
    if (!ds.length) {
      box.innerHTML = '<p class="sm sub">Chưa có nhóm nào nộp bài' + (lop ? ' ở lớp ' + dclEsc(lop) : '') + '.</p>';
      return;
    }
    var h = '<p class="sm sub">' + ds.length + ' nhóm đã nộp.</p>';
    for (var i = 0; i < ds.length; i++) {
      var g = ds[i];
      h += '<div class="dcl-card">' +
           '<div class="kicker">' + dclEsc(g.lop) + (g.nhom ? ' · ' + dclEsc(g.nhom) : '') + '</div>' +
           '<h4>' + dclEsc(g.deTai || 'Chưa ghi tên đề tài') + '</h4>' +
           (g.nopLuc ? '<p class="xs sub" style="margin-bottom:10px">Nộp lúc ' + dclEsc(g.nopLuc) + '</p>' : '') +
           '<div class="btns" style="margin-top:4px">' +
           (g.trinhChieu ? '<a class="btn btn2" target="_blank" rel="noopener" href="' + dclEsc(g.trinhChieu) + '">Bài trình chiếu</a>' : '') +
           (g.infographic ? '<a class="btn btn2" target="_blank" rel="noopener" href="' + dclEsc(g.infographic) + '">Infographic</a>' : '') +
           ((!g.trinhChieu && !g.infographic) ? '<span class="sm sub">Chưa có tệp đính kèm</span>' : '') +
           '</div></div>';
    }
    box.innerHTML = h;
  })['catch'](function () {
    box.innerHTML = '<p class="sm sub">Không kết nối được máy chủ.</p>';
  });
}

/* ---------- Khởi động ---------- */
(function () {
  function khoiDong() {
    dclDocMe();
    dclBangDanhTinh();
    dclBocQNext();
    dclKhoiDangKy();
    dclKhoiNopBai();
    dclKhoiTrungBay();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(khoiDong, 0); });
  } else {
    setTimeout(khoiDong, 0);
  }
})();
