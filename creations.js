// MBM '01 · Dare cards & posters: save a finished card to the home-page gallery, and render that gallery on the home page
(function(){
  if (window.MBMCreations) return;
  var API = "https://script.google.com/macros/s/AKfycby7EIHjCJ053khkkMHN4-gx1mttPKGnQrIkiNw7YXcTFotYF1it1OUQYgCQzlJSMfd9Ng/exec";
  function el(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function thumb(id, w){ return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(id) + "&sz=w" + (w || 600); }

  // ---------- saving ----------
  var lastSig = null;
  function post(a, o){
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "creation_add", code: "MBM2001", me: a.me, pin: a.pin, consent: true, kind: o.kind, style: o.style || "", title: o.title || "", to: o.to || "", photo: o.data() }) })
      .then(function(r){ return r.json(); });
  }
  function say(box, text, cls, btn){ if (!box) return; box.textContent = ""; var p = el("p", "msg " + (cls || ""), text); p.style.margin = "4px 0 0"; box.appendChild(p); if (btn) { btn.style.marginTop = "8px"; box.appendChild(btn); } }
  function doSave(a, o, sig){
    say(o.box, "Adding it to the home page…");
    return post(a, o).then(function(d){
      if (d.ok) { lastSig = sig; say(o.box, "✓ Added to the home page gallery.", "ok"); try { sessionStorage.removeItem("mbm01cre"); } catch (e) {} }
      else { if (d.error === "auth" && window.MBMAuth) MBMAuth.clear(); say(o.box, d.error === "limit" ? "You've added a lot today. Try again in an hour." : d.error === "auth" ? "Couldn't confirm it's you. Tap below to try again." : "Couldn't add it to the home page right now.", "err", d.error === "auth" ? askBtn(o, sig) : null); }
    }).catch(function(){ say(o.box, "No connection, so it wasn't added to the home page.", "err"); });
  }
  function askBtn(o, sig){
    var b = el("button", "btn ghost sm", "Sign in & add to home page"); b.type = "button";
    b.onclick = function(){ if (!window.MBMAuth) return; MBMAuth.ensure().then(function(a){ doSave(a, o, sig); }).catch(function(){}); };
    return b;
  }
  // o: {kind, style, title, to, sig, data(), box, want()}
  function after(o){
    if (o.want && !o.want()) return;
    if (o.sig && o.sig === lastSig) return; // this exact card is already on the home page
    var a = window.MBMAuth && MBMAuth.get();
    if (a) return doSave(a, o, o.sig);
    say(o.box, "Want this on the home page too? Registered batchmates can add it.", "", askBtn(o, o.sig));
  }

  // ---------- home-page gallery ----------
  function gallery(){
    var anchor = document.getElementById("photos"); if (!anchor) return;
    var css =
      ".cre{margin:34px 0 0}.cre .hd{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 16px;margin-bottom:14px}" +
      ".cre h2{margin:0;font-family:var(--hand);font-weight:700;font-size:clamp(30px,5vw,42px);color:var(--blue);line-height:1}" +
      ".cre .hd p{margin:0;color:var(--ink-2);font-size:15px}.cre .hd .acts{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}" +
      ".cre .hd .btn{padding:10px 14px;font-size:15px}" +
      ".cgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}@media (max-width:760px){.cgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}}" +
      ".ctile{display:block;position:relative;background:#FFFCF6;padding:7px 7px 34px;border-radius:6px;border:0;cursor:pointer;box-shadow:0 1px 2px rgba(40,30,15,.1),0 8px 22px rgba(40,30,15,.14);color:#1C2A44;text-align:left;font:inherit;transition:transform .2s}" +
      ".ctile:hover{transform:translateY(-3px)}" +
      ".ctile img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;background:#E8E1D3;border-radius:3px}" +
      ".ctile b{position:absolute;top:13px;left:13px;font:700 11px/1 var(--body);letter-spacing:.08em;background:rgba(28,42,68,.85);color:#F5EFE4;padding:4px 7px;border-radius:5px}" +
      ".ctile span{position:absolute;left:8px;right:8px;bottom:7px;font-family:var(--hand);font-weight:700;font-size:19px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}" +
      ".cempty{background:rgba(255,255,255,.12);border:2px dashed var(--line);border-radius:14px;padding:22px;text-align:center;color:var(--ink-2)}" +
      ".cmore{margin-top:14px}" +
      "dialog.clb{border:0;padding:0;background:transparent;max-width:min(560px,calc(100% - 24px));width:100%;max-height:calc(100dvh - 24px);overflow:auto}" +
      "dialog.clb::backdrop{background:rgba(10,14,26,.8)}" +
      "dialog.clb img{display:block;width:100%;height:auto;border-radius:12px;background:#222;min-height:200px}" +
      "dialog.clb .bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:10px;color:#F5EFE4;font:600 15px/1.4 var(--body,system-ui,sans-serif)}" +
      "dialog.clb .bar p{margin:0;flex:1;min-width:180px}" +
      "dialog.clb .bar a,dialog.clb .bar button{font:700 15px/1 var(--body,system-ui,sans-serif);padding:11px 14px;border-radius:11px;border:2px solid #F5EFE4;background:#F5EFE4;color:#1C2A44;text-decoration:none;cursor:pointer}" +
      "dialog.clb .bar button{background:transparent;color:#F5EFE4}";
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var sec = el("section", "cre"); sec.id = "creations"; sec.setAttribute("aria-labelledby", "creT");
    var hd = el("div", "hd"), h = el("h2", null, "Dares & posters"); h.id = "creT"; hd.appendChild(h);
    hd.appendChild(el("p", null, "Made by the batch with the Dare Card and Poster Maker."));
    var acts = el("div", "acts"), a1 = el("a", "btn", "🎯 Dare someone"), a2 = el("a", "btn ghost", "🎨 Make a poster"); a1.href = "dare.html"; a2.href = "poster.html";
    acts.appendChild(a1); acts.appendChild(a2); hd.appendChild(acts); sec.appendChild(hd);
    var grid = el("div", "cgrid"); sec.appendChild(grid);
    anchor.insertAdjacentElement("afterend", sec);

    function label(it){ return it.kind === "dare" ? (it.to ? it.to + ", dared by " + (it.by || "a batchmate").split(" ")[0] : "Dared by " + it.by) : (it.title ? it.title : "Poster") + " · " + (it.by || "").split(" ")[0]; }
    function open(it){
      var d = el("dialog", "clb"), im = new Image(); im.referrerPolicy = "no-referrer"; im.alt = label(it); im.src = thumb(it.photo, 1400); d.appendChild(im);
      var bar = el("div", "bar"); bar.appendChild(el("p", null, label(it)));
      var go = el("a", null, it.kind === "dare" ? "🎯 Dare someone" : "🎨 Make yours"); go.href = it.kind === "dare" ? "dare.html" : "poster.html"; bar.appendChild(go);
      var x = el("button", null, "Close"); x.type = "button"; x.onclick = function(){ d.close(); }; bar.appendChild(x); d.appendChild(bar);
      d.addEventListener("click", function(e){ if (e.target === d) d.close(); }); d.addEventListener("close", function(){ d.remove(); });
      document.body.appendChild(d); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    }
    function tile(it){
      var b = el("button", "ctile"); b.type = "button"; b.setAttribute("aria-label", "Open " + label(it));
      var im = new Image(); im.referrerPolicy = "no-referrer"; im.alt = ""; im.decoding = "async"; im.src = thumb(it.photo, 600); im.onerror = function(){ b.remove(); };
      b.appendChild(im); b.appendChild(el("b", null, it.kind === "dare" ? "DARE" : "POSTER")); b.appendChild(el("span", null, label(it)));
      b.onclick = function(){ open(it); }; return b;
    }
    function render(items){
      grid.textContent = ""; var more = sec.querySelector(".cmore"); if (more) more.remove();
      if (!items.length) { var e = el("div", "cempty", "Nothing here yet. Make a Dare Card or a poster and it will show up here."); e.style.gridColumn = "1/-1"; grid.appendChild(e); return; }
      var N = 8; items.slice(0, N).forEach(function(it){ grid.appendChild(tile(it)); });
      if (items.length > N) { var m = el("button", "btn ghost cmore", "Show all " + items.length); m.type = "button"; m.onclick = function(){ items.slice(N).forEach(function(it){ grid.appendChild(tile(it)); }); m.remove(); }; sec.appendChild(m); }
    }
    var c = null; try { c = JSON.parse(sessionStorage.getItem("mbm01cre") || "null"); } catch (e) {}
    if (c && Date.now() - c.t < 60000) return render(c.d.items || []);
    fetch(API + "?action=creations").then(function(r){ return r.json(); }).then(function(d){ try { sessionStorage.setItem("mbm01cre", JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} render((d && d.items) || []); })
      .catch(function(){ render([]); });
  }

  window.MBMCreations = { after: after };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", gallery); else gallery();
})();
