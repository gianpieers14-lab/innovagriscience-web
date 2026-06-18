(function () {
  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function render(d) {
    var nav = document.getElementById('nav-blog');
    var show = !!(d && d.mostrar);
    if (nav) nav.style.display = show ? '' : 'none';

    if (!show) {
      var pb = document.getElementById('page-blog');
      if (pb && pb.classList.contains('active') && typeof window.showPage === 'function') window.showPage('home');
      return;
    }

    var t = document.getElementById('blog-title');
    if (t && d.titulo_seccion) t.textContent = d.titulo_seccion;
    var eb = document.getElementById('blog-eyebrow');
    if (eb && d.titulo_seccion) eb.textContent = d.titulo_seccion;
    var intro = document.getElementById('blog-intro');
    if (intro && d.intro) intro.textContent = d.intro;

    var root = document.getElementById('blog-render');
    if (!root) return;
    root.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'blog-grid';
    (d.posts || []).forEach(function (post) {
      var card = document.createElement('article');
      card.className = 'blog-card';
      var img = post.imagen ? '<div class="blog-img" style="background-image:url(\'' + esc(post.imagen) + '\')"></div>' : '';
      card.innerHTML = img +
        '<div class="blog-body">' +
        (post.fecha ? '<div class="blog-date">' + esc(post.fecha) + '</div>' : '') +
        '<h3 class="blog-ptitle">' + esc(post.titulo) + '</h3>' +
        '<p class="blog-sum">' + esc(post.resumen || '') + '</p>' +
        '</div>';
      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  fetch('content/blog.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function () {
      var nav = document.getElementById('nav-blog');
      if (nav) nav.style.display = 'none';
    });
})();
