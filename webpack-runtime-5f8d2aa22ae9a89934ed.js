!function(){"use strict";var e,n,t,r,o,a,i,c,u,f,s={},d={};function l(e){var n=d[e];if(void 0!==n)return n.exports;var t=d[e]={id:e,loaded:!1,exports:{}};return s[e](t,t.exports,l),t.loaded=!0,t.exports}l.m=s,e="function"==typeof Symbol?Symbol("webpack then"):"__webpack_then__",n="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",t=function(e){e&&(e.forEach((function(e){e.r--})),e.forEach((function(e){e.r--?e.r++:e()})))},r=function(e){!--e.r&&e()},o=function(e,n){e?e.push(n):r(n)},l.a=function(a,i,c){var u,f,s,d=c&&[],l=a.exports,b=!0,p=!1,m=function(n,t,r){p||(p=!0,t.r+=n.length,n.map((function(n,o){n[e](t,r)})),p=!1)},h=new Promise((function(e,n){s=n,f=function(){e(l),t(d),d=0}}));h[n]=l,h[e]=function(e,n){if(b)return r(e);u&&m(u,e,n),o(d,e),h.catch(n)},a.exports=h,i((function(a){if(!a)return f();var i,c;u=function(a){return a.map((function(a){if(null!==a&&"object"==typeof a){if(a[e])return a;if(a.then){var i=[];a.then((function(e){c[n]=e,t(i),i=0}));var c={};return c[e]=function(e,n){o(i,e),a.catch(n)},c}}var u={};return u[e]=function(e){r(e)},u[n]=a,u}))}(a);var s=new Promise((function(e,t){(i=function(){e(c=u.map((function(e){return e[n]})))}).r=0,m(u,i,t)}));return i.r?s:c})).then(f,s),b=!1},a=[],l.O=function(e,n,t,r){if(!n){var o=1/0;for(f=0;f<a.length;f++){n=a[f][0],t=a[f][1],r=a[f][2];for(var i=!0,c=0;c<n.length;c++)(!1&r||o>=r)&&Object.keys(l.O).every((function(e){return l.O[e](n[c])}))?n.splice(c--,1):(i=!1,r<o&&(o=r));if(i){a.splice(f--,1);var u=t();void 0!==u&&(e=u)}}return e}r=r||0;for(var f=a.length;f>0&&a[f-1][2]>r;f--)a[f]=a[f-1];a[f]=[n,t,r]},l.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(n,{a:n}),n},l.d=function(e,n){for(var t in n)l.o(n,t)&&!l.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},l.f={},l.e=function(e){return Promise.all(Object.keys(l.f).reduce((function(n,t){return l.f[t](e,n),n}),[]))},l.u=function(e){return{73:"5331672605aeeb0fb2a18dfbc6e48217e35d768a",169:"component---src-pages-pmrem-debug-tsx",187:"52299b76d4276d3dfcbb0e1aadd5415fc1c5a7d9",355:"e08a29b52d9f8379a41111781588d63437bc24af",391:"component---src-pages-visual-debug-tsx",434:"component---src-pages-points-viewer-tsx",532:"styles",556:"component---src-pages-outlier-debug-tsx",678:"component---src-pages-index-js",737:"fb7d5399",774:"framework",811:"1975cad6a9a0c10d1ad097463be9273a87120280",883:"component---src-pages-404-js",908:"9c7ca18ea833e53ebb3f003bc027f4e85ef6b042",953:"ae70068eaae2d1fe16843a8442144885b6dcee9d"}[e]+"-"+{73:"4ef7dc5d8ebce820a9c0",169:"c6d4f1350d7853b16c9e",187:"d5ebb8cb453a876a5639",355:"09bc7c391ecf4921d209",391:"8265d54571664ae95372",434:"368c85e7e9d2c1d36af9",532:"2fc2a9fef1c3abbdad7e",556:"e1b424da11c971779ef3",678:"2ab4b02b73a42e30415b",737:"15b2b5f100375199415e",774:"bdfea7a718b57ee2733a",811:"5e2f88fc260af9a9b32a",883:"e6e2a1e4c88aeab64164",908:"6e05219f9d2c4d803702",953:"4c6b21aae363c2d4d849"}[e]+".js"},l.miniCssF=function(e){return"styles.200e3fa75cb9411d6eb2.css"},l.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),l.hmd=function(e){return(e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:function(){throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e},l.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i={},c="www:",l.l=function(e,n,t,r){if(i[e])i[e].push(n);else{var o,a;if(void 0!==t)for(var u=document.getElementsByTagName("script"),f=0;f<u.length;f++){var s=u[f];if(s.getAttribute("src")==e||s.getAttribute("data-webpack")==c+t){o=s;break}}o||(a=!0,(o=document.createElement("script")).charset="utf-8",o.timeout=120,l.nc&&o.setAttribute("nonce",l.nc),o.setAttribute("data-webpack",c+t),o.src=e),i[e]=[n];var d=function(n,t){o.onerror=o.onload=null,clearTimeout(b);var r=i[e];if(delete i[e],o.parentNode&&o.parentNode.removeChild(o),r&&r.forEach((function(e){return e(t)})),n)return n(t)},b=setTimeout(d.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=d.bind(null,o.onerror),o.onload=d.bind(null,o.onload),a&&document.head.appendChild(o)}},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.v=function(e,n,t,r){var o=fetch(l.p+""+t+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(o,r).then((function(n){return Object.assign(e,n.instance.exports)})):o.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,r)})).then((function(n){return Object.assign(e,n.instance.exports)}))},l.p="/irradiance-wasm/",u=function(e){return new Promise((function(n,t){var r=l.miniCssF(e),o=l.p+r;if(function(e,n){for(var t=document.getElementsByTagName("link"),r=0;r<t.length;r++){var o=(i=t[r]).getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(o===e||o===n))return i}var a=document.getElementsByTagName("style");for(r=0;r<a.length;r++){var i;if((o=(i=a[r]).getAttribute("data-href"))===e||o===n)return i}}(r,o))return n();!function(e,n,t,r){var o=document.createElement("link");o.rel="stylesheet",o.type="text/css",o.onerror=o.onload=function(a){if(o.onerror=o.onload=null,"load"===a.type)t();else{var i=a&&("load"===a.type?"missing":a.type),c=a&&a.target&&a.target.href||n,u=new Error("Loading CSS chunk "+e+" failed.\n("+c+")");u.code="CSS_CHUNK_LOAD_FAILED",u.type=i,u.request=c,o.parentNode.removeChild(o),r(u)}},o.href=n,document.head.appendChild(o)}(e,o,n,t)}))},f={658:0},l.f.miniCss=function(e,n){f[e]?n.push(f[e]):0!==f[e]&&{532:1}[e]&&n.push(f[e]=u(e).then((function(){f[e]=0}),(function(n){throw delete f[e],n})))},function(){var e={658:0};l.f.j=function(n,t){var r=l.o(e,n)?e[n]:void 0;if(0!==r)if(r)t.push(r[2]);else if(/^(532|658)$/.test(n))e[n]=0;else{var o=new Promise((function(t,o){r=e[n]=[t,o]}));t.push(r[2]=o);var a=l.p+l.u(n),i=new Error;l.l(a,(function(t){if(l.o(e,n)&&(0!==(r=e[n])&&(e[n]=void 0),r)){var o=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;i.message="Loading chunk "+n+" failed.\n("+o+": "+a+")",i.name="ChunkLoadError",i.type=o,i.request=a,r[1](i)}}),"chunk-"+n,n)}},l.O.j=function(n){return 0===e[n]};var n=function(n,t){var r,o,a=t[0],i=t[1],c=t[2],u=0;if(a.some((function(n){return 0!==e[n]}))){for(r in i)l.o(i,r)&&(l.m[r]=i[r]);if(c)var f=c(l)}for(n&&n(t);u<a.length;u++)o=a[u],l.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return l.O(f)},t=self.webpackChunkwww=self.webpackChunkwww||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}()}();
//# sourceMappingURL=webpack-runtime-5f8d2aa22ae9a89934ed.js.map