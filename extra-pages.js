(function () {
  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function setTxt(id, val) { var el = document.getElementById(id); if (el && val != null && val !== '') el.textContent = val; }

  function applySwitch(d, navId, pageId) {
    var nav = document.getElementById(navId);
    var show = !!(d && d.mostrar);
    if (nav) nav.style.display = show ? '' : 'none';
    if (!show) {
      var pg = document.getElementById(pageId);
      if (pg && pg.classList.contains('active') && typeof window.showPage === 'function') window.showPage('home');
    }
    return show;
  }

  // ===== NOSOTROS =====
  fetch('content/nosotros.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!applySwitch(d, 'nav-nosotros', 'page-nosotros')) return;
      setTxt('nos-eyebrow', d.titulo_seccion);
      setTxt('nos-title', d.titulo_seccion);
      setTxt('nos-intro', d.intro);
      setTxt('nos-mision', d.mision);
      setTxt('nos-vision', d.vision);
      var team = document.getElementById('nos-team');
      if (team) {
        team.innerHTML = (d.equipo || []).map(function (m) {
          var foto = m.foto ? '<div class="team-photo" style="background-image:url(\'' + esc(m.foto) + '\')"></div>' : '<div class="team-photo"></div>';
          return '<div class="team-card">' + foto + '<div class="team-info">' +
            '<div class="team-name">' + esc(m.nombre) + '</div>' +
            '<div class="team-role">' + esc(m.cargo || '') + '</div>' +
            '<p class="team-desc">' + esc(m.descripcion || '') + '</p>' +
            '</div></div>';
        }).join('');
      }
    })
    .catch(function () { var n = document.getElementById('nav-nosotros'); if (n) n.style.display = 'none'; });

  // ===== INVESTIGACIÓN =====
  fetch('content/investigacion.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!applySwitch(d, 'nav-investigacion', 'page-investigacion')) return;
      setTxt('inv-eyebrow', d.titulo_seccion);
      setTxt('inv-title', d.titulo_seccion);
      setTxt('inv-intro', d.intro);
      var root = document.getElementById('inv-lineas');
      if (root) {
        root.innerHTML = (d.lineas || []).map(function (l) {
          var img = l.imagen ? '<div class="blog-img" style="background-image:url(\'' + esc(l.imagen) + '\')"></div>' : '';
          return '<article class="blog-card" style="cursor:default;">' + img + '<div class="blog-body">' +
            '<h3 class="blog-ptitle">' + esc(l.titulo) + '</h3>' +
            '<p class="blog-sum">' + esc(l.descripcion || '') + '</p>' +
            '</div></article>';
        }).join('');
      }
    })
    .catch(function () { var n = document.getElementById('nav-investigacion'); if (n) n.style.display = 'none'; });
})();
