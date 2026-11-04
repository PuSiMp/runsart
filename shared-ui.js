(() => {
  const FILE_KEY = "runsart-active-file";
  const root = document.documentElement;
  const style = document.createElement("style");
  style.textContent = `
    :root{--mute:#536052}
    @media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--mute:#aab5ac}}
    :root[data-theme="dark"]{--mute:#aab5ac}
    .runsart-layout{display:grid;grid-template-columns:238px minmax(0,1fr);height:100vh;height:100dvh;min-height:0}
    .runsart-layout>main{width:100%;max-width:none;min-width:0;min-height:0;margin:0;overflow-y:auto;overscroll-behavior:contain}
    .runsart-sidebar{position:sticky;top:0;z-index:20;display:flex;flex-direction:column;gap:26px;height:100vh;height:100dvh;padding:22px 14px;border-right:1px solid var(--line);background:var(--panel);transition:padding .2s ease}
    .runsart-sidehead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 6px}
    .runsart-brand{display:flex;flex-direction:column;min-width:0;color:var(--ink);font-weight:700;text-decoration:none}
    .runsart-brand small{color:var(--mute);font-size:.7rem;font-weight:400}
    .runsart-side-toggle{flex:0 0 36px;width:36px;height:36px;padding:0;font-size:1.2rem}
    .runsart-nav{display:flex;flex-direction:column;gap:6px}
    .runsart-nav a{display:flex;align-items:center;gap:11px;min-height:42px;padding:8px 10px;border-radius:9px;color:var(--mute);font-size:.9rem;text-decoration:none;white-space:nowrap;transition:background-color .15s ease,color .15s ease}
    .runsart-nav a:hover,.runsart-nav a[aria-current="page"]{color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,transparent)}
    .runsart-nav a[aria-current="page"]{font-weight:700}
    .runsart-nav-icon{flex:0 0 20px;width:20px;height:20px}
    .runsart-layout.is-collapsed{grid-template-columns:76px minmax(0,1fr)}
    .runsart-layout.is-collapsed .runsart-sidebar{padding-inline:10px}
    .runsart-layout.is-collapsed .runsart-sidehead{justify-content:center;padding:0}
    .runsart-layout.is-collapsed .runsart-brand,.runsart-layout.is-collapsed .runsart-nav a span{display:none}
    .runsart-layout.is-collapsed .runsart-nav a{justify-content:center;padding-inline:0}
    .runsart-layout.is-collapsed .runsart-nav-icon{width:21px;height:21px}
    .runsart-layout .toolnav{display:none!important}
    button:active:not(:disabled),a:active,.card:active,[role="tab"]:active{transform:scale(.96)}
    .runsart-context{position:sticky;top:0;z-index:25;display:flex;flex:0 0 auto;align-items:center;gap:8px;min-height:40px;margin:0;padding:5px 8px;border:1px solid var(--line);border-radius:10px;background:color-mix(in srgb,var(--panel) 94%,transparent);color:var(--ink);font-size:.8rem;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
    .runsart-context-label{color:var(--mute);font-weight:500;white-space:nowrap}
    .runsart-context-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
    .runsart-context-clear{flex:none;min-height:32px;padding:3px 8px;font-size:.75rem}
    .runsart-toast-source{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;min-height:0!important}
    .runsart-toasts{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));z-index:1000;display:grid;gap:8px;width:min(380px,calc(100vw - 32px));pointer-events:none}
    .runsart-toast{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:12px;background:var(--panel);color:var(--ink);box-shadow:0 8px 26px #17211b24;font-size:.88rem;line-height:1.4;pointer-events:auto;opacity:0;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease}
    .runsart-toast.is-visible{opacity:1;transform:translateY(0)}
    .runsart-toast[data-kind="error"]{border-left-color:var(--bad)}
    .runsart-toast[data-kind="success"]{border-left-color:var(--good,var(--accent))}
    .runsart-toast-message{flex:1;min-width:0;overflow-wrap:anywhere}
    .runsart-toast-close{flex:none;min-width:32px;min-height:32px;margin:-5px -7px 0 0;padding:0;border:0;background:transparent;color:var(--mute);font-size:1.2rem;line-height:1}
    @media(max-width:760px){
      .runsart-layout,.runsart-layout.is-collapsed{display:flex;flex-direction:column;height:100vh;height:100dvh}
      .runsart-sidebar,.runsart-layout.is-collapsed .runsart-sidebar{position:sticky;top:0;flex:none;width:100%;height:auto;gap:8px;padding:8px 12px;border-right:0;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--panel) 95%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      .runsart-sidehead,.runsart-layout.is-collapsed .runsart-sidehead{justify-content:space-between;padding:0 4px}
      .runsart-brand,.runsart-layout.is-collapsed .runsart-brand{display:flex}
      .runsart-brand small{display:none}
      .runsart-side-toggle{display:none}
      .runsart-nav,.runsart-layout.is-collapsed .runsart-nav{flex-direction:row;gap:4px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}
      .runsart-nav::-webkit-scrollbar{display:none}
      .runsart-nav a,.runsart-layout.is-collapsed .runsart-nav a{flex:0 0 auto;min-height:38px;gap:7px;padding:7px 10px;font-size:.81rem}
      .runsart-nav a span,.runsart-layout.is-collapsed .runsart-nav a span{display:inline}
      .runsart-nav-icon,.runsart-layout.is-collapsed .runsart-nav-icon{width:17px;height:17px;flex-basis:17px}
      .runsart-layout>main{flex:1;min-height:0;max-height:none;overflow-y:auto}
      .runsart-layout>main .runsart-context{top:0}
    }
    @media(max-width:760px){.runsart-layout.is-mobile-analysis>main{height:auto;max-width:none;display:flex;flex-direction:column;gap:8px;overflow:hidden;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px))}}
    @media(max-width:560px){.runsart-context{gap:6px;padding:4px 7px}.runsart-context-label{font-size:.74rem}.runsart-context-clear{min-height:40px}.runsart-toasts{right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));width:calc(100vw - 24px)}}
    @media(prefers-reduced-motion:reduce){.runsart-sidebar,.runsart-nav a{transition:none}}
    @media(prefers-reduced-motion:reduce){.runsart-toast{transition:none}}
  `;
  document.head.appendChild(style);

  const main = document.querySelector("main");
  let context = null;
  const toolPaths = [
    { href: "/", label: "หน้าแรก", icon: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>' },
    { href: "/tools/slope/", label: "แผนที่และความชัน", icon: '<path d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/>' },
    { href: "/tools/training%20analysis/", label: "วิเคราะห์การซ้อม", icon: '<path d="M3 12h4l3-8 4 16 3-8h4"/>' },
    { href: "/tools/race%20planner/", label: "วางแผนแข่ง", icon: '<path d="M5 21V4m0 0c6-4 8 4 14 0v10c-6 4-8-4-14 0"/>' }
  ];
  const isDashboard = !!document.querySelector(".wrap .sidebar");
  if (main && !isDashboard) {
    const path = decodeURIComponent(location.pathname).replace(/\/+$/, "") || "/";
    const links = toolPaths.map(item => {
      const current = decodeURIComponent(item.href).replace(/\/+$/, "") || "/";
      const active = path === current || (current !== "/" && path.endsWith(current + "/index.html"));
      return `<a href="${item.href}"${active ? ' aria-current="page"' : ""} title="${item.label}"><svg class="runsart-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.icon}</svg><span>${item.label}</span></a>`;
    }).join("");
    const layout = document.createElement("div");
    layout.className = "runsart-layout";
    if (main.querySelector(".mobile-tabs")) layout.classList.add("is-mobile-analysis");
    const sidebar = document.createElement("aside");
    sidebar.className = "runsart-sidebar";
    sidebar.setAttribute("aria-label", "เมนูหลัก");
    sidebar.innerHTML = `<div class="runsart-sidehead"><a class="runsart-brand" href="/"><span>RunSart</span><small>ศาสตร์แห่งการวิ่ง</small></a><button type="button" class="runsart-side-toggle" aria-label="ยุบเมนู" aria-expanded="true" title="ยุบเมนู">‹</button></div><nav class="runsart-nav" aria-label="เครื่องมือ">${links}</nav>`;
    main.parentNode.insertBefore(layout, main);
    layout.append(sidebar, main);
    let collapsed = false;
    try { collapsed = localStorage.getItem("runsart-sidebar-collapsed") === "true"; }
    catch (error) { console.error("อ่านสถานะเมนูไม่ได้", error); }
    layout.classList.toggle("is-collapsed", collapsed);
    const toggle = sidebar.querySelector(".runsart-side-toggle");
    const renderToggle = () => {
      const isCollapsed = layout.classList.contains("is-collapsed");
      toggle.textContent = isCollapsed ? "›" : "‹";
      toggle.setAttribute("aria-expanded", String(!isCollapsed));
      toggle.setAttribute("aria-label", isCollapsed ? "ขยายเมนู" : "ยุบเมนู");
      toggle.title = toggle.getAttribute("aria-label");
    };
    toggle.addEventListener("click", () => {
      layout.classList.toggle("is-collapsed");
      try { localStorage.setItem("runsart-sidebar-collapsed", String(layout.classList.contains("is-collapsed"))); }
      catch (error) { console.error("บันทึกสถานะเมนูไม่ได้", error); }
      renderToggle();
    });
    renderToggle();
  }
  if (main) {
    const bar = document.createElement("aside");
    bar.className = "runsart-context";
    bar.setAttribute("aria-label", "ไฟล์ที่กำลังใช้งาน");
    const label = document.createElement("span");
    label.className = "runsart-context-label";
    label.textContent = "กำลังทำงานกับไฟล์:";
    const name = document.createElement("strong");
    name.className = "runsart-context-name";
    name.setAttribute("aria-live", "polite");
    const clear = document.createElement("button");
    clear.className = "runsart-context-clear";
    clear.type = "button";
    clear.textContent = "ล้างชื่อไฟล์";
    clear.setAttribute("aria-label", "ล้างชื่อไฟล์จากแถบสถานะ โดยไม่ลบข้อมูลที่เปิดอยู่");
    clear.title = clear.getAttribute("aria-label");
    clear.addEventListener("click", () => api.clearFile());
    bar.append(label, name, clear);
    main.prepend(bar);
    context = { bar, name, clear };
  }

  let toastRegion = null;
  const toastTimers = new WeakMap();
  let statusToast = null;
  let statusTimer = 0;
  let lastToastText = "";
  let lastToastAt = 0;
  function getToastRegion() {
    if (!toastRegion) {
      toastRegion = document.createElement("div");
      toastRegion.className = "runsart-toasts";
      toastRegion.setAttribute("aria-label", "การแจ้งเตือน");
      document.body.appendChild(toastRegion);
    }
    return toastRegion;
  }
  function toast(message, kind = "info", duration = 5500) {
    const text = String(message || "").trim();
    if (!text) return;
    const now = Date.now();
    if (text === lastToastText && now - lastToastAt < 1800) return;
    lastToastText = text;
    lastToastAt = now;
    const item = document.createElement("div");
    item.className = "runsart-toast";
    item.dataset.kind = kind;
    item.setAttribute("role", kind === "error" ? "alert" : "status");
    const content = document.createElement("span");
    content.className = "runsart-toast-message";
    content.textContent = text;
    const close = document.createElement("button");
    close.className = "runsart-toast-close";
    close.type = "button";
    close.setAttribute("aria-label", "ปิดการแจ้งเตือน");
    close.textContent = "×";
    close.addEventListener("click", () => dismissToast(item));
    item.append(content, close);
    getToastRegion().appendChild(item);
    requestAnimationFrame(() => item.classList.add("is-visible"));
    if (duration > 0) toastTimers.set(item, window.setTimeout(() => dismissToast(item), duration));
  }
  function status(node, message) {
    if (typeof node === "string") node = document.querySelector(node);
    if (node) {
      node.textContent = message || "";
      if (message) {
        node.classList.add("runsart-toast-source");
        node.setAttribute("aria-hidden", "true");
      } else {
        node.classList.remove("runsart-toast-source");
        node.removeAttribute("aria-hidden");
      }
    }
    if (!message) {
      if (statusToast) dismissToast(statusToast);
      statusToast = null;
      window.clearTimeout(statusTimer);
      return;
    }
    if (!statusToast || !statusToast.isConnected) {
      statusToast = document.createElement("div");
      statusToast.className = "runsart-toast";
      statusToast.dataset.kind = "info";
      statusToast.setAttribute("role", "status");
      const content = document.createElement("span");
      content.className = "runsart-toast-message";
      const close = document.createElement("button");
      const item = statusToast;
      close.className = "runsart-toast-close";
      close.type = "button";
      close.setAttribute("aria-label", "ปิดการแจ้งเตือน");
      close.textContent = "×";
      close.addEventListener("click", () => {
        dismissToast(item);
        if (statusToast === item) {
          statusToast = null;
          window.clearTimeout(statusTimer);
        }
      });
      statusToast.append(content, close);
      getToastRegion().appendChild(statusToast);
      requestAnimationFrame(() => statusToast && statusToast.classList.add("is-visible"));
    }
    statusToast.querySelector(".runsart-toast-message").textContent = String(message);
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => {
      if (statusToast) dismissToast(statusToast);
      statusToast = null;
    }, 5000);
  }
  function dismissToast(item) {
    const timer = toastTimers.get(item);
    if (timer) window.clearTimeout(timer);
    item.classList.remove("is-visible");
    window.setTimeout(() => item.remove(), 220);
  }
  function renderFile() {
    if (!context) return;
    const fileName = contextValue();
    context.name.textContent = fileName || "ยังไม่ได้เลือกไฟล์";
    context.clear.disabled = !fileName;
  }
  function contextValue() {
    try {
      const value = localStorage.getItem(FILE_KEY);
      if (!value) return "";
      const parsed = JSON.parse(value);
      return typeof parsed.name === "string" ? parsed.name : "";
    } catch (error) {
      console.error("อ่านบริบทไฟล์ไม่ได้", error);
      return "";
    }
  }
  const api = {
    setFile(fileName) {
      const name = String(fileName || "").trim();
      if (!name) return;
      try {
        localStorage.setItem(FILE_KEY, JSON.stringify({ name, updatedAt: Date.now() }));
        renderFile();
      } catch (error) {
        console.error("บันทึกบริบทไฟล์ไม่ได้", error);
        toast("บันทึกชื่อไฟล์ที่กำลังใช้งานไม่ได้", "error");
      }
    },
    clearFile() {
      try {
        localStorage.removeItem(FILE_KEY);
        renderFile();
      } catch (error) {
        console.error("ล้างบริบทไฟล์ไม่ได้", error);
        toast("ล้างชื่อไฟล์ที่กำลังใช้งานไม่ได้", "error");
      }
    },
    toast,
    status,
    report(node, message, kind = "error") {
      if (typeof node === "string") node = document.querySelector(node);
      if (!node) {
        if (message) toast(message, kind);
        return;
      }
      node.textContent = message || "";
      if (message) {
        node.classList.add("runsart-toast-source");
        node.setAttribute("aria-hidden", "true");
        toast(message, kind);
      } else {
        node.classList.remove("runsart-toast-source");
        node.removeAttribute("aria-hidden");
      }
    }
  };
  window.RunsArtUI = api;
  renderFile();
  window.addEventListener("storage", event => {
    if (event.key === FILE_KEY || event.key === null) renderFile();
  });
})();
