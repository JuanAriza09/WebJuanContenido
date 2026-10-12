'use strict';

/* MENÚ HAMBURGUESA  */
(function () {
  const toggle  = document.getElementById('menuToggle');
  const panel   = document.getElementById('navPanel');
  const overlay = document.getElementById('menuOverlay');
  if (!toggle || !panel || !overlay) return;

  // Cierra el panel lateral y restaura el scroll
  function closeMenu() {
    toggle.classList.remove('active');
    panel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  // Alterna apertura / cierre al hacer clic en el ícono
  toggle.addEventListener('click', () => {
    if (panel.classList.contains('active')) { closeMenu(); return; }
    toggle.classList.add('active');
    panel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloquea scroll de fondo
    toggle.setAttribute('aria-expanded', 'true');
  });

  // Cierra al hacer clic en el overlay oscuro
  overlay.addEventListener('click', closeMenu);

  // Cierra al navegar a cualquier sección
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Cierra con la tecla Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();

/* ── HEADER: fondo más sólido al hacer scroll (barra de nav siempre fija/visible) ── */
(function () {
  const hdr = document.getElementById('site-header');
  if (!hdr) return;

  function update() {
    // Solo un efecto cosmético de fondo; el header nunca se oculta
    hdr.classList.toggle('scrolled', window.scrollY > 40);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
      setTimeout(() => { ticking = false; }, 100);
    }
  }, { passive: true });

  // Estado inicial
  update();
})();

/*SMOOTH SCROLL: anclas internas */
// Desplazamiento suave compensando la altura del header fijo
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const hh = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--hh-sm') || '72',
      10
    );
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - hh - 16,
      behavior: 'smooth'
    });
  });
});

