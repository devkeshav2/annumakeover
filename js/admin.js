/* AnnuMakeover – Admin Functionality */

// Guard: redirect to login if not authenticated
function requireAdmin() {
  if (!AM.isAdminAuth()) {
    window.location.href = 'admin-login.html';
  }
}

// Logout
function adminLogout() {
  AM.adminLogout();
  window.location.href = 'admin-login.html';
}

/* ===== SERVICES PAGE ===== */
function initAdminServices() {
  requireAdmin();
  renderServicesTable();
  bindServiceModal();
  updateStats();
}

function updateStats() {
  var services = AM.getServices();
  var feedback = AM.getFeedback();
  var el = function (id) { return document.getElementById(id); };
  if (el('statTotal'))    el('statTotal').textContent    = services.length;
  if (el('statActive'))   el('statActive').textContent   = services.filter(function (s) { return s.active; }).length;
  if (el('statFeedback')) el('statFeedback').textContent = feedback.length;
}

function renderServicesTable() {
  var tbody = document.getElementById('servicesBody');
  if (!tbody) return;
  var services = AM.getServices();
  if (!services.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-light)">No services yet. Add one!</td></tr>';
    return;
  }
  tbody.innerHTML = services.map(function (s) {
    var cat = AM.CATEGORIES[s.category] || { label: s.category, icon: '✨' };
    return '<tr>' +
      '<td><span style="margin-right:6px">' + cat.icon + '</span>' + escHtml(s.name) + '</td>' +
      '<td><span style="font-size:0.75rem;color:var(--text-light)">' + cat.label + '</span></td>' +
      '<td style="font-family:var(--font-heading);font-weight:700;color:var(--primary)">₹' + Number(s.price).toLocaleString('en-IN') + '</td>' +
      '<td><span class="badge ' + (s.active ? 'badge-active' : 'badge-inactive') + '">' + (s.active ? '● Active' : '● Inactive') + '</span></td>' +
      '<td style="display:flex;gap:6px;align-items:center">' +
        '<button class="action-btn action-edit" onclick="openEditModal(' + s.id + ')">Edit</button>' +
        '<button class="action-btn action-delete" onclick="deleteService(' + s.id + ')">Delete</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function bindServiceModal() {
  var overlay = document.getElementById('serviceModal');
  var form    = document.getElementById('serviceForm');
  if (!overlay || !form) return;

  // Close
  overlay.querySelectorAll('.modal-close, [data-dismiss]').forEach(function (el) {
    el.addEventListener('click', closeServiceModal);
  });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeServiceModal(); });

  // Submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var id    = parseInt(document.getElementById('svcId').value) || 0;
    var data  = {
      name:        document.getElementById('svcName').value.trim(),
      category:    document.getElementById('svcCat').value,
      price:       parseInt(document.getElementById('svcPrice').value) || 0,
      description: document.getElementById('svcDesc').value.trim(),
      active:      document.getElementById('svcActive').checked,
    };
    if (!data.name || !data.price) { showToast('Name and price are required.', 'error'); return; }
    if (id) {
      AM.updateService(id, data);
      showToast('Service updated!');
    } else {
      AM.addService(data);
      showToast('Service added!');
    }
    closeServiceModal();
    renderServicesTable();
    updateStats();
  });
}

function openAddModal() {
  var form = document.getElementById('serviceForm');
  if (form) form.reset();
  var idEl = document.getElementById('svcId');
  if (idEl) idEl.value = '';
  var titleEl = document.getElementById('modalTitle');
  if (titleEl) titleEl.textContent = 'Add New Service';
  var activeEl = document.getElementById('svcActive');
  if (activeEl) activeEl.checked = true;
  var overlay = document.getElementById('serviceModal');
  if (overlay) overlay.classList.add('active');
}

function openEditModal(id) {
  var s = AM.getServices().find(function (s) { return s.id === id; });
  if (!s) return;
  document.getElementById('svcId').value    = s.id;
  document.getElementById('svcName').value  = s.name;
  document.getElementById('svcCat').value   = s.category;
  document.getElementById('svcPrice').value = s.price;
  document.getElementById('svcDesc').value  = s.description || '';
  document.getElementById('svcActive').checked = s.active;
  var titleEl = document.getElementById('modalTitle');
  if (titleEl) titleEl.textContent = 'Edit Service';
  document.getElementById('serviceModal').classList.add('active');
}

