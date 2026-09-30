// MBM '01 · latest news ticker, home-page news section and one-time popups (posted by admins from admin.html)
(function(){
  if (window.__mbmNews) return; window.__mbmNews = 1;
  var API = "https://script.google.com/macros/s/AKfycby7EIHjCJ053khkkMHN4-gx1mttPKGnQrIkiNw7YXcTFotYF1it1OUQYgCQzlJSMfd9Ng/exec";
  var SEEN = "mbm01seen";
  var noPopup = /admin\.html$/.test(location.pathname);

  var css =
    ".mbn-bar{display:flex;align-items:center;gap:10px;background:#1C2A44;color:#F5EFE4;font:600 14.5px/1.3 var(--body,system-ui,sans-serif);padding:8px 16px;cursor:pointer;border:0;width:100%;text-align:left}" +
    ".mbn-bar b{flex:none;background:#E8BA4A;color:#1C2A44;font-size:11.5px;letter-spacing:.12em;padding:4px 8px;border-radius:999px}" +
    ".mbn-bar span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .35s}" +
    ".mbn-bar i{flex:none;font-style:normal;opacity:.8;font-size:13px}" +
    ".mbn-sec{max-width:1100px;margin:28px auto 8px;padding:0 16px}" +
    ".mbn-sec h2{margin:0 0 12px;font-size:clamp(24px,4vw,32px);line-height:1.1}" +
    ".mbn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px}" +
    ".mbn-card{background:var(--paper,#FFFCF6);color:var(--ink,#1C2A44);border:1px solid var(--line,#DDD2BF);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}" +
    ".mbn-card img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#e9e2d4}" +
    ".mbn-card div{padding:14px 16px 16px;display:grid;gap:6px}" +
    ".mbn-card .d{font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--sand,#B8612F)}" +
    ".mbn-card h3{margin:0;font-size:18.5px;line-height:1.25}" +
    ".mbn-card p{margin:0;white-space:pre-line;color:var(--ink-2,#4A566E);font-size:15.5px;line-height:1.5}" +
    ".mbn-card a.go{justify-self:start;font-weight:700;color:var(--blue,#2E5597)}" +
    ".mbn-pin{color:#B03A2E}" +
    "dialog.mbn{border:0;padding:0;border-radius:20px;max-width:520px;width:calc(100% - 28px);max-height:calc(100dvh - 28px);overflow:auto;background:var(--paper,#FFFCF6);color:var(--ink,#1C2A44);box-shadow:0 24px 70px rgba(0,0,0,.4)}" +
    "dialog.mbn::backdrop{background:rgba(15,21,38,.62)}" +
    "dialog.mbn img{width:100%;display:block;max-height:52vh;object-fit:cover}" +
    "dialog.mbn .in{padding:20px 22px 22px;display:grid;gap:10px;font:16px/1.55 var(--body,system-ui,sans-serif)}" +
    "dialog.mbn .k{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--sand,#B8612F)}" +
    "dialog.mbn h2{margin:0;font-size:24px;line-height:1.2}" +
    "dialog.mbn p{margin:0;white-space:pre-line}" +
    "dialog.mbn .r{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}" +
    "dialog.mbn .r a,dialog.mbn .r button{font:700 15.5px/1 var(--body,system-ui,sans-serif);padding:12px 16px;border-radius:12px;border:2px solid var(--ink,#1C2A44);background:var(--ink,#1C2A44);color:var(--ground,#F5EFE4);text-decoration:none;cursor:pointer}" +
    "dialog.mbn .r .gh{background:transparent;color:var(--ink,#1C2A44)}" +
    "dialog.mbn .list{display:grid;gap:12px}dialog.mbn .list article{border-top:1px solid var(--line,#DDD2BF);padding-top:12px;display:grid;gap:4px}" +
    "dialog.mbn .list h3{margin:0;font-size:17px}dialog.mbn .list img{border-radius:10px;max-height:220px}";

  function el(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function pic(id){ var i = new Image(); i.referrerPolicy = "no-referrer"; i.alt = ""; i.src = "https://drive.google.com/thumbnail?id=" + encodeURIComponent(id) + "&sz=w1200"; return i; }
  function date(ts){ var m = String(ts || "").match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return ""; var M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return Number(m[3]) + " " + M[Number(m[2]) - 1] + " " + m[1]; }
  function okLink(s){ return /^https:\/\//i.test(s) || /^[a-z0-9_\-]+\.html(#[a-z0-9_\-]*)?$/i.test(s) || /^#[a-z0-9_\-]+$/i.test(s); }
  function link(n, cls){ if (!n.link || !okLink(n.link)) return null; var a = el("a", cls, "Open →"); a.href = n.link; if (/^https:/i.test(n.link)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } return a; }
  function seen(){ try { return JSON.parse(localStorage.getItem(SEEN) || "[]"); } catch (e) { return []; } }
  function markSeen(id){ try { var s = seen(); if (s.indexOf(id) < 0) s.push(id); localStorage.setItem(SEEN, JSON.stringify(s.slice(-60))); } catch (e) {} }

  function dialog(build){
    var d = el("dialog", "mbn"); build(d); document.body.appendChild(d);
    d.addEventListener("close", function(){ d.remove(); });
    d.addEventListener("click", function(e){ if (e.target === d) d.close(); });
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    return d;
  }
  function popup(n){
    dialog(function(d){
      if (n.photo) d.appendChild(pic(n.photo));
      var i = el("div", "in"); i.appendChild(el("div", "k", "📣 MBM '01 update" + (n.ts ? " · " + date(n.ts) : "")));
      i.appendChild(el("h2", null, n.title)); if (n.body) i.appendChild(el("p", null, n.body));
      var r = el("div", "r"), a = link(n); if (a) { a.textContent = "Open"; a.addEventListener("click", function(){ d.close(); }); r.appendChild(a); }
      var b = el("button", a ? "gh" : null, "Got it"); b.type = "button"; b.onclick = function(){ d.close(); }; r.appendChild(b);
      i.appendChild(r); d.appendChild(i);
      d.addEventListener("close", function(){ markSeen(n.id); });
    });
  }
  function allNews(list){
    dialog(function(d){
      var i = el("div", "in"); i.appendChild(el("div", "k", "Latest news & updates")); var l = el("div", "list");
      list.forEach(function(n){ var a = el("article"); if (n.photo) a.appendChild(pic(n.photo)); a.appendChild(el("div", "k", (n.pinned ? "📌 " : "") + date(n.ts)));
        a.appendChild(el("h3", null, n.title)); if (n.body) a.appendChild(el("p", null, n.body)); var g = link(n); if (g) a.appendChild(g); l.appendChild(a); });
      i.appendChild(l); var r = el("div", "r"), b = el("button", null, "Close"); b.type = "button"; b.onclick = function(){ d.close(); }; r.appendChild(b); i.appendChild(r); d.appendChild(i);
    });
  }
  function ticker(list){
    var nav = document.querySelector("body > nav, nav.top, nav"); if (!nav) return;
    var bar = el("button", "mbn-bar"); bar.type = "button"; bar.setAttribute("aria-label", "Latest news and updates");
    bar.appendChild(el("b", null, "LATEST")); var s = el("span", null, list[0].title); bar.appendChild(s);
    bar.appendChild(el("i", null, list.length > 1 ? "1/" + list.length + " · See all" : "Read"));
    bar.onclick = function(){ var sec = document.getElementById("mbm-news"); if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" }); else allNews(list); };
    nav.insertAdjacentElement("afterend", bar);
    if (list.length > 1 && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      var k = 0; setInterval(function(){ k = (k + 1) % list.length; s.style.opacity = 0; setTimeout(function(){ s.textContent = list[k].title; bar.lastChild.textContent = (k + 1) + "/" + list.length + " · See all"; s.style.opacity = 1; }, 350); }, 5000);
    }
  }
  function section(list){
    var anchor = document.getElementById("schedule"); if (!anchor) return;
    var sec = el("section", "mbn-sec"); sec.id = "mbm-news";
    var lab = el("div", "label", "From the organisers"); sec.appendChild(lab); sec.appendChild(el("h2", null, "Latest news & updates"));
    var g = el("div", "mbn-grid");
    list.slice(0, 6).forEach(function(n){ var c = el("article", "mbn-card"); if (n.photo) c.appendChild(pic(n.photo)); var b = el("div");
      b.appendChild(el("div", "d" + (n.pinned ? " mbn-pin" : ""), (n.pinned ? "📌 Pinned · " : "") + date(n.ts))); b.appendChild(el("h3", null, n.title));
      if (n.body) b.appendChild(el("p", null, n.body)); var a = link(n, "go"); if (a) b.appendChild(a); c.appendChild(b); g.appendChild(c); });
    sec.appendChild(g);
    if (list.length > 6) { var m = el("button", "btn ghost", "See all " + list.length + " updates"); m.type = "button"; m.style.marginTop = "12px"; m.onclick = function(){ allNews(list); }; sec.appendChild(m); }
    anchor.parentNode.insertBefore(sec, anchor);
  }

  function run(d){
    var items = (d && d.news) || []; if (!items.length) return;
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var feed = items.filter(function(n){ return n.feed; });
    if (feed.length) { ticker(feed); if (document.getElementById("schedule")) section(feed); }
    if (!noPopup) { var s = seen(), p = items.filter(function(n){ return n.popup && s.indexOf(n.id) < 0; })[0]; if (p) setTimeout(function(){ popup(p); }, 1200); }
  }
  function load(){
    var c = null; try { c = JSON.parse(sessionStorage.getItem("mbm01news") || "null"); } catch (e) {}
    if (c && Date.now() - c.t < 60000) return run(c.d);
    fetch(API + "?action=news").then(function(r){ return r.json(); }).then(function(d){ try { sessionStorage.setItem("mbm01news", JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} run(d); }).catch(function(){});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load); else load();
  window.MBMNews = { reload: function(){ try { sessionStorage.removeItem("mbm01news"); } catch (e) {} } };
})();
