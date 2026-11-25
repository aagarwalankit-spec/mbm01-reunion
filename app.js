// MBM '01 · make the site installable as an app (Android: install button; iPhone: Add to Home Screen tip)
(function(){
  if ('serviceWorker' in navigator) window.addEventListener('load', function(){ navigator.serviceWorker.register('/sw.js').catch(function(){}); });
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  if (standalone) return;
  function get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function set(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
  var snooze = Number(get('mbm01appSnooze') || 0); if (Date.now() < snooze) return;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
  var mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  var deferred = null;
  function bar(text, btnText, onBtn){
    if (document.getElementById('mbmApp')) return;
    var b = document.createElement('div'); b.id = 'mbmApp'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Install the app');
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:60;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;background:#1C2A44;color:#F5EFE4;box-shadow:0 12px 34px rgba(0,0,0,.35);font:600 15px/1.35 Figtree,system-ui,sans-serif;max-width:560px;margin:0 auto';
    var ic = document.createElement('img'); ic.src = '/icon-192.png'; ic.alt = ''; ic.width = 44; ic.height = 44; ic.style.cssText = 'border-radius:10px;flex:none';
    var t = document.createElement('div'); t.style.flex = '1'; t.innerHTML = text;
    b.appendChild(ic); b.appendChild(t);
    if (btnText) { var go = document.createElement('button'); go.type = 'button'; go.textContent = btnText; go.style.cssText = 'flex:none;font:700 15px/1 Figtree,system-ui,sans-serif;padding:11px 14px;border-radius:11px;border:0;background:#E8BA4A;color:#1C2A44;cursor:pointer'; go.onclick = onBtn; b.appendChild(go); }
    var x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'Not now'); x.textContent = '×'; x.style.cssText = 'flex:none;border:0;background:none;color:#F5EFE4;font-size:24px;line-height:1;cursor:pointer;padding:4px';
    x.onclick = function(){ set('mbm01appSnooze', String(Date.now() + 7 * 864e5)); b.remove(); }; b.appendChild(x);
    document.body.appendChild(b);
  }
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault(); deferred = e;
    setTimeout(function(){ bar('<b>Get the MBM \'01 app</b><br><span style="font-weight:500;opacity:.85">One tap from your home screen. No browser needed.</span>', 'Install', function(){
      if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function(){ var b = document.getElementById('mbmApp'); if (b) b.remove(); deferred = null; });
    }); }, 2500);
  });
  window.addEventListener('appinstalled', function(){ var b = document.getElementById('mbmApp'); if (b) b.remove(); set('mbm01appSnooze', String(Date.now() + 3650 * 864e5)); });
  if (ios && mobile) setTimeout(function(){ bar('<b>Get the MBM \'01 app</b><br><span style="font-weight:500;opacity:.85">In Safari tap <b>Share</b> (square with arrow), then <b>Add to Home Screen</b>.</span>'); }, 3000);
})();
