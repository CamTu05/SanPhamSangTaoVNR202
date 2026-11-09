/**
 * Tạo bộ minh hoạ biên tập nguyên bản cho ebook "Hành trình Độc lập".
 *
 * Đây là TÁC PHẨM VẼ LẠI (editorial illustration), không phải tư liệu lưu trữ,
 * không mô phỏng ảnh lịch sử và không khẳng định địa lý / nhân vật có thật.
 * Chạy: node scripts/generate-illustrations.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/media')
mkdirSync(OUT, { recursive: true })

const C = {
  paper: '#f7f0e3', cream: '#fffaf0', ink: '#292722', red: '#8b332e',
  redSoft: '#b96055', olive: '#526354', oliveSoft: '#dce7df', gold: '#bd985d',
  goldSoft: '#e4dfc5', sand: '#eadfce', muted: '#7a6b55', slate: '#6d7f83',
}
const F = 'Arial, Helvetica, sans-serif'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const txt = (x, y, s, size = 18, fill = C.ink, extra = '') =>
  `<text x="${x}" y="${y}" font-family="${F}" font-size="${size < 24 ? Math.round(size * 1.5) : size}" fill="${fill}" ${extra}>${esc(s)}</text>`

/* ---------- khung chung ---------- */
function frame({ kicker, title, caption, longCaption, note = 'MINH HOẠ BIÊN TẬP · KHÔNG PHẢI TƯ LIỆU LƯU TRỮ', body, accent = C.red }) {
  // viewBox 720x480 + scale(0.8): cùng bố cục 900x600 nhưng chữ to hơn 25%
  // khi ảnh được render ở khổ nhỏ trên trang sách.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480" role="img" aria-labelledby="t d">
<title id="t">${esc(title)} — minh hoạ biên tập</title>
<desc id="d">${esc(longCaption ?? caption)} Sơ đồ minh hoạ khái niệm, không thể hiện địa lý, nhân vật hay sự kiện cụ thể.</desc>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.cream}"/><stop offset="1" stop-color="${C.paper}"/></linearGradient>
<pattern id="grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1" fill="${C.muted}" opacity="0.13"/><circle cx="13" cy="12" r="0.8" fill="${C.muted}" opacity="0.1"/></pattern>
<marker id="arw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${accent}"/></marker>
<marker id="arwO" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${C.olive}"/></marker>
<clipPath id="art"><rect x="26" y="142" width="848" height="352"/></clipPath>
</defs>
<g transform="scale(0.8)">
<rect width="900" height="600" fill="url(#sky)"/>
<rect width="900" height="600" fill="url(#grain)"/>
<rect x="22" y="22" width="856" height="556" rx="12" fill="none" stroke="${C.gold}" stroke-width="2" opacity="0.75"/>
${txt(52, 64, `MINH HOẠ BIÊN TẬP  ·  ${kicker}`, 21, C.gold, 'font-weight="700" letter-spacing="2"')}
${txt(52, 112, title, 44, C.red, 'font-weight="700"')}
<path d="M52 128 H848" stroke="${C.gold}" stroke-width="2" opacity="0.6"/>
<g clip-path="url(#art)">${body}</g>
<rect x="22" y="498" width="856" height="80" fill="${C.ink}" opacity="0.07"/>
<path d="M52 498 H848" stroke="${C.gold}" stroke-width="1.5" opacity="0.6"/>
${txt(52, 534, caption, 32, C.ink, 'font-weight="700"')}
${txt(52, 570, note, 24, C.muted, 'letter-spacing="0.5"')}
</g>
</svg>`
}

/* ---------- các "cảnh" vẽ tay ---------- */
const person = (x, y, s, fill) =>
  `<g fill="${fill}"><circle cx="${x}" cy="${y}" r="${9 * s}"/><path d="M${x - 13 * s} ${y + 34 * s} q${13 * s} ${-20 * s} ${26 * s} 0 z"/></g>`
const flag = (x, y, h, fill) =>
  `<g><path d="M${x} ${y} V${y - h}" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><path d="M${x} ${y - h} l${46} ${13} l-46 ${13} z" fill="${fill}"/></g>`
const tree = (x, y, s, fill) =>
  `<g fill="${fill}"><path d="M${x} ${y} l${-13 * s} ${22 * s} h${26 * s} z"/><path d="M${x} ${y + 14 * s} l${-16 * s} ${24 * s} h${32 * s} z"/><rect x="${x - 2 * s}" y="${y + 36 * s}" width="${4 * s}" height="${10 * s}"/></g>`
const pin = (x, y, fill, r = 16) =>
  `<g><path d="M${x} ${y + r * 1.7} c${-r} ${-r * 1.2} ${-r} ${-r * 2.2} 0 ${-r * 3.1} c${r} ${0.9 * r} ${r} ${1.9 * r} 0 ${r * 3.1} z" fill="${fill}"/><circle cx="${x}" cy="${y - r * 1.5}" r="${r * 0.42}" fill="${C.cream}"/></g>`

function crowd() {
  let s = `<circle cx="720" cy="225" r="76" fill="${C.gold}" opacity="0.5"/>
  <path d="M26 430 h848 v64 H26 z" fill="${C.oliveSoft}"/>
  <g fill="${C.olive}" opacity="0.28">`
  for (let i = 0; i < 12; i++) s += `<rect x="${40 + i * 72}" y="${300 + (i % 3) * 26}" width="54" height="${130 - (i % 3) * 26}" rx="3"/>`
  s += `</g>`
  s += flag(150, 430, 176, C.red) + flag(430, 430, 208, C.red) + flag(716, 430, 158, C.gold)
  const xs = [96, 178, 258, 340, 420, 500, 580, 660, 744, 820]
  xs.forEach((x, i) => { s += person(x, 424 - (i % 2) * 8, 1.5 + (i % 3) * 0.12, i % 3 === 0 ? C.red : C.ink) })
  for (let i = 0; i < 22; i++) s += `<circle cx="${70 + i * 37}" cy="${168 + (i * 53) % 120}" r="3" fill="${C.gold}" opacity="0.7"/>`
  return s
}

function documentSheet({ seal = '1945' } = {}) {
  let s = `<g transform="rotate(-5 450 320)">
  <rect x="252" y="160" width="396" height="318" rx="6" fill="${C.cream}" stroke="${C.gold}" stroke-width="3"/>
  <rect x="272" y="180" width="356" height="278" rx="3" fill="none" stroke="${C.gold}" stroke-width="1" opacity="0.7"/>`
  s += txt(450, 226, 'VĂN BẢN', 26, C.red, 'text-anchor="middle" font-weight="700" letter-spacing="3"')
  s += `<path d="M330 244 H570" stroke="${C.gold}" stroke-width="2"/>`
  for (let i = 0; i < 7; i++) s += `<rect x="300" y="${266 + i * 26}" width="${i % 3 === 2 ? 220 : 300}" height="7" rx="3" fill="${C.ink}" opacity="0.16"/>`
  s += `<circle cx="566" cy="440" r="34" fill="${C.red}" opacity="0.85"/>` + txt(566, 447, seal, 17, C.cream, 'text-anchor="middle" font-weight="700"')
  s += `</g>
  <path d="M120 250 q-30 70 6 140" stroke="${C.olive}" stroke-width="6" fill="none" opacity="0.5"/>
  <path d="M760 250 q34 76 -4 148" stroke="${C.olive}" stroke-width="6" fill="none" opacity="0.5"/>
  <circle cx="146" cy="196" r="12" fill="${C.gold}"/><circle cx="754" cy="196" r="12" fill="${C.gold}"/>`
  return s
}

function mountains({ sun = true } = {}) {
  let s = `${sun ? `<circle cx="712" cy="222" r="62" fill="${C.gold}" opacity="0.75"/>` : ''}
  <path d="M26 420 L210 232 L330 350 L470 196 L650 400 L760 300 L874 410 V494 H26 z" fill="${C.olive}" opacity="0.28"/>
  <path d="M26 452 L180 320 L300 410 L440 276 L600 440 L720 350 L874 452 V494 H26 z" fill="${C.olive}" opacity="0.55"/>
  <path d="M26 494 L150 430 L300 470 L460 402 L620 468 L760 420 L874 470 V494 z" fill="${C.olive}"/>`
  ;[120, 196, 268, 690, 770, 826].forEach((x, i) => { s += tree(x, 386 + (i % 2) * 18, 0.9, C.ink) })
  s += `<path d="M26 470 Q220 420 360 460 T660 442 T874 462" stroke="${C.gold}" stroke-width="5" stroke-dasharray="14 12" fill="none"/>`
  ;[300, 344, 388].forEach((x) => { s += person(x, 452, 0.9, C.red) })
  s += `<path d="M60 200 h150" stroke="${C.gold}" stroke-width="3" opacity="0.6"/>` + txt(60, 190, 'HẬU CẦN', 16, C.muted, 'letter-spacing="2"')
  return s
}

function globe() {
  let s = `<circle cx="450" cy="318" r="150" fill="${C.oliveSoft}" stroke="${C.olive}" stroke-width="4"/>
  <ellipse cx="450" cy="318" rx="60" ry="150" fill="none" stroke="${C.olive}" stroke-width="2.5" opacity="0.65"/>
  <ellipse cx="450" cy="318" rx="112" ry="150" fill="none" stroke="${C.olive}" stroke-width="2" opacity="0.4"/>
  <path d="M300 318 H600 M312 262 H588 M312 374 H588" stroke="${C.olive}" stroke-width="2" opacity="0.5"/>`
  const nodes = [[180, 206, C.red], [722, 214, C.gold], [168, 424, C.olive], [734, 420, C.red]]
  nodes.forEach(([x, y, col], i) => {
    s += `<circle cx="${x}" cy="${y}" r="30" fill="${col}" opacity="0.85"/>`
    s += txt(x, y + 7, String(i + 1), 22, C.cream, 'text-anchor="middle" font-weight="700"')
    s += `<path d="M${x + (x < 450 ? 32 : -32)} ${y} Q450 ${y + (y < 318 ? -70 : 70)} ${450 + (x < 450 ? -152 : 152)} 318" stroke="${col}" stroke-width="2.5" stroke-dasharray="8 8" fill="none" marker-end="url(#arw)"/>`
  })
  s += txt(450, 326, '1950', 46, C.red, 'text-anchor="middle" font-weight="700"')
  s += txt(450, 494, 'CÔNG NHẬN · VIỆN TRỢ · CHIẾN TRANH LẠNH', 16, C.muted, 'text-anchor="middle" letter-spacing="2"')
  return s
}

function mapArrows({ labels = ['A', 'B', 'C'], year = '' } = {}) {
  let s = `<path d="M60 420 Q150 320 260 350 T460 300 T640 250 T840 290 V494 H60 z" fill="${C.goldSoft}" opacity="0.65"/>
  <path d="M60 460 Q220 420 360 440 T640 420 T840 450" stroke="${C.olive}" stroke-width="3" fill="none" opacity="0.6"/>
  <path d="M110 250 Q230 200 360 240 T600 200 T820 230" stroke="${C.gold}" stroke-width="3" fill="none" stroke-dasharray="10 10"/>`
  const pts = [[160, 356], [448, 300], [726, 262]]
  pts.forEach(([x, y], i) => {
    s += `<circle cx="${x}" cy="${y}" r="27" fill="${i === 1 ? C.red : C.olive}"/>`
    s += txt(x, y + 7, labels[i] ?? String(i + 1), 17, C.cream, 'text-anchor="middle" font-weight="700"')
  })
  s += `<path d="M190 350 Q320 270 420 302" stroke="${C.red}" stroke-width="6" fill="none" marker-end="url(#arw)"/>
  <path d="M478 296 Q600 220 696 264" stroke="${C.red}" stroke-width="6" fill="none" marker-end="url(#arw)"/>
  <path d="M716 288 Q620 400 470 440" stroke="${C.olive}" stroke-width="4" stroke-dasharray="12 10" fill="none" marker-end="url(#arwO)"/>`
  if (year) s += txt(820, 200, year, 26, C.red, 'text-anchor="end" font-weight="700"')
  return s
}

function table() {
  let s = `<path d="M150 300 L750 300 L820 452 L80 452 z" fill="${C.sand}" stroke="${C.gold}" stroke-width="3"/>
  <path d="M150 300 L750 300" stroke="${C.ink}" stroke-width="4" opacity="0.35"/>
  <rect x="380" y="326" width="140" height="70" rx="4" fill="${C.cream}" stroke="${C.gold}" stroke-width="2"/>`
  for (let i = 0; i < 4; i++) s += `<rect x="396" y="${340 + i * 14}" width="108" height="5" rx="2" fill="${C.ink}" opacity="0.2"/>`
  for (const x of [250, 330, 570, 650]) s += `<rect x="${x - 26}" y="330" width="52" height="36" rx="3" fill="${C.cream}" stroke="${C.gold}" stroke-width="1.5"/>`
  for (const x of [200, 300, 450, 600, 700]) s += `<circle cx="${x}" cy="270" r="30" fill="${C.olive}" opacity="0.75"/>`
  for (const x of [170, 730]) s += `<path d="M${x} 300 v-70" stroke="${C.ink}" stroke-width="4"/><circle cx="${x}" cy="222" r="16" fill="${C.gold}"/>`
  s += `<path d="M60 200 H840" stroke="${C.gold}" stroke-width="2" opacity="0.6"/>`
  s += txt(60, 190, 'ĐÀM PHÁN · ĐÌNH CHIẾN · TẬP KẾT', 16, C.muted, 'letter-spacing="2"')
  return s
}

function split() {
  return `<rect x="26" y="142" width="424" height="352" fill="${C.oliveSoft}"/>
  <rect x="450" y="142" width="424" height="352" fill="${C.goldSoft}"/>
  <path d="M438 142 Q400 240 452 316 T436 494" stroke="${C.slate}" stroke-width="30" fill="none" opacity="0.75"/>
  <path d="M438 142 Q400 240 452 316 T436 494" stroke="${C.cream}" stroke-width="4" fill="none" stroke-dasharray="12 10"/>
  <rect x="26" y="300" width="848" height="6" fill="${C.cream}" opacity="0.8"/>
  ${txt(238, 226, 'MIỀN BẮC', 28, C.olive, 'text-anchor="middle" font-weight="700" letter-spacing="3"')}
  ${txt(662, 226, 'MIỀN NAM', 28, C.red, 'text-anchor="middle" font-weight="700" letter-spacing="3"')}
  ${txt(238, 262, 'Khôi phục · cải cách', 17, C.ink, 'text-anchor="middle"')}
  ${txt(662, 262, 'Chính quyền · viện trợ', 17, C.ink, 'text-anchor="middle"')}
  ${txt(450, 470, 'GIỚI TUYẾN QUÂN SỰ TẠM THỜI — KHÔNG PHẢI BIÊN GIỚI', 15, C.ink, 'text-anchor="middle" font-weight="700"')}
  ${[120, 200, 280, 560, 660, 760].map((x, i) => `<rect x="${x}" y="${368 + (i % 2) * 22}" width="46" height="60" rx="3" fill="${i < 3 ? C.olive : C.red}" opacity="0.35"/>`).join('')}`
}

function village() {
  let s = `<path d="M26 424 H874" stroke="${C.olive}" stroke-width="6" opacity="0.5"/>
  <rect x="26" y="424" width="848" height="70" fill="${C.oliveSoft}"/>`
  for (let i = 0; i < 22; i++) s += `<path d="M${40 + i * 39} 372 v96" stroke="${C.ink}" stroke-width="6" opacity="0.65"/>`
  s += `<path d="M40 388 H870 M40 416 H870" stroke="${C.ink}" stroke-width="4" opacity="0.55"/>`
  ;[[180, 330], [400, 342], [640, 326]].forEach(([x, y]) => {
    s += `<path d="M${x - 52} ${y + 22} L${x} ${y - 34} L${x + 52} ${y + 22} z" fill="${C.red}" opacity="0.8"/>
    <rect x="${x - 40}" y="${y + 22}" width="80" height="52" fill="${C.cream}" stroke="${C.ink}" stroke-width="2"/>
    <rect x="${x - 10}" y="${y + 40}" width="20" height="34" fill="${C.ink}" opacity="0.55"/>`
  })
  s += `<rect x="772" y="240" width="18" height="184" fill="${C.ink}" opacity="0.7"/>
  <path d="M742 240 h78 l-10 -30 h-58 z" fill="${C.olive}"/>
  <circle cx="781" cy="212" r="8" fill="${C.gold}"/>`
  s += txt(60, 210, 'KIỂM SOÁT ĐẤT VÀ DÂN', 18, C.muted, 'letter-spacing="2"')
  return s
}

function coast() {
  let s = `<circle cx="740" cy="208" r="54" fill="${C.gold}" opacity="0.7"/>
  <path d="M26 300 Q160 270 300 300 T580 296 T874 304" stroke="${C.slate}" stroke-width="4" fill="none" opacity="0.6"/>
  <path d="M26 344 Q180 316 340 346 T640 340 T874 350" stroke="${C.slate}" stroke-width="3" fill="none" opacity="0.45"/>
  <path d="M26 392 Q200 366 380 396 T700 390 T874 398" stroke="${C.slate}" stroke-width="3" fill="none" opacity="0.35"/>
  <rect x="26" y="392" width="848" height="102" fill="${C.slate}" opacity="0.22"/>
  <path d="M26 430 L180 372 L320 424 L470 366 L620 424 L760 380 L874 428 V494 H26 z" fill="${C.olive}" opacity="0.55"/>`
  ;[[190, 328], [560, 336]].forEach(([x, y]) => {
    s += `<path d="M${x - 46} ${y} h92 l-16 22 h-60 z" fill="${C.ink}" opacity="0.8"/>
    <path d="M${x} ${y} v-52" stroke="${C.ink}" stroke-width="4"/><path d="M${x} ${y - 52} l30 12 l-30 12 z" fill="${C.red}"/>`
  })
  s += `<path d="M60 250 Q220 210 380 250" stroke="${C.red}" stroke-width="5" fill="none" stroke-dasharray="12 10" marker-end="url(#arw)"/>`
  s += txt(60, 202, '8/3/1965', 24, C.red, 'font-weight="700"')
  return s
}

function bands({ years = ['1965', '1966', '1967'] } = {}) {
  let s = ''
  for (let i = 0; i < 9; i++) s += `<path d="M${-100 + i * 130} 494 L${40 + i * 130} 142" stroke="${i % 2 ? C.red : C.olive}" stroke-width="26" opacity="0.12"/>`
  s += `<path d="M90 230 Q300 190 500 260 T810 230" stroke="${C.red}" stroke-width="9" fill="none" marker-end="url(#arw)"/>
  <path d="M810 400 Q600 440 400 370 T90 400" stroke="${C.olive}" stroke-width="9" fill="none" marker-end="url(#arwO)"/>`
  years.forEach((y, i) => {
    const x = 200 + i * 250
    s += `<circle cx="${x}" cy="318" r="34" fill="${C.cream}" stroke="${C.gold}" stroke-width="3"/>`
    s += txt(x, 326, y, 17, C.red, 'text-anchor="middle" font-weight="700"')
  })
  s += txt(450, 468, 'TIÊU HAO · BÁO CÁO · KHOẢNG CÁCH NHẬN THỨC', 16, C.muted, 'text-anchor="middle" letter-spacing="1.6"')
  return s
}

function timeline({ years = ['1945', '1950', '1954', '1968', '1973', '1976'] } = {}) {
  let s = `<path d="M80 320 H820" stroke="${C.gold}" stroke-width="6" stroke-linecap="round"/>`
  years.forEach((y, i) => {
    const x = 110 + i * 136
    const up = i % 2 === 0
    s += `<circle cx="${x}" cy="320" r="20" fill="${i === 3 ? C.red : C.olive}"/>`
    s += `<circle cx="${x}" cy="320" r="8" fill="${C.cream}"/>`
    s += `<path d="M${x} 320 v${up ? -70 : 70}" stroke="${C.gold}" stroke-width="2"/>`
    s += txt(x, up ? 232 : 414, y, 21, C.ink, 'text-anchor="middle" font-weight="700"')
    if (up) s += txt(x, 208, 'BƯỚC NGOẶT', 11, C.muted, 'text-anchor="middle" letter-spacing="1.4"')
  })
  s += `<path d="M80 452 H820" stroke="${C.red}" stroke-width="2" stroke-dasharray="8 8" opacity="0.5"/>`
  return s
}

function columns() {
  let s = `<path d="M26 452 H874" stroke="${C.ink}" stroke-width="5" opacity="0.4"/>`
  const xs = [150, 320, 500, 680]
  xs.forEach((x, i) => {
    const broken = i === 2
    s += `<g transform="${broken ? `rotate(-13 ${x} 320)` : ''}">
      <rect x="${x - 38}" y="${216}" width="76" height="236" rx="4" fill="${i % 2 ? C.oliveSoft : C.sand}" stroke="${C.ink}" stroke-width="2"/>
      <rect x="${x - 50}" y="${196}" width="100" height="24" rx="3" fill="${C.gold}"/>
      ${[0, 1, 2].map((k) => `<path d="M${x - 22 + k * 22} 240 V440" stroke="${C.ink}" stroke-width="2" opacity="0.18"/>`).join('')}
      </g>`
  })
  s += `<path d="M500 300 l24 -22 l-14 30 l22 -8" stroke="${C.red}" stroke-width="4" fill="none"/>`
  s += `<circle cx="818" cy="222" r="26" fill="${C.red}" opacity="0.8"/>`
  s += txt(60, 200, 'ĐỨT GÃY LÃNH ĐẠO · BẤT ỔN', 18, C.muted, 'letter-spacing="2"')
  return s
}

function calendar() {
  let s = `<rect x="90" y="168" width="330" height="300" rx="10" fill="${C.cream}" stroke="${C.gold}" stroke-width="3"/>
  <rect x="90" y="168" width="330" height="52" rx="10" fill="${C.red}"/>`
  s += txt(255, 202, 'THÁNG 1 · 1968', 20, C.cream, 'text-anchor="middle" font-weight="700"')
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const x = 112 + c * 62, y = 240 + r * 54
    const hot = r === 3 && c === 2
    s += `<rect x="${x}" y="${y}" width="48" height="40" rx="4" fill="${hot ? C.red : C.oliveSoft}" opacity="${hot ? 1 : 0.8}"/>`
    if (hot) s += txt(x + 24, y + 27, 'TẾT', 14, C.cream, 'text-anchor="middle" font-weight="700"')
  }
  s += `<circle cx="690" cy="216" r="42" fill="${C.gold}" opacity="0.65"/>`
  s += `<path d="M470 452 v-120 h46 v70 h54 v-110 h60 v160 h50 v-90 h46 v90 h60 v58 z" fill="${C.ink}" opacity="0.55"/>`
  s += `<path d="M470 452 H874" stroke="${C.ink}" stroke-width="5" opacity="0.5"/>`
  s += txt(470, 196, 'TÍNH TOÁN · BẤT NGỜ', 18, C.muted, 'letter-spacing="2"')
  return s
}

function cities({ names = ['SÀI GÒN', 'HUẾ', 'TOÀN MIỀN NAM'] } = {}) {
  const pts = [[210, 288], [450, 224], [700, 300]]
  let s = `<path d="M26 442 Q220 400 450 438 T874 430 V494 H26 z" fill="${C.olive}" opacity="0.3"/>`
  s += `<path d="M210 288 Q330 200 450 224 T700 300" stroke="${C.gold}" stroke-width="4" stroke-dasharray="10 10" fill="none"/>`
  pts.forEach(([x, y], i) => {
    for (let r = 34; r <= 70; r += 18) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.red}" stroke-width="2.5" opacity="${0.55 - i * 0.05 - r / 400}"/>`
    s += `<circle cx="${x}" cy="${y}" r="22" fill="${C.red}"/>`
    s += txt(x, y - 92, names[i], 17, C.ink, 'text-anchor="middle" font-weight="700"')
  })
  s += txt(450, 480, 'NHIỀU MẶT TRẬN CÙNG LÚC', 16, C.muted, 'text-anchor="middle" letter-spacing="2"')
  return s
}

