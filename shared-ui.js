(() => {
  const FILE_KEY = "runsart-active-file";
  const root = document.documentElement;
  const style = document.createElement("style");
  style.textContent = `
    :root{--mute:#536052}
    @media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--mute:#aab5ac}}
    :root[data-theme="dark"]{--mute:#aab5ac}
    .tool-shell{max-width:none;min-height:100vh;margin:0;padding:0;display:grid;grid-template-columns:238px minmax(0,1fr);transition:grid-template-columns .24s cubic-bezier(.2,.7,.25,1)}
    .tool-shell>.sidebar{position:sticky;top:0;height:100vh;padding:22px 14px;background:var(--panel);border-right:1px solid var(--line);display:flex;flex-direction:column;gap:26px;z-index:5;transition:padding .24s cubic-bezier(.2,.7,.25,1)}
    .tool-shell .sidehead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 6px}
    .tool-shell .sidehead .brand{min-width:0;display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;font-size:1.1rem;color:var(--ink)}
    .tool-shell .sidehead .brand small{display:block;font-size:.7rem;font-weight:400;color:var(--mute)}
    .tool-shell .logo{width:34px;height:34px;flex:none;border-radius:9px;background:var(--accent);color:var(--onaccent);display:flex;align-items:center;justify-content:center}
    .tool-shell .logo .ic{width:20px;height:20px}
    .tool-shell .side-toggle{flex:0 0 34px}
    .tool-shell .sidenav{display:flex;flex-direction:column;gap:6px}
    .toolnav,.sidenav,.mobile-tabs,.chart-scroll,.tw{scrollbar-width:none;-ms-overflow-style:none}
    .toolnav::-webkit-scrollbar,.sidenav::-webkit-scrollbar,.mobile-tabs::-webkit-scrollbar,.chart-scroll::-webkit-scrollbar,.tw::-webkit-scrollbar{display:none}
    .toolnav[data-scroll-cue="left"],.sidenav[data-scroll-cue="left"],.mobile-tabs[data-scroll-cue="left"],.chart-scroll[data-scroll-cue="left"],.tw[data-scroll-cue="left"]{-webkit-mask-image:linear-gradient(to right,transparent 0,#000 28px,#000 100%);mask-image:linear-gradient(to right,transparent 0,#000 28px,#000 100%)}
    .toolnav[data-scroll-cue="right"],.sidenav[data-scroll-cue="right"],.mobile-tabs[data-scroll-cue="right"],.chart-scroll[data-scroll-cue="right"],.tw[data-scroll-cue="right"]{-webkit-mask-image:linear-gradient(to right,#000 0,#000 calc(100% - 28px),transparent 100%);mask-image:linear-gradient(to right,#000 0,#000 calc(100% - 28px),transparent 100%)}
    .toolnav[data-scroll-cue="both"],.sidenav[data-scroll-cue="both"],.mobile-tabs[data-scroll-cue="both"],.chart-scroll[data-scroll-cue="both"],.tw[data-scroll-cue="both"]{-webkit-mask-image:linear-gradient(to right,transparent 0,#000 28px,#000 calc(100% - 28px),transparent 100%);mask-image:linear-gradient(to right,transparent 0,#000 28px,#000 calc(100% - 28px),transparent 100%)}
    .tool-shell .side-label{padding:0 10px 6px;color:var(--mute);font-size:.72rem;font-weight:700;letter-spacing:.04em}
    .tool-shell .sidenav a{display:flex;align-items:center;gap:11px;min-height:42px;padding:8px 10px;text-decoration:none;color:var(--mute);border-radius:9px;font-size:.9rem;white-space:nowrap}
    .tool-shell .sidenav a:hover,.tool-shell .sidenav a[aria-current="page"]{color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,transparent)}
    .tool-shell .sidenav a[aria-current="page"]{font-weight:700}
    .tool-shell .sidenav .ic{flex:0 0 20px}
    .tool-shell .side-spacer{flex:1}
    .tool-shell .side-note{margin:0 8px;color:var(--mute);font-size:.76rem}
    .tool-shell.is-collapsed{grid-template-columns:76px minmax(0,1fr)}
    .tool-shell.is-collapsed>.sidebar{padding-inline:10px}
    .tool-shell.is-collapsed .sidehead{justify-content:center;padding:0}
    .tool-shell.is-collapsed .sidehead .brand,.tool-shell.is-collapsed .side-label,.tool-shell.is-collapsed .sidenav a span,.tool-shell.is-collapsed .side-note{display:none}
    .tool-shell.is-collapsed .sidehead{position:relative}
    .tool-shell.is-collapsed .sidenav a{justify-content:center;padding-inline:0}
    .tool-shell.is-collapsed .sidenav .ic{width:21px;height:21px}
    .tool-shell>.tool-main{width:min(100%,1320px);min-width:0;padding:18px clamp(20px,4vw,56px) 40px;margin:0 auto}
    .tool-shell .toolnav{display:none!important}
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
      .tool-shell,.tool-shell.is-collapsed{grid-template-columns:minmax(0,1fr);grid-template-rows:auto 1fr;min-height:100vh;transition:none}
      .tool-shell>.sidebar,.tool-shell.is-collapsed>.sidebar{position:sticky;top:0;width:100%;height:auto;padding:8px 14px;background:color-mix(in srgb,var(--panel) 95%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-right:0;border-bottom:1px solid var(--line);gap:8px}
      .tool-shell .sidehead,.tool-shell.is-collapsed .sidehead{padding:0 4px}
      .tool-shell .sidehead .brand small{display:none}
      .tool-shell .side-toggle{display:none}
      .tool-shell .sidenav{flex-direction:row;gap:4px;overflow-x:auto;padding-bottom:2px}
      .tool-shell .side-label,.tool-shell .side-spacer,.tool-shell .side-note{display:none}
      .tool-shell .sidenav a{flex:0 0 auto;min-height:38px;gap:7px;padding:7px 10px;font-size:.81rem}
      .tool-shell .sidenav .ic{width:17px;height:17px}
      .tool-shell>.tool-main{width:100%;max-width:none;min-height:0;margin:0;padding:18px 18px 32px}
    }
    @media(max-width:760px){.tool-shell.is-mobile-analysis{height:100vh;height:100dvh;min-height:0;grid-template-rows:auto minmax(0,1fr)}.tool-shell.is-mobile-analysis>.tool-main{height:auto;display:flex;flex-direction:column;gap:8px;overflow:hidden;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px))}}
    @media(max-width:560px){.runsart-context{gap:6px;padding:4px 7px}.runsart-context-label{font-size:.74rem}.runsart-context-clear{min-height:40px}.runsart-toasts{right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));width:calc(100vw - 24px)}}
    @media(prefers-reduced-motion:reduce){.runsart-sidebar,.runsart-nav a{transition:none}}
    @media(prefers-reduced-motion:reduce){.runsart-toast{transition:none}}
  `;
  document.head.appendChild(style);

  const main = document.querySelector("main");
  let context = null;
  const toolPaths = [
    { href: "/tools/slope/", label: "แผนที่และความชัน", icon: "mount" },
    { href: "/tools/training%20analysis/", label: "วิเคราะห์การซ้อม", icon: "pulse" },
    { href: "/tools/race%20planner/", label: "วางแผนแข่ง", icon: "flag" }
  ];
  const sidebarIcons = {
    mount: "M3 19l6-11 4 7 3-4 5 8z",
    home: "M3 10.5L12 3l9 7.5M5 9v12h14V9M9 21v-7h6v7",
    upload: "M12 16V4m0 0L8 8m4-4l4 4M4 20h16",
    pulse: "M3 12h4l3-8 4 16 3-8h4",
    flag: "M5 21V4m0 0c5-4 9 4 14 0v11c-5 4-9-4-14 0",
    clock: "M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0"
  };
  const sidebarIcon = name => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${sidebarIcons[name]}"/></svg>`;
  const isDashboard = !!document.querySelector(".wrap .sidebar");
  if (main && !isDashboard) {
    const path = decodeURIComponent(location.pathname).replace(/\/+$/, "") || "/";
    const links = toolPaths.map(item => {
      const current = decodeURIComponent(item.href).replace(/\/+$/, "") || "/";
      const active = path === current || (current !== "/" && path.endsWith(current + "/index.html"));
      return `<a href="${item.href}"${active ? ' aria-current="page"' : ""} title="${item.label}">${sidebarIcon(item.icon)}<span>${item.label}</span></a>`;
    }).join("");
    const layout = document.createElement("div");
    layout.className = "wrap tool-shell";
    if (main.querySelector(".mobile-tabs")) layout.classList.add("is-mobile-analysis");
    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";
    sidebar.setAttribute("aria-label", "เมนูหลัก");
    sidebar.innerHTML = `<div class="sidehead"><a class="brand" href="/"><span class="logo">${sidebarIcon("mount")}</span><span>RunSart <small>ศาสตร์แห่งการวิ่ง</small></span></a><button class="ib side-toggle" aria-label="ยุบเมนู" aria-expanded="true" title="ยุบเมนู">‹</button></div><nav class="sidenav"><span class="side-label">WORKSPACE</span><a href="/#overview" title="ภาพรวม">${sidebarIcon("home")}<span>ภาพรวม</span></a><a href="/#upload" title="นำเข้ากิจกรรม">${sidebarIcon("upload")}<span>นำเข้ากิจกรรม</span></a><span class="side-label">เครื่องมือ</span>${links}</nav><div class="side-spacer"></div><p class="side-note">ข้อมูลวิ่งของคุณ จัดเป็นระเบียบในที่เดียว</p>`;
    main.classList.add("tool-main");
    main.parentNode.insertBefore(layout, main);
    layout.append(sidebar, main);
    let collapsed = false;
    const toggle = sidebar.querySelector(".side-toggle");
    const renderToggle = () => {
      const isCollapsed = layout.classList.contains("is-collapsed");
      toggle.textContent = isCollapsed ? "›" : "‹";
      toggle.setAttribute("aria-expanded", String(!isCollapsed));
      toggle.setAttribute("aria-label", isCollapsed ? "ขยายเมนู" : "ยุบเมนู");
      toggle.title = toggle.getAttribute("aria-label");
    };
    toggle.addEventListener("click", () => {
      layout.classList.toggle("is-collapsed");
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

  const horizontalScrollers = [...document.querySelectorAll(".toolnav,.sidenav,.mobile-tabs,.chart-scroll,.tw")];
  const updateScrollCue = element => {
    const maxScroll = element.scrollWidth - element.clientWidth;
    if (maxScroll <= 1) {
      element.removeAttribute("data-scroll-cue");
      return;
    }
    const atStart = element.scrollLeft <= 1;
    const atEnd = element.scrollLeft >= maxScroll - 1;
    element.dataset.scrollCue = atStart ? "right" : atEnd ? "left" : "both";
  };
  if (horizontalScrollers.length) {
    horizontalScrollers.forEach(element => {
      updateScrollCue(element);
      element.addEventListener("scroll", () => updateScrollCue(element), { passive: true });
    });
    window.addEventListener("resize", () => horizontalScrollers.forEach(updateScrollCue), { passive: true });
    if (window.ResizeObserver) {
      const scrollObserver = new ResizeObserver(entries => entries.forEach(entry => updateScrollCue(entry.target)));
      horizontalScrollers.forEach(element => scrollObserver.observe(element));
    }
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
    const fileName = contextValue();
    if (!context) return;
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
