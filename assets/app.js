// ====== Config ======
const LINE_URL = "https://page.line.me/GU7ufB5K"; // <-- ใส่ลิงก์ LINE OA ของคุณ
const PHONE = "02-124-5989";              // <-- ใส่เบอร์คุณ
const EMAIL = "wam.info2025@gmail.com";         // <-- ใส่อีเมลคุณ

// ====== Helpers ======
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

// ====== Inject header/footer (simple reuse) ======
function mountHeaderFooter(){
  const header = `
  <header class="header">
    <div class="container">
      <div class="nav">
        <a class="brand" href="index.html" aria-label="Home">
          <div class="logo"></div>
          <div>
            <div style="font-size:14px; color:var(--muted); font-weight:800;">STEEL</div>
            <div style="margin-top:-2px;">Best Deal Hub</div>
          </div>
        </a>

        <nav class="navlinks" aria-label="Main navigation">
          <a href="about.html">เกี่ยวกับเรา</a>
          <a href="howto.html">การสั่งซื้อและชำระเงิน</a>

          <div class="dropdown">
            <a class="dropbtn" href="products.html">
              สินค้าทั้งหมด
              <span style="opacity:.7">▾</span>
            </a>
            <div class="menu" role="menu" aria-label="Products">
              <a href="products.html#rebar">เหล็กเส้น</a>
              <a href="products.html#plate">เหล็กแผ่นดำ</a>
              <a href="products.html#channel">เหล็กรางน้ำ</a>
              <a href="products.html#c">เหล็กตัวซี</a>
              <a href="products.html#angle">เหล็กฉาก</a>
              <a href="products.html#box-tis">เหล็กกล่อง มอก.</a>
              <a href="products.html#box">เหล็กกล่องทั่วไป</a>
              <a href="products.html#galv">เหล็กกัลวาไนซ์</a>
              <a href="products.html#beam">เหล็กบีม</a>
            </div>
          </div>

          <a href="prompt.html">บริการส่งด่วน</a>
          <a href="blog.html">บทความ</a>
          <a href="contact.html">ติดต่อเรา</a>
        </nav>

        <div class="nav-cta">
          <button class="btn primary" id="btnQuoteTop">ขอใบเสนอราคา</button>
          <button class="burger" id="btnBurger" aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="drawer" id="drawer" aria-hidden="true">
    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <div class="brand">
          <div class="logo"></div>
          <div style="font-weight:900">Menu</div>
        </div>
        <button class="close" id="btnClose" aria-label="Close menu">✕</button>
      </div>

      <a href="index.html">หน้าแรก</a>
      <a href="about.html">เกี่ยวกับเรา</a>
      <a href="howto.html">การสั่งซื้อและชำระเงิน</a>
      <a href="products.html">สินค้าทั้งหมด</a>
      <a href="prompt.html">บริการส่งด่วน</a>
      <a href="blog.html">บทความ</a>
      <a href="contact.html">ติดต่อเรา</a>
      <div class="hr"></div>
      <button class="btn primary" id="btnQuoteDrawer" style="width:100%">ขอใบเสนอราคา</button>
      <a class="btn ghost" style="margin-top:10px; text-align:center" href="${LINE_URL}" target="_blank" rel="noreferrer">แอดไลน์คุยไว ⚡</a>
    </div>
  </div>
  `;

  const footer = `
  <footer class="footer">
    <div class="container">
      <div class="grid" style="grid-template-columns: 1.2fr .8fr; gap:16px">
        <div>
          <div class="brand" style="margin-bottom:10px">
            <div class="logo"></div>
            <div style="font-weight:900">Best Deal Hub</div>
          </div>
          <div class="small">
            ของพร้อมครบ จบงานไว — ถ้าเหล็กทำให้ใจสั่น… แปลว่าคุณยังไม่ได้ขอใบเสนอราคา 😄
          </div>
        </div>
        <div class="small" style="text-align:right">
          <div>โทร: <b style="color:var(--text)">${PHONE}</b></div>
          <div>อีเมล: <b style="color:var(--text)">${EMAIL}</b></div>
          <div style="margin-top:8px">© <span id="year"></span> All rights reserved.</div>
        </div>
      </div>
    </div>
  </footer>
  `;

  const mountHeader = $("#site-header");
  const mountFooter = $("#site-footer");
  if(mountHeader) mountHeader.innerHTML = header;
  if(mountFooter) mountFooter.innerHTML = footer;

  const y = $("#year");
  if(y) y.textContent = new Date().getFullYear();
}

// ====== Drawer controls ======
function initDrawer(){
  const drawer = $("#drawer");
  const open = $("#btnBurger");
  const close = $("#btnClose");
  if(!drawer || !open || !close) return;

  const set = (on) => {
    drawer.style.display = on ? "block" : "none";
    drawer.setAttribute("aria-hidden", on ? "false" : "true");
  };
  open.addEventListener("click", () => set(true));
  close.addEventListener("click", () => set(false));
  drawer.addEventListener("click", (e) => {
    if(e.target === drawer) set(false);
  });
}

// ====== Quote Modal ======
function initModal(){
  const modal = $("#quoteModal");
  if(!modal) return;

  const openers = ["#btnQuoteTop", "#btnQuoteHero", "#btnQuoteDrawer", "#btnQuoteSection", "#fabQuote"]
    .map(s => $(s)).filter(Boolean);

  const btnClose = $("#btnCloseModal");
  const btnLine = $("#btnOpenLine");
  const form = $("#quoteForm");

  const set = (on) => modal.style.display = on ? "flex" : "none";

  openers.forEach(btn => btn.addEventListener("click", () => set(true)));
  if(btnClose) btnClose.addEventListener("click", () => set(false));
  modal.addEventListener("click", (e) => { if(e.target === modal) set(false); });

  if(btnLine){
    btnLine.addEventListener("click", () => window.open(LINE_URL, "_blank", "noopener,noreferrer"));
  }

  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      const msg =
`ขอใบเสนอราคา 🧾
ชื่อ: ${data.name || "-"}
เบอร์: ${data.phone || "-"}
ประเภทสินค้า: ${data.type || "-"}
ขนาด/สเปก: ${data.spec || "-"}
จำนวน: ${data.qty || "-"}
พื้นที่จัดส่ง: ${data.area || "-"}
วันที่ต้องการใช้: ${data.date || "-"}
รายละเอียดเพิ่มเติม: ${data.note || "-"}`;

      // แนะนำให้ส่งข้อความนี้ไปทาง LINE
      navigator.clipboard?.writeText(msg).catch(()=>{});
      alert("คัดลอกข้อความใบขอราคาให้แล้ว ✅\nวางส่งใน LINE ได้เลย (ถ้าไม่ติดบล็อกคลิปบอร์ดนะ 😄)");
    });
  }
}

// ====== Floating buttons ======
function initFab(){
  const lineBtn = $("#fabLine");
  if(lineBtn) lineBtn.addEventListener("click", ()=> window.open(LINE_URL, "_blank", "noopener,noreferrer"));
}

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  mountHeaderFooter();
  initDrawer();
  initModal();
  initFab();
});