function signal({ year = '1975' } = {}) {
  let s = `<path d="M60 420 Q160 300 300 336 T540 280 T840 320 V494 H60 z" fill="${C.goldSoft}" opacity="0.6"/>
  <path d="M60 452 Q240 400 420 444 T840 430" stroke="${C.olive}" stroke-width="3" fill="none" opacity="0.5"/>
  ${[70, 110, 150].map((r) => `<circle cx="470" cy="316" r="${r}" fill="none" stroke="${C.red}" stroke-width="3" opacity="${0.55 - r / 500}"/>`).join('')}`
  s += pin(470, 300, C.red, 22)
  s += `<path d="M180 230 Q320 190 430 250" stroke="${C.red}" stroke-width="5" fill="none" stroke-dasharray="12 10" marker-end="url(#arw)"/>`
  s += txt(60, 202, year, 30, C.red, 'font-weight="700"')
  s += txt(840, 470, 'TÍN HIỆU · THỜI CƠ', 16, C.muted, 'text-anchor="end" letter-spacing="2"')
  return s
}

function flagBallot() {
  let s = `<path d="M180 168 V430" stroke="${C.ink}" stroke-width="7"/>
  <path d="M180 168 H560 V330 H180 z" fill="${C.red}"/>
  <path d="M370 218 l16 34 l37 5 l-27 26 l7 37 l-33 -18 l-33 18 l7 -37 l-27 -26 l37 -5 z" fill="${C.gold}"/>`
  s += `<rect x="560" y="330" width="220" height="140" rx="8" fill="${C.sand}" stroke="${C.gold}" stroke-width="3"/>
  <rect x="600" y="312" width="140" height="26" rx="3" fill="${C.cream}" stroke="${C.gold}" stroke-width="2"/>`
  s += `<g transform="rotate(-8 690 250)"><rect x="638" y="196" width="104" height="80" rx="4" fill="${C.cream}" stroke="${C.gold}" stroke-width="2"/>
  ${[0, 1, 2].map((i) => `<rect x="652" y="${214 + i * 18}" width="76" height="5" rx="2" fill="${C.ink}" opacity="0.2"/>`).join('')}</g>`
  s += txt(60, 470, 'BẦU CỬ · THỐNG NHẤT NHÀ NƯỚC', 17, C.muted, 'letter-spacing="2"')
  return s
}

