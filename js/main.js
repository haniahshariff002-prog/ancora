/* =========================================================
   Ancora landing page — main.js
   Sections: footer year · scroll reveal · item data ·
   carousel + filters · waitlist form
   ========================================================= */

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// ---------- Garment illustrations (swap for real photos any time) ----------
const SHAPES = {
  tee:      '<path d="M34 16 L10 30 L20 46 L30 40 V84 H70 V40 L80 46 L90 30 L66 16 C62 24 38 24 34 16Z"/>',
  coat:     '<path d="M34 12 L10 28 L18 48 L28 42 V90 H72 V42 L82 48 L90 28 L66 12 L50 30Z"/><path d="M50 30 V90" fill="none"/><circle cx="57" cy="52" r="1.8" fill="#17241C"/><circle cx="57" cy="66" r="1.8" fill="#17241C"/>',
  dress:    '<path d="M38 10 H44 L50 22 L56 10 H62 L64 38 L80 90 H20 L36 38Z"/><path d="M36 38 H64" fill="none"/>',
  trousers: '<path d="M30 12 H70 L76 90 H55 L50 40 L45 90 H24Z"/><path d="M30 22 H70" fill="none"/>',
  sweater:  '<path d="M34 16 L8 58 L20 64 L30 48 V86 H70 V48 L80 64 L92 58 L66 16 C62 22 38 22 34 16Z"/><path d="M30 78 H70" fill="none"/>',
  skirt:    '<path d="M32 20 H68 L86 86 H14Z"/><path d="M32 30 H68" fill="none"/>',
  kids:     '<path d="M36 26 L18 36 L25 49 L32 45 V80 H68 V45 L75 49 L82 36 L64 26 C61 32 39 32 36 26Z"/><circle cx="50" cy="58" r="6" fill="#fff"/>',
  book:     '<rect x="24" y="14" width="52" height="72" rx="4"/><path d="M34 14 V86" fill="none"/><path d="M44 30 H66 M44 40 H60" fill="none"/>',
  lamp:     '<path d="M34 18 H66 L76 50 H24Z"/><path d="M50 50 V78" fill="none"/><ellipse cx="50" cy="82" rx="16" ry="5"/>',
  vase:     '<path d="M40 14 H60 L57 32 C78 42 76 82 50 88 C24 82 22 42 43 32Z"/>'
};

const garment = (type, fill) =>
  `<svg viewBox="0 0 100 100" class="w-full h-full" fill="${fill}" stroke="#17241C" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${SHAPES[type]}</svg>`;

// To use real photos, add an `img` URL to any item below; it replaces the illustration.
// e.g. { name: 'Oversized blazer', cat: 'Women', img: 'assets/blazer.jpg', bg: '#F9D3E3' }
const ITEMS = [
  { name: 'Oversized blazer', cat: 'Women',     type: 'coat',     bg: '#F9D3E3', fill: '#B7D1BE' },
  { name: 'Slip dress',       cat: 'Women',     type: 'dress',    bg: '#CFE3D5', fill: '#F8B4D1' },
  { name: 'Pleated skirt',    cat: 'Women',     type: 'skirt',    bg: '#FBE3EC', fill: '#FFFFFF' },
  { name: 'Chunky knit',      cat: 'Women',     type: 'sweater',  bg: '#DDEBDF', fill: '#F8B4D1' },
  { name: 'Denim jacket',     cat: 'Men',       type: 'coat',     bg: '#F7C6DB', fill: '#FFFFFF' },
  { name: 'Cargo trousers',   cat: 'Men',       type: 'trousers', bg: '#CFE3D5', fill: '#E6F0E7' },
  { name: 'Graphic tee',      cat: 'Men',       type: 'tee',      bg: '#FBE3EC', fill: '#B7D1BE' },
  { name: 'Kids’ tee',        cat: 'Children',  type: 'kids',     bg: '#DDEBDF', fill: '#F8B4D1' },
  { name: 'Kids’ knit',       cat: 'Children',  type: 'sweater',  bg: '#F9D3E3', fill: '#E6F0E7' },
  { name: 'Paperback stack',  cat: 'Books',     type: 'book',     bg: '#CFE3D5', fill: '#F8B4D1' },
  { name: 'Design textbook',  cat: 'Books',     type: 'book',     bg: '#FBE3EC', fill: '#B7D1BE' },
  { name: 'Table lamp',       cat: 'Household', type: 'lamp',     bg: '#F7C6DB', fill: '#FFFFFF' },
  { name: 'Ceramic vase',     cat: 'Household', type: 'vase',     bg: '#DDEBDF', fill: '#F8B4D1' }
];

// ---------- Carousel + search + category filters ----------
const track = document.getElementById('track');
const empty = document.getElementById('empty');
const search = document.getElementById('search');
const chips = document.querySelectorAll('#filters .chip');
let activeCat = null;
let query = '';

const card = (i) => `
  <article class="mr-5 shrink-0 w-48 sm:w-60" aria-label="${i.name}, ${i.cat}">
    <div class="aspect-square rounded-3xl border-2 border-ink shadow-soft p-7 sm:p-9 overflow-hidden" style="background:${i.bg}">
      ${i.img ? `<img src="${i.img}" alt="${i.name}" class="w-full h-full object-cover -m-7 sm:-m-9 scale-[1.35]" loading="lazy" />` : garment(i.type, i.fill)}
    </div>
    <div class="px-2 pt-3">
      <p class="font-display uppercase text-sm sm:text-base leading-tight">${i.name}</p>
      <p class="text-xs sm:text-sm font-bold text-hotpink">${i.cat === 'Household' ? 'Household items' : i.cat}</p>
    </div>
  </article>`;

function render() {
  const q = query.trim().toLowerCase();
  const list = ITEMS.filter((i) =>
    (!activeCat || i.cat === activeCat) &&
    (!q || i.name.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q))
  );

  if (!list.length) {
    track.innerHTML = '';
    track.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }
  track.classList.remove('hidden');
  empty.classList.add('hidden');

  // Repeat until there are enough cards to fill the screen, then double for a seamless loop.
  let base = list;
  while (base.length < 9) base = base.concat(list);
  const html = base.map(card).join('');
  track.innerHTML = html + html;
  track.style.animationDuration = (base.length * 4.5) + 's';
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const cat = chip.dataset.cat;
    activeCat = activeCat === cat ? null : cat; // click again to clear
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === activeCat)));
    render();
  });
});
search.addEventListener('input', (e) => { query = e.target.value; render(); });
render();

// ---------- Waitlist form (front-end only) ----------
const form = document.getElementById('waitlist-form');
const msg = document.getElementById('form-msg');
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  msg.classList.remove('hidden', 'text-hotpink', 'text-ink');

  if (!emailRe.test(email)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.classList.add('text-hotpink');
    form.email.focus();
    return;
  }

  // TODO: send `email` to your waitlist provider or API endpoint here.
  msg.textContent = '✔ You’re on the list. See you soon.';
  msg.classList.add('text-ink');
  form.reset();
});
