var oe=n=>{throw TypeError(n)};var $=(n,e,t)=>e.has(n)||oe("Cannot "+t);var h=(n,e,t)=>($(n,e,"read from private field"),t?t.call(n):e.get(n)),B=(n,e,t)=>e.has(n)?oe("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),A=(n,e,t,o)=>($(n,e,"write to private field"),o?o.call(n,t):e.set(n,t),t),u=(n,e,t)=>($(n,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();const Ne="modulepreload",$e=function(n){return"/lastgameintermediate/"+n},ie={},F=function(e,t,o){let i=Promise.resolve();if(t&&t.length>0){let r=function(c){return Promise.all(c.map(f=>Promise.resolve(f).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));i=r(t.map(c=>{if(c=$e(c),c in ie)return;ie[c]=!0;const f=c.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const g=document.createElement("link");if(g.rel=f?"stylesheet":Ne,f||(g.as="script"),g.crossOrigin="",g.href=c,l&&g.setAttribute("nonce",l),document.head.appendChild(g),f)return new Promise((v,P)=>{g.addEventListener("load",v),g.addEventListener("error",()=>P(new Error(`Unable to preload CSS for ${c}`)))})}))}function s(r){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r}return i.then(r=>{for(const a of r||[])a.status==="rejected"&&s(a.reason);return e().catch(s)})},M={BASE_URL:"https://story-api.dicoding.dev/v1"},O={REGISTER:`${M.BASE_URL}/register`,LOGIN:`${M.BASE_URL}/login`,STORIES:`${M.BASE_URL}/stories`,STORIES_GUEST:`${M.BASE_URL}/stories/guest`};async function me({name:n,email:e,password:t}){const i=await(await fetch(O.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:e,password:t})})).json();return await new Promise(s=>setTimeout(s,1e3)),i}async function fe({email:n,password:e}){const o=await(await fetch(O.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:e})})).json();return await new Promise(i=>setTimeout(i,1e3)),o.error===!1&&(localStorage.setItem("token",o.loginResult.token),localStorage.setItem("userId",o.loginResult.userId),localStorage.setItem("name",o.loginResult.name)),o}async function pe({description:n,photo:e,lat:t,lon:o}){const i=new FormData;i.append("description",n),i.append("photo",e),t!==void 0&&i.append("lat",t),o!==void 0&&i.append("lon",o);const s=localStorage.getItem("token"),r=s?O.STORIES:O.STORIES_GUEST,a=s?{Authorization:`Bearer ${s}`}:{},c=await(await fetch(r,{method:"POST",headers:a,body:i})).json();return await new Promise(f=>setTimeout(f,1500)),c}async function ge({page:n=1,size:e=10,location:t=0}={}){const o=localStorage.getItem("token"),s=await(await fetch(`${O.STORIES}?page=${n}&size=${e}&location=${t}`,{headers:{Authorization:`Bearer ${o}`}})).json();return await new Promise(r=>setTimeout(r,800)),s}const se=Object.freeze(Object.defineProperty({__proto__:null,addStory:pe,getStories:ge,loginUser:fe,registerUser:me},Symbol.toStringTag,{value:"Module"})),z=(n,e)=>e.some(t=>n instanceof t);let re,ae;function Ve(){return re||(re=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ue(){return ae||(ae=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const W=new WeakMap,V=new WeakMap,N=new WeakMap;function qe(n){const e=new Promise((t,o)=>{const i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",r)},s=()=>{t(D(n.result)),i()},r=()=>{o(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",r)});return N.set(e,n),e}function ze(n){if(W.has(n))return;const e=new Promise((t,o)=>{const i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",r),n.removeEventListener("abort",r)},s=()=>{t(),i()},r=()=>{o(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",r),n.addEventListener("abort",r)});W.set(n,e)}let G={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return W.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return D(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ye(n){G=n(G)}function We(n){return Ue().includes(n)?function(...e){return n.apply(H(this),e),D(this.request)}:function(...e){return D(n.apply(H(this),e))}}function Ge(n){return typeof n=="function"?We(n):(n instanceof IDBTransaction&&ze(n),z(n,Ve())?new Proxy(n,G):n)}function D(n){if(n instanceof IDBRequest)return qe(n);if(V.has(n))return V.get(n);const e=Ge(n);return e!==n&&(V.set(n,e),N.set(e,n)),e}const H=n=>N.get(n);function He(n,e,{blocked:t,upgrade:o,blocking:i,terminated:s}={}){const r=indexedDB.open(n,e),a=D(r);return o&&r.addEventListener("upgradeneeded",l=>{o(D(r.result),l.oldVersion,l.newVersion,D(r.transaction),l)}),t&&r.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),a.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const Qe=["get","getKey","getAll","getAllKeys","count"],Ke=["put","add","delete","clear"],U=new Map;function ce(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(U.get(e))return U.get(e);const t=e.replace(/FromIndex$/,""),o=e!==t,i=Ke.includes(t);if(!(t in(o?IDBIndex:IDBObjectStore).prototype)||!(i||Qe.includes(t)))return;const s=async function(r,...a){const l=this.transaction(r,i?"readwrite":"readonly");let c=l.store;return o&&(c=c.index(a.shift())),(await Promise.all([c[t](...a),i&&l.done]))[0]};return U.set(e,s),s}ye(n=>({...n,get:(e,t,o)=>ce(e,t)||n.get(e,t,o),has:(e,t)=>!!ce(e,t)||n.has(e,t)}));const Ye=["continue","continuePrimaryKey","advance"],le={},Q=new WeakMap,he=new WeakMap,Je={get(n,e){if(!Ye.includes(e))return n[e];let t=le[e];return t||(t=le[e]=function(...o){Q.set(this,he.get(this)[e](...o))}),t}};async function*Xe(...n){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...n)),!e)return;e=e;const t=new Proxy(e,Je);for(he.set(t,e),N.set(t,H(e));e;)yield t,e=await(Q.get(t)||e.continue()),Q.delete(t)}function de(n,e){return e===Symbol.asyncIterator&&z(n,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&z(n,[IDBIndex,IDBObjectStore])}ye(n=>({...n,get(e,t,o){return de(e,t)?Xe:n.get(e,t,o)},has(e,t){return de(e,t)||n.has(e,t)}}));const Ze="dicoding-stories-db",et=2,b="favorites",w="stories",S="sync-queue";let q=null;async function y(){return q||(q=He(Ze,et,{upgrade(n){if(n.objectStoreNames.contains(b)||n.createObjectStore(b,{keyPath:"id"}).createIndex("id","id",{unique:!0}),!n.objectStoreNames.contains(w)){const e=n.createObjectStore(w,{keyPath:"id"});e.createIndex("id","id",{unique:!0}),e.createIndex("createdAt","createdAt",{unique:!1}),e.createIndex("synced","synced",{unique:!1})}if(!n.objectStoreNames.contains(S)){const e=n.createObjectStore(S,{keyPath:"id",autoIncrement:!0});e.createIndex("type","type",{unique:!1}),e.createIndex("createdAt","createdAt",{unique:!1})}}})),q}async function ve(n){const t=(await y()).transaction(b,"readwrite");await t.objectStore(b).put({...n,favoritedAt:new Date().toISOString()}),await t.done}async function be(n){const t=(await y()).transaction(b,"readwrite");await t.objectStore(b).delete(n),await t.done}async function we(){const e=(await y()).transaction(b,"readonly"),o=await e.objectStore(b).getAll();return await e.done,o}async function Se(n){const t=(await y()).transaction(b,"readonly"),i=await t.objectStore(b).get(n);return await t.done,!!i}async function Ee(n){const t=(await y()).transaction(w,"readwrite"),o=t.objectStore(w),i={...n,id:`offline-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,createdAt:new Date().toISOString(),synced:!1,offline:!0};return await o.put(i),await t.done,i}async function Ie(){const e=(await y()).transaction(w,"readonly"),o=await e.objectStore(w).getAll();return await e.done,o}async function xe(){const e=(await y()).transaction(w,"readonly"),i=await e.objectStore(w).index("synced").getAll(!1);return await e.done,i}async function K(n){const t=(await y()).transaction(w,"readwrite"),o=t.objectStore(w),i=await o.get(n);i&&(i.synced=!0,await o.put(i)),await t.done}async function j(n){const t=(await y()).transaction(S,"readwrite"),o=t.objectStore(S),i={...n,createdAt:new Date().toISOString(),status:"pending"},s=await o.put(i);return await t.done,s}async function Le(){const e=(await y()).transaction(S,"readonly"),o=await e.objectStore(S).getAll();return await e.done,o}async function Pe(n){const t=(await y()).transaction(S,"readwrite");await t.objectStore(S).delete(n),await t.done}async function R(n,e){const o=(await y()).transaction(S,"readwrite"),i=o.objectStore(S),s=await i.get(n);s&&(s.status=e,s.updatedAt=new Date().toISOString(),await i.put(s)),await o.done}async function tt(){const n=await xe(),e=await Le();for(const t of e)if(t.status==="pending"&&t.type==="story")try{const{addStory:o}=await F(async()=>{const{addStory:s}=await Promise.resolve().then(()=>se);return{addStory:s}},void 0);(await o(t.data)).error===!1?(await K(t.storyId),await Pe(t.id),await R(t.id,"completed")):await R(t.id,"failed")}catch(o){console.error("Failed to sync story from queue:",o),await R(t.id,"failed")}for(const t of n)try{const{addStory:o}=await F(async()=>{const{addStory:s}=await Promise.resolve().then(()=>se);return{addStory:s}},void 0);(await o({description:t.description,photo:t.photo,lat:t.lat,lon:t.lon})).error===!1?await K(t.id):await j({type:"story",storyId:t.id,data:{description:t.description,photo:t.photo,lat:t.lat,lon:t.lon}})}catch(o){console.error("Failed to sync story:",o),await j({type:"story",storyId:t.id,data:{description:t.description,photo:t.photo,lat:t.lat,lon:t.lon}})}}const ue=Object.freeze(Object.defineProperty({__proto__:null,addFavorite:ve,addStoryOffline:Ee,addToSyncQueue:j,getFavorites:we,getStoriesOffline:Ie,getSyncQueue:Le,getUnsyncedStories:xe,initDB:y,isFavorite:Se,markStorySynced:K,removeFavorite:be,removeFromSyncQueue:Pe,syncPendingStories:tt,updateSyncQueueStatus:R},Symbol.toStringTag,{value:"Module"}));var _,ke;class nt{constructor(e){B(this,_);this.view=e,this.stories=[],this.offlineStories=[],this.activeMarker=null}async loadStories(){if(localStorage.getItem("token")){this.view.showLoading();try{if(this.offlineStories=await Ie(),navigator.onLine){const t=await ge({location:1});if(t.error===!1){const o=t.listStory,i=u(this,_,ke).call(this,o,this.offlineStories);this.stories=i,this.view.displayStories(this.stories)}else this.stories=this.offlineStories,this.view.displayStories(this.stories),this.view.showError("Failed to load stories from server. Showing cached content.")}else this.stories=this.offlineStories,this.view.displayStories(this.stories)}catch(t){console.error("Error loading stories:",t),this.stories=this.offlineStories,this.view.displayStories(this.stories),this.view.showError("Error loading stories. Showing cached content.")}}}onStoryClick(e){const t=this.stories.find(o=>o.id===e);t&&t.lat&&t.lon&&(this.view.map.setView([t.lat,t.lon],15),this.activeMarker&&this.view.map.removeLayer(this.activeMarker),this.activeMarker=L.marker([t.lat,t.lon]).addTo(this.view.map).bindPopup(`<b>${t.name}</b><br>${t.description}`).openPopup())}getStories(){return this.stories}getOfflineStories(){return this.offlineStories}}_=new WeakSet,ke=function(e,t){const o=new Map(e.map(s=>[s.id,s])),i=[...e];for(const s of t)o.has(s.id)||i.push(s);return i};var p,Be,De,Ce,Y,Te,J,X;class ot{constructor(){B(this,p);this.presenter=new nt(this),this.map=null,this.markers=[],this.favorites=[]}async render(){return localStorage.getItem("token")?`
      <section class="container">
        <h1>Dicoding Stories</h1>
        <div class="filter-section">
          <label for="location-filter">Filter by Location:</label>
          <select id="location-filter">
            <option value="all">All Stories</option>
            <option value="with-location">With Location</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>
        <div class="content-wrapper">
          <div id="story-list" class="story-list"></div>
          <div id="map" class="map-container"></div>
        </div>
      </section>
    `:`
        <section class="container">
          <h1>Dicoding Stories</h1>
          <p>Please <a href="#/login">login</a> to view stories.</p>
        </section>
      `}async afterRender(){if(!localStorage.getItem("token"))return;document.getElementById("map");const t=document.getElementById("story-list"),o=document.getElementById("location-filter");u(this,p,Be).call(this),this.map=L.map("map").setView([-6.2,106.816666],10);const i=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}),s=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"}),r={OpenStreetMap:i,Satellite:s};i.addTo(this.map),L.control.layers(r).addTo(this.map),await this.presenter.loadStories(),await this.loadFavorites(),t.addEventListener("click",async a=>{const l=a.target.closest(".story-item");if(l){const c=l.dataset.id;a.target.classList.contains("favorite-btn")?await this.toggleFavorite(c):this.presenter.onStoryClick(c)}}),o.addEventListener("change",()=>{const a=this.filterStories(o.value);this.displayStories(a)}),window.addEventListener("online",()=>u(this,p,De).call(this)),window.addEventListener("offline",()=>u(this,p,Ce).call(this)),setInterval(()=>{navigator.onLine||u(this,p,X).call(this)},5e3)}showLoading(){const e=document.getElementById("story-list");e.innerHTML='<div class="loading">Loading stories...</div>'}showError(e){const t=document.getElementById("story-list");t.innerHTML=`<div class="error">${e}</div>`}displayStories(e){const t=document.getElementById("story-list");this.markers.forEach(o=>this.map.removeLayer(o)),this.markers.length=0,t.innerHTML=e.map(o=>{const i=o.offline||o.id.startsWith("offline-"),s=i?'<span class="sync-status">⏳ Pending sync</span>':"",r=o.photoUrl||(o.photo instanceof File?URL.createObjectURL(o.photo):"");return`
        <div class="story-item ${i?"offline-story":""}" data-id="${o.id}" tabindex="0">
          <img src="${r}" alt="${o.name} story image" loading="lazy">
          <h3>${o.name}</h3>
          <p>${o.description}</p>
          <p>${new Date(o.createdAt).toLocaleDateString()}</p>
          ${s}
          <button class="favorite-btn ${this.isStoryFavorited(o.id)?"favorited":""}" aria-label="Toggle favorite">
            ${this.isStoryFavorited(o.id)?"❤️":"🤍"}
          </button>
        </div>
      `}).join(""),e.forEach(o=>{if(o.lat&&o.lon){const i=L.marker([o.lat,o.lon]).addTo(this.map).bindPopup(`<b>${o.name}</b><br>${o.description}`);this.markers.push(i)}})}filterStories(e){return e==="with-location"?this.presenter.getStories().filter(t=>t.lat&&t.lon):e==="favorites"?this.favorites:this.presenter.getStories()}async loadFavorites(){try{this.favorites=await we()}catch(e){console.error("Failed to load favorites:",e),this.favorites=[]}}async toggleFavorite(e){try{const t=this.presenter.getStories().find(r=>r.id===e);if(!t)return;await Se(e)?(await be(e),this.favorites=this.favorites.filter(r=>r.id!==e)):(await ve(t),this.favorites.push(t));const i=document.getElementById("location-filter").value,s=this.filterStories(i);this.displayStories(s)}catch(t){console.error("Failed to toggle favorite:",t)}}isStoryFavorited(e){return this.favorites.some(t=>t.id===e)}}p=new WeakSet,Be=function(){navigator.onLine||u(this,p,Y).call(this)},De=function(){console.log("Back online"),u(this,p,J).call(this),this.presenter.loadStories(),u(this,p,Te).call(this)},Ce=function(){console.log("Gone offline"),u(this,p,Y).call(this)},Y=function(){const e=document.querySelector(".container");if(document.getElementById("offline-message"))return;const t=document.createElement("div");t.id="offline-message",t.className="offline-message",t.innerHTML=`
      <div class="offline-content">
        <span class="offline-icon">📴</span>
        <div class="offline-text">
          <strong>You're offline</strong>
          <p>Some features may be limited. Cached content is available.</p>
          <div id="sync-status" class="sync-status-info">
            <span id="sync-count">Checking pending items...</span>
            <button id="manual-sync-btn" class="manual-sync-btn" style="display: none;">Sync Now</button>
          </div>
        </div>
      </div>
    `,e.insertBefore(t,e.firstChild),u(this,p,X).call(this)},Te=function(){const e=document.getElementById("offline-message");e&&e.remove()},J=async function(){try{const{syncPendingStories:e}=await F(async()=>{const{syncPendingStories:t}=await Promise.resolve().then(()=>ue);return{syncPendingStories:t}},void 0);await e(),console.log("Pending stories synced successfully")}catch(e){console.error("Failed to sync pending stories:",e)}},X=async function(){try{const{getSyncQueue:e,getUnsyncedStories:t}=await F(async()=>{const{getSyncQueue:l,getUnsyncedStories:c}=await Promise.resolve().then(()=>ue);return{getSyncQueue:l,getUnsyncedStories:c}},void 0),o=await e(),i=await t(),s=o.length+i.length,r=document.getElementById("sync-count"),a=document.getElementById("manual-sync-btn");r&&(s>0?(r.textContent=`${s} item${s>1?"s":""} pending sync`,a&&(a.style.display="inline-block",a.onclick=()=>u(this,p,J).call(this))):(r.textContent="All items synced",a&&(a.style.display="none")))}catch(e){console.error("Failed to update sync status:",e)}};class it{async render(){return`
      <section class="container">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 2rem; color: var(--text-primary); text-align: center;">About Dicoding Stories</h1>

          <div style="background: var(--bg-primary); padding: 2rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md); margin-bottom: 2rem;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-primary);">Our Mission</h2>
            <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Dicoding Stories is a modern web application that empowers users to share their personal stories with the world, enhanced by location data. We believe that every story has a place, and every place has a story.
            </p>
            <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary);">
              Our platform combines the art of storytelling with the power of interactive maps, allowing users to create rich, location-aware narratives that connect people across geographical boundaries.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-primary);">📍 Location-Aware Stories</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Share your experiences with precise location data, allowing others to explore stories from around the world.
              </p>
            </div>

            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-primary);">📸 Rich Media Support</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Upload photos and capture moments with our built-in camera functionality for authentic storytelling.
              </p>
            </div>

            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-primary);">🗺️ Interactive Maps</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Explore stories on beautiful, interactive maps with multiple viewing options including satellite imagery.
              </p>
            </div>

            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-primary);">📱 Responsive Design</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Enjoy a seamless experience across all devices with our fully responsive, mobile-first design.
              </p>
            </div>
          </div>

          <div style="background: var(--bg-primary); padding: 2rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-primary);">Technology Stack</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚡️</div>
              <strong>Vanilla JavaScript</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Modern ES6+ JavaScript</p>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🗺️</div>
              <strong>Leaflet Maps</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Interactive mapping library</p>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎨</div>
              <strong>CSS Variables</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Modern styling approach</p>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">📱</div>
              <strong>Responsive Design</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Mobile-first approach</p>
            </div>
            </div>
          </div>
        </div>
      </section>
    `}async afterRender(){const e={threshold:.1,rootMargin:"0px 0px -50px 0px"},t=new IntersectionObserver(o=>{o.forEach(i=>{i.isIntersecting&&(i.target.style.opacity="1",i.target.style.transform="translateY(0)")})},e);document.querySelectorAll(".container > div > div").forEach(o=>{o.style.opacity="0",o.style.transform="translateY(20px)",o.style.transition="opacity 0.6s ease, transform 0.6s ease",t.observe(o)})}}class st{async render(){return`
      <section class="container">
        <h1>Add New Story</h1>
        <form id="add-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" required aria-describedby="description-help"></textarea>
            <small id="description-help" class="form-help">Describe your story in detail.</small>
          </div>
          <div class="form-group">
            <label for="photo">Photo:</label>
            <input type="file" id="photo" name="photo" accept="image/*" required aria-describedby="photo-help">
            <small id="photo-help" class="form-help">Upload an image or use your camera.</small>
            <button type="button" id="camera-btn" aria-label="Use camera to take photo">Use Camera</button>
          </div>
          <div class="form-group">
            <label for="map">Click on map to set location (optional):</label>
            <div id="map" style="height: 300px;" role="application" aria-label="Map for selecting location"></div>
            <input type="hidden" id="lat" name="lat" aria-hidden="true">
            <input type="hidden" id="lon" name="lon" aria-hidden="true">
          </div>
          <button type="submit" aria-describedby="submit-help">Add Story</button>
          <small id="submit-help" class="form-help">Submit your story to share with others.</small>
        </form>
      </section>
    `}async afterRender(){const e=document.getElementById("add-form");document.getElementById("map");const t=document.getElementById("lat"),o=document.getElementById("lon"),i=document.getElementById("camera-btn"),s=document.getElementById("description"),r=document.getElementById("photo"),a=L.map("map").setView([-6.2,106.816666],10);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(a);let l;a.on("click",c=>{l&&a.removeLayer(l),l=L.marker(c.latlng).addTo(a),t.value=c.latlng.lat,o.value=c.latlng.lng}),s.addEventListener("input",()=>{s.value.trim().length<10?s.setCustomValidity("Description must be at least 10 characters long."):s.setCustomValidity("")}),r.addEventListener("change",()=>{const c=r.files[0];c&&c.size>1024*1024?(r.setCustomValidity("File size must be less than 1MB."),alert("File size must be less than 1MB.")):r.setCustomValidity("")}),i.addEventListener("click",async()=>{try{const c=await navigator.mediaDevices.getUserMedia({video:!0}),f=document.createElement("video");f.srcObject=c,f.style.display="none",document.body.appendChild(f),f.play();const m=document.createElement("canvas"),g=m.getContext("2d");m.width=640,m.height=480;const v=document.createElement("div");v.innerHTML=`
          <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 20px; border-radius: 10px;">
              <video id="camera-preview" autoplay style="width: 100%; max-width: 400px;"></video>
              <br><br>
              <button id="capture-btn">Capture</button>
              <button id="cancel-btn">Cancel</button>
            </div>
          </div>
        `,document.body.appendChild(v);const P=document.getElementById("camera-preview");P.srcObject=c,document.getElementById("capture-btn").addEventListener("click",()=>{g.drawImage(P,0,0,m.width,m.height),m.toBlob(E=>{const I=new File([E],"camera.jpg",{type:"image/jpeg"}),ne=new DataTransfer;ne.items.add(I),r.files=ne.files}),c.getTracks().forEach(E=>E.stop()),document.body.removeChild(v),document.body.removeChild(f)}),document.getElementById("cancel-btn").addEventListener("click",()=>{c.getTracks().forEach(E=>E.stop()),document.body.removeChild(v),document.body.removeChild(f)})}catch{alert("Camera access denied or not supported.")}}),e.addEventListener("submit",async c=>{c.preventDefault();const f=new FormData(e),m=e.querySelector('button[type="submit"]'),g=f.get("description"),v=f.get("photo"),P=t.value?parseFloat(t.value):void 0,E=o.value?parseFloat(o.value):void 0;if(!g||!v){alert("Please fill in all required fields.");return}if(m.disabled=!0,m.textContent="Adding story...",!navigator.onLine){try{const I=await Ee({description:g,photo:v,lat:P,lon:E,name:localStorage.getItem("name")||"Anonymous"});await j({type:"story",storyId:I.id,data:{description:g,photo:v,lat:P,lon:E}}),alert("Story saved offline! It will be uploaded when you're back online."),window.location.hash="#/"}catch(I){console.error("Failed to save story offline:",I),alert("Failed to save story offline. Please try again.")}finally{m.disabled=!1,m.textContent="Add Story"}return}try{const I=await pe({description:g,photo:v,lat:P,lon:E});I.error===!1?(alert("Story added successfully!"),window.location.hash="#/"):alert("Failed to add story: "+I.message)}catch{alert("Error adding story. Please try again.")}finally{m.disabled=!1,m.textContent="Add Story"}})}}class rt{async render(){return`
      <section class="container">
        <h1>Login</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-describedby="email-help">
            <small id="email-help" class="form-help">Enter your registered email address.</small>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required aria-describedby="password-help">
            <small id="password-help" class="form-help">Enter your password.</small>
          </div>
          <button type="submit" aria-describedby="login-help">Login</button>
          <small id="login-help" class="form-help">Click to log in to your account.</small>
        </form>
        <p>Don't have an account? <a href="#/register">Register here</a></p>
      </section>
    `}async afterRender(){const e=document.getElementById("login-form"),t=e.querySelector('button[type="submit"]'),o=document.getElementById("email"),i=document.getElementById("password");o.addEventListener("input",()=>{/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.value)?o.setCustomValidity(""):o.setCustomValidity("Please enter a valid email address.")}),i.addEventListener("input",()=>{i.value.length<8?i.setCustomValidity("Password must be at least 8 characters long."):i.setCustomValidity("")}),e.addEventListener("submit",async s=>{s.preventDefault();const r=new FormData(e),a=r.get("email"),l=r.get("password");if(!a||!l){alert("Please fill in all fields.");return}t.disabled=!0,t.textContent="Logging in...";try{const c=await fe({email:a,password:l});c.error===!1?(alert("Login successful!"),window.location.hash="#/"):alert("Login failed: "+c.message)}catch{alert("Error during login. Please check your connection and try again.")}finally{t.disabled=!1,t.textContent="Login"}})}}class at{async render(){return`
      <section class="container">
        <h1>Register</h1>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required aria-describedby="name-help">
            <small id="name-help" class="form-help">Enter your full name.</small>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-describedby="email-help">
            <small id="email-help" class="form-help">Enter a valid email address.</small>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required minlength="8" aria-describedby="password-help">
            <small id="password-help" class="form-help">Password must be at least 8 characters long.</small>
          </div>
          <button type="submit" aria-describedby="register-help">Register</button>
          <small id="register-help" class="form-help">Click to create your account.</small>
        </form>
        <p>Already have an account? <a href="#/login">Login here</a></p>
      </section>
    `}async afterRender(){const e=document.getElementById("register-form"),t=e.querySelector('button[type="submit"]'),o=document.getElementById("name"),i=document.getElementById("email"),s=document.getElementById("password");o.addEventListener("input",()=>{o.value.trim().length<2?o.setCustomValidity("Name must be at least 2 characters long."):o.setCustomValidity("")}),i.addEventListener("input",()=>{/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value)?i.setCustomValidity(""):i.setCustomValidity("Please enter a valid email address.")}),s.addEventListener("input",()=>{s.value.length<8?s.setCustomValidity("Password must be at least 8 characters long."):s.setCustomValidity("")}),e.addEventListener("submit",async r=>{r.preventDefault();const a=new FormData(e),l=a.get("name"),c=a.get("email"),f=a.get("password");if(!l||!c||!f){alert("Please fill in all fields.");return}t.disabled=!0,t.textContent="Registering...";try{const m=await me({name:l,email:c,password:f});m.error===!1?(alert("Registration successful! Please login."),window.location.hash="#/login"):alert("Registration failed: "+m.message)}catch{alert("Error during registration. Please check your connection and try again.")}finally{t.disabled=!1,t.textContent="Register"}})}}const ct={"/":new ot,"/about":new it,"/add":new st,"/login":new rt,"/register":new at};function lt(n){const e=n.split("/");return{resource:e[1]||null,id:e[2]||null}}function dt(n){let e="";return n.resource&&(e=e.concat(`/${n.resource}`)),n.id&&(e=e.concat("/:id")),e||"/"}function ut(){return location.hash.replace("#","")||"/"}function mt(){const n=ut(),e=lt(n);return dt(e)}var k,C,x,d,Oe,Z,ee,Ae,Me,Re,te,Fe,je,_e,T;class ft{constructor({navigationDrawer:e,drawerButton:t,content:o}){B(this,d);B(this,k,null);B(this,C,null);B(this,x,null);A(this,k,o),A(this,C,t),A(this,x,e),u(this,d,Oe).call(this)}async renderPage(){const e=mt(),t=ct[e];if((e==="/"||e==="/add")&&!localStorage.getItem("token")){window.location.hash="#/login";return}document.startViewTransition?document.startViewTransition(async()=>{h(this,k).innerHTML=await t.render(),await t.afterRender()}):(h(this,k).style.opacity="0",setTimeout(async()=>{h(this,k).innerHTML=await t.render(),await t.afterRender(),h(this,k).style.opacity="1"},300));const o={"/":"Home - Dicoding Stories","/add":"Add Story - Dicoding Stories","/login":"Login - Dicoding Stories","/register":"Register - Dicoding Stories","/about":"About - Dicoding Stories"};document.title=o[e]||"Dicoding Stories",u(this,d,te).call(this),u(this,d,Z).call(this)}}k=new WeakMap,C=new WeakMap,x=new WeakMap,d=new WeakSet,Oe=function(){h(this,C).addEventListener("click",()=>{h(this,x).classList.toggle("open")}),document.body.addEventListener("click",e=>{!h(this,x).contains(e.target)&&!h(this,C).contains(e.target)&&h(this,x).classList.remove("open"),h(this,x).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&h(this,x).classList.remove("open")})})},Z=async function(){if("Notification"in window&&"serviceWorker"in navigator)if(await Notification.requestPermission()==="granted")console.log("Notification permission granted"),u(this,d,ee).call(this,"Notifications enabled! 🎉","success"),u(this,d,Me).call(this);else{console.log("Notification permission denied"),u(this,d,ee).call(this,"Notifications denied. You can enable them later in browser settings.","warning");const t=document.getElementById("notification-toggle");t&&(t.checked=!1)}},ee=function(e,t){const o=document.createElement("div");o.className=`notification-feedback ${t}`,o.textContent=e,o.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: var(--border-radius-lg);
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s;
      box-shadow: var(--shadow-lg);
    `,t==="success"?o.style.background="linear-gradient(135deg, #10b981 0%, #059669 100%)":t==="warning"?o.style.background="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)":o.style.background="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",document.body.appendChild(o),setTimeout(()=>{o.parentNode&&o.parentNode.removeChild(o)},3500)},Ae=async function(){try{const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();t&&(await t.unsubscribe(),console.log("Push subscription unsubscribed"))}catch(e){console.error("Failed to unsubscribe from push notifications:",e)}},Me=async function(){try{const t=await(await navigator.serviceWorker.ready).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:u(this,d,Re).call(this,CONFIG.VAPID_PUBLIC_KEY)});console.log("Push subscription:",t)}catch(e){console.error("Failed to subscribe to push notifications:",e)}},Re=function(e){const t="=".repeat((4-e.length%4)%4),o=(e+t).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(o),s=new Uint8Array(i.length);for(let r=0;r<i.length;++r)s[r]=i.charCodeAt(r);return s},te=function(){const e=document.getElementById("nav-list"),t=!!localStorage.getItem("token"),o=[{href:"#/",text:"Home"},{href:"#/add",text:"Add Story"},{href:"#/about",text:"About"}];t?o.push({href:"#logout",text:"Logout",id:"logout-link"}):o.push({href:"#/login",text:"Login"},{href:"#/register",text:"Register"}),e.innerHTML=o.map(s=>`<li><a href="${s.href}" ${s.id?`id="${s.id}"`:""}>${s.text}</a></li>`).join(""),t&&u(this,d,Fe).call(this);const i=document.getElementById("logout-link");i&&i.addEventListener("click",s=>{s.preventDefault(),localStorage.removeItem("token"),localStorage.removeItem("userId"),localStorage.removeItem("name"),window.location.hash="#/login",u(this,d,te).call(this)})},Fe=async function(){const e=document.getElementById("nav-list");if(document.getElementById("notification-toggle-container"))return;const o=document.createElement("li");o.id="notification-toggle-container",o.innerHTML=`
      <div class="notification-toggle-wrapper">
        <label for="notification-toggle" class="notification-toggle-label">
          <div class="toggle-switch">
            <input type="checkbox" id="notification-toggle" class="toggle-input">
            <span class="toggle-slider"></span>
          </div>
          <div class="toggle-content">
            <span class="toggle-icon">🔔</span>
            <span class="toggle-text">Push Notifications</span>
            <span class="toggle-status" id="notification-status"></span>
          </div>
        </label>
      </div>
    `,e.appendChild(o);const i=document.getElementById("notification-toggle"),s=document.getElementById("notification-status");if("serviceWorker"in navigator&&"pushManager"in window)try{const a=await(await navigator.serviceWorker.ready).pushManager.getSubscription();i.checked=!!a,u(this,d,T).call(this,s,!!a)}catch(r){console.error("Error checking subscription status:",r),u(this,d,T).call(this,s,!1)}i.addEventListener("change",async()=>{const r=i.checked;s.textContent=r?"Enabling...":"Disabling...",s.className="toggle-status loading";try{r?await u(this,d,Z).call(this):await u(this,d,Ae).call(this),u(this,d,T).call(this,s,r)}catch(a){console.error("Error updating notification subscription:",a),i.checked=!r,u(this,d,T).call(this,s,!r)}}),u(this,d,je).call(this)},je=async function(){if(window.matchMedia("(display-mode: standalone)").matches)return;let e;window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),e=t,u(this,d,_e).call(this,e)}),window.addEventListener("appinstalled",t=>{console.log("App was installed successfully");const o=document.getElementById("install-button");o&&(o.style.display="none")})},_e=function(e){const t=document.getElementById("nav-list");if(document.getElementById("install-button-container"))return;const i=document.createElement("li");i.id="install-button-container",i.innerHTML=`
      <button id="install-button" class="install-button">
        <span class="install-icon">📱</span>
        <span class="install-text">Install App</span>
      </button>
    `,t.appendChild(i);const s=document.getElementById("install-button");s.addEventListener("click",async()=>{if(e){e.prompt();const{outcome:r}=await e.userChoice;console.log(r==="accepted"?"User accepted the install prompt":"User dismissed the install prompt"),e=null,s.style.display="none"}})},T=function(e,t){t?(e.textContent="Enabled",e.className="toggle-status enabled"):(e.textContent="Disabled",e.className="toggle-status disabled")};document.addEventListener("DOMContentLoaded",async()=>{const n=new ft({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});if(await n.renderPage(),window.addEventListener("hashchange",async()=>{await n.renderPage()}),"serviceWorker"in navigator)try{const e=await navigator.serviceWorker.register("/sw.js");console.log("SW registered: ",e)}catch(e){console.log("SW registration failed: ",e)}});
