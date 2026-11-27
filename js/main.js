/* SISNE — landing (Developed by: Rym Tech) */

/* ==========================================================================
   CONFIGURACIÓN: cambiá estos datos y se actualizan en toda la página.
   ========================================================================== */
var SISNE_CONFIG = {
  // TODO: número de WhatsApp Business, solo dígitos con código de país (54) y 9. Ej: "5491123456789"
  whatsapp: "5491100000000",
  // Cómo se muestra el número en la página
  whatsappLabel: "+54 9 11 0000 0000",
  // Mensaje que aparece escrito al abrir WhatsApp
  whatsappMessage: "Hola SISNE! Quiero ordenar mi negocio. Me gustaría coordinar una reunión.",
  // TODO: email corporativo
  email: "contacto@sisne.com.ar",
  // TODO: clave gratuita de https://web3forms.com (llega al email que registres).
  // Mientras esté vacía, el formulario abre WhatsApp con los datos cargados.
  web3formsKey: ""
};
(function () {
  "use strict";

  /* --- Año del pie --- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* --- Header: borde al scrollear --- */
  var header = document.getElementById("header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Menú móvil --- */
  var btn = document.getElementById("menu-btn");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    function setMenu(open) {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      btn.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
    }
    btn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* --- Hero: planilla de celdas que se convierte en tablero --- */
  var viz = document.getElementById("viz");
  var grid = document.getElementById("viz-grid");
  var axis = document.getElementById("viz-axis");
  var replay = document.getElementById("viz-replay");

  if (viz && grid && axis) {
    var COLS = 12, ROWS = 9;
    var heights = [2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8, 9]; // crecimiento ilustrativo
    var letters = "ABCDEFGHIJKL".split("");
    var months = "ENE FEB MAR ABR MAY JUN JUL AGO SEP OCT NOV DIC".split(" ");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Relleno "desordenado" determinístico para que se vea como una planilla cargada a mano
    function noise(c, r) { var x = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453; return x - Math.floor(x); }

    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var fromBottom = ROWS - 1 - r;
        var cell = document.createElement("div");
        var lit = fromBottom < heights[c];
        cell.className = "cell" + (noise(c, r) > 0.62 ? " has" : "") + (lit ? " lit" : "") + (lit && fromBottom === heights[c] - 1 ? " top" : "");
        cell.style.transitionDelay = (c * 55 + fromBottom * 18) + "ms";
        grid.appendChild(cell);
      }
    }

    function drawAxis(state) {
      var list = state === "after" ? months : letters;
      axis.innerHTML = "";
      list.forEach(function (t) {
        var s = document.createElement("span");
        s.textContent = t.length > 1 ? t.charAt(0) : t;
        s.title = t;
        axis.appendChild(s);
      });
    }

    function setState(state) {
      viz.setAttribute("data-state", state);
      drawAxis(state);
    }

    drawAxis("before");

    function play() {
      setState("before");
      // dos frames para que el navegador pinte el estado inicial antes de transicionar
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          window.setTimeout(function () { setState("after"); }, reduce ? 0 : 900);
        });
      });
    }

    if (reduce) { setState("after"); } else { play(); }

    if (replay) {
      replay.addEventListener("click", function () {
        if (reduce) { setState(viz.getAttribute("data-state") === "after" ? "before" : "after"); }
        else { play(); }
      });
    }
  }

  /* --- Analítica: envía eventos si hay GA4, Plausible o GTM --- */
  function track(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
      if (typeof window.plausible === "function") window.plausible(name, { props: params || {} });
      if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: name }, params || {}));
    } catch (e) { /* sin analítica */ }
  }

  /* --- Links de WhatsApp y email --- */
  var cfg = window.SISNE_CONFIG || SISNE_CONFIG;
  function waUrl(text) {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text || cfg.whatsappMessage);
  }
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waUrl();
    a.target = "_blank";
    a.rel = "noopener";
    if (a.hasAttribute("data-wa-text")) a.textContent = cfg.whatsappLabel;
    a.addEventListener("click", function () { track("contact_whatsapp", { location: a.className || "link" }); });
  });
  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.href = "mailto:" + cfg.email;
    a.textContent = cfg.email;
  });

  /* --- Barra fija en celular: aparece después del hero y se esconde en contacto --- */
  var bar = document.getElementById("mobile-bar");
  var hero = document.getElementById("inicio");
  var contact = document.getElementById("contacto");
  if (bar && hero && contact && "IntersectionObserver" in window) {
    var heroVisible = true, contactVisible = false;
    var update = function () { bar.classList.toggle("is-visible", !heroVisible && !contactVisible); };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (e) { contactVisible = e[0].isIntersecting; update(); }).observe(contact);
  }

  /* --- Formulario de contacto --- */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");

  function setError(input, msg) {
    var field = input.closest(".field");
    var err = field.querySelector(".field__error");
    field.classList.toggle("has-error", !!msg);
    input.setAttribute("aria-invalid", String(!!msg));
    if (msg) {
      if (!err) {
        err = document.createElement("span");
        err.className = "field__error";
        err.id = input.id + "-error";
        input.setAttribute("aria-describedby", err.id);
        field.appendChild(err);
      }
      err.textContent = msg;
    } else if (err) {
      err.remove();
      input.removeAttribute("aria-describedby");
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      var nombre = form.querySelector("#f-nombre");
      var wa = form.querySelector("#f-wa");
      var email = form.querySelector("#f-email");

      setError(nombre, nombre.value.trim() ? "" : "Completá tu nombre.");
      if (!nombre.value.trim()) ok = false;

      var digits = wa.value.replace(/\D/g, "");
      var waOk = digits.length >= 8;
      setError(wa, waOk ? "" : "Escribí un número de WhatsApp válido, por ejemplo 11 2345 6789.");
      if (!waOk) ok = false;

      var emailOk = !email.value.trim() || /^\S+@\S+\.\S+$/.test(email.value);
      setError(email, emailOk ? "" : "Escribí un email válido, por ejemplo nombre@negocio.com.");
      if (!emailOk) ok = false;

      if (!ok) {
        statusEl.textContent = "Revisá los campos marcados.";
        var firstBad = form.querySelector(".has-error input");
        if (firstBad) firstBad.focus();
        return;
      }

      var d = new FormData(form);
      if (d.get("botcheck")) return; // bot
      var mejorar = d.getAll("mejorar").join(", ") || "-";
      var resumen = [
        "Nombre: " + d.get("nombre"),
        "WhatsApp: " + d.get("whatsapp"),
        "Email: " + (d.get("email") || "-"),
        "Rubro: " + (d.get("rubro") || "-"),
        "Quiere mejorar: " + mejorar,
        "Mensaje: " + (d.get("mensaje") || "-")
      ].join("\n");

      var btn = form.querySelector("button[type=submit]");

      if (cfg.web3formsKey) {
        btn.disabled = true;
        statusEl.textContent = "Enviando…";
        var payload = {
          access_key: cfg.web3formsKey,
          subject: "Nueva consulta SISNE: " + d.get("nombre"),
          from_name: "Web SISNE",
          nombre: d.get("nombre"),
          whatsapp: d.get("whatsapp"),
          email: d.get("email") || "",
          rubro: d.get("rubro") || "",
          quiere_mejorar: mejorar,
          mensaje: d.get("mensaje") || ""
        };
        if (d.get("email")) payload.replyto = d.get("email");
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (!res.success) throw new Error(res.message);
            form.reset();
            statusEl.textContent = "¡Listo! Recibimos tu consulta y te escribimos por WhatsApp a la brevedad.";
            track("generate_lead", { method: "form" });
          })
          .catch(function () {
            statusEl.innerHTML = "No pudimos enviar el formulario. <a href=\"" + waUrl("Hola SISNE!\n" + resumen) + "\" target=\"_blank\" rel=\"noopener\">Mandanos los datos por WhatsApp</a>.";
          })
          .finally(function () { btn.disabled = false; });
      } else {
        // Sin servicio de formularios configurado: abre WhatsApp con la consulta escrita.
        statusEl.textContent = "Abrimos WhatsApp con tu consulta para que la envíes.";
        track("generate_lead", { method: "whatsapp_form" });
        window.open(waUrl("Hola SISNE! Les dejo mi consulta:\n" + resumen), "_blank", "noopener");
      }
    });
  }
})();
