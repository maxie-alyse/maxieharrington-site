// reveal on scroll
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0 }
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

// work index filters
document.querySelectorAll(".filters button").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.href) location.href = b.dataset.href;
  })
);

// theme preview — press L to flip light/dark (persists per browser)
try {
  if (localStorage.getItem("theme") === "dark") document.body.classList.remove("light");
} catch (e) {}
addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "l" && !e.metaKey && !e.ctrlKey && !e.altKey) {
    document.body.classList.toggle("light");
    try {
      localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    } catch (err) {}
  }
});

// live local time in footer (SF)
const tEl = document.getElementById("localtime");
if (tEl) {
  const tick = () => {
    tEl.textContent = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit",
      timeZone: "America/Los_Angeles",
    }) + " PT";
  };
  tick();
  setInterval(tick, 30000);
}

// back links: return to the previous page when it was on this site
document.querySelectorAll(".backlink").forEach((a) =>
  a.addEventListener("click", (e) => {
    if (document.referrer && document.referrer.includes(location.host) && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  })
);

// photo carousels: slow auto-drift, arrows on hover, seamless wrap
document.querySelectorAll(".photostrip").forEach((strip) => {
  const track = strip.querySelector(".pstrack");
  if (!track) return;
  let x = 0, tx = 0, pausedUntil = 0;
  const speed = 0.35;
  function arrow(ch, dir, cls) {
    const b = document.createElement("button");
    b.className = "ps-arrow " + cls;
    b.textContent = ch;
    b.setAttribute("aria-label", dir < 0 ? "Previous" : "Next");
    b.addEventListener("click", () => { tx += dir * 420; pausedUntil = Date.now() + 4000; });
    strip.appendChild(b);
  }
  arrow("\u2039", -1, "left");
  arrow("\u203a", 1, "right");
  const imgs = Array.from(track.querySelectorAll("img"));
  let ready = false;
  Promise.all(imgs.map((im) => im.complete ? Promise.resolve() : new Promise((res) => { im.onload = im.onerror = res; })))
    .then(() => { ready = true; });
  (function step() {
    if (!ready) { requestAnimationFrame(step); return; }
    if (Date.now() > pausedUntil) tx += speed;
    x += (tx - x) * 0.12;
    const half = track.scrollWidth / 2;
    if (half > 0) {
      if (x >= half) { x -= half; tx -= half; }
      if (x < 0) { x += half; tx += half; }
    }
    track.style.transform = "translate3d(" + (-x) + "px,0,0)";
    requestAnimationFrame(step);
  })();
});

// hover-to-play card loops
document.querySelectorAll(".vcard .hoverplay").forEach((v) => {
  const card = v.closest(".vcard");
  card.addEventListener("mouseenter", () => { v.play().catch(() => {}); });
  card.addEventListener("mouseleave", () => { v.pause(); });
});

// scatter drift: each piece lags the scroll at its own speed
(function () {
  const items = Array.from(document.querySelectorAll("[data-sp]"));
  if (!items.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const st = items.map((el) => ({ el, sp: parseFloat(el.dataset.sp), y: 0, base: 0 }));
  function measure() {
    st.forEach((s) => {
      s.el.style.transform = "";
      const r = s.el.getBoundingClientRect();
      s.base = r.top + scrollY + r.height / 2;
    });
  }
  measure();
  addEventListener("resize", measure);
  addEventListener("load", measure);
  (function tick() {
    const vc = scrollY + innerHeight / 2;
    st.forEach((s) => {
      const target = (vc - s.base) * s.sp;
      s.y += (target - s.y) * 0.06;
      s.el.style.transform = "translate3d(0," + s.y.toFixed(1) + "px,0)";
    });
    requestAnimationFrame(tick);
  })();
})();

// film drift bands — slow idle drift, hover pause, drag/swipe to browse
(function(){
  var tracks = document.querySelectorAll('.ftrack');
  if (!tracks.length) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var speeds = [0.18, -0.13, 0.10];
  tracks.forEach(function(tr, i){
    var base = reduced ? 0 : speeds[i % speeds.length];
    var x = 0, half = 0, hover = false, dragging = false;
    var lastPX = 0, vel = 0, glide = 0;
    var band = tr.parentElement;
    function measure(){ half = tr.scrollWidth / 2; }
    if (document.readyState === 'complete') measure();
    window.addEventListener('load', measure);
    setTimeout(measure, 800);
    band.addEventListener('mouseenter', function(){ hover = true; });
    band.addEventListener('mouseleave', function(){ hover = false; });
    band.addEventListener('pointerdown', function(e){
      dragging = true; glide = 0; vel = 0; lastPX = e.clientX; band._moved = 0;
      band.classList.add('dragging');
      band.setPointerCapture && band.setPointerCapture(e.pointerId);
    });
    band.addEventListener('pointermove', function(e){
      if (!dragging) return;
      var dx = e.clientX - lastPX; lastPX = e.clientX;
      x += dx; vel = dx; band._moved = (band._moved || 0) + Math.abs(dx);
    });
    function endDrag(){
      if (!dragging) return;
      dragging = false; glide = vel;
      band.classList.remove('dragging');
    }
    band.addEventListener('pointerup', endDrag);
    band.addEventListener('pointercancel', endDrag);
    function step(){
      if (half > 0){
        if (!dragging){
          if (Math.abs(glide) > Math.abs(base)){
            x += glide; glide *= 0.95;
          } else if (!hover){
            x -= base;
          }
        }
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        tr.style.transform = 'translate3d(' + x + 'px,0,0)';
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
})();


// lightbox — click any non-link photo to view it full frame
(function(){
  var main = document.querySelector('main');
  if (!main) return;
  var box = null;
  function close(){
    if (!box) return;
    box.classList.remove('on');
    document.body.classList.remove('lbx-open');
    var b = box; box = null;
    setTimeout(function(){ b.remove(); }, 260);
  }
  function open(src, alt){
    box = document.createElement('div');
    box.className = 'lbx';
    var im = document.createElement('img');
    im.src = src; im.alt = alt || '';
    box.appendChild(im);
    box.addEventListener('click', close);
    document.body.appendChild(box);
    document.body.classList.add('lbx-open');
    requestAnimationFrame(function(){ box.classList.add('on'); });
  }
  main.addEventListener('click', function(e){
    var img = e.target.closest('img');
    if (!img || img.closest('a') || img.closest('.lbx')) return;
    var band = img.closest('.fband');
    if (band && (band._moved || 0) > 6) return;
    open(img.currentSrc || img.src, img.alt);
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
})();
