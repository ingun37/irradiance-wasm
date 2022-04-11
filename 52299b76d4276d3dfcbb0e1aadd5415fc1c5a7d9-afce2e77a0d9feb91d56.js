"use strict";(self.webpackChunkwww=self.webpackChunkwww||[]).push([[187,518],{5616:function(e,t,n){n.d(t,{Z:function(){return g}});var r=n(4942),a=n(5245),i=n(7462),o=n(7294),l=n(5505),u=n(9408),s=n(2371),c=n(8348),f=n(8416);function d(e){return(0,f.Z)("MuiContainer",e)}(0,n(2194).Z)("MuiContainer",["root","disableGutters","fixed","maxWidthXs","maxWidthSm","maxWidthMd","maxWidthLg","maxWidthXl"]);var v=n(9240),m=n(5893),p=["className","component","disableGutters","fixed","maxWidth"],h=(0,c.ZP)("div",{name:"MuiContainer",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,t["maxWidth".concat((0,v.Z)(String(n.maxWidth)))],n.fixed&&t.fixed,n.disableGutters&&t.disableGutters]}})((function(e){var t=e.theme,n=e.ownerState;return(0,i.Z)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",display:"block"},!n.disableGutters&&(0,r.Z)({paddingLeft:t.spacing(2),paddingRight:t.spacing(2)},t.breakpoints.up("sm"),{paddingLeft:t.spacing(3),paddingRight:t.spacing(3)}))}),(function(e){var t=e.theme;return e.ownerState.fixed&&Object.keys(t.breakpoints.values).reduce((function(e,n){var r=t.breakpoints.values[n];return 0!==r&&(e[t.breakpoints.up(n)]={maxWidth:"".concat(r).concat(t.breakpoints.unit)}),e}),{})}),(function(e){var t=e.theme,n=e.ownerState;return(0,i.Z)({},"xs"===n.maxWidth&&(0,r.Z)({},t.breakpoints.up("xs"),{maxWidth:Math.max(t.breakpoints.values.xs,444)}),n.maxWidth&&"xs"!==n.maxWidth&&(0,r.Z)({},t.breakpoints.up(n.maxWidth),{maxWidth:"".concat(t.breakpoints.values[n.maxWidth]).concat(t.breakpoints.unit)}))})),g=o.forwardRef((function(e,t){var n=(0,s.Z)({props:e,name:"MuiContainer"}),r=n.className,o=n.component,c=void 0===o?"div":o,f=n.disableGutters,g=void 0!==f&&f,w=n.fixed,y=void 0!==w&&w,b=n.maxWidth,x=void 0===b?"lg":b,E=(0,a.Z)(n,p),M=(0,i.Z)({},n,{component:c,disableGutters:g,fixed:y,maxWidth:x}),Z=function(e){var t=e.classes,n=e.fixed,r=e.disableGutters,a=e.maxWidth,i={root:["root",a&&"maxWidth".concat((0,v.Z)(String(a))),n&&"fixed",r&&"disableGutters"]};return(0,u.Z)(i,d,t)}(M);return(0,m.jsx)(h,(0,i.Z)({as:c,ownerState:M,className:(0,l.Z)(Z.root,r),ref:t},E))}))},9308:function(e,t,n){n.d(t,{Z:function(){return y}});var r=n(5245),a=n(7462),i=n(7294),o=n(5505),l=n(8297),u=n(9408),s=n(8348),c=n(2371),f=n(9240),d=n(8416);function v(e){return(0,d.Z)("MuiTypography",e)}(0,n(2194).Z)("MuiTypography",["root","h1","h2","h3","h4","h5","h6","subtitle1","subtitle2","body1","body2","inherit","button","caption","overline","alignLeft","alignRight","alignCenter","alignJustify","noWrap","gutterBottom","paragraph"]);var m=n(5893),p=["align","className","component","gutterBottom","noWrap","paragraph","variant","variantMapping"],h=(0,s.ZP)("span",{name:"MuiTypography",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.variant&&t[n.variant],"inherit"!==n.align&&t["align".concat((0,f.Z)(n.align))],n.noWrap&&t.noWrap,n.gutterBottom&&t.gutterBottom,n.paragraph&&t.paragraph]}})((function(e){var t=e.theme,n=e.ownerState;return(0,a.Z)({margin:0},n.variant&&t.typography[n.variant],"inherit"!==n.align&&{textAlign:n.align},n.noWrap&&{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},n.gutterBottom&&{marginBottom:"0.35em"},n.paragraph&&{marginBottom:16})})),g={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p",inherit:"p"},w={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},y=i.forwardRef((function(e,t){var n=(0,c.Z)({props:e,name:"MuiTypography"}),i=function(e){return w[e]||e}(n.color),s=(0,l.Z)((0,a.Z)({},n,{color:i})),d=s.align,y=void 0===d?"inherit":d,b=s.className,x=s.component,E=s.gutterBottom,M=void 0!==E&&E,Z=s.noWrap,_=void 0!==Z&&Z,S=s.paragraph,k=void 0!==S&&S,R=s.variant,C=void 0===R?"body1":R,T=s.variantMapping,P=void 0===T?g:T,A=(0,r.Z)(s,p),D=(0,a.Z)({},s,{align:y,color:i,className:b,component:x,gutterBottom:M,noWrap:_,paragraph:k,variant:C,variantMapping:P}),B=x||(k?"p":P[C]||g[C])||"span",F=function(e){var t=e.align,n=e.gutterBottom,r=e.noWrap,a=e.paragraph,i=e.variant,o=e.classes,l={root:["root",i,"inherit"!==e.align&&"align".concat((0,f.Z)(t)),n&&"gutterBottom",r&&"noWrap",a&&"paragraph"]};return(0,u.Z)(l,v,o)}(D);return(0,m.jsx)(h,(0,a.Z)({as:B,ref:t,ownerState:D,className:(0,o.Z)(F.root,b)},A))}))},715:function(e,t,n){n.d(t,{Xo:function(){return J}});var r=Uint8Array,a=Uint16Array,i=Uint32Array,o=new r([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),l=new r([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),u=new r([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),s=function(e,t){for(var n=new a(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];var o=new i(n[30]);for(r=1;r<30;++r)for(var l=n[r];l<n[r+1];++l)o[l]=l-n[r]<<5|r;return[n,o]},c=s(o,2),f=c[0],d=c[1];f[28]=258,d[258]=28;for(var v=s(l,0),m=(v[0],v[1]),p=new a(32768),h=0;h<32768;++h){var g=(43690&h)>>>1|(21845&h)<<1;g=(61680&(g=(52428&g)>>>2|(13107&g)<<2))>>>4|(3855&g)<<4,p[h]=((65280&g)>>>8|(255&g)<<8)>>>1}var w=function(e,t,n){for(var r=e.length,i=0,o=new a(t);i<r;++i)e[i]&&++o[e[i]-1];var l,u=new a(t);for(i=0;i<t;++i)u[i]=u[i-1]+o[i-1]<<1;if(n){l=new a(1<<t);var s=15-t;for(i=0;i<r;++i)if(e[i])for(var c=i<<4|e[i],f=t-e[i],d=u[e[i]-1]++<<f,v=d|(1<<f)-1;d<=v;++d)l[p[d]>>>s]=c}else for(l=new a(r),i=0;i<r;++i)e[i]&&(l[i]=p[u[e[i]-1]++]>>>15-e[i]);return l},y=new r(288);for(h=0;h<144;++h)y[h]=8;for(h=144;h<256;++h)y[h]=9;for(h=256;h<280;++h)y[h]=7;for(h=280;h<288;++h)y[h]=8;var b=new r(32);for(h=0;h<32;++h)b[h]=5;var x=w(y,9,0),E=w(b,5,0),M=function(e){return(e+7)/8|0},Z=function(e,t,n){(null==t||t<0)&&(t=0),(null==n||n>e.length)&&(n=e.length);var o=new(2==e.BYTES_PER_ELEMENT?a:4==e.BYTES_PER_ELEMENT?i:r)(n-t);return o.set(e.subarray(t,n)),o},_=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],S=function e(t,n,r){var a=new Error(n||_[t]);if(a.code=t,Error.captureStackTrace&&Error.captureStackTrace(a,e),!r)throw a;return a},k=function(e,t,n){n<<=7&t;var r=t/8|0;e[r]|=n,e[r+1]|=n>>>8},R=function(e,t,n){n<<=7&t;var r=t/8|0;e[r]|=n,e[r+1]|=n>>>8,e[r+2]|=n>>>16},C=function(e,t){for(var n=[],i=0;i<e.length;++i)e[i]&&n.push({s:i,f:e[i]});var o=n.length,l=n.slice();if(!o)return[z,0];if(1==o){var u=new r(n[0].s+1);return u[n[0].s]=1,[u,1]}n.sort((function(e,t){return e.f-t.f})),n.push({s:-1,f:25001});var s=n[0],c=n[1],f=0,d=1,v=2;for(n[0]={s:-1,f:s.f+c.f,l:s,r:c};d!=o-1;)s=n[n[f].f<n[v].f?f++:v++],c=n[f!=d&&n[f].f<n[v].f?f++:v++],n[d++]={s:-1,f:s.f+c.f,l:s,r:c};var m=l[0].s;for(i=1;i<o;++i)l[i].s>m&&(m=l[i].s);var p=new a(m+1),h=T(n[d-1],p,0);if(h>t){i=0;var g=0,w=h-t,y=1<<w;for(l.sort((function(e,t){return p[t.s]-p[e.s]||e.f-t.f}));i<o;++i){var b=l[i].s;if(!(p[b]>t))break;g+=y-(1<<h-p[b]),p[b]=t}for(g>>>=w;g>0;){var x=l[i].s;p[x]<t?g-=1<<t-p[x]++-1:++i}for(;i>=0&&g;--i){var E=l[i].s;p[E]==t&&(--p[E],++g)}h=t}return[new r(p),h]},T=function e(t,n,r){return-1==t.s?Math.max(e(t.l,n,r+1),e(t.r,n,r+1)):n[t.s]=r},P=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new a(++t),r=0,i=e[0],o=1,l=function(e){n[r++]=e},u=1;u<=t;++u)if(e[u]==i&&u!=t)++o;else{if(!i&&o>2){for(;o>138;o-=138)l(32754);o>2&&(l(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(l(i),--o;o>6;o-=6)l(8304);o>2&&(l(o-3<<5|8208),o=0)}for(;o--;)l(i);o=1,i=e[u]}return[n.subarray(0,r),t]},A=function(e,t){for(var n=0,r=0;r<t.length;++r)n+=e[r]*t[r];return n},D=function(e,t,n){var r=n.length,a=M(t+2);e[a]=255&r,e[a+1]=r>>>8,e[a+2]=255^e[a],e[a+3]=255^e[a+1];for(var i=0;i<r;++i)e[a+i+4]=n[i];return 8*(a+4+r)},B=function(e,t,n,r,i,s,c,f,d,v,m){k(t,m++,n),++i[256];for(var p=C(i,15),h=p[0],g=p[1],M=C(s,15),Z=M[0],_=M[1],S=P(h),T=S[0],B=S[1],F=P(Z),z=F[0],L=F[1],W=new a(19),I=0;I<T.length;++I)W[31&T[I]]++;for(I=0;I<z.length;++I)W[31&z[I]]++;for(var N=C(W,7),O=N[0],U=N[1],G=19;G>4&&!O[u[G-1]];--G);var j,q,H,V,X=v+5<<3,Y=A(i,y)+A(s,b)+c,$=A(i,h)+A(s,Z)+c+14+3*G+A(W,O)+(2*W[16]+3*W[17]+7*W[18]);if(X<=Y&&X<=$)return D(t,m,e.subarray(d,d+v));if(k(t,m,1+($<Y)),m+=2,$<Y){j=w(h,g,0),q=h,H=w(Z,_,0),V=Z;var J=w(O,U,0);k(t,m,B-257),k(t,m+5,L-1),k(t,m+10,G-4),m+=14;for(I=0;I<G;++I)k(t,m+3*I,O[u[I]]);m+=3*G;for(var K=[T,z],Q=0;Q<2;++Q){var ee=K[Q];for(I=0;I<ee.length;++I){var te=31&ee[I];k(t,m,J[te]),m+=O[te],te>15&&(k(t,m,ee[I]>>>5&127),m+=ee[I]>>>12)}}}else j=x,q=y,H=E,V=b;for(I=0;I<f;++I)if(r[I]>255){te=r[I]>>>18&31;R(t,m,j[te+257]),m+=q[te+257],te>7&&(k(t,m,r[I]>>>23&31),m+=o[te]);var ne=31&r[I];R(t,m,H[ne]),m+=V[ne],ne>3&&(R(t,m,r[I]>>>5&8191),m+=l[ne])}else R(t,m,j[r[I]]),m+=q[r[I]];return R(t,m,j[256]),m+q[256]},F=new i([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),z=new r(0),L=function(e,t,n,u,s,c){var f=e.length,v=new r(u+f+5*(1+Math.ceil(f/7e3))+s),p=v.subarray(u,v.length-s),h=0;if(!t||f<8)for(var g=0;g<=f;g+=65535){var w=g+65535;w>=f&&(p[h>>3]=c),h=D(p,h+1,e.subarray(g,w))}else{for(var y=F[t-1],b=y>>>13,x=8191&y,E=(1<<n)-1,_=new a(32768),S=new a(E+1),k=Math.ceil(n/3),R=2*k,C=function(t){return(e[t]^e[t+1]<<k^e[t+2]<<R)&E},T=new i(25e3),P=new a(288),A=new a(32),L=0,W=0,I=(g=0,0),N=0,O=0;g<f;++g){var U=C(g),G=32767&g,j=S[U];if(_[G]=j,S[U]=G,N<=g){var q=f-g;if((L>7e3||I>24576)&&q>423){h=B(e,p,0,T,P,A,W,I,O,g-O,h),I=L=W=0,O=g;for(var H=0;H<286;++H)P[H]=0;for(H=0;H<30;++H)A[H]=0}var V=2,X=0,Y=x,$=G-j&32767;if(q>2&&U==C(g-$))for(var J=Math.min(b,q)-1,K=Math.min(32767,g),Q=Math.min(258,q);$<=K&&--Y&&G!=j;){if(e[g+V]==e[g+V-$]){for(var ee=0;ee<Q&&e[g+ee]==e[g+ee-$];++ee);if(ee>V){if(V=ee,X=$,ee>J)break;var te=Math.min($,ee-2),ne=0;for(H=0;H<te;++H){var re=g-$+H+32768&32767,ae=re-_[re]+32768&32767;ae>ne&&(ne=ae,j=re)}}}$+=(G=j)-(j=_[G])+32768&32767}if(X){T[I++]=268435456|d[V]<<18|m[X];var ie=31&d[V],oe=31&m[X];W+=o[ie]+l[oe],++P[257+ie],++A[oe],N=g+V,++L}else T[I++]=e[g],++P[e[g]]}}h=B(e,p,c,T,P,A,W,I,O,g-O,h),!c&&7&h&&(h=D(p,h+1,z))}return Z(v,0,u+M(h)+s)},W=function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var n=t,r=9;--r;)n=(1&n&&-306674912)^n>>>1;e[t]=n}return e}(),I=function(){var e=-1;return{p:function(t){for(var n=e,r=0;r<t.length;++r)n=W[255&n^t[r]]^n>>>8;e=n},d:function(){return~e}}},N=function(e,t,n,r,a){return L(e,null==t.level?6:t.level,null==t.mem?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(e.length)))):12+t.mem,n,r,!a)},O=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n},U=function(e,t,n){for(;n;++t)e[t]=n,n>>>=8};function G(e,t){return N(e,t||{},0,0)}var j=function e(t,n,a,i){for(var o in t){var l=t[o],u=n+o,s=i;Array.isArray(l)&&(s=O(i,l[1]),l=l[0]),l instanceof r?a[u]=[l,s]:(a[u+="/"]=[new r(0),s],e(l,u,a,i))}},q="undefined"!=typeof TextEncoder&&new TextEncoder,H="undefined"!=typeof TextDecoder&&new TextDecoder;try{H.decode(z,{stream:!0}),1}catch(K){}function V(e,t){if(t){for(var n=new r(e.length),a=0;a<e.length;++a)n[a]=e.charCodeAt(a);return n}if(q)return q.encode(e);var i=e.length,o=new r(e.length+(e.length>>1)),l=0,u=function(e){o[l++]=e};for(a=0;a<i;++a){if(l+5>o.length){var s=new r(l+8+(i-a<<1));s.set(o),o=s}var c=e.charCodeAt(a);c<128||t?u(c):c<2048?(u(192|c>>6),u(128|63&c)):c>55295&&c<57344?(u(240|(c=65536+(1047552&c)|1023&e.charCodeAt(++a))>>18),u(128|c>>12&63),u(128|c>>6&63),u(128|63&c)):(u(224|c>>12),u(128|c>>6&63),u(128|63&c))}return Z(o,0,l)}var X=function(e){var t=0;if(e)for(var n in e){var r=e[n].length;r>65535&&S(9),t+=r+4}return t},Y=function(e,t,n,r,a,i,o,l){var u=r.length,s=n.extra,c=l&&l.length,f=X(s);U(e,t,null!=o?33639248:67324752),t+=4,null!=o&&(e[t++]=20,e[t++]=n.os),e[t]=20,t+=2,e[t++]=n.flag<<1|(null==i&&8),e[t++]=a&&8,e[t++]=255&n.compression,e[t++]=n.compression>>8;var d=new Date(null==n.mtime?Date.now():n.mtime),v=d.getFullYear()-1980;if((v<0||v>119)&&S(10),U(e,t,v<<25|d.getMonth()+1<<21|d.getDate()<<16|d.getHours()<<11|d.getMinutes()<<5|d.getSeconds()>>>1),t+=4,null!=i&&(U(e,t,n.crc),U(e,t+4,i),U(e,t+8,n.size)),U(e,t+12,u),U(e,t+14,f),t+=16,null!=o&&(U(e,t,c),U(e,t+6,n.attrs),U(e,t+10,o),t+=14),e.set(r,t),t+=u,f)for(var m in s){var p=s[m],h=p.length;U(e,t,+m),U(e,t+2,h),e.set(p,t+4),t+=4+h}return c&&(e.set(l,t),t+=c),t},$=function(e,t,n,r,a){U(e,t,101010256),U(e,t+8,n),U(e,t+10,n),U(e,t+12,r),U(e,t+16,a)};function J(e,t){t||(t={});var n={},a=[];j(e,"",n,t);var i=0,o=0;for(var l in n){var u=n[l],s=u[0],c=u[1],f=0==c.level?0:8,d=(Z=V(l)).length,v=c.comment,m=v&&V(v),p=m&&m.length,h=X(c.extra);d>65535&&S(11);var g=f?G(s,c):s,w=g.length,y=I();y.p(s),a.push(O(c,{size:s.length,crc:y.d(),c:g,f:Z,m:m,u:d!=l.length||m&&v.length!=p,o:i,compression:f})),i+=30+d+h+w,o+=76+2*(d+h)+(p||0)+w}for(var b=new r(o+22),x=i,E=o-i,M=0;M<a.length;++M){var Z=a[M];Y(b,Z.o,Z,Z.f,Z.u,Z.c.length);var _=30+Z.f.length+X(Z.extra);b.set(Z.c,Z.o+_),Y(b,i,Z,Z.f,Z.u,Z.c.length,Z.o,Z.m),i+=16+_+(Z.m?Z.m.length:0)}return $(b,i,a.length,E,x),b}"function"==typeof queueMicrotask?queueMicrotask:"function"==typeof setTimeout&&setTimeout},7362:function(e,t,n){n.d(t,{x:function(){return f}});var r=n(5671),a=n(3144),i=n(8052),o=n(136),l=n(6215),u=n(1120),s=n(2109);function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,u.Z)(e);if(t){var a=(0,u.Z)(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return(0,l.Z)(this,n)}}var f=function(e){(0,o.Z)(n,e);var t=c(n);function n(e){var a;return(0,r.Z)(this,n),(a=t.call(this,e)).type=s.cLu,a}return(0,a.Z)(n,[{key:"parse",value:function(e){var t=function(e,t){switch(e){case 1:console.error("THREE.RGBELoader Read Error: "+(t||""));break;case 2:console.error("THREE.RGBELoader Write Error: "+(t||""));break;case 3:console.error("THREE.RGBELoader Bad File Format: "+(t||""));break;default:console.error("THREE.RGBELoader: Error: "+(t||""))}return-1},n=function(e,t,n){t=t||1024;for(var r=e.pos,a=-1,i=0,o="",l=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));0>(a=l.indexOf("\n"))&&i<t&&r<e.byteLength;)o+=l,i+=l.length,r+=128,l+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));return-1<a&&(!1!==n&&(e.pos+=i+a+1),o+l.slice(0,a))},r=function(e,t,n,r){var a=e[t+3],i=Math.pow(2,a-128)/255;n[r+0]=s.A5E.toHalfFloat(Math.min(e[t+0]*i,65504)),n[r+1]=s.A5E.toHalfFloat(Math.min(e[t+1]*i,65504)),n[r+2]=s.A5E.toHalfFloat(Math.min(e[t+2]*i,65504)),n[r+3]=s.A5E.toHalfFloat(1)},a=new Uint8Array(e);a.pos=0;var i,o,l,u,c,f,d=function(e){var r,a,i=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,l=/^\s*FORMAT=(\S+)\s*$/,u=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,s={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};if(e.pos>=e.byteLength||!(r=n(e)))return t(1,"no header found");if(!(a=r.match(/^#\?(\S+)/)))return t(3,"bad initial token");for(s.valid|=1,s.programtype=a[1],s.string+=r+"\n";!1!==(r=n(e));)if(s.string+=r+"\n","#"!==r.charAt(0)){if((a=r.match(i))&&(s.gamma=parseFloat(a[1])),(a=r.match(o))&&(s.exposure=parseFloat(a[1])),(a=r.match(l))&&(s.valid|=2,s.format=a[1]),(a=r.match(u))&&(s.valid|=4,s.height=parseInt(a[1],10),s.width=parseInt(a[2],10)),2&s.valid&&4&s.valid)break}else s.comments+=r+"\n";return 2&s.valid?4&s.valid?s:t(3,"missing image size specifier"):t(3,"missing format specifier")}(a);if(-1!==d){var v=d.width,m=d.height,p=function(e,n,r){var a=n;if(a<8||a>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);if(a!==(e[2]<<8|e[3]))return t(3,"wrong scanline width");var i=new Uint8Array(4*n*r);if(!i.length)return t(4,"unable to allocate buffer space");for(var o=0,l=0,u=4*a,s=new Uint8Array(4),c=new Uint8Array(u),f=r;f>0&&l<e.byteLength;){if(l+4>e.byteLength)return t(1);if(s[0]=e[l++],s[1]=e[l++],s[2]=e[l++],s[3]=e[l++],2!=s[0]||2!=s[1]||(s[2]<<8|s[3])!=a)return t(3,"bad rgbe scanline format");for(var d=0,v=void 0;d<u&&l<e.byteLength;){var m=(v=e[l++])>128;if(m&&(v-=128),0===v||d+v>u)return t(3,"bad scanline data");if(m)for(var p=e[l++],h=0;h<v;h++)c[d++]=p;else c.set(e.subarray(l,l+v),d),d+=v,l+=v}for(var g=a,w=0;w<g;w++){var y=0;i[o]=c[w+y],y+=a,i[o+1]=c[w+y],y+=a,i[o+2]=c[w+y],y+=a,i[o+3]=c[w+y],o+=4}f--}return i}(a.subarray(a.pos),v,m);if(-1!==p){var h,g,w;switch(this.type){case s.VzW:w=p.length/4;for(var y=new Float32Array(4*w),b=0;b<w;b++)l=y,u=4*b,c=void 0,f=void 0,c=(i=p)[(o=4*b)+3],f=Math.pow(2,c-128)/255,l[u+0]=i[o+0]*f,l[u+1]=i[o+1]*f,l[u+2]=i[o+2]*f,l[u+3]=1;h=y,g=s.VzW;break;case s.cLu:w=p.length/4;for(var x=new Uint16Array(4*w),E=0;E<w;E++)r(p,4*E,x,4*E);h=x,g=s.cLu;break;default:console.error("THREE.RGBELoader: unsupported type: ",this.type)}return{width:v,height:m,data:h,header:d.string,gamma:d.gamma,exposure:d.exposure,format:undefined,type:g}}}return null}},{key:"setDataType",value:function(e){return this.type=e,this}},{key:"load",value:function(e,t,r,a){return(0,i.Z)((0,u.Z)(n.prototype),"load",this).call(this,e,(function(e,n){switch(e.type){case s.VzW:case s.cLu:e.encoding=s.rnI,e.minFilter=s.wem,e.magFilter=s.wem,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,n)}),r,a)}}]),n}(s.yxD)},4294:function(e,t,n){n.a(e,(async function(e){n.r(t),n.d(t,{default:function(){return Z}});var r=n(7294),a=n(4382),i=n(8348),o=n(8953),l=n(8958),u=n(1916),s=n(1194),c=n(9308),f=n(2266),d=n(7449),v=n(5616),m=n(4431),p=n(4842),h=n(7454),g=n(715),w=n(511),y=n(9675),b=n(23),x=n(953),E=e([m,u,l]);[m,u,l]=E.then?await E:E;var M=(0,i.ZP)(o.Z)((function(e){var t=e.theme;return Object.assign({},t.typography.body2,{padding:t.spacing(1),textAlign:"center",color:t.palette.text.secondary})}));function Z(){var e=(0,r.useState)(new Map),t=e[0],n=e[1],i=(0,r.useState)(7e3),o=i[0],E=i[1],Z=(0,r.useState)(2e3),_=Z[0],S=Z[1],k=(0,r.useState)(128),R=k[0],C=k[1],T=(0,r.useState)(8),P=T[0],A=T[1],D=(0,r.useState)("0.1"),B=D[0],F=D[1],z=(0,r.useState)(null),L=z[0],W=z[1];return r.createElement(a.Z,{spacing:2,alignItems:"center"},r.createElement(p.default,null),r.createElement(w.default,{onFile:W}),r.createElement(a.Z,{direction:"row",spacing:2},r.createElement(M,null,r.createElement(a.Z,{spacing:2,alignItems:"center"},r.createElement(c.Z,{variant:"h6"},"Diffuse Irradiance Map"),r.createElement(M,null,r.createElement(c.Z,null,"sampling pattern (Fibonacci sphere)"),r.createElement(l.default,{buffer:function(){return u.p_(300)},itemSize:3,uniqueId:"fibo"})),r.createElement(a.Z,{direction:"row",spacing:2},r.createElement(f.Z,{style:{width:120},id:"outlined-number",label:"sample size",type:"number",value:o,onChange:function(e){return E(Number.parseInt(e.target.value))}}),r.createElement(f.Z,{style:{width:120},id:"outlined-number",label:"blur sigma",value:B,onChange:function(e){return F(e.target.value)}})),r.createElement(d.Z,{disabled:null===L,onClick:function(){if(L){var e=(0,m.lR)(L,o,Number.parseFloat(B));n(e.reduce((function(e,t,n){return e.set("Environment_c0"+n+".png.hdr",t)}),new Map))}}},"generate"))),r.createElement(M,null,r.createElement(a.Z,{spacing:2,alignItems:"center"},r.createElement(c.Z,{variant:"h6"},"Pre-Filtered Environment Map"),r.createElement(M,null,r.createElement(c.Z,null,"sampling pattern"),r.createElement(l.default,{buffer:function(){return u.zu(1,1,1,s.IW,60)},itemSize:3,uniqueId:"thestep2"})),r.createElement(a.Z,{direction:"row",spacing:2},r.createElement(f.Z,{style:{width:90},label:"sample size",type:"number",value:_,onChange:function(e){return S(Number.parseInt(e.target.value))}}),r.createElement(f.Z,{style:{width:90},label:"map size",type:"number",value:R,onChange:function(e){return C(Number.parseInt(e.target.value))}}),r.createElement(f.Z,{style:{width:90},label:"mip-levels",type:"number",value:P,onChange:function(e){return A(Number.parseInt(e.target.value))}})),r.createElement(d.Z,{disabled:null===L,onClick:function(){L&&(0,m.HA)(L,_,R,P).then((function(e){n(e.reduce((function(e,t,n){return e.set("Environment_m0"+Math.floor(n/6)+"_c0"+n%6+".png.hdr",t)}),new Map))}))}},"generate")))),r.createElement(a.Z,{spacing:2,direction:"row"},r.createElement(d.Z,{onClick:function(){var e={};t.forEach((function(t,n){e[n]=t}));var n=g.Xo(e);(0,m.lm)(n,"environment-maps.zip")}},"Download All"),r.createElement(d.Z,{disabled:null===L,onClick:function(){L&&(0,m.Vd)(L,Number.parseFloat(B))}},"Download Blurred"),r.createElement(d.Z,{onClick:m.D$},"WebGPU test")),r.createElement(h.default,{names:Array.from(t.keys())}),r.createElement(v.Z,null,r.createElement(y.default,null)),r.createElement(v.Z,null,r.createElement(b.default,{eff:x.n})))}}))},4842:function(e,t,n){n.r(t),n.d(t,{default:function(){return B}});var r=n(7294),a=n(7462),i=n(5245),o=n(5505),l=n(2048),u=n(2037),s=n(8297),c=n(7120),f=n(5893),d=["className","component"];var v=n(6756),m=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.defaultTheme,n=e.defaultClassName,v=void 0===n?"MuiBox-root":n,m=e.generateClassName,p=(0,l.ZP)("div")(u.Z),h=r.forwardRef((function(e,n){var r=(0,c.Z)(t),l=(0,s.Z)(e),u=l.className,h=l.component,g=void 0===h?"div":h,w=(0,i.Z)(l,d);return(0,f.jsx)(p,(0,a.Z)({as:g,ref:n,className:(0,o.Z)(u,m?m(v):v),theme:r},w))}));return h}({defaultTheme:(0,n(8790).Z)(),defaultClassName:"MuiBox-root",generateClassName:v.Z.generate}),p=m,h=n(885),g=n(4942),w=n(9408),y=n(5535),b=n(7663),x=n(9240),E=n(8348),M=n(2371),Z=n(93),_=n(5973),S=n(9308),k=n(8416);function R(e){return(0,k.Z)("MuiLink",e)}var C=(0,n(2194).Z)("MuiLink",["root","underlineNone","underlineHover","underlineAlways","button","focusVisible"]),T=["className","color","component","onBlur","onFocus","TypographyClasses","underline","variant"],P={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},A=(0,E.ZP)(S.Z,{name:"MuiLink",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,t["underline".concat((0,x.Z)(n.underline))],"button"===n.component&&t.button]}})((function(e){var t=e.theme,n=e.ownerState,r=(0,y.D)(t,"palette.".concat(function(e){return P[e]||e}(n.color)))||n.color;return(0,a.Z)({},"none"===n.underline&&{textDecoration:"none"},"hover"===n.underline&&{textDecoration:"none","&:hover":{textDecoration:"underline"}},"always"===n.underline&&{textDecoration:"underline",textDecorationColor:"inherit"!==r?(0,b.Fq)(r,.4):void 0,"&:hover":{textDecorationColor:"inherit"}},"button"===n.component&&(0,g.Z)({position:"relative",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none","&::-moz-focus-inner":{borderStyle:"none"}},"&.".concat(C.focusVisible),{outline:"auto"}))})),D=r.forwardRef((function(e,t){var n=(0,M.Z)({props:e,name:"MuiLink"}),l=n.className,u=n.color,s=void 0===u?"primary":u,c=n.component,d=void 0===c?"a":c,v=n.onBlur,m=n.onFocus,p=n.TypographyClasses,g=n.underline,y=void 0===g?"always":g,b=n.variant,E=void 0===b?"inherit":b,S=(0,i.Z)(n,T),k=(0,Z.Z)(),C=k.isFocusVisibleRef,P=k.onBlur,D=k.onFocus,B=k.ref,F=r.useState(!1),z=(0,h.Z)(F,2),L=z[0],W=z[1],I=(0,_.Z)(t,B),N=(0,a.Z)({},n,{color:s,component:d,focusVisible:L,underline:y,variant:E}),O=function(e){var t=e.classes,n=e.component,r=e.focusVisible,a=e.underline,i={root:["root","underline".concat((0,x.Z)(a)),"button"===n&&"button",r&&"focusVisible"]};return(0,w.Z)(i,R,t)}(N);return(0,f.jsx)(A,(0,a.Z)({className:(0,o.Z)(O.root,l),classes:p,color:s,component:d,onBlur:function(e){P(e),!1===C.current&&W(!1),v&&v(e)},onFocus:function(e){D(e),!0===C.current&&W(!0),m&&m(e)},ref:I,ownerState:N,variant:E},S))}));function B(){return r.createElement(p,{textAlign:"center"},r.createElement(S.Z,{variant:"h3",component:"div",gutterBottom:!0},"Diffuse Irradiance & Pre-Filtered Environment Map Generator"),r.createElement(S.Z,{variant:"subtitle1",gutterBottom:!0,component:"div"},"This is a demo of Rust-WASM implementation of"," ",r.createElement(D,{href:"https://learnopengl.com/PBR/IBL/Diffuse-irradiance"},"Diffuse Irradiance Map")," and ",r.createElement(D,{href:"https://learnopengl.com/PBR/IBL/Specular-IBL"},"Pre-Filtered Environment Map")," generation algorithms."))}},9675:function(e,t,n){n.r(t),n.d(t,{default:function(){return l}});var r=n(7294),a=n(2109),i=n(9908),o=n(7362);function l(){var e="pmremdebug";return(0,r.useEffect)((function(){!function(e,t,n){var r=new a.cPb(40,e/t,1,1e3);r.position.set(0,0,120);var l=new a.xsS;l.background=new a.Ilk(0);var u=new a.CP7;document.getElementById(n).appendChild(u.domElement),u.physicallyCorrectLights=!0,u.toneMapping=a.LY2;var s=new a.FE5(18,8,150,20),c=new a.Wid({color:16777215,metalness:.68,roughness:.08}),f=new a.Kj0(s,c);l.add(f);var d=new a._12(200,200),v=new a.vBJ,m=new a.Kj0(d,v);m.position.y=-50,m.rotation.x=.5*-Math.PI,l.add(m);var p=new a.anP(u);p.compileCubemapShader(),u.setPixelRatio(window.devicePixelRatio),u.setSize(e,t);var h=function(){u.render(l,r)};(new o.x).load("venetian_crossroads_1k.hdr",(function(e){var t=p.fromEquirectangular(e),n=t?t.texture:null;n&&n!==f.material.envMap&&(f.material.envMap=n,f.material.needsUpdate=!0,m.material.map=n,m.material.needsUpdate=!0),f.rotation.y+=.005,m.visible=!0,u.toneMappingExposure=1,h()})),u.outputEncoding=a.knz;var g=new i.z(r,u.domElement);g.minDistance=50,g.maxDistance=300,g.addEventListener("change",h)}(512,512,e)}),[]),r.createElement("div",{id:e,style:{height:512..toString()+"px",width:512..toString()+"px"}})}},23:function(e,t,n){n.r(t),n.d(t,{default:function(){return a}});var r=n(7294);function a(e){var t,n=null!==(t=e.domID)&&void 0!==t?t:"dom"+Math.floor(1e5*Math.random()).toString();return(0,r.useEffect)((function(){e.eff(512,512,n)}),[]),r.createElement("div",{id:n,style:{height:512..toString()+"px",width:512..toString()+"px"}})}},953:function(e,t,n){n.d(t,{n:function(){return g}});var r=n(2109),a=n(9908),i=n(7362),o=n(5671),l=n(3144),u=20,s=null,c=(1+Math.sqrt(5))/2,f=1/c,d=[new r.Pa4(1,1,1),new r.Pa4(-1,1,1),new r.Pa4(1,1,-1),new r.Pa4(-1,1,-1),new r.Pa4(0,c,f),new r.Pa4(0,c,-f),new r.Pa4(f,0,c),new r.Pa4(-f,0,c),new r.Pa4(c,f,0),new r.Pa4(-c,f,0)],v={magFilter:r.wem,generateMipmaps:!1,type:r.cLu,format:r.wk1,encoding:r.rnI,depthBuffer:!1},m=function(){function e(t){(0,o.Z)(this,e),this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._blurMaterial=null}return(0,l.Z)(e,[{key:"fromEquirectangular",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return this._fromTexture(e,t)}},{key:"dispose",value:function(){this._dispose()}},{key:"_setSize",value:function(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}},{key:"_dispose",value:function(){var e;null===(e=this._blurMaterial)||void 0===e||e.dispose(),null!==this._pingPongRenderTarget&&this._pingPongRenderTarget.dispose()}},{key:"_cleanup",value:function(e){this._renderer.setRenderTarget(s),e.scissorTest=!1}},{key:"_fromTexture",value:function(e,t){e.mapping===r.fY$||e.mapping===r.vxC?this._setSize(0===e.image.length?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),s=this._renderer.getRenderTarget();var n=t||this._allocateTargets();this._textureToCubeUV(e,n);var a=this._applyPMREM(n);return this._cleanup(n),a}},{key:"_allocateTargets",value:function(){var e,t,n=this._cubeSize,a=p(n,v);if(null===this._pingPongRenderTarget||this._pingPongRenderTarget.width!==n){null!==this._pingPongRenderTarget&&this._dispose(),this._pingPongRenderTarget=p(n,v);var i=function(e){for(var t=[],n=[],r=e,a=0;a<e;a++){var i=Math.pow(2,r);t.push(i);var o=1/i;0===a&&(o=0),n.push(o),r--}return{sizeLods:t,sigmas:n}}(this._lodMax);this._sizeLods=i.sizeLods,this._sigmas=i.sigmas,this._blurMaterial=(e=new Float32Array(u),t=new r.Pa4(0,1,0),new r.jyz({name:"SphericalGaussianBlur",defines:{n:u},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:e},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:t}},vertexShader:"\n            varying vec3 vOutputDirection;\n\n            void main() {\n            \tvOutputDirection = position;\n\t\t\t\tgl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );\n\t\t\t}\n    ",fragmentShader:"\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform samplerCube envMap;\n\t\t\tuniform int samples;\n\t\t\tuniform float weights[ n ];\n\t\t\tuniform bool latitudinal;\n\t\t\tuniform float dTheta;\n\t\t\tuniform float mipInt;\n\t\t\tuniform vec3 poleAxis;\n\n\t\t\tvec3 getSample( float theta, vec3 axis ) {\n\n\t\t\t\tfloat cosTheta = cos( theta );\n\t\t\t\t// Rodrigues' axis-angle rotation\n\t\t\t\tvec3 sampleDirection = vOutputDirection * cosTheta\n\t\t\t\t\t+ cross( axis, vOutputDirection ) * sin( theta )\n\t\t\t\t\t+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );\n                return textureCubeLodEXT(envMap, normalize(sampleDirection), mipInt).rgb;\n\t\t\t\t// return bilinearCubeUV( envMap, sampleDirection, mipInt );\n\n\t\t\t}\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );\n\n\t\t\t\tif ( all( equal( axis, vec3( 0.0 ) ) ) ) {\n\n\t\t\t\t\taxis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );\n\n\t\t\t\t}\n\n\t\t\t\taxis = normalize( axis );\n\n\t\t\t\tgl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\t\t\t\tgl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );\n\n\t\t\t\tfor ( int i = 1; i < n; i++ ) {\n\n\t\t\t\t\tif ( i >= samples ) {\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\t}\n\n\t\t\t\t\tfloat theta = dTheta * float( i );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( theta, axis );\n\n\t\t\t\t}\n\n\t\t\t}\n\t\t",blending:r.jFi,depthTest:!1,depthWrite:!1,side:r.ehD}))}return a}},{key:"_textureToCubeUV",value:function(e,t){var n=this._renderer;if(e.mapping===r.fY$||e.mapping===r.vxC)throw new Error("from cube texture is not implemented.");t.fromEquirectangularTexture(n,e)}},{key:"_applyPMREM",value:function(e){var t=this._renderer,n=t.autoClear;t.autoClear=!1;for(var a=[],i=e.texture,o=1;o<this._sigmas.length;o++){var l=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),u=d[(o-1)%d.length],s=this._sizeLods[o],c=new r.oAp(s,v);this._blur(i,c,o-1,o,l,u);var f=h(t,s,c);c.dispose(),a.push(f),i=f}var m=h(t,this._cubeSize,e);return m.minFilter=r.D1R,m.mipmaps=a,m.needsUpdate=!0,t.autoClear=n,m}},{key:"_blur",value:function(e,t,n,r,a,i){var o=this._pingPongRenderTarget;this._halfBlur(e,o,n,r,a,"latitudinal",i),this._halfBlur(o.texture,t,r,r,a,"longitudinal",i)}},{key:"_halfBlur",value:function(e,t,n,a,i,o,l){var s=this._renderer,c=this._blurMaterial;"latitudinal"!==o&&"longitudinal"!==o&&console.error("blur direction must be either latitudinal or longitudinal!");var f=new r.Kj0(new r.DvJ,c),d=c.uniforms,v=this._sizeLods[n]-1,m=isFinite(i)?Math.PI/(2*v):2*Math.PI/39,p=i/m,h=isFinite(i)?1+Math.floor(3*p):u;h>u&&console.warn("sigmaRadians, ".concat(i,", is too large and will clip, as it requested ").concat(h," samples when the maximum is set to ").concat(u));for(var g=[],w=0,y=0;y<u;++y){var b=y/p,x=Math.exp(-b*b/2);g.push(x),0===y?w+=x:y<h&&(w+=2*x)}for(var E=0;E<g.length;E++)g[E]=g[E]/w;d.envMap.value=e,d.samples.value=h,d.weights.value=g,d.latitudinal.value="latitudinal"===o,l&&(d.poleAxis.value=l),d.dTheta.value=m,d.mipInt.value=n;var M=new r._am(.1,1e3,t),Z=new r.xsS;Z.add(f),M.update(s,Z)}}]),e}();function p(e,t){return new r.oAp(e,t)}function h(e,t,n){var a=v.format,i=v.type,o=v.magFilter,l=v.minFilter,u=v.encoding,s=[0,1,2,3,4,5].map((function(l){var s=new Uint16Array(t*t*4);e.readRenderTargetPixels(n,0,0,t,t,s,l);var c=new r.IEO(s,t,t,a,i,void 0,void 0,void 0,o,void 0,void 0,u);return c.generateMipmaps=!1,c})),c=new r.BtG(s,void 0,void 0,void 0,o,l,a,i,void 0,u);return c.needsUpdate=!0,c.generateMipmaps=!1,c}function g(e,t,n){var o=new r.cPb(40,e/t,1,1e3);o.position.set(0,0,8);var l=new r.xsS;l.background=new r.Ilk(15728640);var u=new r.CP7;document.getElementById(n).appendChild(u.domElement),u.physicallyCorrectLights=!0,u.toneMapping=r.LY2;var s=new m(u);u.setPixelRatio(window.devicePixelRatio),u.setSize(e,t);var c=function(){requestAnimationFrame((function(){return u.render(l,o)}))};(new i.x).load("venetian_crossroads_1k.hdr",(function(e){var t=s.fromEquirectangular(e),n=null!=t?t:null,a=new r.jyz({vertexShader:"\n                  varying vec3 vOutputDirection;\n\n      void main() {\n                  \tvOutputDirection = position;\n\n      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );\n      }\n      ",fragmentShader:"\n      \tvarying vec3 vOutputDirection;\n      \tuniform samplerCube env;\n        void main() {\n          gl_FragColor = textureCubeLodEXT(env, normalize(vOutputDirection), 4.0);\n          // gl_FragColor = textureCube(env, normalize(vOutputDirection));\n        }\n      ",uniforms:{env:{value:n}}}),i=new r.Kj0(new r.DvJ,a);i.translateX(-1),l.add(i),u.toneMappingExposure=1,c()})),u.outputEncoding=r.knz;var f=new a.z(o,u.domElement);f.minDistance=1,f.maxDistance=300,f.addEventListener("change",c)}}}]);
//# sourceMappingURL=52299b76d4276d3dfcbb0e1aadd5415fc1c5a7d9-afce2e77a0d9feb91d56.js.map