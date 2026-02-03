(function () {
  "use strict";

  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href && href !== "#") {
      var el = document.querySelector(href);
      if (el) sections.push({ id: href, link: link, section: el });
    }
  });

  function scrollToSection(hash) {
    var el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (history.replaceState) history.replaceState(null, "", hash);
    else location.hash = hash;
  }

  function setActiveLink(activeId) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === activeId) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateScrollSpy() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var viewportMid = scrollY + 120;
    var current = null;
    for (var i = sections.length - 1; i >= 0; i--) {
      if (sections[i].section.offsetTop <= viewportMid) {
        current = sections[i].id;
        break;
      }
    }
    if (!current && sections.length) current = sections[0].id;
    if (current) setActiveLink(current);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href && href !== "#") {
        e.preventDefault();
        scrollToSection(href);
      }
    });
  });

  var scrollTimeout;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
    scrollTimeout = window.requestAnimationFrame(updateScrollSpy);
  });

  if (location.hash && document.querySelector(location.hash)) {
    setTimeout(function () {
      var el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      setActiveLink(location.hash);
    }, 0);
  } else if (sections.length) {
    setActiveLink(sections[0].id);
  }

  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
