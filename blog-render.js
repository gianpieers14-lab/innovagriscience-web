(function () {
  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var BPOSTS = [];

  function mdToHtml(s) {
    if (!s) return '';
    if (window.marked && window.marked.parse) { try { return window.marked.parse(s); } catch (e) {} }
    return '<p>' + esc(s).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
  }

  function render(d) {
    var nav = document.getElementById('nav-blog');
    var show = !!(d && d.mostrar);
    if (nav) nav.style.display = show ? '' : 'none';
    if (!show) {
      var pb = document.getElementById('page-blog');
      if (pb && pb.classList.contains('active') && typeof window.showPage === 'function') window.showPage('home');
      return;
    }
    var t = document.getElementById('blog-title'); if (t && d.titulo_seccion) t.textContent = d.titulo_seccion;
    var eb = document.getElementById('blog-eyebrow'); if (eb && d.titulo_seccion) eb.textContent = d.titulo_seccion;
    var intro = document.getElementById('blog-intro'); if (intro && d.intro) intro.textContent = d.intro;

    BPOSTS = d.posts || [];
    var root = document.getElementById('blog-render'); if (!root) return;
    root.innerHTML = '';
    var grid = document.createElement('div'); grid.className = 'blog-grid';
    BPOSTS.forEach(function (post, i) {
      var card = document.createElement('article'); card.className = 'blog-card';
      var img = post.imagen ? '<div class="blog-img" style="background-image:url(\'' + esc(post.imagen) + '\')"></div>' : '';
      var hasMore = post.contenido || post.pdf;
      card.innerHTML = img + '<div class="blog-body">' +
        (post.fecha ? '<div class="blog-date">' + esc(post.fecha) + '</div>' : '') +
        '<h3 class="blog-ptitle">' + esc(post.titulo) + '</h3>' +
        '<p class="blog-sum">' + esc(post.resumen || '') + '</p>' +
        (hasMore ? '<span class="blog-more">Leer más &#8594;</span>' : '') +
        '</div>';
      card.addEventListener('click', function () { openPost(i); });
      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  var mv = document.createElement('div'); mv.id = 'blogmodal';
  mv.style.cssText = 'display:none;position:fixed;inset:0;z-index:10000;background:rgba(8,26,25,.78);align-items:flex-start;justify-content:center;overflow-y:auto;padding:40px 16px;';
  mv.innerHTML = '<div style="background:#fff;max-width:760px;width:100%;border-radius:14px;overflow:hidden;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.4);">' +
    '<span id="bm-close" style="position:absolute;top:10px;right:16px;font-size:32px;color:#fff;cursor:pointer;z-index:2;text-shadow:0 1px 6px rgba(0,0,0,.6);line-height:1;">&times;</span>' +
    '<div id="bm-img" style="width:100%;height:250px;background-size:cover;background-position:center;background-color:#0D3130;"></div>' +
    '<div id="bm-content" style="padding:1.8rem 2rem 2.2rem;"></div>' +
    '</div>';
  document.body.appendChild(mv);

  function openPost(i) {
    var p = BPOSTS[i]; if (!p) return;
    document.getElementById('bm-img').style.backgroundImage = p.imagen ? ("url('" + p.imagen + "')") : '';
    var pdfBtn = p.pdf ? ('<a href="' + esc(p.pdf) + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#009739;color:#fff;text-decoration:none;font-weight:600;padding:.75rem 1.4rem;border-radius:9px;margin-top:1.3rem;font-family:Inter,Arial,sans-serif;">&#128196;&nbsp; Ver / descargar PDF</a>') : '';
    document.getElementById('bm-content').innerHTML =
      (p.fecha ? '<div style="font-size:.7rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#3CB649;margin-bottom:.5rem;font-family:Inter,Arial,sans-serif;">' + esc(p.fecha) + '</div>' : '') +
      '<h2 style="font-family:\'Playfair Display\',serif;color:#115F5D;font-size:1.6rem;line-height:1.25;margin-bottom:1rem;">' + esc(p.titulo) + '</h2>' +
      '<div class="bm-rich" style="font-family:Inter,Arial,sans-serif;color:#3A5453;line-height:1.8;font-size:.92rem;">' +
      (p.contenido ? mdToHtml(p.contenido) : ('<p>' + esc(p.resumen || '') + '</p>')) + '</div>' + pdfBtn;
    mv.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    mv.scrollTop = 0;
  }
  function closeM() { mv.style.display = 'none'; document.body.style.overflow = ''; }
  document.getElementById('bm-close').onclick = closeM;
  mv.addEventListener('click', function (e) { if (e.target === mv) closeM(); });
  document.addEventListener('keydown', function (e) { if (mv.style.display === 'flex' && e.key === 'Escape') closeM(); });
  window.openPost = openPost;

  fetch('content/blog.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function () { var nav = document.getElementById('nav-blog'); if (nav) nav.style.display = 'none'; });
})();
