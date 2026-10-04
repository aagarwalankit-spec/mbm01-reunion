// MBM '01 · home page strip: logos from the Professional Wall
(function(){
  var after = document.getElementById("creations") || document.getElementById("photos"); if (!after) return;
  var API = "https://script.google.com/macros/s/AKfycby7EIHjCJ053khkkMHN4-gx1mttPKGnQrIkiNw7YXcTFotYF1it1OUQYgCQzlJSMfd9Ng/exec";
  function el(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function ckey(s){ return String(s || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9 ]/g, " ").replace(/\b(pvt|private|ltd|limited|llp|inc|incorporated|corp|corporation|co|company|india|plc|gmbh)\b/g, " ").replace(/\s+/g, "") || String(s || "").toLowerCase(); }
  function hue(s){ var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  function letters(n){ var p = String(n).replace(/[^A-Za-z0-9 ]/g, " ").split(" ").filter(Boolean); return (p.length > 1 ? p[0][0] + p[1][0] : (p[0] || "?").slice(0, 2)).toUpperCase(); }
  var css =
    ".wk{margin:34px 0 0}.wk .hd{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 16px;margin-bottom:14px}" +
    ".wk h2{margin:0;font-family:var(--hand);font-weight:700;font-size:clamp(30px,5vw,42px);color:var(--blue);line-height:1}" +
    ".wk .hd p{margin:0;color:var(--ink-2);font-size:15px}.wk .hd .acts{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}.wk .hd .btn{padding:10px 14px;font-size:15px}" +
    ".wkg{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px}" +
    ".wkt{position:relative;display:grid;grid-template-rows:1fr auto;gap:6px;place-items:center;background:#fff;color:#1C2A44;border-radius:14px;padding:12px 8px 8px;min-height:112px;text-decoration:none;box-shadow:0 1px 2px rgba(40,30,15,.1),0 6px 16px rgba(40,30,15,.1);transition:transform .15s}" +
    ".wkt:hover{transform:translateY(-3px)}.wkt img{max-width:100%;max-height:56px;object-fit:contain;display:block}" +
    ".wkt .lm{width:54px;height:54px;border-radius:14px;display:grid;place-items:center;color:#fff;font:800 20px/1 var(--body,system-ui,sans-serif)}" +
    ".wkt span{font:700 12.5px/1.2 var(--body,system-ui,sans-serif);text-align:center;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".wkt b{position:absolute;top:6px;right:6px;background:#1C2A44;color:#F5EFE4;font:800 11px/1 var(--body,system-ui,sans-serif);padding:4px 6px;border-radius:999px}" +
    ".wke{background:rgba(255,255,255,.12);border:2px dashed var(--line);border-radius:14px;padding:20px;text-align:center;color:var(--ink-2)}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var sec = el("section", "wk"); sec.id = "work"; sec.setAttribute("aria-labelledby", "wkT");
  var hd = el("div", "hd"), h = el("h2", null, "Where the batch works"); h.id = "wkT"; hd.appendChild(h);
  var sub = el("p", null, "Company logos from the Professional Wall."); hd.appendChild(sub);
  var acts = el("div", "acts"), a1 = el("a", "btn", "＋ Add my company"), a2 = el("a", "btn ghost", "See the wall →"); a1.href = "work.html#add"; a2.href = "work.html"; acts.appendChild(a1); acts.appendChild(a2); hd.appendChild(acts);
  sec.appendChild(hd); var grid = el("div", "wkg"); sec.appendChild(grid); after.insertAdjacentElement("afterend", sec);

  function mark(name){ var d = el("div", "lm", letters(name)); d.style.background = "hsl(" + hue(ckey(name)) + " 55% 38%)"; return d; }
  function render(items){
    var map = {}, cos = [];
    items.forEach(function(it){ var k = ckey(it.c); if (!map[k]) { map[k] = { name: it.c, logo: "", site: "", n: 0 }; cos.push(map[k]); } var c = map[k]; c.n++; if (!c.logo && it.logo) c.logo = it.logo; if (!c.site && it.site) c.site = it.site; });
    if (!cos.length) { grid.style.display = "block"; grid.appendChild(el("div", "wke", "No logos yet. Put your company on the wall and start the spread.")); return; }
    cos.sort(function(a, b){ return (b.n - a.n) || a.name.localeCompare(b.name); });
    sub.textContent = items.length + " batchmate" + (items.length > 1 ? "s" : "") + " across " + cos.length + " compan" + (cos.length > 1 ? "ies" : "y") + " so far.";
    cos.slice(0, 14).forEach(function(c){ var t = el("a", "wkt"); t.href = "work.html"; t.setAttribute("aria-label", c.name + ", " + c.n + " batchmate" + (c.n > 1 ? "s" : ""));
      var box = el("div"); box.style.cssText = "display:grid;place-items:center;min-height:56px";
      var fb = function(){ box.textContent = ""; box.appendChild(mark(c.name)); };
      if (c.logo || c.site) { var im = new Image(); im.referrerPolicy = "no-referrer"; im.alt = ""; im.onerror = fb; im.onload = function(){ if (!c.logo && im.naturalWidth < 48) fb(); };
        im.src = c.logo ? "https://drive.google.com/thumbnail?id=" + encodeURIComponent(c.logo) + "&sz=w300" : "https://www.google.com/s2/favicons?sz=128&domain=" + encodeURIComponent(c.site); box.appendChild(im); } else fb();
      t.appendChild(box); t.appendChild(el("span", null, c.name)); if (c.n > 1) t.appendChild(el("b", null, "×" + c.n)); grid.appendChild(t); });
    if (cos.length > 14) { var m = el("a", "wkt"); m.href = "work.html"; m.appendChild(el("div", "lm", "+" + (cos.length - 14))).style.background = "#1C2A44"; m.appendChild(el("span", null, "more companies")); grid.appendChild(m); }
  }
  fetch(API + "?action=work").then(function(r){ return r.json(); }).then(function(d){ render((d && d.items) || []); }).catch(function(){ render([]); });
})();
