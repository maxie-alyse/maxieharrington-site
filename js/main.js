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
    btns.forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    const f = b.dataset.f;
    document.querySelectorAll(".work-row, .vgrid:not(.small) .vcard").forEach((r) => {
      r.classList.toggle("hide", f !== "all" && !(r.dataset.roles || "").includes(f));
    });
  })
);

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