function helicopter() {
  let s = `<circle cx="740" cy="212" r="50" fill="${C.gold}" opacity="0.65"/>
  <path d="M26 430 L200 316 L360 420 L520 300 L700 414 L874 330 V494 H26 z" fill="${C.olive}" opacity="0.45"/>
  <path d="M26 466 Q220 420 440 458 T874 442 V494 H26 z" fill="${C.olive}"/>
  <g transform="translate(320 214)">
    <path d="M0 44 q0 -34 42 -34 h76 q40 0 62 26 l24 4 h-30 q-18 24 -60 24 H30 q-30 0 -30 -20 z" fill="${C.ink}" opacity="0.82"/>
    <path d="M56 10 v-22 M150 10 h116" stroke="${C.ink}" stroke-width="6"/>
    <path d="M20 -14 h240" stroke="${C.ink}" stroke-width="7"/>
    <path d="M96 64 v22 M150 64 v22" stroke="${C.ink}" stroke-width="4"/>
    <circle cx="96" cy="36" r="11" fill="${C.gold}"/>
  </g>
  <path d="M540 240 Q650 190 780 250" stroke="${C.red}" stroke-width="5" fill="none" stroke-dasharray="12 10" marker-end="url(#arw)"/>
  ${txt(60, 202, 'RÚT QUÂN · CHUYỂN TRÁCH NHIỆM', 17, C.muted, 'letter-spacing="2"')}`
  return s
}

