// MBM '01 · one grouped menu for every page (replaces each page's own nav bar)
(function(){
  if (window.__mbmNav) return; window.__mbmNav = 1;
  var old = document.querySelector("body > nav"); if (!old) return;
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var home = here === "index.html";
  function H(a){ return (home ? "" : "index.html") + a; }
  var GROUPS = [
    { t: "The reunion", items: [
      ["Schedule", H("#schedule"), "🗓️"], ["Venues", H("#venues"), "🏰"], ["Travel & stay", H("#travel"), "🚆"],
      ["Food menu", "menu.html", "🍛"], ["FAQ", H("#faq"), "❓"] ] },
    { t: "Batchmates", items: [
      ["Who's coming", H("#batch"), "✅"], ["Then & Now", "batchmates.html", "📸"], ["Slam Book", "slam.html", "📖"], ["Memories", H("#memories"), "🎞️"] ] },
    { t: "Photos", items: [ ["Photo Wall", "wall.html", "🖼️"], ["Photo Booth", "booth.html", "🤳"], ["Poster Maker", "poster.html", "🎨"] ] },
    { t: "Games", items: [ ["Canteen Catch", "game.html", "🥟"], ["Dare Card", "dare.html", "🎯"] ] }
  ];

  var css =
    "nav.mbm-nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:40;background:color-mix(in srgb,var(--ground,#F5EFE4) 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-family:var(--body,system-ui,sans-serif)}" +
    ".mbm-nav .in{max-width:1180px;margin:0 auto;padding:0 16px;display:flex;align-items:center;gap:6px;height:58px}" +
    ".mbm-nav .brand{font-family:var(--display,'Permanent Marker',cursive);font-size:22px;color:var(--ink,#1C2A44);text-decoration:none;white-space:nowrap;margin-right:auto}" +
    ".mbm-nav .brand b{color:var(--sand,#B8612F);font-weight:400}" +
    ".mbm-nav .g{position:relative}" +
    ".mbm-nav .gb{font:600 15px/1 var(--body,system-ui,sans-serif);color:var(--ink-2,#4A566E);background:none;border:0;border-radius:9px;padding:10px 11px;cursor:pointer;display:flex;align-items:center;gap:5px;white-space:nowrap}" +
    ".mbm-nav .gb::after{content:'';width:6px;height:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg) translateY(-2px);opacity:.7}" +
    ".mbm-nav .gb:hover,.mbm-nav .g.open .gb,.mbm-nav .g.cur .gb{color:var(--ink,#1C2A44);background:var(--paper,#FFFCF6)}" +
    ".mbm-nav .g.cur .gb{box-shadow:inset 0 -2px 0 var(--sand,#B8612F)}" +
    ".mbm-nav .dd{position:absolute;top:calc(100% + 6px);left:0;min-width:220px;background:var(--paper,#FFFCF6);border:1px solid var(--line,#DDD2BF);border-radius:14px;box-shadow:0 16px 40px rgba(20,30,60,.18);padding:6px;display:none}" +
    ".mbm-nav .g.open .dd{display:grid}" +
    ".mbm-nav .dd::before{content:'';position:absolute;left:0;right:0;top:-12px;height:12px}" +
    "html{scroll-padding-top:72px}" +
    ".mbm-nav .dd a,.mbm-nav .mp a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:var(--ink,#1C2A44);text-decoration:none;font-weight:600;font-size:15px}" +
    ".mbm-nav .dd a:hover,.mbm-nav .mp a:hover{background:var(--ground,#F5EFE4)}" +
    ".mbm-nav a[aria-current=page]{background:color-mix(in srgb,var(--sand,#B8612F) 14%,transparent)}" +
    ".mbm-nav .dd a span,.mbm-nav .mp a span{width:22px;text-align:center}" +
    ".mbm-nav .cta{font:700 15px/1 var(--body,system-ui,sans-serif);background:var(--saffron,var(--ink,#1C2A44));color:#fff;border-radius:10px;padding:11px 15px;text-decoration:none;white-space:nowrap;margin-left:6px}" +
    ".mbm-nav .mb{display:none;font:700 15px/1 var(--body,system-ui,sans-serif);color:var(--ink,#1C2A44);background:var(--paper,#FFFCF6);border:1.5px solid var(--line,#DDD2BF);border-radius:10px;padding:10px 13px;cursor:pointer;align-items:center;gap:8px}" +
    ".mbm-nav .mb i{display:inline-block;width:16px;height:2px;background:currentColor;box-shadow:0 -5px 0 currentColor,0 5px 0 currentColor}" +
    ".mbm-nav .mp{display:none}" +
    "@media (max-width:900px){" +
      ".mbm-nav .g{display:none}.mbm-nav .mb{display:inline-flex}" +
      ".mbm-nav.open .mp{display:grid;gap:14px;position:absolute;left:0;right:0;top:100%;max-height:calc(100dvh - 70px);overflow:auto;background:var(--paper,#FFFCF6);border-bottom:1px solid var(--line,#DDD2BF);box-shadow:0 18px 40px rgba(20,30,60,.2);padding:14px 16px 20px}" +
      ".mbm-nav .mp h3{margin:0 0 2px;padding:0 12px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sand,#B8612F)}" +
      ".mbm-nav .mp .l{display:grid;grid-template-columns:1fr 1fr;gap:2px}" +
    "}" +
    "@media (max-width:360px){.mbm-nav .cta{padding:10px 11px;font-size:14px}.mbm-nav .mb{padding:10px}}";

  function el(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function isCur(href){ var f = href.split("#")[0].toLowerCase(); return f && f === here; }
  function link(it){ var a = el("a"); a.href = it[1]; var s = el("span", null, it[2]); s.setAttribute("aria-hidden", "true"); a.appendChild(s); a.appendChild(document.createTextNode(it[0])); if (isCur(it[1])) a.setAttribute("aria-current", "page"); return a; }

  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var nav = el("nav", "mbm-nav"); nav.setAttribute("aria-label", "Main menu");
  var inr = el("div", "in"); nav.appendChild(inr);
  var br = el("a", "brand"); br.href = home ? "#top" : "index.html"; br.innerHTML = "MBM <b>'01</b>"; inr.appendChild(br);

  var groups = [];
  GROUPS.forEach(function(g, i){
    var w = el("div", "g"), b = el("button", "gb", g.t), d = el("div", "dd");
    b.type = "button"; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", "mbmdd" + i); d.id = "mbmdd" + i;
    g.items.forEach(function(it){ d.appendChild(link(it)); if (isCur(it[1])) w.classList.add("cur"); });
    b.onclick = function(e){ e.stopPropagation(); var o = matchMedia("(hover:hover)").matches || !w.classList.contains("open"); closeAll(); if (o) { w.classList.add("open"); b.setAttribute("aria-expanded", "true"); } };
    w.addEventListener("mouseenter", function(){ if (matchMedia("(hover:hover)").matches) { clearTimeout(w._t); closeAll(); w.classList.add("open"); b.setAttribute("aria-expanded", "true"); } });
    w.addEventListener("mouseleave", function(){ if (matchMedia("(hover:hover)").matches) { clearTimeout(w._t); w._t = setTimeout(function(){ w.classList.remove("open"); b.setAttribute("aria-expanded", "false"); }, 250); } });
    w.appendChild(b); w.appendChild(d); inr.appendChild(w); groups.push(w);
  });
  function closeAll(){ groups.forEach(function(w){ w.classList.remove("open"); w.firstChild.setAttribute("aria-expanded", "false"); }); }

  var mb = el("button", "mb"); mb.type = "button"; mb.setAttribute("aria-expanded", "false"); mb.setAttribute("aria-controls", "mbmmp"); mb.appendChild(el("i")); mb.appendChild(document.createTextNode("Menu")); inr.appendChild(mb);
  var cta = el("a", "cta", "Register"); cta.href = H("#register"); inr.appendChild(cta);

  var mp = el("div", "mp"); mp.id = "mbmmp";
  GROUPS.forEach(function(g){ var s = el("div"); s.appendChild(el("h3", null, g.t)); var l = el("div", "l"); g.items.forEach(function(it){ l.appendChild(link(it)); }); s.appendChild(l); mp.appendChild(s); });
  nav.appendChild(mp);
  mb.onclick = function(e){ e.stopPropagation(); var o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o ? "true" : "false"); };

  document.addEventListener("click", function(e){ if (!nav.contains(e.target)) { closeAll(); nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") { closeAll(); nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });
  nav.addEventListener("click", function(e){ var a = e.target.closest && e.target.closest("a"); if (a) { closeAll(); nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });

  old.parentNode.replaceChild(nav, old);
})();