/* ACORDEÓN DE SERVICIOS */
// Solo un ítem abierto a la vez — cierra el anterior al abrir uno nuevo
document.querySelectorAll('.svc-header').forEach(hd => {
  hd.addEventListener('click', () => {
    const item   = hd.closest('.svc-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.svc-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── FORMULARIO DE CONTACTO — Envío directo al WhatsApp del Chef ──
   En lugar de mandar el formulario a un servidor de correo, se arma
   un mensaje con los datos ingresados y se abre WhatsApp (wa.me) con
   el texto ya redactado, listo para que el usuario solo presione
   "Enviar" dentro de WhatsApp. */
(function () {
  const form = document.getElementById('cform');
  if (!form) return;

  const WHATSAPP_NUMBER = '573157739739'; // Número del Chef Juan Antonio Gómez

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const get = (name) => {
      const el = form.querySelector(`[name="${name}"]`);
      return el ? el.value.trim() : '';
    };

    const nombre   = get('Nombre');
    const email    = get('Email');
    const telefono = get('Telefono');
    const mensaje  = get('Mensaje');

    const tipoSelect = form.querySelector('[name="Tipo_de_consulta"]');
    const tipo = (tipoSelect && tipoSelect.value)
      ? tipoSelect.options[tipoSelect.selectedIndex].text
      : '';

    // Validación básica de campos requeridos antes de abrir WhatsApp
    if (!nombre || !email || !mensaje) {
      form.reportValidity();
      return;
    }

    let texto = `Hola, mi nombre es ${nombre}.`;
    if (tipo) texto += `\nMe interesa: ${tipo}.`;
    texto += `\n\n${mensaje}`;
    texto += `\n\n— Correo: ${email}`;
    if (telefono) texto += `\n— Teléfono: ${telefono}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
  });
})();

/* LIGHTBOX — Especialidades y Portafolio*/
(function () {
  const lb    = document.getElementById('portfolioLightbox');
  const btnX  = document.getElementById('lbClose');
  const lbImg = document.getElementById('lbImg');
  const lbTit = document.getElementById('lbTitle');
  const lbTxt = document.getElementById('lbText');
  if (!lb) return;

  // Abre el lightbox: sirve para .portfolio-item y .esp-card
  function openLightbox(item) {
    const t  = item.dataset.title || '';
    const tx = item.dataset.text  || '';

    // Busca imagen: primero data-img, luego cualquier <img> dentro del ítem
    const innerImg = item.querySelector('img');
    // Usar .src (resuelto por el browser) garantiza URL absoluta correcta
    const rawSrc   = item.dataset.img !== undefined ? item.dataset.img : '';
    const imgSrc   = rawSrc || (innerImg ? innerImg.src : '');

    if (lbImg) {
      lbImg.src              = imgSrc;
      lbImg.alt              = t;
      lbImg.style.display    = imgSrc ? 'block' : 'none';
      lbImg.style.marginBottom = imgSrc ? '20px' : '0';
    }
    if (lbTit) lbTit.textContent = t;
    if (lbTxt) lbTxt.textContent = tx;

    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Escucha clics en tarjetas de portafolio Y especialidades
  document.querySelectorAll('.portfolio-item, .esp-card').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(item));
  });

  // Cierra el lightbox
  function closeLb() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (btnX) btnX.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/*  REVELADO AL HACER SCROLL (v9)
    - Escalonado POR GRUPO (cada fila/grilla arranca desde cero, no por índice global)
    - Incluye rótulos, títulos y textos introductorios de cada sección
    - Al terminar, retira las clases de animación para que el hover de las
      tarjetas y sus transiciones nativas funcionen sin retraso */
(function () {
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CARDS = '.esp-card, .portfolio-item, .exp-card, .master-card, .prox-card';
  const HEADS = '.seccion:not(.seccion--hero) .sec-inner > :is(.label, h2, .sec-lead)';

  const targets = new Set();
  document.querySelectorAll(CARDS + ', ' + HEADS).forEach(el => targets.add(el));
  document.querySelectorAll('.fade-up').forEach(el => targets.add(el));
  if (!targets.size) return;

  if (noMotion) {
    targets.forEach(el => { el.classList.remove('fade-up'); el.style.opacity = ''; });
    return;
  }

  // Índice dentro de su grupo (hermanos del mismo padre que también se revelan)
  const groups = new Map();
  targets.forEach(el => {
    const g = groups.get(el.parentElement) || [];
    g.push(el);
    groups.set(el.parentElement, g);
  });
  groups.forEach(list => list.forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = Math.min(i, 6) * 0.075 + 's';
  }));

  function reveal(el) {
    el.classList.add('visible');
    // Limpieza: devuelve el control al CSS nativo del componente
    setTimeout(() => {
      el.classList.remove('fade-up', 'visible');
      el.style.transitionDelay = '';
    }, 1500);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { reveal(en.target); obs.unobserve(en.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(el => obs.observe(el));
})();

/* ── BARRA DE PROGRESO DE LECTURA (v9) ──────────────────────────
   Línea dorada fina en el borde superior que indica cuánto se ha
   recorrido de la página. Solo transform/opacity: no cuesta rendimiento. */
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  let ticking = false;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.setProperty('--p', p.toFixed(4));
    bar.classList.toggle('on', p > 0.005);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* ── TRANSICIÓN ENTRE PÁGINAS (v9) ──────────────────────────────
   Navegadores modernos: la transición la hace el CSS con View
   Transitions entre documentos (@view-transition), sin JS.
   Navegadores sin soporte: se marca <html class="no-xvt"> y se usa
   un desvanecido de respaldo al salir y al entrar. */
(function () {
  const supportsXVT = 'onpagereveal' in window;
  if (supportsXVT) return;

  const root = document.documentElement;
  root.classList.add('no-xvt');

  // Si el usuario vuelve con el botón "atrás" (bfcache), quitar el estado de salida
  window.addEventListener('pageshow', () => root.classList.remove('is-leaving'));

  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;                                   // externos (WhatsApp, redes)
    if (url.pathname === location.pathname && url.search === location.search) return; // ancla en la misma página
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    root.classList.add('is-leaving');
    setTimeout(() => { location.href = url.href; }, 240);
  });
})();

/* ── RESPALDO AUTOMÁTICO DE IMÁGENES Y VIDEO ROTOS ──────────
   Si un archivo (imagen o video) no se encuentra en el servidor,
   evita el ícono roto del navegador: las imágenes puramente
   decorativas se ocultan; el resto muestra una caja de marcador
   de posición elegante y consistente con el diseño. */
(function () {
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';

  // Selectores de imágenes decorativas: si fallan, simplemente desaparecen
  const DECOR = '.decor-img, .viajes-img, .header-sublogo-img, .chef-firma, .header-firma-img';

  // Una imagen ya puede haber fallado ANTES de que este script corriera
  // (por ejemplo si el archivo 404 responde muy rápido). img.complete +
  // naturalWidth===0 detecta ese caso para no perder el error.
  function alreadyFailed(img) {
    return img.complete && img.naturalWidth === 0 && img.src;
  }

  function handleGenericError(img) {
    if (img.dataset.fallbackDone) return;
    img.dataset.fallbackDone = '1';
    if (img.matches(DECOR)) {
      img.classList.add('media-fallback-hidden');
      return;
    }
    const box = document.createElement('div');
    box.className = 'media-fallback';
    box.innerHTML = ICON + '<span>Imagen próximamente</span>';
    img.replaceWith(box);
  }

  document.querySelectorAll('img').forEach(img => {
    if (img.classList.contains('header-main-logo') || img.classList.contains('titulo-principal-img')) return; // manejo aparte, más abajo
    img.addEventListener('error', () => handleGenericError(img));
    if (alreadyFailed(img)) handleGenericError(img);
  });

  // Logo/título principal — se probó más de una vez el nombre exacto
  // del archivo sin acertar, así que en vez de adivinar de nuevo se
  // prueban automáticamente varias rutas y extensiones posibles hasta
  // encontrar la que realmente existe en el servidor.
  document.querySelectorAll('.header-main-logo, .titulo-principal-img').forEach(img => {
    const base = img.src.slice(0, img.src.lastIndexOf('/') + 1);
    const altBase = base.replace('Portafolio/', 'FotosDecoraciones/');
    const names = [
      'TituloPrincipal.png', 'TituloPrincipal.jpg', 'TituloPrincipal.jpeg',
      'Titulo Principal.png', 'Titulo Principal.jpg',
      'titulo-principal.png', 'titulo-principal.jpg',
      'Titulo.png', 'Titulo.jpg'
    ];
    const candidates = [...names.map(n => base + n), ...names.map(n => altBase + n)];

    let i = 0;
    function tryNext() {
      i++;
      if (i < candidates.length) {
        img.src = candidates[i];
      } else {
        img.removeEventListener('error', tryNext);
        img.classList.add('media-fallback-hidden');
      }
    }
    img.addEventListener('error', tryNext);
    if (alreadyFailed(img)) tryNext();
  });

  // Video del medallón: es solo un halo de fondo decorativo — si el
  // archivo no carga, simplemente se oculta (el botón FotoBoton.png
  // sigue funcionando normalmente encima).
  document.querySelectorAll('video').forEach(video => {
    const hide = () => {
      if (video.dataset.fallbackDone) return;
      video.dataset.fallbackDone = '1';
      video.classList.add('media-fallback-hidden');
    };
    video.addEventListener('error', hide, true);
    video.querySelectorAll('source').forEach(src => src.addEventListener('error', hide, true));
  });
})();

/* ── LOG de versión ───────────────────────────────────────── */
console.log(
  '%c Les Clefs Food Design v11.1 — corregido',
  'color:#C49A2A;font-size:16px;font-weight:700;background:#1A1A1A;padding:6px 14px;border-radius:6px;'
);

/* ── LOGO PRINCIPAL EN 3D: se inclina siguiendo el cursor ───────
   Calcula la posición del mouse respecto al centro del logo y la
   traduce a una rotación suave (máx. ~14°). Al salir del header
   vuelve a su posición. En pantallas táctiles queda solo el
   balanceo lento definido en el CSS. */
(function () {
  const hdr  = document.getElementById('site-header');
  const logo = document.querySelector('.header-main-logo');
  const link = document.querySelector('.header-brand-link');
  if (!hdr || !logo) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  const MAX = 4;             // grados máximos de inclinación (muy sutil, aspecto serio)
  let raf = null, nx = 0, ny = 0;

  function apply() {
    raf = null;
    logo.style.setProperty('--ry', (nx * MAX).toFixed(2) + 'deg');
    logo.style.setProperty('--rx', (-ny * MAX).toFixed(2) + 'deg');
  }

  hdr.addEventListener('mousemove', e => {
    const r  = logo.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    // Normaliza a -1…1 (se limita para que lejos del logo no gire de más)
    nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.35)));
    ny = Math.max(-1, Math.min(1, (e.clientY - cy) / 160));
    // Posición del cursor DENTRO del logo (en %): alimenta la luz que lo sigue
    if (link) {
      const px = ((e.clientX - r.left) / r.width)  * 100;
      const py = ((e.clientY - r.top)  / r.height) * 100;
      link.style.setProperty('--mx', px.toFixed(1) + '%');
      link.style.setProperty('--my', py.toFixed(1) + '%');
    }
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  hdr.addEventListener('mouseleave', () => {
    nx = 0; ny = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  });
})();