// MBM '01 · home page: who is leading the Photo Wall, runners-up, and the latest wall activity
(function(){
  var host = document.getElementById("photos"), grid = document.getElementById("hgrid"); if (!host || !grid) return;
  var API = "https://script.google.com/macros/s/AKfycby7EIHjCJ053khkkMHN4-gx1mttPKGnQrIkiNw7YXcTFotYF1it1OUQYgCQzlJSMfd9Ng/exec";
  function el(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function time(s){ s = String(s || ""); var m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/); if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) - 19800000; var t = Date.parse(s); return isNaN(t) ? 0 : t; }
  function ago(t){ if (!t) return ""; var d = (Date.now() - t) / 60000; if (d < 2) return "just now"; if (d < 60) return Math.round(d) + " min ago"; if (d < 1440) return Math.round(d / 60) + " h ago"; if (d < 2880) return "yesterday"; if (d < 43200) return Math.round(d / 1440) + " days ago"; return ""; }
  function initials(n){ var p = String(n).split(" ").filter(Boolean); return ((p[0] || "?")[0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase(); }
  function plural(n, w){ return n + " " + w + (n === 1 ? "" : "s"); }
  function key(n){ return String(n || "").toLowerCase().replace(/[^a-z]/g, ""); }

  var css =
    ".wlead{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:14px;margin:0 0 18px}" +
    "@media (max-width:820px){.wlead{grid-template-columns:1fr}}" +
    ".wchamp{position:relative;overflow:hidden;display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:18px;color:#1C2A44;background:linear-gradient(135deg,#FFE69A 0%,#F6C544 55%,#E9A91F 100%);box-shadow:0 10px 26px rgba(160,110,10,.28);text-decoration:none}" +
    ".wchamp::after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);transform:translateX(-120%);animation:wshine 4.5s ease-in-out infinite}" +
    "@keyframes wshine{0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}}" +
    "@media (prefers-reduced-motion:reduce){.wchamp::after{animation:none;display:none}}" +
    ".wav{position:relative;flex:none;width:78px;height:78px;border-radius:50%;background:#1C2A44;color:#FFE69A;display:grid;place-items:center;font:800 28px/1 var(--body,system-ui,sans-serif);border:4px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.2)}" +
    ".wav i{position:absolute;top:-24px;left:50%;transform:translateX(-50%) rotate(-8deg);font-style:normal;font-size:32px}" +
    ".wchamp .k{font:800 12px/1 var(--body,system-ui,sans-serif);letter-spacing:.14em;text-transform:uppercase;opacity:.8}" +
    ".wchamp .nm{font:800 clamp(24px,4.4vw,34px)/1.1 var(--body,system-ui,sans-serif);margin:5px 0 4px;letter-spacing:-.01em}" +
    ".wchamp .st{font:600 15px/1.35 var(--body,system-ui,sans-serif)}" +
    ".wside{display:grid;gap:10px;align-content:start}" +
    ".wpod{list-style:none;margin:0;padding:12px 14px;border-radius:16px;background:var(--paper,#FFFCF6);border:1px solid var(--line,#DDD2BF);display:grid;gap:8px;color:var(--ink,#1C2A44)}" +
    ".wpod li{display:flex;align-items:center;gap:10px;font:600 15.5px/1.2 var(--body,system-ui,sans-serif)}" +
    ".wpod li b{flex:none;width:26px;text-align:center;font-size:18px}" +
    ".wpod li span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".wpod li em{font-style:normal;color:var(--ink-2,#4A566E);font-size:14px;white-space:nowrap}" +
    ".wchips{display:flex;flex-wrap:wrap;gap:8px}" +
    ".wchips a,.wchips span{font:600 13.5px/1.3 var(--body,system-ui,sans-serif);padding:8px 11px;border-radius:999px;background:var(--paper,#FFFCF6);border:1px solid var(--line,#DDD2BF);color:var(--ink,#1C2A44);text-decoration:none}" +
    ".wchips b{font-weight:800}";

  function render(d){
    var photos = (d && d.photos) || [], tags = (d && d.tags) || []; if (!photos.length) return;
    var up = {}, name = {}, tagBy = {}, tagged = {}, tname = {};
    photos.forEach(function(p){ var k = key(p.uploader); if (!k) return; up[k] = (up[k] || 0) + 1; name[k] = name[k] || p.uploader; });
    tags.forEach(function(t){ var k = key(t.by); if (k) tagBy[k] = (tagBy[k] || 0) + 1; var n = key(t.name); if (n) { tagged[n] = (tagged[n] || 0) + 1; tname[n] = tname[n] || t.name; } });
    var rank = Object.keys(up).map(function(k){ return { k: k, n: name[k], c: up[k], t: tagBy[k] || 0 }; }).sort(function(a, b){ return (b.c - a.c) || (b.t - a.t); });
    if (!rank.length) return;
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var top = rank[0], tie = rank.filter(function(r){ return r.c === top.c && r.t === top.t; });

    var wrap = el("div", "wlead");
    var ch = el("a", "wchamp"); ch.href = "wall.html"; ch.setAttribute("aria-label", top.n + " is leading the Photo Wall. Open the Photo Wall.");
    var av = el("div", "wav", initials(top.n)); var cr = el("i", null, "👑"); cr.setAttribute("aria-hidden", "true"); av.appendChild(cr); ch.appendChild(av);
    var tx = el("div"); tx.appendChild(el("div", "k", tie.length > 1 ? "Tied at the top of the Photo Wall" : "Leading the Photo Wall"));
    tx.appendChild(el("div", "nm", tie.length > 1 ? tie.map(function(r){ return r.n; }).join(" & ") : top.n));
    tx.appendChild(el("div", "st", plural(top.c, "photo") + " posted" + (top.t ? " · " + plural(top.t, "friend") + " tagged" : "") + ". Can you beat that?"));
    ch.appendChild(tx); wrap.appendChild(ch);

    var side = el("div", "wside"), rest = rank.slice(tie.length > 1 ? tie.length : 1, (tie.length > 1 ? tie.length : 1) + 3);
    if (rest.length) { var ol = el("ol", "wpod"), medals = ["🥈", "🥉", "4."];
      rest.forEach(function(r, i){ var li = el("li"); var m = el("b", null, medals[i]); m.setAttribute("aria-hidden", "true"); li.appendChild(m); li.appendChild(el("span", null, r.n)); li.appendChild(el("em", null, plural(r.c, "photo"))); ol.appendChild(li); });
      side.appendChild(ol); }
    var chips = el("div", "wchips");
    function chip(label, val, href){ var c = el(href ? "a" : "span"); if (href) c.href = href; c.appendChild(document.createTextNode(label + " ")); c.appendChild(el("b", null, val)); chips.appendChild(c); }
    var mt = Object.keys(tagged).sort(function(a, b){ return tagged[b] - tagged[a]; })[0];
    if (mt) chip("🏷️ Most tagged:", tname[mt] + " (" + tagged[mt] + ")", "wall.html");
    var last = photos.slice().sort(function(a, b){ return time(b.ts) - time(a.ts); })[0];
    if (last) { var a = ago(time(last.ts)); chip("🆕 Latest:", last.uploader + (last.caption ? " · “" + String(last.caption).slice(0, 34) + "”" : "") + (a ? " · " + a : ""), "wall.html#p=" + encodeURIComponent(last.id)); }
    chip("📸", plural(photos.length, "photo") + " from " + plural(rank.length, "batchmate"));
    side.appendChild(chips); wrap.appendChild(side);
    grid.parentNode.insertBefore(wrap, grid);
  }
  fetch(API + "?action=wall").then(function(r){ return r.json(); }).then(render).catch(function(){});
})();
