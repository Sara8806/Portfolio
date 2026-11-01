(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }

  toggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Active link while scrolling ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          links.forEach(function (a) { a.classList.remove("active"); });
          map[entry.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- Lightbox ---------- */
  var box = document.getElementById("lightbox");
  var boxImg = document.getElementById("lb-img");
  var boxCap = document.getElementById("lb-caption");
  var group = [];
  var index = 0;
  var opener = null;

  function show(i) {
    index = (i + group.length) % group.length;
    var item = group[index];
    boxImg.src = item.dataset.src;
    boxImg.alt = item.dataset.caption;
    boxCap.textContent = item.dataset.caption;
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var name = btn.dataset.lightbox;
      group = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox="' + name + '"]'));
      opener = btn;
      show(group.indexOf(btn));
      var single = group.length < 2;
      document.getElementById("lb-prev").hidden = single;
      document.getElementById("lb-next").hidden = single;
      box.showModal();
    });
  });

  document.getElementById("lb-close").addEventListener("click", function () { box.close(); });
  document.getElementById("lb-prev").addEventListener("click", function () { show(index - 1); });
  document.getElementById("lb-next").addEventListener("click", function () { show(index + 1); });

  // click on the dark backdrop closes it
  box.addEventListener("click", function (e) {
    if (e.target === box) box.close();
  });
  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  box.addEventListener("close", function () {
    boxImg.removeAttribute("src");
    if (opener) opener.focus();
  });

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  var form = document.getElementById("contact-form");
  var errorEl = document.getElementById("form-error");
  var TO = "saraamagdy2006@gmail.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;
    var problems = [];

    [name, email, message].forEach(function (f) { f.classList.remove("invalid"); });

    if (!name.value.trim()) { problems.push("your name"); name.classList.add("invalid"); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { problems.push("a valid email"); email.classList.add("invalid"); }
    if (!message.value.trim()) { problems.push("a message"); message.classList.add("invalid"); }

    if (problems.length) {
      errorEl.hidden = false;
      errorEl.textContent = "Please add " + problems.join(", ") + ".";
      return;
    }

    errorEl.hidden = true;
    var subject = "Website project from " + name.value.trim();
    var body = message.value.trim() + "\n\n" + name.value.trim() + "\n" + email.value.trim();
    window.location.href =
      "mailto:" + TO +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
})();
