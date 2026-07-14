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

  /* ---------- INIT AUTOMATIQUE ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
  });

  /* Expose l'API commune sous un seul objet global : HS */
  window.HS = {
    toggleAccordion: toggleAccordion,
    initScrollSpy: initScrollSpy,
    scrollToId: scrollToId,
    setActiveNavPage: setActiveNavPage
  };

})();
