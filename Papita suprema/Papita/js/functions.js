/* =====================================================
   Pet Nova – js/functions.js
   JavaScript exclusivo de la página Functions (functions.html)
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

/* ---------- Contadores animados (página Functions) ----------
   Los números con data-count (5,000+, 12,000+, 300+, 98%) cuentan desde 0
   cuando aparecen en pantalla. Si el navegador no soporta la animación, o
   la persona prefiere menos movimiento, se queda el número final. */
(function () {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    function run(el) {
        var end = Number(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var start = null, duration = 1600;
        function step(t) {
            if (start === null) start = t;
            var p = Math.min((t - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(end * eased).toLocaleString("en-US") + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) { run(entry.target); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { observer.observe(n); });
})();

/* =====================================================
   NUEVAS SECCIONES DE FUNCTIONS
   ===================================================== */

/* ---------- Mapa de Panamá: elegir un lugar ---------- */
(function () {
    var data = window.PETMAP, svg = document.querySelector(".pmap-svg");
    if (!data || !svg) return;
    var tag = document.getElementById("pmap-tag"), nameEl = document.getElementById("pmap-name"),
        desc = document.getElementById("pmap-desc"), list = document.getElementById("pmap-list");
    var pins = Array.prototype.slice.call(svg.querySelectorAll(".map-pin"));
    var buttons = {};

    function select(id) {
        var d = data[id]; if (!d) return;
        tag.textContent = d.tag; nameEl.textContent = d.name; desc.textContent = d.desc;
        pins.forEach(function (p) { p.classList.toggle("is-selected", p.getAttribute("data-id") === id); });
        Object.keys(buttons).forEach(function (k) { buttons[k].setAttribute("aria-pressed", k === id ? "true" : "false"); });
    }
    Object.keys(data).forEach(function (id) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = data[id].name; b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () { select(id); });
        var li = document.createElement("li"); li.appendChild(b); list.appendChild(li);
        buttons[id] = b;
    });
    pins.forEach(function (p) {
        var id = p.getAttribute("data-id");
        p.addEventListener("click", function () { select(id); });
        p.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(id); }
        });
    });
    select("lachorrera");
})();

/* ---------- Información médica: tarjetas editables ---------- */
(function () {
    var cards = document.querySelectorAll(".med-card");
    if (!cards.length) return;
    var KEY = "petnova-medical-v1", saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }
    function persist() { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} }

    Array.prototype.forEach.call(cards, function (card) {
        var key = card.getAttribute("data-key");
        var body = card.querySelector(".med-body");
        var btn = card.querySelector(".med-edit");
        var label = card.querySelector(".med-edit-text");
        var before = "";
        if (saved[key]) body.textContent = saved[key];

        function start() {
            before = body.textContent;
            body.setAttribute("contenteditable", "true");
            card.classList.add("is-editing");
            label.textContent = "Save";
            body.focus();
            var r = document.createRange(); r.selectNodeContents(body); r.collapse(false);
            var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        }
        function stop(commit) {
            body.removeAttribute("contenteditable");
            card.classList.remove("is-editing");
            label.textContent = "Edit";
            if (!commit) { body.textContent = before; return; }
            var text = body.textContent.trim();
            if (!text) { text = body.getAttribute("data-default"); delete saved[key]; }
            else { saved[key] = text; }
            body.textContent = text;
            persist();
        }
        btn.addEventListener("click", function () {
            if (card.classList.contains("is-editing")) stop(true); else start();
        });
        body.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { e.preventDefault(); stop(false); btn.focus(); }
            else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); stop(true); btn.focus(); }
        });
    });

    var reset = document.getElementById("med-reset");
    if (reset) reset.addEventListener("click", function () {
        saved = {}; persist();
        Array.prototype.forEach.call(cards, function (card) {
            var body = card.querySelector(".med-body");
            body.removeAttribute("contenteditable");
            card.classList.remove("is-editing");
            card.querySelector(".med-edit-text").textContent = "Edit";
            body.textContent = body.getAttribute("data-default");
        });
    });
})();