function attritionPlan() {
  let s = `<rect x="26" y="142" width="848" height="352" fill="${C.goldSoft}" opacity="0.35"/>`
  for (let i = 0; i < 6; i++) s += `<circle cx="${140 + i * 128}" cy="${430 - (i % 3) * 60}" r="26" fill="none" stroke="${C.olive}" stroke-width="3" opacity="0.6"/>`
  s += `<path d="M100 380 Q240 220 420 280 T800 230" stroke="${C.red}" stroke-width="8" fill="none" marker-end="url(#arw)"/>
  <path d="M800 420 Q620 320 460 380 T120 300" stroke="${C.olive}" stroke-width="6" fill="none" stroke-dasharray="14 10" marker-end="url(#arwO)"/>`
  ;[[180, 250], [460, 330], [730, 210]].forEach(([x, y], i) => {
    s += `<rect x="${x - 54}" y="${y - 22}" width="108" height="44" rx="6" fill="${C.cream}" stroke="${C.gold}" stroke-width="2"/>`
    s += txt(x, y + 6, ['TẬP TRUNG', 'PHÂN TÁN', 'CỨ ĐIỂM'][i], 14, C.ink, 'text-anchor="middle" font-weight="700"')
  })
  s += txt(450, 480, 'MỘT KẾ HOẠCH, HAI CÁCH TÍNH', 16, C.muted, 'text-anchor="middle" letter-spacing="2"')
  return s
}

