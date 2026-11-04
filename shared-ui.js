(() => {
  const FILE_KEY = "runsart-active-file";
  const root = document.documentElement;
  const style = document.createElement("style");
  style.textContent = `
    :root{--mute:#536052}
    @media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--mute:#aab5ac}}
    :root[data-theme="dark"]{--mute:#aab5ac}
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
    @media(max-width:560px){.runsart-context{gap:6px;padding:4px 7px}.runsart-context-label{font-size:.74rem}.runsart-context-clear{min-height:40px}.runsart-toasts{right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));width:calc(100vw - 24px)}}
    @media(prefers-reduced-motion:reduce){.runsart-toast{transition:none}}
  `;
  document.head.appendChild(style);

  const main = document.querySelector("main");
  let context = null;
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
