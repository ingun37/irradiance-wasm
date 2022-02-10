"use strict";(self.webpackChunkwww=self.webpackChunkwww||[]).push([[908],{9308:function(n,e,t){t.d(e,{Z:function(){return Z}});var r=t(5245),o=t(7462),a=t(7294),i=t(5505),u=t(8297),c=t(9408),s=t(8348),l=t(2371),p=t(9240),d=t(8416);function m(n){return(0,d.Z)("MuiTypography",n)}(0,t(2194).Z)("MuiTypography",["root","h1","h2","h3","h4","h5","h6","subtitle1","subtitle2","body1","body2","inherit","button","caption","overline","alignLeft","alignRight","alignCenter","alignJustify","noWrap","gutterBottom","paragraph"]);var f=t(5893),v=["align","className","component","gutterBottom","noWrap","paragraph","variant","variantMapping"],h=(0,s.ZP)("span",{name:"MuiTypography",slot:"Root",overridesResolver:function(n,e){var t=n.ownerState;return[e.root,t.variant&&e[t.variant],"inherit"!==t.align&&e["align".concat((0,p.Z)(t.align))],t.noWrap&&e.noWrap,t.gutterBottom&&e.gutterBottom,t.paragraph&&e.paragraph]}})((function(n){var e=n.theme,t=n.ownerState;return(0,o.Z)({margin:0},t.variant&&e.typography[t.variant],"inherit"!==t.align&&{textAlign:t.align},t.noWrap&&{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},t.gutterBottom&&{marginBottom:"0.35em"},t.paragraph&&{marginBottom:16})})),g={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p",inherit:"p"},y={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},Z=a.forwardRef((function(n,e){var t=(0,l.Z)({props:n,name:"MuiTypography"}),a=function(n){return y[n]||n}(t.color),s=(0,u.Z)((0,o.Z)({},t,{color:a})),d=s.align,Z=void 0===d?"inherit":d,b=s.className,w=s.component,x=s.gutterBottom,B=void 0!==x&&x,M=s.noWrap,N=void 0!==M&&M,P=s.paragraph,E=void 0!==P&&P,R=s.variant,k=void 0===R?"body1":R,C=s.variantMapping,S=void 0===C?g:C,T=(0,r.Z)(s,v),L=(0,o.Z)({},s,{align:Z,color:a,className:b,component:w,gutterBottom:B,noWrap:N,paragraph:E,variant:k,variantMapping:S}),W=w||(E?"p":S[k]||g[k])||"span",A=function(n){var e=n.align,t=n.gutterBottom,r=n.noWrap,o=n.paragraph,a=n.variant,i=n.classes,u={root:["root",a,"inherit"!==n.align&&"align".concat((0,p.Z)(e)),t&&"gutterBottom",r&&"noWrap",o&&"paragraph"]};return(0,c.Z)(u,m,i)}(L);return(0,f.jsx)(h,(0,o.Z)({as:W,ref:e,ownerState:L,className:(0,i.Z)(A.root,b)},T))}))},5973:function(n,e,t){var r=t(8127);e.Z=r.Z},93:function(n,e,t){t.d(e,{Z:function(){return d}});var r,o=t(7294),a=!0,i=!1,u={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function c(n){n.metaKey||n.altKey||n.ctrlKey||(a=!0)}function s(){a=!1}function l(){"hidden"===this.visibilityState&&i&&(a=!0)}function p(n){var e,t,r,o=n.target;try{return o.matches(":focus-visible")}catch(i){}return a||(t=(e=o).type,!("INPUT"!==(r=e.tagName)||!u[t]||e.readOnly)||"TEXTAREA"===r&&!e.readOnly||!!e.isContentEditable)}var d=function(){var n=o.useCallback((function(n){var e;null!=n&&((e=n.ownerDocument).addEventListener("keydown",c,!0),e.addEventListener("mousedown",s,!0),e.addEventListener("pointerdown",s,!0),e.addEventListener("touchstart",s,!0),e.addEventListener("visibilitychange",l,!0))}),[]),e=o.useRef(!1);return{isFocusVisibleRef:e,onFocus:function(n){return!!p(n)&&(e.current=!0,!0)},onBlur:function(){return!!e.current&&(i=!0,window.clearTimeout(r),r=window.setTimeout((function(){i=!1}),100),e.current=!1,!0)},ref:n}}},8297:function(n,e,t){t.d(e,{Z:function(){return s}});var r=t(2982),o=t(7462),a=t(5245),i=t(6486),u=t(9665),c=["sx"];function s(n){var e,t=n.sx,s=function(n){var e={systemProps:{},otherProps:{}};return Object.keys(n).forEach((function(t){u.G[t]?e.systemProps[t]=n[t]:e.otherProps[t]=n[t]})),e}((0,a.Z)(n,c)),l=s.systemProps,p=s.otherProps;return e=Array.isArray(t)?[l].concat((0,r.Z)(t)):"function"==typeof t?function(){var n=t.apply(void 0,arguments);return(0,i.P)(n)?(0,o.Z)({},l,n):l}:(0,o.Z)({},l,t),(0,o.Z)({},p,{sx:e})}},6386:function(n,e,t){function r(n,e){"function"==typeof n?n(e):n&&(n.current=e)}t.d(e,{Z:function(){return r}})},8127:function(n,e,t){t.d(e,{Z:function(){return a}});var r=t(7294),o=t(6386);function a(n,e){return r.useMemo((function(){return null==n&&null==e?null:function(t){(0,o.Z)(n,t),(0,o.Z)(e,t)}}),[n,e])}},4842:function(n,e,t){t.r(e),t.d(e,{default:function(){return W}});var r=t(7294),o=t(7462),a=t(5245),i=t(5505),u=t(2048),c=t(2037),s=t(8297),l=t(7120),p=t(5893),d=["className","component"];var m=t(6756),f=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=n.defaultTheme,t=n.defaultClassName,m=void 0===t?"MuiBox-root":t,f=n.generateClassName,v=(0,u.ZP)("div")(c.Z),h=r.forwardRef((function(n,t){var r=(0,l.Z)(e),u=(0,s.Z)(n),c=u.className,h=u.component,g=void 0===h?"div":h,y=(0,a.Z)(u,d);return(0,p.jsx)(v,(0,o.Z)({as:g,ref:t,className:(0,i.Z)(c,f?f(m):m),theme:r},y))}));return h}({defaultTheme:(0,t(8790).Z)(),defaultClassName:"MuiBox-root",generateClassName:m.Z.generate}),v=f,h=t(885),g=t(4942),y=t(9408),Z=t(5535),b=t(7663),w=t(9240),x=t(8348),B=t(2371),M=t(93),N=t(5973),P=t(9308),E=t(8416);function R(n){return(0,E.Z)("MuiLink",n)}var k=(0,t(2194).Z)("MuiLink",["root","underlineNone","underlineHover","underlineAlways","button","focusVisible"]),C=["className","color","component","onBlur","onFocus","TypographyClasses","underline","variant"],S={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},T=(0,x.ZP)(P.Z,{name:"MuiLink",slot:"Root",overridesResolver:function(n,e){var t=n.ownerState;return[e.root,e["underline".concat((0,w.Z)(t.underline))],"button"===t.component&&e.button]}})((function(n){var e=n.theme,t=n.ownerState,r=(0,Z.D)(e,"palette.".concat(function(n){return S[n]||n}(t.color)))||t.color;return(0,o.Z)({},"none"===t.underline&&{textDecoration:"none"},"hover"===t.underline&&{textDecoration:"none","&:hover":{textDecoration:"underline"}},"always"===t.underline&&{textDecoration:"underline",textDecorationColor:"inherit"!==r?(0,b.Fq)(r,.4):void 0,"&:hover":{textDecorationColor:"inherit"}},"button"===t.component&&(0,g.Z)({position:"relative",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none","&::-moz-focus-inner":{borderStyle:"none"}},"&.".concat(k.focusVisible),{outline:"auto"}))})),L=r.forwardRef((function(n,e){var t=(0,B.Z)({props:n,name:"MuiLink"}),u=t.className,c=t.color,s=void 0===c?"primary":c,l=t.component,d=void 0===l?"a":l,m=t.onBlur,f=t.onFocus,v=t.TypographyClasses,g=t.underline,Z=void 0===g?"always":g,b=t.variant,x=void 0===b?"inherit":b,P=(0,a.Z)(t,C),E=(0,M.Z)(),k=E.isFocusVisibleRef,S=E.onBlur,L=E.onFocus,W=E.ref,A=r.useState(!1),D=(0,h.Z)(A,2),F=D[0],V=D[1],I=(0,N.Z)(e,W),j=(0,o.Z)({},t,{color:s,component:d,focusVisible:F,underline:Z,variant:x}),O=function(n){var e=n.classes,t=n.component,r=n.focusVisible,o=n.underline,a={root:["root","underline".concat((0,w.Z)(o)),"button"===t&&"button",r&&"focusVisible"]};return(0,y.Z)(a,R,e)}(j);return(0,p.jsx)(T,(0,o.Z)({className:(0,i.Z)(O.root,u),classes:v,color:s,component:d,onBlur:function(n){S(n),!1===k.current&&V(!1),m&&m(n)},onFocus:function(n){L(n),!0===k.current&&V(!0),f&&f(n)},ref:I,ownerState:j,variant:x},P))}));function W(){return r.createElement(v,{textAlign:"center"},r.createElement(P.Z,{variant:"h3",component:"div",gutterBottom:!0},"Diffuse Irradiance & Pre-Filtered Environment Map Generator"),r.createElement(P.Z,{variant:"subtitle1",gutterBottom:!0,component:"div"},"This is a demo of Rust-WASM implementation of"," ",r.createElement(L,{href:"https://learnopengl.com/PBR/IBL/Diffuse-irradiance"},"Diffuse Irradiance Map")," and ",r.createElement(L,{href:"https://learnopengl.com/PBR/IBL/Specular-IBL"},"Pre-Filtered Environment Map")," generation algorithms."))}}}]);
//# sourceMappingURL=9c7ca18ea833e53ebb3f003bc027f4e85ef6b042-6e05219f9d2c4d803702.js.map