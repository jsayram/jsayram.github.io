/* Jose Ramirez-Villa — portfolio interactions
   Vanilla JS, no dependencies. Every effect degrades gracefully and
   respects prefers-reduced-motion. */
(function () {
    'use strict';

    var root = document.documentElement;
    var body = document.body;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            localStorage.setItem(key, value);
        } catch (e) { return null; }
    }

    /* ---------- Theme toggle (persisted, follows system until chosen) ---------- */
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        var syncLabel = function () {
            var dark = root.getAttribute('data-theme') === 'dark';
            toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
            toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
        };
        syncLabel();
        toggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            store('theme', next);
            syncLabel();
        });
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (store('theme')) return;
            root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            syncLabel();
        });
    }

    /* ---------- Mobile menu ---------- */
    var menuBtn = document.querySelector('.menu-btn');
    function setMenu(open) {
        body.classList.toggle('menu-open', open);
        if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (menuBtn) {
        menuBtn.addEventListener('click', function () {
            setMenu(!body.classList.contains('menu-open'));
        });
        document.querySelectorAll('.nav-links a').forEach(function (a) {
            a.addEventListener('click', function () { setMenu(false); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMenu(false);
        });
    }

    /* ---------- Header state + scroll progress ---------- */
    var header = document.querySelector('.site-header');
    var progress = document.querySelector('.progress');
    var lastY = window.scrollY;
    var ticking = false;

    function onScroll() {
        var y = window.scrollY;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
        if (header) {
            header.classList.toggle('is-scrolled', y > 12);
            var hide = y > 320 && y > lastY && !body.classList.contains('menu-open');
            header.classList.toggle('is-hidden', hide);
            body.classList.toggle('header-hidden', hide);
        }
        lastY = y;
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-in'); });
    }

    // stagger children: data-stagger on a parent assigns --i to each [data-reveal] child
    document.querySelectorAll('[data-stagger]').forEach(function (parent) {
        parent.querySelectorAll('[data-reveal]').forEach(function (el, i) {
            el.style.setProperty('--i', i % 8);
        });
    });

    // intro choreography
    window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { body.classList.add('is-loaded'); });
    });

    /* ---------- Active nav link (scroll spy) ---------- */
    function spy(links, offset) {
        var map = [];
        links.forEach(function (a) {
            var id = a.getAttribute('href').split('#')[1];
            var target = id && document.getElementById(id);
            if (target) map.push({ link: a, target: target });
        });
        if (!map.length || !('IntersectionObserver' in window)) return;
        var visible = new Map();
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { visible.set(e.target, e.isIntersecting); });
            var current = null;
            map.forEach(function (m) { if (visible.get(m.target)) current = current || m; });
            map.forEach(function (m) {
                var on = current && m.link === current.link;
                m.link.classList.toggle('is-active', !!on);
                if (on && m.link.closest('.doc-nav')) {
                    var bar = m.link.closest('ul');
                    var left = m.link.offsetLeft - bar.clientWidth / 2 + m.link.clientWidth / 2;
                    bar.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
                }
            });
        }, { rootMargin: '-' + offset + 'px 0px -55% 0px' });
        map.forEach(function (m) { obs.observe(m.target); });
    }
    spy(document.querySelectorAll('.nav-links a[href^="#"]'), 80);
    spy(document.querySelectorAll('.doc-nav a[href^="#"]'), 140);

    /* ---------- Pointer effects (fine pointers only) ---------- */
    if (finePointer && !reduceMotion) {
        // hero / page-hero spotlight
        document.querySelectorAll('.hero, .page-hero').forEach(function (hero) {
            hero.addEventListener('pointermove', function (e) {
                var r = hero.getBoundingClientRect();
                hero.style.setProperty('--px', (e.clientX - r.left) + 'px');
                hero.style.setProperty('--py', (e.clientY - r.top) + 'px');
            });
        });

        // portrait tilt
        var portrait = document.querySelector('.hero-portrait');
        if (portrait) {
            var photo = portrait.querySelector('.photo');
            portrait.addEventListener('pointermove', function (e) {
                var r = portrait.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                photo.style.setProperty('--rx', (x * 10).toFixed(2) + 'deg');
                photo.style.setProperty('--ry', (-y * 10).toFixed(2) + 'deg');
            });
            portrait.addEventListener('pointerleave', function () {
                photo.style.setProperty('--rx', '0deg');
                photo.style.setProperty('--ry', '0deg');
            });
        }

        // card spotlight
        document.querySelectorAll('.project, .skill').forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });

        // magnetic buttons
        document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
            btn.addEventListener('pointermove', function (e) {
                var r = btn.getBoundingClientRect();
                btn.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px');
                btn.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px');
            });
            btn.addEventListener('pointerleave', function () {
                btn.style.setProperty('--mx', '0px');
                btn.style.setProperty('--my', '0px');
            });
        });
    }

    /* ---------- Count-up stats ---------- */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        var cio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var end = parseInt(el.getAttribute('data-count'), 10);
                cio.unobserve(el);
                if (reduceMotion) { el.textContent = end; return; }
                var start = null;
                var dur = 1400;
                var step = function (t) {
                    if (!start) start = t;
                    var p = Math.min((t - start) / dur, 1);
                    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
                    if (p < 1) window.requestAnimationFrame(step);
                };
                window.requestAnimationFrame(step);
            });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { cio.observe(c); });
    }

    /* ---------- Copy email ---------- */
    var toast = document.querySelector('.toast');
    var toastTimer;
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
    }
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var text = btn.getAttribute('data-copy');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    showToast('Email copied to clipboard');
                }, function () { window.location.href = 'mailto:' + text; });
            } else {
                window.location.href = 'mailto:' + text;
            }
        });
    });

    /* ---------- Lightbox ---------- */
    var frames = Array.prototype.slice.call(document.querySelectorAll('.figure .frame img, [data-lightbox] img'));
    if (frames.length) {
        var lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('aria-label', 'Image viewer');
        var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
        lb.innerHTML =
            '<span class="lb-count"></span>' +
            '<img alt="">' +
            '<p class="lightbox-cap"></p>' +
            '<button class="lb-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
            '<button class="lb-prev" type="button" aria-label="Previous image">' + arrow + '</button>' +
            '<button class="lb-next" type="button" aria-label="Next image">' + arrow + '</button>';
        body.appendChild(lb);

        var lbImg = lb.querySelector('img');
        var lbCap = lb.querySelector('.lightbox-cap');
        var lbCount = lb.querySelector('.lb-count');
        var current = 0;
        var opener = null;

        var show = function (i) {
            current = (i + frames.length) % frames.length;
            var src = frames[current];
            lbImg.src = src.currentSrc || src.src;
            lbImg.alt = src.alt;
            var fig = src.closest('figure');
            var cap = fig && fig.querySelector('figcaption');
            lbCap.textContent = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : src.alt;
            lbCount.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(frames.length).padStart(2, '0');
        };
        var open = function (i) {
            opener = document.activeElement;
            show(i);
            lb.classList.add('is-open');
            body.style.overflow = 'hidden';
            lb.querySelector('.lb-close').focus();
        };
        var close = function () {
            lb.classList.remove('is-open');
            body.style.overflow = '';
            if (opener) opener.focus();
        };

        frames.forEach(function (img, i) {
            var target = img.closest('.frame') || img;
            target.setAttribute('tabindex', '0');
            target.setAttribute('role', 'button');
            target.setAttribute('aria-label', 'Enlarge image: ' + (img.alt || 'figure'));
            target.addEventListener('click', function () { open(i); });
            target.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
            });
        });

        lb.querySelector('.lb-close').addEventListener('click', close);
        lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
        lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
        lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
        document.addEventListener('keydown', function (e) {
            if (!lb.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(current - 1);
            if (e.key === 'ArrowRight') show(current + 1);
            if (e.key === 'Tab') {
                var btns = lb.querySelectorAll('button');
                var first = btns[0];
                var last = btns[btns.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });

        var touchX = null;
        lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend', function (e) {
            if (touchX === null) return;
            var dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
            touchX = null;
        });
    }

    /* ---------- Bit-pattern demo (robot page) ---------- */
    var demo = document.querySelector('[data-bit-demo]');
    if (demo) {
        var cases = [
            ['0110', 'Forward'],
            ['0011', 'Correct right'],
            ['0001', 'Turn right'],
            ['1100', 'Correct left'],
            ['1000', 'Turn left'],
            ['0000', 'Back up']
        ];
        var bits = demo.querySelectorAll('.bits b');
        var action = demo.querySelector('.action');
        var k = 0;
        var paint = function () {
            var c = cases[k % cases.length];
            for (var b = 0; b < 4; b++) {
                bits[b].textContent = c[0][b];
                bits[b].classList.toggle('on', c[0][b] === '1');
            }
            action.textContent = '→ ' + c[1];
            k++;
        };
        paint();
        if (!reduceMotion) setInterval(paint, 1800);
    }

    /* ---------- Footer year ---------- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
})();