/* ---------- danh mục 23 minh hoạ ---------- */
/* Nhãn nằm trên nền địa hình: thêm viền kem để không bị chìm vào màu núi. */
const halo = (x, y, s, size = 16, fill = C.muted, anchor = 'start') =>
  txt(x, y, s, size, fill, `paint-order="stroke" stroke="${C.cream}" stroke-width="5" stroke-linejoin="round"${anchor === 'middle' ? ' text-anchor="middle"' : anchor === 'end' ? ' text-anchor="end"' : ''}`)

/* ---------- cảnh cho chương Điện Biên Phủ ---------- */
function valley() {
  let s = `<circle cx="730" cy="208" r="54" fill="${C.gold}" opacity="0.6"/>
  <path d="M26 494 L26 300 L200 168 L330 300 L450 250 L580 340 L720 200 L874 320 V494 z" fill="${C.olive}" opacity="0.35"/>
  <path d="M26 494 L26 392 L180 306 L320 396 L470 336 L620 424 L760 344 L874 404 V494 z" fill="${C.olive}" opacity="0.6"/>
  <ellipse cx="450" cy="452" rx="298" ry="50" fill="${C.goldSoft}" opacity="0.85"/>
  <path d="M210 452 H690" stroke="${C.muted}" stroke-width="5" stroke-dasharray="18 10" opacity="0.75"/>
  <path d="M120 246 Q280 330 396 418" stroke="${C.red}" stroke-width="7" fill="none" marker-end="url(#arw)"/>
  <path d="M792 264 Q644 352 522 424" stroke="${C.olive}" stroke-width="7" fill="none" marker-end="url(#arwO)"/>`
  s += halo(96, 200, 'HỎA LỰC · SÂN BAY', 17)
  s += halo(852, 216, 'BAO VÂY · HẬU CẦN', 17, C.muted, 'end')
  s += halo(450, 300, 'THUNG LŨNG', 15, C.muted, 'middle')
  ;[150, 200, 250].forEach((x, i) => { s += tree(x, 300 + i * 12, 0.85, C.ink) })
  ;[700, 750, 800].forEach((x, i) => { s += tree(x, 330 + i * 10, 0.85, C.ink) })
  return s
}

