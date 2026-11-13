/* =====================================================
   Pet Nova – js/index.js
   JavaScript exclusivo de la página Home (index.html)
   ===================================================== */

/* ---------- Cursor animado de la barra de navegación ----------
   Todas las páginas. Un "cursor" morado se desliza detrás del enlace
   al que apuntas con el mouse o el teclado y, al salir, vuelve al enlace
   de la página actual (el que tiene aria-current="page"). */
(function () {
    var ul = document.querySelector(".navbar nav ul");
    if (!ul) return;
    var cursor = ul.querySelector(".nav-cursor");
    var links = Array.prototype.slice.call(ul.querySelectorAll("a"));
    var selected = ul.querySelector('a[aria-current="page"]') || links[0];

    function moveTo(link, animate) {
        cursor.style.transition = animate ? "" : "none";
        cursor.style.width = link.offsetWidth + "px";
        cursor.style.height = link.offsetHeight + "px";
        cursor.style.transform = "translate(" + link.offsetLeft + "px," + link.offsetTop + "px)";
        cursor.style.opacity = 1;
        links.forEach(function (l) { l.classList.toggle("is-under", l === link); });
    }

    links.forEach(function (link) {
        link.addEventListener("mouseenter", function () { moveTo(link, true); });
        link.addEventListener("focus", function () { moveTo(link, true); });
    });
    ul.addEventListener("mouseleave", function () { moveTo(selected, true); });
    ul.addEventListener("focusout", function () { moveTo(selected, true); });

    window.addEventListener("load", function () { moveTo(selected, false); });
    window.addEventListener("resize", function () { moveTo(selected, false); });
    moveTo(selected, false);
})();

/* ---------- Pestañas animadas (sección Functions del Home) ----------
   Cambia de panel al hacer clic, mueve la "píldora" oscura detrás de la
   pestaña activa y permite usar las flechas, Home y End del teclado. */
(function () {
    var list = document.querySelector(".tab-list");
    if (!list) return;
    var pill = list.querySelector(".tab-pill");
    var tabs = Array.prototype.slice.call(list.querySelectorAll(".tab-btn"));

    function movePill(tab, animate) {
        pill.style.transition = animate ? "" : "none";
        pill.style.width = tab.offsetWidth + "px";
        pill.style.height = tab.offsetHeight + "px";
        pill.style.transform = "translate(" + tab.offsetLeft + "px," + tab.offsetTop + "px)";
    }

    function activate(tab, focus) {
        tabs.forEach(function (t) {
            var on = t === tab;
            t.setAttribute("aria-selected", on);
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
        });
        movePill(tab, true);
        if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { activate(tab); });
        tab.addEventListener("keydown", function (e) {
            var next = null;
            if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
            if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
            if (e.key === "Home") next = tabs[0];
            if (e.key === "End") next = tabs[tabs.length - 1];
            if (next) { e.preventDefault(); activate(next, true); }
        });
    });

    function current() { return list.querySelector('[aria-selected="true"]'); }
    window.addEventListener("load", function () { movePill(current(), false); });
    window.addEventListener("resize", function () { movePill(current(), false); });
    movePill(current(), false);
})();

/* ---------- Perro caminando (Lottie) ----------
   Reproduce la animación en bucle; el desplazamiento y el giro de un
   extremo a otro de la franja morada los hace el CSS (.cat-walker).
   Si la librería no carga, se muestra el gato en SVG como respaldo. */
(function () {
    var box = document.getElementById("perro-lottie");
    if (!box) return;
    var track = box.closest(".cat-track");
    if (typeof lottie === "undefined" || !window.PERRO_LOTTIE) {
        track.classList.add("is-fallback");
        return;
    }
    lottie.loadAnimation({
        container: box,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: window.PERRO_LOTTIE
    });
})();
