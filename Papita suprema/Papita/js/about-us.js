/* =====================================================
   Pet Nova – js/about-us.js
   JavaScript exclusivo de la página About Us (about-us.html)
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

/* ---------- Gato con ojos que siguen al cursor (Lottie) ----------
   Reproduce la animación en bucle y, cada vez que el cursor se mueve,
   desplaza un poco la capa de los ojos ("eys") hacia donde apunta.
   Si la librería no carga, se muestra un gato de respaldo. */
(function () {
    var box = document.getElementById("gato-lottie");
    if (!box) return;
    var stage = box.parentNode;
    if (typeof lottie === "undefined" || !window.GATO_LOTTIE) {
        stage.classList.add("is-fallback");
        return;
    }
    var anim = lottie.loadAnimation({
        container: box,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: window.GATO_LOTTIE
    });

    var eyes = null;
    function findLayer(list, name) {
        for (var i = 0; list && i < list.length; i++) {
            var el = list[i];
            if (!el) continue;
            if (el.data && el.data.nm === name && (el.layerElement || el.baseElement)) return el.layerElement || el.baseElement;
            var inner = findLayer(el.elements, name);
            if (inner) return inner;
        }
        return null;
    }

    var MAX = 16; /* desplazamiento máximo, en unidades de la animación (802 de ancho) */
    function look(x, y) {
        if (!eyes) eyes = findLayer(anim.renderer && anim.renderer.elements, "eys");
        if (!eyes) return;
        var r = box.getBoundingClientRect();
        var dx = (x - (r.left + r.width / 2)) / (window.innerWidth / 2);
        var dy = (y - (r.top + r.height / 2)) / (window.innerHeight / 2);
        dx = Math.max(-1, Math.min(1, dx));
        dy = Math.max(-1, Math.min(1, dy));
        eyes.style.transition = "translate 0.15s ease-out";
        eyes.style.translate = (dx * MAX).toFixed(1) + "px " + (dy * MAX * 0.7).toFixed(1) + "px";
    }
    window.addEventListener("mousemove", function (e) { look(e.clientX, e.clientY); });
    window.addEventListener("touchmove", function (e) {
        if (e.touches[0]) look(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
})();

/* ---------- Compartir el sitio ----------
   Arma los enlaces de WhatsApp, Facebook, X y correo con la dirección de
   Home y permite copiar el enlace. */
(function () {
    var row = document.querySelector(".share-row");
    if (!row) return;
    var url = new URL("index.html", window.location.href).href;
    var text = "Check out Pet Nova, the app that helps you care for your pet!";
    var enc = encodeURIComponent;
    var targets = {
        whatsapp: "https://wa.me/?text=" + enc(text + " " + url),
        facebook: "https://www.facebook.com/sharer/sharer.php?u=" + enc(url),
        x: "https://twitter.com/intent/tweet?text=" + enc(text) + "&url=" + enc(url),
        email: "mailto:?subject=" + enc("Pet Nova") + "&body=" + enc(text + "\n" + url)
    };
    Array.prototype.forEach.call(row.querySelectorAll("[data-share]"), function (a) {
        a.href = targets[a.getAttribute("data-share")];
    });

    var status = document.getElementById("share-status");
    function say(msg) { if (status) status.textContent = msg; }

    var copy = document.getElementById("copy-link");
    copy.addEventListener("click", function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () { say("Link copied!"); },
                function () { say(url); });
        } else {
            say(url);
        }
    });
})();