function supplyLine() {
  let s = `<path d="M26 494 L26 336 L164 236 L300 328 L432 258 L566 348 L700 266 L874 348 V494 z" fill="${C.olive}" opacity="0.32"/>
  <path d="M26 494 Q200 428 340 470 T640 448 T874 470 V494 z" fill="${C.olive}" opacity="0.55"/>
  <path d="M56 468 C160 418 200 458 282 418 S420 358 500 398 S640 438 722 388 S822 348 862 358" stroke="${C.gold}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M56 468 C160 418 200 458 282 418 S420 358 500 398 S640 438 722 388 S822 348 862 358" stroke="${C.cream}" stroke-width="2" stroke-dasharray="10 14" fill="none"/>`
  // người gùi hàng và xe đạp thồ
  ;[[150, 452], [250, 428], [560, 408], [660, 398]].forEach(([x, y], i) => {
    s += `<g><circle cx="${x}" cy="${y - 34}" r="8" fill="${C.ink}"/><path d="M${x - 12} ${y} q12 -22 24 0 z" fill="${C.ink}"/>
    <rect x="${x - 16}" y="${y - 54}" width="32" height="14" rx="3" fill="${C.red}" opacity="0.85"/></g>`
  })
  // khẩu pháo kéo
  s += `<g transform="translate(742 336)"><circle cx="-8" cy="20" r="13" fill="${C.ink}"/><circle cx="30" cy="20" r="13" fill="${C.ink}"/>
  <path d="M-30 4 L46 -26" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><path d="M-30 4 L-46 22" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/></g>`
  // chiến hào
  s += `<path d="M320 486 l44 -22 l-8 26 l46 -20 l-6 24 l48 -22 l-6 24" stroke="${C.red}" stroke-width="6" fill="none" stroke-linejoin="round"/>`
  s += halo(56, 190, 'KÉO PHÁO · MỞ ĐƯỜNG · DÂN CÔNG', 17)
  return s
}

