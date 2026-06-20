(function () {
  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function slug(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  function renderMini(data) {
    var root = document.getElementById('mini-carousels');
    if (!root) return;
    root.innerHTML = '';
    (data.bloques || []).forEach(function (blk, bi) {
      var fotos = blk.fotos || [];
      if (!fotos.length) return;
      var key = (slug(blk.especie) || 'mc') + '-' + bi;
      var slides = fotos.map(function (f, i) {
        return '<div class="mc-slide' + (i === 0 ? ' active' : '') + '" data-c="' + key + '"><img src="' + esc(f.imagen) + '" alt="' + esc(f.titulo) + '"/><div class="mc-caption"><span class="mc-tag" style="color:#3CB649;">' + esc(blk.especie) + '</span><div class="mc-title">' + esc(f.titulo) + '</div><div class="mc-desc">' + esc(f.descripcion || '') + '</div></div></div>';
      }).join('');
      var dots = fotos.map(function (f, i) {
        return '<button class="mc-dot' + (i === 0 ? ' active' : '') + '" data-c="' + key + '" onclick="mcGoTo(\'' + key + '\',' + i + ')"></button>';
      }).join('');
      var mc = document.createElement('div');
      mc.className = 'mini-carousel';
      mc.innerHTML = '<div class="mc-header"><span class="mc-species">' + esc(blk.especie) + '</span><span class="mc-common">' + esc(blk.comun) + '</span><span class="mc-count">' + fotos.length + ' fotos</span></div>' +
        '<div class="mc-track">' + slides + '</div>' +
        '<div class="mc-controls"><button class="mc-btn" onclick="mcPrev(\'' + key + '\')">&#8249;</button><div class="mc-dots">' + dots + '</div><button class="mc-btn" onclick="mcNext(\'' + key + '\')">&#8250;</button></div>';
      root.appendChild(mc);
      if (typeof window.mcInit === 'function') window.mcInit(key, fotos.length);
    });
  }

  function renderHero(data) {
    var track = document.getElementById('hero-track');
    var dotsWrap = document.getElementById('hero-dots');
    if (!track) return;
    var blk = (data.bloques || [])[0];
    var fotos = blk ? (blk.fotos || []) : [];
    if (!fotos.length) return;
    var TAG = 'Identificación entomológica · I+D+i';
    track.innerHTML = fotos.map(function (f, i) {
      return '<div class="slide' + (i === 0 ? ' active' : '') + '"><img src="' + esc(f.imagen) + '" alt="' + esc(f.titulo) + '"/><div class="slide-overlay"></div><div class="slide-caption"><span class="slide-tag">' + TAG + '</span><div class="slide-title">' + esc(f.titulo) + '</div><div class="slide-desc">' + esc(f.descripcion || '') + '</div></div></div>';
    }).join('');
    if (dotsWrap) {
      dotsWrap.innerHTML = fotos.map(function (f, i) {
        return '<button class="dot' + (i === 0 ? ' active' : '') + '" onclick="goTo(' + i + ')"></button>';
      }).join('');
    }
    var slides = track.querySelectorAll('.slide');
    var dots = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
    var prog = document.querySelector('.car-progress');
    var current = 0, total = slides.length, INTERVAL = 5500, timer;
    function go(n) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (n + total) % total;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      resetProg();
    }
    function resetProg() {
      if (!prog) return;
      prog.style.transition = 'none'; prog.style.width = '0%';
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        prog.style.transition = 'width ' + INTERVAL + 'ms linear'; prog.style.width = '100%';
      }); });
    }
    function start() { timer = setInterval(function () { go(current + 1); }, INTERVAL); resetProg(); }
    function stop() { clearInterval(timer); if (prog) prog.style.transition = 'none'; }
    var wrap = document.querySelector('.hero-carousel');
    if (wrap) { wrap.addEventListener('mouseenter', stop); wrap.addEventListener('mouseleave', start); }
    window.goTo = function (n) { stop(); go(n); start(); };
    window.carouselPrev = function () { stop(); go(current - 1); start(); };
    window.carouselNext = function () { stop(); go(current + 1); start(); };
    if (total > 1) start(); else resetProg();
  }

  var ZOOM = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
  var FLAT = [];

  function render(data) {
    var root = document.getElementById('galeria-render');
    if (!root) return;
    root.innerHTML = '';
    FLAT = [];
    (data.bloques || []).forEach(function (blk) {
      var n = (blk.fotos || []).length;
      var block = document.createElement('div');
      block.className = 'species-block';
      var header = document.createElement('div');
      header.className = 'species-header';
      header.innerHTML = '<div><span class="species-badge">' + esc(blk.especie) +
        '<span class="species-common"> &mdash; ' + esc(blk.comun) + '</span></span></div>' +
        '<span class="species-count">' + n + ' fotografías</span>';
      block.appendChild(header);
      var grid = document.createElement('div');
      grid.className = 'gal-grid';
      (blk.fotos || []).forEach(function (f) {
        var idx = FLAT.length;
        FLAT.push(f);
        var card = document.createElement('div');
        card.className = 'gal-card';
        card.innerHTML = '<div class="gal-img-wrap"><img src="' + esc(f.imagen) + '" alt="' + esc(f.titulo) +
          '" loading="lazy"/><div class="gal-img-overlay"></div><div class="gal-zoom-icon">' + ZOOM + '</div></div>' +
          '<div class="gal-info"><div class="gal-title">' + esc(f.titulo) + '</div><div class="gal-desc">' + esc(f.descripcion) + '</div></div>';
        card.addEventListener('click', function () { openGLB(idx); });
        grid.appendChild(card);
      });
      block.appendChild(grid);
      root.appendChild(block);
    });
  }

  fetch('content/galeria.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (data) { render(data); renderMini(data); renderHero(data); })
    .catch(function () {});

  var ov = document.createElement('div');
  ov.id = 'glb';
  ov.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(8,26,25,.94);align-items:center;justify-content:center;flex-direction:column;';
  ov.innerHTML =
    '<span id="glb-close" style="position:absolute;top:18px;right:26px;font-size:42px;color:#fff;cursor:pointer;line-height:1;">&times;</span>' +
    '<span id="glb-prev" style="position:absolute;left:22px;top:50%;transform:translateY(-50%);font-size:48px;color:#fff;cursor:pointer;user-select:none;">&#8249;</span>' +
    '<span id="glb-next" style="position:absolute;right:22px;top:50%;transform:translateY(-50%);font-size:48px;color:#fff;cursor:pointer;user-select:none;">&#8250;</span>' +
    '<img id="glb-img" style="max-width:86vw;max-height:78vh;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,.5);"/>' +
    '<div id="glb-cap" style="text-align:center;margin-top:14px;max-width:80vw;"></div>';
  document.body.appendChild(ov);

  var CUR = 0;
  function show() {
    var f = FLAT[CUR];
    if (!f) return;
    document.getElementById('glb-img').src = f.imagen;
    document.getElementById('glb-cap').innerHTML =
      '<div style="font-family:\'Playfair Display\',serif;font-style:italic;font-size:1.05rem;font-weight:700;color:#fff;">' + esc(f.titulo) + '</div>' +
      '<div style="font-size:.82rem;color:rgba(255,255,255,.6);margin-top:5px;font-family:\'Inter\',sans-serif;">' + esc(f.descripcion) + '</div>';
  }
  window.openGLB = function (i) { CUR = i; show(); ov.style.display = 'flex'; document.body.style.overflow = 'hidden'; };
  function closeGLB() { ov.style.display = 'none'; document.body.style.overflow = ''; }
  function prev() { if (!FLAT.length) return; CUR = (CUR - 1 + FLAT.length) % FLAT.length; show(); }
  function next() { if (!FLAT.length) return; CUR = (CUR + 1) % FLAT.length; show(); }
  document.getElementById('glb-close').onclick = closeGLB;
  document.getElementById('glb-prev').onclick = prev;
  document.getElementById('glb-next').onclick = next;
  ov.addEventListener('click', function (e) { if (e.target === ov) closeGLB(); });
  document.addEventListener('keydown', function (e) {
    if (ov.style.display !== 'flex') return;
    if (e.key === 'Escape') closeGLB();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });
})();

(function () {
  function applyHash() {
    var h = (location.hash || '').replace('#', '');
    if (h && document.getElementById('page-' + h) && typeof window.showPage === 'function') {
      window.showPage(h);
    }
  }
  window.addEventListener('hashchange', applyHash);
  if (document.readyState !== 'loading') applyHash();
  else document.addEventListener('DOMContentLoaded', applyHash);
})();
