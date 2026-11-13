/* =====================================================
   Pet Nova – js/privacy-policy.js
   JavaScript exclusivo de la página Privacy Policy (privacy-policy.html)
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
