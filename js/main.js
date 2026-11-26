/* RYM TECH — landing */
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

  /* --- Formulario de contacto --- */
  // TODO: reemplazar por el email real de RYM TECH (o conectar un servicio de formularios).
  var CONTACT_EMAIL = "contacto@rymtech.com";

  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var err = field.querySelector(".field__error");
        var valid = input.value.trim() !== "" && (input.type !== "email" || /^\S+@\S+\.\S+$/.test(input.value));
        field.classList.toggle("has-error", !valid);
        input.setAttribute("aria-invalid", String(!valid));
        if (!valid) {
          ok = false;
          if (!err) {
            err = document.createElement("span");
            err.className = "field__error";
            err.id = input.id + "-error";
            input.setAttribute("aria-describedby", err.id);
            field.appendChild(err);
          }
          err.textContent = input.type === "email" ? "Escribí un email válido, por ejemplo nombre@empresa.com." : "Completá este campo.";
        } else if (err) {
          err.remove();
          input.removeAttribute("aria-describedby");
        }
      });

      if (!ok) {
        statusEl.textContent = "Revisá los campos marcados.";
        var firstBad = form.querySelector(".has-error input, .has-error textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var d = new FormData(form);
      var subject = "Consulta desde la web: " + d.get("empresa");
      var body = [
        "Nombre: " + d.get("nombre"),
        "Empresa: " + d.get("empresa"),
        "Email: " + d.get("email"),
        "Tamaño: " + (d.get("tamano") || "-"),
        "",
        d.get("mensaje")
      ].join("\n");

      statusEl.textContent = "Abrimos tu programa de correo para enviar la consulta.";
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
