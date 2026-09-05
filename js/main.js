// reveal on scroll
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.12 }
);
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

// work index filters
const btns = document.querySelectorAll(".filters button");
btns.forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.href) { location.href = b.dataset.href; return; }
    const wasOn = b.classList.contains("on");
    btns.forEach((x) => x.classList.remove("on"));
    if (!wasOn) b.classList.add("on");
    const f = wasOn ? null : b.dataset.f;
    document.querySelectorAll(".catsec").forEach((sec) => {
      sec.classList.toggle("hide", f !== null && sec.dataset.cat !== f);
    });
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