function assault() {
  let s = `<circle cx="740" cy="206" r="48" fill="${C.gold}" opacity="0.6"/>
  <path d="M26 494 L26 404 L180 334 L320 406 L470 344 L620 414 L760 348 L874 408 V494 z" fill="${C.olive}" opacity="0.45"/>
  <path d="M300 494 Q450 322 600 494 z" fill="${C.olive}"/>`
  ;[62, 104, 146].forEach((r, i) => { s += `<circle cx="450" cy="438" r="${r}" fill="none" stroke="${C.red}" stroke-width="3" opacity="${0.5 - i * 0.13}"/>` })
  s += flag(450, 372, 104, C.red)
  s += `<path d="M150 300 Q300 356 372 408" stroke="${C.red}" stroke-width="6" fill="none" marker-end="url(#arw)"/>
  <path d="M760 306 Q612 358 530 410" stroke="${C.red}" stroke-width="6" fill="none" marker-end="url(#arw)"/>
  <path d="M450 190 V246" stroke="${C.red}" stroke-width="6" fill="none" marker-end="url(#arw)"/>`
  s += halo(450, 178, '7/5/1954', 22, C.red, 'middle')
  s += halo(56, 196, 'VÒNG VÂY SIẾT CHẶT', 17)
  return s
}

function portraits() {
  const xs = [190, 450, 710]
  const labels = ['MỤC TIÊU', 'CHỈ HUY', 'HỆ THỐNG']
  let s = `<path d="M26 442 Q220 404 450 436 T874 430 V494 H26 z" fill="${C.olive}" opacity="0.28"/>`
  xs.forEach((x, i) => {
    s += `<circle cx="${x}" cy="308" r="84" fill="${i === 1 ? C.goldSoft : C.oliveSoft}" stroke="${C.gold}" stroke-width="2.5"/>`
    s += `<g fill="${C.ink}" opacity="0.5"><circle cx="${x}" cy="284" r="29"/><path d="M${x - 50} 372 q50 -62 100 0 z"/></g>`
    s += txt(x, 424, labels[i], 16, C.muted, 'text-anchor="middle" letter-spacing="2"')
  })
  s += `<path d="M282 308 H358 M542 308 H618" stroke="${C.gold}" stroke-width="3" stroke-dasharray="9 9"/>`
  s += halo(450, 200, 'QUYẾT ĐỊNH KHÔNG CỦA RIÊNG AI', 18, C.muted, 'middle')
  return s
}

