/* ============================================================
   HS PERSONAL TRAINER — COMMON.JS
   Logique partagée, chargée sur toutes les pages.
   Ne jamais dupliquer ces fonctions dans une page : uniquement
   les appeler ou ajouter les classes attendues en HTML.
   ============================================================ */

(function () {

  /* ---------- 1. ACCORDÉONS (.card, .offer-card, .faq-item) ----------
     Usage HTML :
     <div class="card" data-accordion="groupe-A" id="c1">
       <div class="card-header" onclick="HS.toggleAccordion('c1')">...</div>
       <div class="card-body">...</div>
     </div>
     Si data-accordion partagé entre plusieurs cartes, une seule
     reste ouverte à la fois (comportement "offres" et "FAQ"). */
  function toggleAccordion(id) {
    var card = document.getElementById(id);
    if (!card) return;
    var isOpen = card.classList.contains('active') || card.classList.contains('open');
    var group = card.dataset.accordion;

    if (group) {
      document.querySelectorAll('[data-accordion="' + group + '"]').forEach(function (c) {
        c.classList.remove('active', 'open');
      });
    }
    if (!isOpen) {
      card.classList.add(card.classList.contains('faq-item') ? 'open' : 'active');
    }
  }

  /* ---------- 2. SCROLL REVEAL (.reveal, .reveal-fade) ----------
     Ajoute simplement class="reveal" (ou "reveal-fade") à un
     élément en HTML : il apparaît automatiquement au scroll.
     Pour un effet échelonné, ajouter .delay-1 à .delay-5 sur
     les enfants d'une liste. */
  function initScrollReveal() {
    var targets = document.querySelectorAll('.reveal, .reveal-fade');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 3. NAVBAR — LIEN ACTIF AU SCROLL ----------
     Usage : appeler HS.initScrollSpy(['section-1','section-2', ...])
     une fois le DOM chargé, avec les IDs de sections de la page. */
  function initScrollSpy(sectionIds) {
    var navLinks = document.querySelectorAll('.navbar ul li a');
    if (!sectionIds || !sectionIds.length || !navLinks.length) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset + 200;
      var current = '';
      sectionIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    });
  }

  /* ---------- 4. SMOOTH SCROLL VERS UNE ANCRE ---------- */
  function scrollToId(id, offset) {
    var el = document.getElementById(id);
    if (!el) return false;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 60);
    window.scrollTo({ top: top, behavior: 'smooth' });
    return false;
  }

  /* ---------- 5. INDICATEUR DE PAGE ACTIVE DANS LA NAVBAR ----------
     À appeler une fois par page avec le slug courant, ex :
     HS.setActiveNavPage('coaching')
     Les liens de la navbar doivent porter data-page="coaching" etc. */
  function setActiveNavPage(pageSlug) {
    document.querySelectorAll('.navbar ul li a[data-page]').forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === pageSlug);
    });
  }

  /* ---------- 6. MENU HAMBURGER (volet de navigation mobile) ----------
     Toutes les pages ont la même structure : .menu-toggle + .navbar ul
     + .nav-overlay. S'initialise seul, rien à appeler depuis les pages. */
  function initMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var list = document.querySelector('.navbar ul');
    var overlay = document.getElementById('navOverlay');
    if (!toggle || !list || !overlay) return;

    function openMenu() {
      list.classList.add('open');
      overlay.classList.add('visible');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      list.classList.remove('open');
      overlay.classList.remove('visible');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      if (list.classList.contains('open')) closeMenu(); else openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    // Pas de fermeture manuelle au clic sur un lien : la navigation vers
    // la page suivante recharge le document et réinitialise le menu
    // fermé toute seule. Fermer manuellement ici interrompait parfois
    // la navigation sur mobile.
  }

  /* ---------- 6bis. PANNEAU DE PARAMÈTRES ----------
     Structure attendue sur chaque page : #settingsToggle, #settingsPanel,
     #settingsClose, #settingsOverlay, et un groupe .theme-switch avec des
     boutons [data-theme-choice="dark"|"light"]. Le thème choisi est
     mémorisé (localStorage) et appliqué immédiatement au prochain
     chargement via le petit script placé en tout début de <head>. */
  function initSettingsPanel() {
    var toggle = document.getElementById('settingsToggle');
    var panel = document.getElementById('settingsPanel');
    var close = document.getElementById('settingsClose');
    var overlay = document.getElementById('settingsOverlay');
    if (!toggle || !panel || !overlay) return;

    function openPanel() {
      panel.classList.add('open');
      overlay.classList.add('visible');
    }
    function closePanel() {
      panel.classList.remove('open');
      overlay.classList.remove('visible');
    }
    toggle.addEventListener('click', openPanel);
    if (close) close.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);

    // Thème
    var options = panel.querySelectorAll('[data-theme-choice]');
    var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    options.forEach(function (opt) {
      opt.classList.toggle('active', opt.dataset.themeChoice === current);
      opt.addEventListener('click', function () {
        var choice = opt.dataset.themeChoice;
        if (choice === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        try { localStorage.setItem('hs-theme', choice); } catch (e) { /* navigation privée : tant pis, non bloquant */ }
        options.forEach(function (o) { o.classList.toggle('active', o === opt); });
      });
    });

    // Taille du texte
    var sizeOptions = panel.querySelectorAll('[data-fontsize-choice]');
    var currentSize = document.documentElement.getAttribute('data-fontsize') || 'normal';
    sizeOptions.forEach(function (opt) {
      opt.classList.toggle('active', opt.dataset.fontsizeChoice === currentSize);
      opt.addEventListener('click', function () {
        var choice = opt.dataset.fontsizeChoice;
        if (choice === 'normal') {
          document.documentElement.removeAttribute('data-fontsize');
        } else {
          document.documentElement.setAttribute('data-fontsize', choice);
        }
        try { localStorage.setItem('hs-fontsize', choice); } catch (e) { /* navigation privée : non bloquant */ }
        sizeOptions.forEach(function (o) { o.classList.toggle('active', o === opt); });
      });
    });
  }

  /* ---------- 7. TICKER TACTILE ----------
     Défilement automatique doux, interrompu dès que l'utilisateur
     touche/glisse — il reprend la main comme un vrai carrousel natif.
     wrapSelector : l'élément avec overflow-x (ex: '.ticker-wrap').
     Le premier enfant direct est considéré comme la piste à faire défiler. */
  function initTouchTicker(wrapSelector) {
    document.querySelectorAll(wrapSelector).forEach(function (wrap) {
      var track = wrap.firstElementChild;
      if (!track) return;

      var speed = 1.4;      // px par tick — vitesse du défilement auto
      var paused = false;
      var resumeTimer = null;

      var intervalId = setInterval(function () {
        if (!paused) {
          wrap.scrollLeft += speed;
        }
        // Le rebouclage s'applique dans tous les cas, même pendant un
        // glissement tactile, pour ne jamais laisser l'utilisateur
        // atteindre le bout réel de la piste dupliquée.
        var halfWidth = track.scrollWidth / 2;
        if (wrap.scrollLeft >= halfWidth) {
          wrap.scrollLeft -= halfWidth;
        }
      }, 20);

      function pause() {
        paused = true;
        if (resumeTimer) clearTimeout(resumeTimer);
      }
      function scheduleResume() {
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () { paused = false; }, 1800);
      }

      wrap.addEventListener('touchstart', pause, { passive: true });
      wrap.addEventListener('touchend', scheduleResume);
      wrap.addEventListener('mousedown', pause);
      window.addEventListener('mouseup', scheduleResume);
    });
  }

  /* ---------- INIT AUTOMATIQUE ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initMobileMenu();
    initSettingsPanel();
    initTouchTicker('.ticker-wrap');
    initTouchTicker('.benefit-strip');
  });

  /* Expose l'API commune sous un seul objet global : HS */
  window.HS = {
    toggleAccordion: toggleAccordion,
    initScrollSpy: initScrollSpy,
    scrollToId: scrollToId,
    setActiveNavPage: setActiveNavPage
  };

})();