function closeServiceModal() {
  var overlay = document.getElementById('serviceModal');
  if (overlay) overlay.classList.remove('active');
}

function deleteService(id) {
  if (!confirm('Delete this service? This cannot be undone.')) return;
  AM.deleteService(id);
  renderServicesTable();
  updateStats();
  showToast('Service deleted.');
}

/* ===== FEEDBACK PAGE ===== */
function initAdminFeedback() {
  requireAdmin();
  renderFeedbackList();
  updateStats();
}

function renderFeedbackList() {
  var container = document.getElementById('feedbackList');
  if (!container) return;
  var list = AM.getFeedback();
  if (!list.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💬</div><h3>No feedback yet</h3><p>Customer feedback will appear here.</p></div>';
    return;
  }
  container.innerHTML = list.map(function (f) {
    var stars = '★'.repeat(f.rating || 5) + '☆'.repeat(5 - (f.rating || 5));
    return '<div class="feedback-item" data-id="' + f.id + '">' +
      '<div class="feedback-header">' +
        '<div>' +
          '<div class="feedback-author">' + escHtml(f.name) + '</div>' +
          '<div class="feedback-meta">📞 ' + escHtml(f.phone || '—') + ' · 📅 ' + AM.formatDate(f.date) + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<span style="color:var(--gold);font-size:0.85rem">' + stars + '</span>' +
          '<span class="badge ' + (f.adminReply ? 'badge-replied' : 'badge-new') + '">' + (f.adminReply ? 'Replied' : 'New') + '</span>' +
        '</div>' +
      '</div>' +
      '<span class="feedback-tag">' + (f.service ? escHtml(f.service) : 'General') + '</span>' +
      '<p class="feedback-text">' + escHtml(f.message) + '</p>' +
      (f.adminReply ? '<div class="admin-reply-box"><div class="admin-reply-label">Admin Reply</div><div class="admin-reply-text">' + escHtml(f.adminReply) + '</div></div>' : '') +
      '<div class="feedback-actions">' +
        '<button class="action-btn action-reply" onclick="openReplyModal(' + f.id + ')">' + (f.adminReply ? 'Edit Reply' : 'Reply') + '</button>' +
        '<button class="action-btn action-delete" onclick="deleteFeedback(' + f.id + ')">Delete</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openReplyModal(id) {
  var f = AM.getFeedback().find(function (x) { return x.id === id; });
  if (!f) return;
  document.getElementById('replyId').value   = id;
  document.getElementById('replyText').value = f.adminReply || '';
  document.getElementById('replyModal').classList.add('active');
}

function closeReplyModal() {
  var overlay = document.getElementById('replyModal');
  if (overlay) overlay.classList.remove('active');
}

function submitReply() {
  var id   = parseInt(document.getElementById('replyId').value);
  var text = document.getElementById('replyText').value.trim();
  if (!text) { showToast('Reply cannot be empty.', 'error'); return; }
  AM.replyFeedback(id, text);
  closeReplyModal();
  renderFeedbackList();
  updateStats();
  showToast('Reply saved!');
}

function deleteFeedback(id) {
  if (!confirm('Delete this feedback entry?')) return;
  AM.deleteFeedback(id);
  renderFeedbackList();
  updateStats();
  showToast('Feedback deleted.');
}

/* ===== LOGIN PAGE ===== */
function initAdminLogin() {
  if (AM.isAdminAuth()) {
    window.location.href = 'admin-services.html';
    return;
  }
  var form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var pin = document.getElementById('adminPin').value;
    if (AM.adminLogin(pin)) {
      window.location.href = 'admin-services.html';
    } else {
      var err = document.getElementById('loginError');
      if (err) { err.textContent = 'Incorrect PIN. Please try again.'; err.classList.add('show'); }
    }
  });
}

/* ===== UTILS ===== */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function showToast(msg, type) {
  type = type || 'success';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = (type === 'success' ? '✓ ' : '✕ ') + msg;
  container.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3500);
}