const items = [
  { id: 'ill-01-august-1945', k: 'MỞ ĐẦU', t: 'Khoảng trống quyền lực', c: 'Mùa thu 1945: xã hội kiệt quệ, bộ máy cai trị khủng hoảng và một thời cơ rất ngắn.', b: crowd() },
  { id: 'ill-02-ballot-1946', k: 'CHƯƠNG 1', t: 'Một nhà nước mới', c: 'Tổng tuyển cử 6/1/1946 và Quốc hội khóa I đặt nền tảng đại diện.', b: documentSheet({ seal: '1946' }) },
  { id: 'ill-04-resistance-1946', k: 'CHƯƠNG 2', t: '19/12/1946', c: 'Chiến đấu trong đô thị nhằm kéo dài thời gian, không phải trận quyết định nhanh.', b: `<g>${crowd()}</g>` },
  { id: 'ill-05-base-forces', k: 'CHƯƠNG 2', t: 'Dựng căn cứ, xây lực lượng', c: 'Căn cứ, bộ đội địa phương, dân công và chủ lực được củng cố giai đoạn 1948–1949.', b: mountains() },
  { id: 'ill-06-world-1950', k: 'CHƯƠNG 3', t: 'Bối cảnh quốc tế mới', c: 'Công nhận ngoại giao, viện trợ và Chiến tranh Lạnh đan xen vấn đề độc lập.', b: globe() },
  { id: 'ill-07-campaigns-1953', k: 'CHƯƠNG 3', t: 'Chiến dịch và hậu phương', c: '1951–1953: thành công lẫn tổn thất buộc cách đánh tiếp tục điều chỉnh.', b: mapArrows({ labels: ['1', '2', '3'], year: '1951–53' }) },
  { id: 'ill-08-geneva-1954', k: 'CHƯƠNG 4', t: 'Bàn đàm phán Genève', c: 'Văn kiện tháng 7/1954 quy định đình chiến, tập kết và chuyển quân.', b: table() },
  { id: 'ill-09-two-regions', k: 'CHƯƠNG 5', t: 'Hai miền, hai chương trình', c: 'Giới tuyến gần vĩ tuyến 17 chỉ là ranh giới quân sự tạm thời.', b: split() },
  { id: 'ill-10-strategic-hamlet', k: 'CHƯƠNG 6', t: 'Ấp chiến lược', c: 'Tổ chức lại cư dân nhằm tách lực lượng nổi dậy khỏi cơ sở xã hội.', b: village() },
  { id: 'ill-11-instability-1963', k: 'CHƯƠNG 6', t: 'Bất ổn chính trị', c: 'Các nhóm cầm quyền thay đổi nhanh, quản trị và chỉ huy bị gián đoạn.', b: columns() },
  { id: 'ill-12-attrition-1967', k: 'CHƯƠNG 7', t: 'Chiến tranh tiêu hao', c: 'Thống kê tổn thất khó phản ánh quyền kiểm soát chính trị trên thực địa.', b: bands() },
  { id: 'ill-13-vietnamization', k: 'CHƯƠNG 8', t: 'Việt Nam hóa chiến tranh', c: 'Rút dần quân Mỹ, tăng trang bị và trách nhiệm cho quân đội Việt Nam Cộng hòa.', b: helicopter() },
  { id: 'ill-14-paris-document', k: 'CHƯƠNG 8', t: 'Đàm phán Paris', c: 'Đàm phán công khai và bí mật kéo dài trong khi chiến sự vẫn tiếp diễn.', b: documentSheet({ seal: '1973' }) },
  { id: 'ill-15-post-paris', k: 'CHƯƠNG 9', t: 'Sau Paris', c: '1973–1974: hai phía tranh giành địa bàn, bổ sung lực lượng và theo dõi viện trợ.', b: mapArrows({ labels: ['B', 'V', 'T'], year: '1973–74' }) },
  { id: 'ill-16-reunification-1976', k: 'CHƯƠNG 9', t: 'Thống nhất nhà nước', c: '30/4/1975 kết thúc chiến tranh; 2/7/1976 hoàn tất thống nhất về nhà nước.', b: flagBallot() },
  { id: 'ill-17-turning-points', k: 'KẾT SÁCH', t: 'Những bước ngoặt', c: 'Sáu mốc cần đọc cùng nguyên nhân, diễn biến, hệ quả và ý nghĩa.', b: timeline() },
  { id: 'ill-18-navarre-plan', k: 'CHƯƠNG 3', t: 'Kế hoạch Navarre', c: 'Tập trung lực lượng để giành ưu thế, nhưng bị buộc phải phân tán trên nhiều hướng.', b: attritionPlan() },
  { id: 'ill-20-tet-eve', k: 'CHƯƠNG 7', t: 'Trước Tết 1968', c: 'Kỳ vọng nổi dậy và mức độ dự đoán của hai bên đều không diễn ra như kế hoạch.', b: calendar() },
  { id: 'ill-23-phuoc-long', k: 'CHƯƠNG 9', t: 'Phước Long · 6/1/1975', c: 'Một tín hiệu quan trọng, nhưng một trận đánh đơn lẻ chưa quyết định toàn cuộc.', b: signal() },
  { id: 'ill-24-valley', k: 'CHƯƠNG 4', t: 'Một thung lũng, hai tính toán', c: 'Pháp dựa vào hỏa lực và sân bay; Việt Minh dựa vào bao vây, hậu cần và thời gian.', b: valley() },
  { id: 'ill-25-preparation', k: 'CHƯƠNG 4', t: 'Chuẩn bị và đổi cách đánh', c: 'Mở đường, kéo pháo, đào chiến hào: chuẩn bị hậu cần quyết định nhịp độ chiến dịch.', b: supplyLine() },
  { id: 'ill-26-phase-two', k: 'CHƯƠNG 4', t: 'Đợt II · 30/3–30/4/1954', c: 'Chiến hào tiến dần, chia cắt và thu hẹp khu phòng thủ phía đông.', b: mapArrows({ labels: ['Đ', 'T', 'B'], year: 'ĐỢT II' }) },
  { id: 'ill-28-people', k: 'CHƯƠNG 4', t: 'Con người trong bước ngoặt', c: 'Quyết định chiến lược nằm trong một hệ thống chỉ huy, hậu cần và chính trị rộng lớn.', b: portraits() },
]

/** Nhãn ngắn in trong ảnh; câu mô tả đầy đủ nằm ở figcaption của trang. */
const tags = [
  'MÙA THU 1945', '6/1/1946 · LÁ PHIẾU', '19/12/1946 · ĐÔ THỊ', '1948–1949 · CĂN CỨ',
  '1950 · THẾ GIỚI', '1951–1953 · CHIẾN DỊCH', 'THÁNG 7/1954 · GENÈVE', 'VĨ TUYẾN 17',
  'ẤP CHIẾN LƯỢC', 'SAU 1963', '1965–1967 · TIÊU HAO', 'VIỆT NAM HÓA',
  '1968–1973 · PARIS', '1973–1974 · ĐỊA BÀN', '1976 · THỐNG NHẤT', 'SÁU BƯỚC NGOẶT',
  'KẾ HOẠCH NAVARRE', 'TẾT 1968', '6/1/1975 · PHƯỚC LONG', 'HỎA LỰC ↔ BAO VÂY',
  'KÉO PHÁO · MỞ ĐƯỜNG', 'CHIẾN HÀO · SIẾT VÂY', 'QUYẾT ĐỊNH · HỆ THỐNG',
]

for (const [i, it] of items.entries()) {
  const svg = frame({ kicker: it.k, title: it.t, caption: tags[i], longCaption: it.c, body: it.b, accent: C.red })
  writeFileSync(resolve(OUT, `${it.id}.svg`), svg, 'utf8')
}
console.log(`Da tao ${items.length} minh hoa SVG tai ${OUT}`)
