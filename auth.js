// MBM '01 · registered-batchmate check for uploads.
// Asks for name + last 4 digits of the mobile number used at registration, checks it with the server once,
// and remembers it on this phone so people aren't asked every time.
window.MBMAuth = (function(){
  var API = "https://script.google.com/macros/s/AKfycby7EIHjCJ053khkkMHN4-gx1mttPKGnQrIkiNw7YXcTFotYF1it1OUQYgCQzlJSMfd9Ng/exec";
  var KEY = "mbm01auth";
  function get(){ try{ return JSON.parse(localStorage.getItem(KEY) || "null"); }catch(e){ return null; } }
  function set(v){ try{ if(v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY); }catch(e){} }
  var css = ".mbma{border:0;padding:0;border-radius:18px;max-width:440px;width:calc(100% - 24px);background:var(--paper,#FFFCF6);color:var(--ink,#1C2A44);box-shadow:0 20px 60px rgba(0,0,0,.35)}"+
    ".mbma::backdrop{background:rgba(15,21,38,.6)}.mbma form{padding:22px 22px 20px;display:grid;gap:12px;font:16px/1.5 var(--body,system-ui,sans-serif)}"+
    ".mbma h2{margin:0;font-size:22px;line-height:1.2}.mbma p{margin:0;color:var(--ink-2,#4A566E);font-size:15px}"+
    ".mbma label{display:grid;gap:5px;font-weight:600;font-size:14.5px}.mbma input{font:500 16px var(--body,system-ui,sans-serif);padding:11px 12px;border-radius:10px;border:1.5px solid var(--line,#DDD2BF);background:var(--ground,#F5EFE4);color:var(--ink,#1C2A44);width:100%}"+
    ".mbma .pin{letter-spacing:.5em;font-weight:700;max-width:170px}.mbma .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}"+
    ".mbma button{font:700 15px/1 var(--body,system-ui,sans-serif);padding:12px 16px;border-radius:11px;border:2px solid var(--ink,#1C2A44);background:var(--ink,#1C2A44);color:var(--ground,#F5EFE4);cursor:pointer}"+
    ".mbma button.gh{background:transparent;color:var(--ink,#1C2A44)}.mbma button:disabled{opacity:.55}.mbma .m{min-height:1.3em;font-weight:600;font-size:14.5px}.mbma .m.err{color:#B03A2E}.mbma .m.ok{color:#2E7D4F}.mbma a{color:var(--blue,#2E5597)}";
  function ask(){
    return new Promise(function(resolve, reject){
      if(!document.getElementById("mbma-css")){ var s=document.createElement("style"); s.id="mbma-css"; s.textContent=css; document.head.appendChild(s); }
      var dlg=document.createElement("dialog"); dlg.className="mbma"; dlg.setAttribute("aria-labelledby","mbmaT");
      dlg.innerHTML='<form novalidate><h2 id="mbmaT">Registered batchmates only</h2>'+
        '<p>Uploads are open to batchmates registered for the reunion. Confirm it\'s you once and this phone will remember it.</p>'+
        '<label>Your name (as registered)<input name="n" autocomplete="name" maxlength="60" required></label>'+
        '<label>Last 4 digits of your registered mobile<input name="p" class="pin" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" required></label>'+
        '<div class="m" role="status" aria-live="polite"></div>'+
        '<div class="row"><button type="submit">Verify</button><button type="button" class="gh">Cancel</button></div>'+
        '<p style="font-size:13.5px">Not registered yet? <a href="index.html#register">See how to register</a>.</p></form>';
      document.body.appendChild(dlg);
      var f=dlg.querySelector("form"), n=f.n, p=f.p, m=dlg.querySelector(".m"), go=f.querySelector("button[type=submit]"), done=false;
      try{ var last=localStorage.getItem("mbm01me"); if(last) n.value=last; }catch(e){}
      function close(ok){ done=true; try{ dlg.close(); }catch(e){} dlg.remove(); if(!ok) reject("cancel"); }
      f.querySelector(".gh").onclick=function(){ close(false); };
      dlg.addEventListener("cancel", function(e){ e.preventDefault(); close(false); });
      p.addEventListener("input", function(){ p.value=p.value.replace(/\D/g,"").slice(0,4); });
      f.onsubmit=function(ev){ ev.preventDefault();
        var name=n.value.trim(), pin=p.value.trim();
        if(!name){ m.className="m err"; m.textContent="Type your name."; n.focus(); return; }
        if(!/^\d{4}$/.test(pin)){ m.className="m err"; m.textContent="Enter the last 4 digits of your mobile number."; p.focus(); return; }
        go.disabled=true; m.className="m"; m.textContent="Checking…";
        fetch(API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({code:"MBM2001",action:"verify",me:name,pin:pin})})
          .then(function(r){ return r.json(); }).then(function(d){
            if(d.ok){ var a={name:d.name, me:name, pin:pin}; set(a); try{ localStorage.setItem("mbm01me", d.name); }catch(e){}
              m.className="m ok"; m.textContent="Welcome, "+d.name+"!"; setTimeout(function(){ close(true); resolve(a); }, 700); }
            else { go.disabled=false; m.className="m err";
              m.textContent = d.error==="locked" ? "Too many tries. Please wait 30 minutes and try again." : "We couldn't find that name and number among registered batchmates. Check both, or contact the organisers."; }
          }).catch(function(){ go.disabled=false; m.className="m err"; m.textContent="No connection. Try again."; });
      };
      if(dlg.showModal) dlg.showModal(); else dlg.setAttribute("open","");
      setTimeout(function(){ (n.value?p:n).focus(); }, 30);
    });
  }
  function ensure(){ var a=get(); return a ? Promise.resolve(a) : ask(); }
  return { get:get, ensure:ensure, ask:ask, clear:function(){ set(null); } };
})();
