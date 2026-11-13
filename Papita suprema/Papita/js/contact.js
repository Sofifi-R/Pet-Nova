/* =====================================================
   Pet Nova – js/contact.js
   JavaScript exclusivo de la página Contact (contact.html)
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

/* ---------- Formulario de contacto (página Contact) ----------
   Valida nombre, apellido y correo (obligatorios), marca los campos con
   error y, si todo está bien, abre el programa de correo del usuario con
   el mensaje listo para enviar a petnovitas2027@gmail.com.
   (Un formulario sin servidor no puede enviar correos por sí solo.) */
(function () {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = form.querySelector(".form-status");
    var TO = "petnovitas2027@gmail.com";

    function val(name) { return form.elements[name].value.trim(); }
    function setStatus(msg, type) {
        status.textContent = msg;
        status.className = "form-status " + (type || "");
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var missing = false;
        ["first-name", "last-name", "email"].forEach(function (name) {
            var field = form.elements[name];
            var bad = !val(name) || (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val(name)));
            field.setAttribute("aria-invalid", bad ? "true" : "false");
            if (bad) missing = true;
        });
        if (missing) {
            setStatus("Please fill in your first name, last name and a valid email.", "is-error");
            return;
        }

        var subject = val("subject") || "Message from " + val("first-name") + " " + val("last-name");
        var body = val("message") + "\n\n— " + val("first-name") + " " + val("last-name") + " (" + val("email") + ")";
        window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        setStatus("Thank you, " + val("first-name") + "! Your email app should open with your message ready to send.", "is-ok");
        form.reset();
    });

    form.addEventListener("input", function (e) {
        if (e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", "false");
    });
})();
