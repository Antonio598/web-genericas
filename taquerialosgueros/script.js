// ==========================================================
//  Horarios — único lugar donde se editan.
//  Índice: 0 = Domingo ... 6 = Sábado
//  open/close en minutos desde medianoche. Si close > 1440
//  significa que cierra después de medianoche (día siguiente).
// ==========================================================
// ==========================================================
//  CONFIG — datos del negocio. ⚠️ Todo esto es de EJEMPLO:
//  reemplazar por los datos reales.
// ==========================================================
const CONFIG = {
  whatsapp: "5215500000000", // PLACEHOLDER: 52 + 1 + número a 10 dígitos
  whatsappMsg: "¡Hola Los Güeros! Quiero hacer un pedido:",
  prices: { volcan: 30, gringa: 55, tostada: 30, taco: 22 }, // PLACEHOLDER (MXN)
  social: { // PLACEHOLDER — deja "" para ocultar el ícono
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },
};

const TZ = "America/Mexico_City";
const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const hm = (h, m = 0) => h * 60 + m;

const SCHEDULE = {
  0: { open: hm(16, 30), close: hm(24, 0) },   // Domingo
  1: { open: hm(16, 30), close: hm(24, 0) },   // Lunes
  2: { open: hm(16, 30), close: hm(24, 0) },   // Martes
  3: { open: hm(16, 30), close: hm(24, 0) },   // Miércoles
  4: null,                                      // Jueves: cerrado
  5: { open: hm(16, 30), close: hm(24, 50) },  // Viernes
  6: { open: hm(16, 30), close: hm(24, 50) },  // Sábado
};

const fmt = (mins) => {
  const m = mins % 1440;
  let h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${mm} ${ampm}`;
};
const rangeText = (s) => (s ? `${fmt(s.open)} – ${fmt(s.close)}` : "Cerrado");

// Hora actual en CDMX, sin importar la zona horaria del visitante
function nowInCDMX() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const hour = Number(get("hour")) % 24;
  return { day, mins: hour * 60 + Number(get("minute")) };
}

function getStatus() {
  const { day, mins } = nowInCDMX();
  const today = SCHEDULE[day];
  const yesterday = SCHEDULE[(day + 6) % 7];

  // ¿Seguimos abiertos por el horario de ayer (después de medianoche)?
  if (yesterday && yesterday.close > 1440 && mins < yesterday.close - 1440) {
    return { open: true, msg: `Abierto ahora · cerramos a las ${fmt(yesterday.close)}` };
  }
  if (today && mins >= today.open && mins < today.close) {
    return { open: true, msg: `Abierto ahora · cerramos a las ${fmt(today.close)}` };
  }
  if (today && mins < today.open) {
    return { open: false, msg: `Cerrado · abrimos hoy a las ${fmt(today.open)}` };
  }
  // Buscar el siguiente día con servicio
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (SCHEDULE[d]) {
      const when = i === 1 ? "mañana" : `el ${DAYS[d].toLowerCase()}`;
      return { open: false, msg: `Cerrado · abrimos ${when} a las ${fmt(SCHEDULE[d].open)}` };
    }
  }
  return { open: false, msg: "Cerrado" };
}

let renderedDay = null;
function renderHours() {
  const { day } = nowInCDMX();
  if (day === renderedDay) return; // solo re-dibujar si cambió el día (evita repetir la animación)
  renderedDay = day;
  const list = document.getElementById("hours-list");
  const order = [1, 2, 3, 4, 5, 6, 0]; // Lunes primero
  list.innerHTML = order
    .map((d, i) => {
      const s = SCHEDULE[d];
      const cls = [d === day ? "is-today" : "", s ? "" : "is-closed"].join(" ").trim();
      return `<li class="${cls}" style="--i:${i}"><span class="day">${DAYS[d]}</span><span class="time">${rangeText(s)}</span></li>`;
    })
    .join("");
  document.getElementById("today-hours").textContent = rangeText(SCHEDULE[day]);
}

function renderStatus() {
  const el = document.getElementById("status");
  const s = getStatus();
  el.classList.toggle("is-open", s.open);
  el.classList.toggle("is-closed", !s.open);
  el.querySelector(".status__text").textContent = s.msg;
}

function renderPrices() {
  const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  document.querySelectorAll("[data-price]").forEach((el) => {
    const p = CONFIG.prices[el.dataset.price];
    if (p != null) el.textContent = money.format(p);
    else el.closest(".dish__price")?.remove();
  });
}

function setupWhatsApp() {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMsg)}`;
  document.querySelectorAll("[data-wa]").forEach((a) => (a.href = url));
}

