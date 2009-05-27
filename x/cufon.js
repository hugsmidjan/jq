/* Copyright (c) 2009 Simo Kinnunen. Licensed under the MIT license. */
var Cufon=(function(){var L=function(){return L.replace.apply(null,arguments)};var W=L.DOM={ready:(function(){var b=false,d={loaded:1,complete:1};var a=[],c=function(){if(b){return}b=true;for(var e;e=a.shift();e()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",c,false);window.addEventListener("pageshow",c,false)}if(!window.opera&&document.readyState){(function(){d[document.readyState]?c():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");c()}catch(f){setTimeout(arguments.callee,1)}})()}P(window,"load",c);return function(e){if(!arguments.length){c()}else{b?e():a.push(e)}}})()};var M=L.CSS={Size:function(b,a){this.value=parseFloat(b);this.unit=String(b).match(/[a-z%]*$/)[0]||"px";this.convert=function(c){return c/a*this.value};this.convertFrom=function(c){return c/this.value*a};this.toString=function(){return this.value+this.unit}},color:I(function(b){var a={};a.color=b.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(d,c,e){a.opacity=parseFloat(e);return"rgb("+c+")"});return a}),getStyle:function(b){var a=document.defaultView;if(a&&a.getComputedStyle){return new A(a.getComputedStyle(b,null))}if(b.currentStyle){return new A(b.currentStyle)}return new A(b.style)},gradient:I(function(e){var f={id:e,type:e.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},b=e.substr(e.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var d=0,a=b.length,c;d<a;++d){c=b[d].split("=",2).reverse();f.stops.push([c[1]||d/(a-1),c[0]])}return f}),quotedList:I(function(d){var c=[],b=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,a;while(a=b.exec(d)){c.push(a[3]||a[1])}return c}),recognizesMedia:I(function(d){var c=document.createElement("style"),b,a;c.type="text/css";c.media=d;b=F("head")[0];b.insertBefore(c,b.firstChild);a=!!(c.sheet||c.styleSheet);b.removeChild(c);return a}),supports:function(c,b){var a=document.createElement("span").style;if(a[c]===undefined){return false}a[c]=b;return a[c]===b},textAlign:function(d,c,a,b){if(c.get("textAlign")=="right"){if(a>0){d=" "+d}}else{if(a<b-1){d+=" "}}return d},textDecoration:function(f,e){if(!e){e=this.getStyle(f)}var b={underline:null,overline:null,"line-through":null};for(var a=f;a.parentNode&&a.parentNode.nodeType==1;){var d=true;for(var c in b){if(!J(b,c)||b[c]){continue}if(e.get("textDecoration").indexOf(c)!=-1){b[c]=e.get("color")}d=false}if(d){break}e=this.getStyle(a=a.parentNode)}return b},textShadow:I(function(e){if(e=="none"){return null}var d=[],f={},a,b=0;var c=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(a=c.exec(e)){if(a[0]==","){d.push(f);f={},b=0}else{if(a[1]){f.color=a[1]}else{f[["offX","offY","blur"][b++]]=a[2]}}}d.push(f);return d}),textTransform:function(b,a){return b[{uppercase:"toUpperCase",lowercase:"toLowerCase"}[a.get("textTransform")]||"toString"]()},whiteSpace:(function(){var a={inline:1,"inline-block":1,"run-in":1};return function(d,b,c){if(a[b.get("display")]){return d}if(!c.previousSibling){d=d.replace(/^\s+/,"")}if(!c.nextSibling){d=d.replace(/\s+$/,"")}return d}})()};M.ready=(function(){var c=!M.recognizesMedia("all"),b=false;var a=[],e=function(){c=true;for(var h;h=a.shift();h()){}};var f=F("link"),g={stylesheet:1};function d(){var j,h,k;for(h=0;k=f[h];++h){if(k.disabled||!g[k.rel.toLowerCase()]||!M.recognizesMedia(k.media||"screen")){continue}j=k.sheet||k.styleSheet;if(!j||j.disabled){return false}}return true}W.ready(function(){if(!b){b=M.getStyle(document.body).isUsable()}if(c||(b&&d())){e()}else{setTimeout(arguments.callee,10)}});return function(h){if(c){h()}else{a.push(h)}}})();function R(b){var a=this.face=b.face;this.glyphs=b.glyphs;this.w=b.w;this.baseSize=parseInt(a["units-per-em"],10);this.family=a["font-family"].toLowerCase();this.weight=a["font-weight"];this.style=a["font-style"]||"normal";this.viewBox=(function(){var d=a.bbox.split(/\s+/);var c={minX:parseInt(d[0],10),minY:parseInt(d[1],10),maxX:parseInt(d[2],10),maxY:parseInt(d[3],10)};c.width=c.maxX-c.minX,c.height=c.maxY-c.minY;c.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return c})();this.ascent=-parseInt(a.ascent,10);this.descent=-parseInt(a.descent,10);this.height=-this.ascent+this.descent}function E(){var b={},a={oblique:"italic",italic:"oblique"};this.add=function(c){(b[c.style]||(b[c.style]={}))[c.weight]=c};this.get=function(g,h){var f=b[g]||b[a[g]]||b.normal||b.italic||b.oblique;if(!f){return null}h={normal:400,bold:700}[h]||parseInt(h,10);if(f[h]){return f[h]}var d={1:1,99:0}[h%100],j=[],e,c;if(d===undefined){d=h>400}if(h==500){h=400}for(var i in f){if(!J(f,i)){continue}i=parseInt(i,10);if(!e||i<e){e=i}if(!c||i>c){c=i}j.push(i)}if(h<e){h=e}if(h>c){h=c}j.sort(function(l,k){return(d?(l>h&&k>h)?l<k:l>k:(l<h&&k<h)?l>k:l<k)?-1:1});return f[j[0]]}}function Q(){function c(e,f){if(e.contains){return e.contains(f)}return e.compareDocumentPosition(f)&16}function a(g){var f=g.relatedTarget;if(!f||c(this,f)){return}b(this)}function d(f){b(this)}function b(e){setTimeout(function(){L.replace(e,D.get(e).options,true)},10)}this.attach=function(e){if(e.onmouseenter===undefined){P(e,"mouseover",a);P(e,"mouseout",a)}else{P(e,"mouseenter",d);P(e,"mouseleave",d)}}}function T(){var b=[],c={};function a(g){var d=[],f;for(var e=0;f=g[e];++e){d[e]=b[c[f]]}return d}this.add=function(e,d){c[e]=b.push(d)-1};this.repeat=function(){var d=arguments.length?a(arguments):b,e;for(var f=0;e=d[f++];){L.replace(e[0],e[1],true)}}}function Z(){var c={},a=0;function b(d){return d.cufid||(d.cufid=++a)}this.get=function(d){var e=b(d);return c[e]||(c[e]={})}}function A(a){var c={},b={};this.extend=function(d){for(var e in d){if(J(d,e)){c[e]=d[e]}}return this};this.get=function(d){return c[d]!=undefined?c[d]:a[d]};this.getSize=function(e,d){return b[e]||(b[e]=new M.Size(this.get(e),d))};this.isUsable=function(){return !!a}}function P(b,a,c){if(b.addEventListener){b.addEventListener(a,c,false)}else{if(b.attachEvent){b.attachEvent("on"+a,function(){return c.call(b,window.event)})}}}function U(b,a){var c=D.get(b);if(c.options){return b}if(a.hover&&a.hoverables[b.nodeName.toLowerCase()]){B.attach(b)}c.options=a;return b}function I(a){var b={};return function(c){if(!J(b,c)){b[c]=a.apply(null,arguments)}return b[c]}}function C(f,e){if(!e){e=M.getStyle(f)}var b=M.quotedList(e.get("fontFamily").toLowerCase()),d;for(var c=0,a=b.length;c<a;++c){d=b[c];if(H[d]){return H[d].get(e.get("fontStyle"),e.get("fontWeight"))}}return null}function F(a){return document.getElementsByTagName(a)}function J(b,a){return b.hasOwnProperty(a)}function G(){var a={},c,e;for(var d=0,b=arguments.length;c=arguments[d],d<b;++d){for(e in c){if(J(c,e)){a[e]=c[e]}}}return a}function N(d,n,b,o,e,c){var m=o.separate;if(m=="none"){return Y[o.engine].apply(null,arguments)}var k=document.createDocumentFragment(),g;var h=n.split(O[m]),a=(m=="words");if(a&&S){if(/^\s/.test(n)){h.unshift("")}if(/\s$/.test(n)){h.push("")}}for(var j=0,f=h.length;j<f;++j){g=Y[o.engine](d,a?M.textAlign(h[j],b,j,f):h[j],b,o,e,c,j<f-1);if(g){k.appendChild(g)}}return k}function K(b,j){var c,a,d,g,f,i;for(d=U(b,j).firstChild;d;d=f){g=d.nodeType;f=d.nextSibling;i=false;if(g==1){if(!d.firstChild){continue}if(!/cufon/.test(d.className)){arguments.callee(d,j);continue}else{i=true}}else{if(g!=3){continue}}if(!a){a=M.getStyle(b).extend(j)}if(!c){c=C(b,a)}if(!c){continue}if(i){Y[j.engine](c,null,a,j,d,b);continue}var h=M.whiteSpace(d.data,a,d);if(h===""){continue}var e=N(c,h,a,j,d,b);if(e){d.parentNode.replaceChild(e,d)}else{d.parentNode.removeChild(d)}}}var S=" ".split(/\s+/).length==0;var D=new Z();var B=new Q();var X=new T();var Y={},H={},V={enableTextDecoration:false,engine:null,hover:false,hoverables:{a:true},printable:true,selector:(window.Sizzle||(window.jQuery&&function(a){return jQuery(a)})||(window.dojo&&dojo.query)||(window.$$&&function(a){return $$(a)})||(window.$&&function(a){return $(a)})||(document.querySelectorAll&&function(a){return document.querySelectorAll(a)})||F),separate:"words",textShadow:"none"};var O={words:/[^\S\u00a0]+/,characters:""};L.now=function(){W.ready();return L};L.refresh=function(){X.repeat.apply(X,arguments);return L};L.registerEngine=function(b,a){if(!a){return L}Y[b]=a;return L.set("engine",b)};L.registerFont=function(c){var a=new R(c),b=a.family;if(!H[b]){H[b]=new E()}H[b].add(a);return L.set("fontFamily",'"'+b+'"')};L.replace=function(c,b,a){b=G(V,b);if(b.autoDetect){delete b.fontFamily;}if(!b.engine){return L}if(typeof b.textShadow=="string"){b.textShadow=M.textShadow(b.textShadow)}if(typeof b.color=="string"&&/^-/.test(b.color)){b.textGradient=M.gradient(b.color)}if(!a){X.add(c,arguments)}if(c.nodeType||typeof c=="string"){c=[c]}M.ready(function(){for(var e=0,d=c.length;e<d;++e){var f=c[e];if(typeof f=="string"){L.replace(b.selector(f),b,true)}else{K(f,b)}}});return L};L.set=function(a,b){V[a]=b;return L};return L})();Cufon.registerEngine("canvas",(function(){var B=document.createElement("canvas");if(!B||!B.getContext||!B.getContext.apply){return}B=null;var A=Cufon.CSS.supports("display","inline-block");var E=!A&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var F=document.createElement("style");F.type="text/css";F.appendChild(document.createTextNode((".cufon-canvas{text-indent:0;}@media screen,projection{.cufon-canvas{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(E?"":"font-size:1px;line-height:1px;")+"}.cufon-canvas .cufon-alt{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;}"+(A?".cufon-canvas canvas{position:relative;}":".cufon-canvas canvas{position:absolute;}")+"}@media print{.cufon-canvas{padding:0;}.cufon-canvas canvas{display:none;}.cufon-canvas .cufon-alt{display:inline;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(F);function D(O,H){var M=0,L=0;var G=[],N=/([mrvxe])([^a-z]*)/g,J;generate:for(var I=0;J=N.exec(O);++I){var K=J[2].split(",");switch(J[1]){case"v":G[I]={m:"bezierCurveTo",a:[M+~~K[0],L+~~K[1],M+~~K[2],L+~~K[3],M+=~~K[4],L+=~~K[5]]};break;case"r":G[I]={m:"lineTo",a:[M+=~~K[0],L+=~~K[1]]};break;case"m":G[I]={m:"moveTo",a:[M=~~K[0],L=~~K[1]]};break;case"x":G[I]={m:"closePath"};break;case"e":break generate}H[G[I].m].apply(H,G[I].a)}return G}function C(K,J){for(var I=0,H=K.length;I<H;++I){var G=K[I];J[G.m].apply(J,G.a)}}return function(AD,Z,u,V,d,AE){var I=(Z===null);if(I){Z=d.alt}var b=AD.viewBox;var K=u.getSize("fontSize",AD.baseSize);var s=u.get("letterSpacing");s=(s=="normal")?0:K.convertFrom(parseInt(s,10));var c=0,t=0,r=0,X=0;var a=V.textShadow,p=[];if(a){for(var AC=a.length;AC--;){var h=a[AC];var o=K.convertFrom(parseFloat(h.offX));var n=K.convertFrom(parseFloat(h.offY));p[AC]=[o,n];if(n<c){c=n}if(o>t){t=o}if(n>r){r=n}if(o<X){X=o}}}var AH=Cufon.CSS.textTransform(Z,u).split(""),T;var J=AD.glyphs,W,M,w;var G=0,P,f=[];for(var AC=0,AA=0,v=AH.length;AC<v;++AC){W=J[T=AH[AC]]||AD.missingGlyph;if(!W){continue}if(M){G-=w=M[T]||0;f[AA-1]-=w}G+=P=f[AA++]=~~(W.w||AD.w)+s;M=W.k}if(P===undefined){return null}t+=b.width-P;X+=b.minX;var U,L;if(I){U=d;L=d.firstChild}else{U=document.createElement("span");U.className="cufon cufon-canvas";U.alt=Z;L=document.createElement("canvas");U.appendChild(L);if(V.printable){var z=document.createElement("span");z.className="cufon-alt";z.appendChild(document.createTextNode(Z));U.appendChild(z)}}var AI=U.style;var m=L.style;var H=K.convert(b.height);var AG=Math.ceil(H);var q=AG/H;L.width=Math.ceil(K.convert(G*q+t-X));L.height=Math.ceil(K.convert(b.height-c+r));c+=b.minY;m.top=Math.round(K.convert(c-AD.ascent))+"px";m.left=Math.round(K.convert(X))+"px";var S=Math.ceil(K.convert(G*q))+"px";if(A){AI.width=S;AI.height=K.convert(AD.height)+"px"}else{AI.paddingLeft=S;AI.paddingBottom=(K.convert(AD.height)-1)+"px"}var AF=L.getContext("2d"),e=H/b.height;AF.scale(e,e*q);AF.translate(-X,-c);AF.lineWidth=AD.face["underline-thickness"];AF.save();function N(i,g){AF.strokeStyle=g;AF.beginPath();AF.moveTo(0,i);AF.lineTo(G,i);AF.stroke()}var O=V.enableTextDecoration?Cufon.CSS.textDecoration(AE,u):{};if(O.underline){N(-AD.face["underline-position"],O.underline)}if(O.overline){N(AD.ascent,O.overline)}function AB(){AF.scale(q,1);for(var x=0,k=0,g=AH.length;x<g;++x){var y=J[AH[x]]||AD.missingGlyph;if(!y){continue}if(y.d){AF.beginPath();if(y.code){C(y.code,AF)}else{y.code=D("m"+y.d,AF)}AF.fill()}AF.translate(f[k++],0)}AF.restore()}if(a){for(var AC=a.length;AC--;){var h=a[AC];AF.save();AF.fillStyle=h.color;AF.translate.apply(AF,p[AC]);AB()}}var R=V.textGradient;if(R){var Y=R.stops,Q=AF.createLinearGradient(0,b.minY,0,b.maxY);for(var AC=0,v=Y.length;AC<v;++AC){Q.addColorStop.apply(Q,Y[AC])}AF.fillStyle=Q}else{AF.fillStyle=u.get("color")}AB();if(O["line-through"]){N(-AD.descent,O["line-through"])}return U}})());Cufon.registerEngine("vml",(function(){if(!document.namespaces){return}if(document.namespaces.cvml==null){document.namespaces.add("cvml","urn:schemas-microsoft-com:vml")}var B=document.createElement("cvml:shape");B.style.behavior="url(#default#VML)";if(!B.coordsize){return}B=null;document.write(('<style type="text/css">.cufon-vml-canvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}.cufon-vml-canvas{position:absolute;text-align:left;}.cufon-vml{display:inline-block;position:relative;vertical-align:middle;}.cufon-vml .cufon-alt{position:absolute;left:-10000in;font-size:1px;}a .cufon-vml{cursor:pointer}}@media print{.cufon-vml *{display:none;}.cufon-vml .cufon-alt{display:inline;}}</style>').replace(/;/g,"!important;"));function C(F,G){return A(F,/(?:em|ex|%)$/i.test(G)?"1em":G)}function A(I,J){if(/px$/i.test(J)){return parseFloat(J)}var H=I.style.left,G=I.runtimeStyle.left;I.runtimeStyle.left=I.currentStyle.left;I.style.left=J;var F=I.style.pixelLeft;I.style.left=H;I.runtimeStyle.left=G;return F}var E={};function D(K){var L=K.id;if(!E[L]){var I=K.stops,J=document.createElement("cvml:fill"),F=[];J.type="gradient";J.angle=180;J.focus="0";J.method="sigma";J.color=I[0][1];for(var H=1,G=I.length-1;H<G;++H){F.push(I[H][0]*100+"% "+I[H][1])}J.colors=F.join(",");J.color2=I[G][1];E[L]=J}return E[L]}return function(AB,b,v,Y,f,AC,t){var I=(b===null);if(I){b=f.alt}var d=AB.viewBox;var K=v.computedFontSize||(v.computedFontSize=new Cufon.CSS.Size(C(AC,v.get("fontSize"))+"px",AB.baseSize));var s=v.computedLSpacing;if(s==undefined){s=v.get("letterSpacing");v.computedLSpacing=s=(s=="normal")?0:~~K.convertFrom(A(AC,s))}var V,L;if(I){V=f;L=f.firstChild}else{V=document.createElement("span");V.className="cufon cufon-vml";V.alt=b;L=document.createElement("span");L.className="cufon-vml-canvas";V.appendChild(L);if(Y.printable){var y=document.createElement("span");y.className="cufon-alt";y.appendChild(document.createTextNode(b));V.appendChild(y)}if(!t){V.appendChild(document.createElement("cvml:shape"))}}var AH=V.style;var n=L.style;var G=K.convert(d.height),AE=Math.ceil(G);var r=AE/G;var q=d.minX,p=d.minY;n.height=AE;n.top=Math.round(K.convert(p-AB.ascent));n.left=Math.round(K.convert(q));AH.height=K.convert(AB.height)+"px";var P=Y.enableTextDecoration?Cufon.CSS.textDecoration(AC,v):{};var a=v.get("color");var AG=Cufon.CSS.textTransform(b,v).split(""),U;var J=AB.glyphs,Z,M,x;var F=0,g=[],o=0,Q;var S,c=Y.textShadow;for(var AA=0,z=0,w=AG.length;AA<w;++AA){Z=J[U=AG[AA]]||AB.missingGlyph;if(!Z){continue}if(M){F-=x=M[U]||0;g[z-1]-=x}F+=Q=g[z++]=~~(Z.w||AB.w)+s;M=Z.k}if(Q===undefined){return null}var T=-q+F+(d.width-Q);var AF=K.convert(T*r),u=Math.round(AF);var m=T+","+d.height,H;var e="r"+m+"ns";var R=Y.textGradient&&D(Y.textGradient);for(AA=0,z=0;AA<w;++AA){Z=J[AG[AA]]||AB.missingGlyph;if(!Z){continue}if(I){S=L.childNodes[z];while(S.firstChild){S.removeChild(S.firstChild)}}else{S=document.createElement("cvml:shape");L.appendChild(S)}S.stroked="f";S.coordsize=m;S.coordorigin=H=(q-o)+","+p;S.path=(Z.d?"m"+Z.d+"xe":"")+"m"+H+e;S.fillcolor=a;if(R){S.appendChild(R.cloneNode(false))}var AD=S.style;AD.width=u;AD.height=AE;if(c){var O=c[0],N=c[1];var X=Cufon.CSS.color(O.color),W;var h=document.createElement("cvml:shadow");h.on="t";h.color=X.color;h.offset=O.offX+","+O.offY;if(N){W=Cufon.CSS.color(N.color);h.type="double";h.color2=W.color;h.offset2=N.offX+","+N.offY}h.opacity=X.opacity||(W&&W.opacity)||1;S.appendChild(h)}o+=g[z++]}AH.width=Math.max(Math.ceil(K.convert(F*r)),0);return V}})());