/* ---------- Gato animado (Lottie) ---------- */
(function () {
    var box = document.getElementById("gato-lottie");
    if (!box) return;
    var stage = box.parentNode;
    if (typeof lottie === "undefined" || !window.GATO_LOTTIE) { stage.classList.add("is-fallback"); return; }
    lottie.loadAnimation({ container: box, renderer: "svg", loop: true, autoplay: true, animationData: window.GATO_LOTTIE });
})();

/* ---------- Calendario interactivo con huellitas ---------- */
(function () {
    var daysEl = document.getElementById("cal-days");
    if (!daysEl) return;
    var KEY = "petnova-calendar-v1";
    var MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
    var TAGS = ["YOUR BEST YEAR STARTS HERE.","LOVE IS IN THE PAWS.","SPRING INTO CARE.","SHOWERS, SNUGGLES & SHOTS.","BLOOMING WITH WAGS.","SUN, SAND & SNIFFS.","SUMMER OF TREATS.","LAZY DAYS, HAPPY PAWS.","BACK TO ROUTINE.","SPOOKY-GOOD CHECK-UPS.","THANKFUL FOR EVERY PURR.","COZY PAWS, WARM HEARTS."];
    var PAW = '<svg class="paw" viewBox="0 0 24 24" aria-hidden="true"><use href="#cal-paw"/></svg>';

    var yearEl = document.getElementById("cal-year"), monthEl = document.getElementById("cal-month"),
        tagEl = document.getElementById("cal-tag"), form = document.getElementById("cal-form"),
        petIn = document.getElementById("cal-pet"), dateIn = document.getElementById("cal-date"),
        statusEl = document.getElementById("cal-status"), listEl = document.getElementById("cal-entries"),
        titleEl = document.getElementById("cal-entries-title");

    var today = new Date();
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = null, popKey = null;
    var entries = [];
    try { entries = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { entries = []; }
    function persist() { try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch (e) {} }

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function keyOf(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }
    function parse(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function pretty(k) { return parse(k).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
    function prettyTime(t) {
        if (!t) return "";
        var p = t.split(":"), h = +p[0], ap = h >= 12 ? "PM" : "AM";
        return (h % 12 || 12) + ":" + p[1] + " " + ap;
    }
    function say(msg, err) { statusEl.textContent = msg; statusEl.classList.toggle("is-error", !!err); }

    function render() {
        var y = view.getFullYear(), m = view.getMonth();
        yearEl.textContent = y; monthEl.textContent = MONTHS[m]; tagEl.textContent = TAGS[m];
        var first = new Date(y, m, 1).getDay(), count = new Date(y, m + 1, 0).getDate();
        var todayKey = keyOf(today.getFullYear(), today.getMonth(), today.getDate());
        var frag = document.createDocumentFragment();
        for (var i = 0; i < first; i++) { var e = document.createElement("span"); e.className = "cal-empty"; frag.appendChild(e); }
        for (var d = 1; d <= count; d++) {
            var k = keyOf(y, m, d);
            var n = entries.filter(function (x) { return x.date === k; }).length;
            var b = document.createElement("button");
            b.type = "button"; b.className = "cal-day"; b.setAttribute("data-key", k);
            b.setAttribute("aria-label", MONTHS[m].charAt(0) + MONTHS[m].slice(1).toLowerCase() + " " + d + (n ? ", " + n + (n === 1 ? " entry" : " entries") : ""));
            b.innerHTML = '<span class="num">' + d + "</span>" + (n ? PAW : "");
            if (k === todayKey) b.classList.add("is-today");
            if (k === selected) { b.classList.add("is-selected"); b.setAttribute("aria-pressed", "true"); }
            if (k === popKey) b.classList.add("paw-pop");
            b.addEventListener("click", function () { selected = this.getAttribute("data-key"); dateIn.value = selected; popKey = null; render(); });
            frag.appendChild(b);
        }
        daysEl.innerHTML = ""; daysEl.appendChild(frag);
        renderList();
    }

    function renderList() {
        var y = view.getFullYear(), m = view.getMonth(), prefix = y + "-" + pad(m + 1) + "-";
        var shown = entries.filter(function (x) { return selected ? x.date === selected : x.date.indexOf(prefix) === 0; });
        shown.sort(function (a, b) { return (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")); });
        titleEl.textContent = selected ? "Entries on " + pretty(selected) : "Entries this month";
        listEl.innerHTML = "";
        if (selected) {
            var li0 = document.createElement("li"); li0.style.background = "none"; li0.style.padding = "0";
            var all = document.createElement("button"); all.type = "button"; all.className = "cal-showall"; all.textContent = "Show the whole month";
            all.addEventListener("click", function () { selected = null; render(); });
            li0.appendChild(all); listEl.appendChild(li0);
        }
        if (!shown.length) {
            var li = document.createElement("li"); li.style.background = "none"; li.style.padding = "0";
            li.className = "cal-empty-msg"; li.textContent = "Nothing saved yet. Add a reminder and a paw will appear on the date.";
            listEl.appendChild(li); return;
        }
        shown.forEach(function (x) {
            var li = document.createElement("li");
            var dt = document.createElement("span"); dt.className = "e-date"; dt.textContent = pretty(x.date);
            var main = document.createElement("span"); main.className = "e-main";
            var strong = document.createElement("strong"); strong.textContent = x.type + " · " + x.pet;
            main.appendChild(strong);
            var meta = [prettyTime(x.time), x.note].filter(Boolean).join(" · ");
            if (meta) { var sm = document.createElement("small"); sm.textContent = meta; main.appendChild(sm); }
            var del = document.createElement("button"); del.type = "button"; del.className = "e-del";
            del.setAttribute("aria-label", "Delete " + x.type + " for " + x.pet); del.innerHTML = "&times;";
            del.addEventListener("click", function () {
                entries = entries.filter(function (e) { return e.id !== x.id; }); persist(); popKey = null; render();
            });
            li.appendChild(dt); li.appendChild(main); li.appendChild(del); listEl.appendChild(li);
        });
    }

    document.getElementById("cal-prev").addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); popKey = null; render(); });
    document.getElementById("cal-next").addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); popKey = null; render(); });
    document.getElementById("cal-today").addEventListener("click", function () {
        view = new Date(today.getFullYear(), today.getMonth(), 1);
        selected = keyOf(today.getFullYear(), today.getMonth(), today.getDate()); dateIn.value = selected; popKey = null; render();
    });
    dateIn.addEventListener("change", function () {
        if (!dateIn.value) return;
        var d = parse(dateIn.value); view = new Date(d.getFullYear(), d.getMonth(), 1); selected = dateIn.value; popKey = null; render();
    });

    form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var pet = petIn.value.trim();
        if (!pet) { say("Please add your pet’s name.", true); petIn.focus(); return; }
        if (!dateIn.value) { say("Please choose a date.", true); dateIn.focus(); return; }
        entries.push({
            id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
            pet: pet, type: form.type.value, date: dateIn.value,
            time: form.time.value, note: form.note.value.trim()
        });
        persist();
        var d = parse(dateIn.value);
        view = new Date(d.getFullYear(), d.getMonth(), 1);
        selected = dateIn.value; popKey = selected;
        render();
        say("Saved! A paw was added on " + pretty(selected) + ".", false);
        form.time.value = ""; form.note.value = "";
    });

    dateIn.value = "";
    render();
})();

/* ---------- Carrusel de Pet Moments ---------- */
(function () {
    var track = document.getElementById("car-track");
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children), dotsBox = document.getElementById("car-dots");
    var prev = document.querySelector(".car-prev"), next = document.querySelector(".car-next");
    var dots = cards.map(function (c, i) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("aria-label", "Go to moment " + (i + 1));
        b.addEventListener("click", function () { go(i); });
        dotsBox.appendChild(b); return b;
    });
    function step() { return cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0); }
    function go(i) { track.scrollTo({ left: i * step(), behavior: "smooth" }); }
    function current() { return Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / step()))); }
    function sync() {
        var i = current();
        dots.forEach(function (d, k) { if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
    }
    prev.addEventListener("click", function () {
        if (track.scrollLeft <= 4) go(cards.length - 1); else go(current() - 1);
    });
    next.addEventListener("click", function () {
        var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        if (atEnd) go(0); else go(current() + 1);
    });
    track.addEventListener("scroll", sync, { passive: true });
    track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
    });
    window.addEventListener("resize", sync);
    sync();
})();