function renderSocial() {
  document.querySelectorAll("[data-social]").forEach((a) => {
    const url = CONFIG.social[a.dataset.social];
    if (url) a.href = url;
    else a.hidden = true;
  });
}

// Menú móvil
function setupNav() {
  const btn = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
    })
  );
}

// ==========================================================
//  Animaciones
// ==========================================================
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Divide "Los Güeros" en letras para animarlas una por una
function splitTitle() {
  const el = document.querySelector("[data-split]");
  if (!el || reduceMotion) return;
  let i = 0;
  el.innerHTML = el.textContent.trim().split(" ")
    .map((word) => `<span class="word">${[...word].map((c) => `<span class="char" style="--i:${i++}">${c}</span>`).join("")}</span>`)
    .join(" ");
}

// Chispas que suben desde la plancha
function setupEmbers() {
  const box = document.getElementById("embers");
  if (!box || reduceMotion) return;
  const n = window.innerWidth < 600 ? 10 : 18;
  const r = (a, b) => a + Math.random() * (b - a);
  for (let k = 0; k < n; k++) {
    const s = document.createElement("span");
    s.className = "ember";
    s.style.cssText = `--x:${r(2, 98)}%;--s:${r(3, 7)}px;--t:${r(6, 12)}s;--delay:${r(0, 8)}s;--drift:${r(-60, 60)}px`;
    box.appendChild(s);
  }
}

// Aparición al hacer scroll
function setupReveal() {
  if (!("IntersectionObserver" in window) || reduceMotion) return;
  const groups = [
    [".section__head", ""],
    [".cta h2", ""],
    [".split > :first-child", "reveal--left"],
    [".split:not(.split--map) > :last-child", "reveal--right"],
    [".map", "reveal--zoom"],
  ];
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
      // quitar el retraso escalonado para que el hover responda al instante
      setTimeout(() => (e.target.style.transitionDelay = ""), 1400);
    }),
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  const add = (el, variant, delay = 0) => {
    el.classList.add("reveal");
    if (variant) el.classList.add(variant);
    if (delay) el.style.transitionDelay = `${delay}ms`;
    io.observe(el);
  };
  groups.forEach(([sel, variant]) => document.querySelectorAll(sel).forEach((el) => add(el, variant)));
  document.querySelectorAll(".dish").forEach((el, i) => add(el, "", i * 110));
}

// Sombra en la barra al bajar, link activo y botón flotante de WhatsApp
function setupScrollUI() {
  const nav = document.querySelector(".nav");
  const wa = document.querySelector(".wa-float");
  const hero = document.querySelector(".hero");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 10);
    wa?.classList.toggle("is-hidden", y < hero.offsetHeight * 0.6);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(".nav__links a:not(.btn)")];
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("#menu, #horarios, #ubicacion").forEach((s) => spy.observe(s));
}

document.getElementById("year").textContent = new Date().getFullYear();
renderPrices();
setupWhatsApp();
renderSocial();
renderHours();
renderStatus();
setInterval(() => { renderStatus(); renderHours(); }, 60_000);
setupNav();
splitTitle();
setupEmbers();
setupReveal();
setupScrollUI();
