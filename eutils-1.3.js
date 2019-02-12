!function(){"use strict";
/* jQuery extra utilities 1.3  -- (c) 2010-2017 Hugsmiðjan ehf.  @preserve */var i="tmp_"+Date.now()+"_",u=1;var t=function(e,t){if("string"==typeof e&&(t=e,e=void 0),e&&(e=e.nodeType?e:e[0]),!e||!e.id){var n=t||i+u++;if(t)for(var r;document.getElementById(n);){if(void 0===r){var o=t.match(/\d+$/);r=o?parseInt(o[0],10):1,t=o?t.replace(/\d+$/,""):t}n=t+ ++r}if(!e)return n;e.id||(e.id=n)}return e.id},e=window.jQuery;e.aquireId=t,e.fn.aquireId=function(e){return this.each(function(){t(this,e)}).attr("id")};var o=function(){},a=Object.prototype.hasOwnProperty;var n=function(e,t){o.prototype=e;var n=new o;if(t)for(var r in t)a.call(t,r)&&(n[r]=t[r]);return n};window.jQuery.beget=n;var s={};var r=function(e,t,n){if(n=n||" ...",e=e.trim().replace(/\s+/g," "),t&&e.length>t+n.length){var r=t+"~~"+n,o=s[r]||(s[r]=new RegExp("^(.{0,"+t+"})\\s.+$")),i=e.replace(o,"$1");return i+(i.length<e.length?n:"")}return e};window.jQuery.cropText=r;var c=function(i,u,a){var s,e=function(){for(var e=arguments,t=[],n=arguments.length;n--;)t[n]=e[n];var r=a&&!s,o=this;clearTimeout(s),s=setTimeout(function(){!r&&i.apply(o,t),s=0},u),r&&i.apply(o,t)};return e.cancel=function(){clearTimeout(s),s=0},e};c.d=function(e,t){return c(function(e){return e()},e,t)};var l=c;window.jQuery.debounceFn=l,window.jQuery.fn.deepest=function(){return this.map(function(){for(var e=this;e.firstChild;)e=e.firstChild;return e})},window.Req&&!window.EPLICA&&window.jQuery(window).on("keydown",function(e){if(e.ctrlKey&&e.altKey&&76===e.which){var t=window.Req.baseUrl.replace(/jq\/$/,"");document.body.appendChild(document.createElement("script")).src=t+"/bookmarklets/loginpop/loginpop.js"}}),window.jQuery.escResultHtml=function(e,o){var i=(o=o||{}).tagName||"del",u=" "+(o.tagAttrs||'tagName="'),t=String(e).replace(/<\!DOCTYPE[^>]*>/i,"").replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi,function(e,t,n,r){return n=n.toLowerCase(),o["keep"+n]?t+n+r:t+i+("<"===t?u+n+'"':"")+r});return o.keepimgSrc||(t=t.replace(/(<img[^>]*? )src=/gi,"$1"+(o.srcAttr||"data-srcAttr")+"=")),t};var f=window.jQuery,d=function(e,n,r,t){var o=[],i=(t?"previous":"next")+"Sibling";return e.each(function(){for(var e,t=this[i];t;t=t[i])if(e=1===t.nodeType,r||e){if(e&&!f(t).not(n).length)break;o.push(t)}}),e.pushStack(o)};f.fn.nextUntil=function(e,t){return d(this,e,t)},f.fn.prevUntil=function(e,t){return d(this,e,t,1)};var p=window.jQuery;function h(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function v(e,t){return e(t={exports:{}},t.exports),t.exports}p.fixSkiplinks=function(e){var t="click.fixSkipLinks",u=document,a=u.location,s=e&&null!=e.offset?e.offset.apply?e.offset:function(){return e.offset}:p.scrollOffset;p(u).off(t).on(t,function(e){if(e.target.href){var t=e.target.href.split("#"),n=t[1];if(n&&!e.isDefaultPrevented()){var r=p(u.getElementById(n));if(r[0]&&t[0]===a.href.split("#")[0]){e.preventDefault();var o=null==r.attr("tabindex");o&&r.attr("tabindex",-1),a.href="#"+n;var i=s(r);i&&setTimeout(function(){u.body.scrollTop-=i,u.documentElement.scrollTop-=i,r[0].focus(),r[0].blur(),o&&setTimeout(function(){r.removeAttr("tabindex")},0)},0)}}}});var n=a.hash.replace(/^#/,""),r=n&&document.getElementById(n),o=r&&r.getBoundingClientRect().top;if(null!=o){var i=s()-o;0<i&&(u.body.scrollTop-=i,u.documentElement.scrollTop-=i)}},p.scrollOffset=function(){return 0};var g=v(function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var c=function(){return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop},n=function(e,t){e.tabIndex<0&&e.setAttribute("tabindex",-1);var n=c();e.focus();var r=c()-n;if(r){var o=e.getBoundingClientRect().top,i=window.innerHeight||document.documentElement.clientHeight;if(0<r&&r+o<i-50)window.scrollTo(window.pageXOffset,n);else{var u=t.offset,a=u&&u.apply?u(e):u||0,s=o+c();window.scrollTo(window.pageXOffset,s-a)}}};t.getYScroll=c,t.default=function(e,t){if(e){if(null!=(t=t||{}).delay)return setTimeout(function(){n(e,t)},t.delay);n(e,t)}}}),w=h(g),m=(g.getYScroll,window.jQuery);m.focusHere=function(e,t){e.length&&(e=e[0]),(t=t||{}).offset=t.offset||m.focusOffset(),w(e,t)},m.fn.focusHere=function(e){return m.focusHere(this[0],e),this},m.focusOffset=function(){return 30};var y=v(function(e,t){Object.defineProperty(t,"__esModule",{value:!0});var n=function(e,t){var n=(e=(e||"").replace(/^#/,""))&&document.getElementById(t?decodeURIComponent(e):e),r=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop,o=n&&n.id;n&&(n.id=""),document.location.hash=t?e:i(e),window.scrollTo(0,r),n&&(n.id=o)},i=function(e){return encodeURI(e).replace(/#/g,"%23").replace(/%7C/g,"|")},r=function(e,t){var n=(e||document.location.href).split("#")[1]||"";return t?n:decodeURIComponent(n)},o={get:r,set:n,encode:i};t.setFrag=n,t.getFrag=r,t.encodeFrag=i,t.default=o}),j=h(y),b=(y.setFrag,y.getFrag,y.encodeFrag,window.jQuery);b.getFrag=j.get,b.setFrag=j.set,b.encodeFrag=j.encode;var T=window.jQuery;T.getResultBody=function(e,t){var n=T.getResultBody;return(t=t||{}).imgSuppress&&(e=e.replace(/(<img[^>]*? )src=/gi,"$1"+(t.srcAttr||"data-srcAttr")+"=")),T("<div/>").append(T((T.parseHTML||T)(e||"")).not(t.stripFlat||n.stripFlat||"script,title,meta,link,style").find(t.stripDeep||n.stripDeep||"script,style").remove().end())};var Q=window.jQuery;Q.fn.if_=function(e){return Q.isFunction(e)&&(e=e.call(this)),this.if_CondMet=!!e,this.pushStack(e?this:[])},Q.fn.else_=function(e){var t=this.end();return t.if_CondMet?t.pushStack([]):t.if_(arguments.length?e:1)};var C=window.jQuery;C.imgSuppress=function(e,t){return e&&e.replace(/(<img[^>]*? )src=/gi,"$1"+(t||"data-srcAttr")+"=")},C.imgUnsuppress=function(e,n){if(e)if(n=n||"data-srcAttr","string"==typeof e)e=e.replace(new RegExp("(<img[^>]*? )"+n+"=","gi"),"$1src=");else{var t=[];(e.nodeType?[e]:[].slice.call(e)).forEach(function(e){e instanceof HTMLElement&&("img"===e.nodeName&&e.hasAttribute(n)&&t.push(e),t.push.apply(t,e.querySelectorAll("img["+n+"]")))}),t.forEach(function(e){var t=e.getAttribute(n);e.removeAttribute(n),e.setAttribute("src",t)})}return e},C.fn.imgUnsuppress=function(e){return C.imgUnsuppress(this,e)};var E=function(e){return e.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g,"\\$1")},x={};var A=function(e,t){var n,r=[],o=t.length,i=e;if(-1<i.indexOf("%{")){if(isNaN(o))for(n in t)r.push(n);else for(;o--;)r.push(o);for(n=r.length;n--;){var u=r[n],a=x[u];a||(a=new RegExp(E("%{"+u+"}"),"g"),x[u]=a),i=i.replace(a,t[u])}}return i};window.jQuery.inject=A;var O=window.jQuery;O.lang=function(e,t){"boolean"==typeof e&&(t=e,e=null);var n=O(e||"html").closest("[lang]").attr("lang")||"";return n?(t?n:n.substr(0,2)).toLowerCase():null},O.fn.lang=function(e){return O.lang(this[0],e)};var S=function(e,t){var n=t.length-e.value.length,r=e.selectionStart+n,o=e.selectionEnd+n;e.value=t,e.setSelectionRange&&e.setSelectionRange(r,o)},R=window.jQuery;R.liveVal=S,R.fn.liveVal=function(n){return this.each(function(e,t){S(t,n)})};var k,I,F,M=window.jQuery,U=function(){var e=I.css("fontSize");e!==F&&(F=e,M(window).trigger("fontresize"))};M.event.special.fontresize={setup:function(){this!==window&&this!==document.body||(I=M("body"),F=I.css("fontSize"),k=setInterval(U,500))},teardown:function(){this!==window&&this!==document.body||clearTimeout(k)}},window.jQuery.fn.pause=function(e,t){return!t&&this.delay?this.delay(e):this.animate({smu:0},e||0===e?e:800,t)};var $=window.jQuery;$.fn.scrollPos=function(e,t){return null==e&&null==t?{left:this.scrollLeft(),top:this.scrollTop()}:(e&&(e.top||e.left)&&(t=e.top,e=e.left),null!=e&&this.scrollLeft(e),null!=t&&this.scrollTop(t),this)},$.scrollPos=function(e,t){return $(document).scrollPos(e,t)};var P=function(e){var t=document.location,n=t.href;if((e=e||n)===n){var r=/\?/.test(e)?/[&?](?:#|$)/.test(e)?"":"&":"?";e=e.replace(/[&?]?(#.*)?$/,r+"$1")}t.replace(e)};window.jQuery.reloadPage=P;var N=window.jQuery;N.setFocus=function(e){if(e){e=N(e);var n=",A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,",r=-1<n.indexOf(","+e[0].tagName+",")&&e.is(":visible")&&e[0];if(!r&&e.is(":visible")&&e.find("*").each(function(e,t){if(-1<n.indexOf(","+t.tagName+",")&&N(t).is(":visible"))return r=t,!1}),r){var t=N(document),o=t.scrollTop();if(N(r)[0].focus(),t.scrollTop()!==o){var i=N(e).offset().top-30;i<10&&(i=0),t.scrollTop(i)}}}},N.fn.setFocus=function(){return N.setFocus(this[0]),this};var _=function(e,t){for(var n=(e=t?[].slice.call(e):e).length;n;){var r=Math.floor(n*Math.random(n--)),o=e[n];e[n]=e[r],e[r]=o}return e},B=window.jQuery;B.shuffle=function(e,t){return _(e,!t)},B.fn.shuffle=function(){return _(this,!0)},window.jQuery.fn.splitN=function(e,t){for(var n=0,r=this.length,o=[].slice.call(arguments,2);n<r;)t.apply(this.slice(n,n+e),o),n+=e;return this};var q=function(r,o,i){var u,a,s,c=0,l=function(){for(var e=arguments,t=[],n=arguments.length;n--;)t[n]=e[n];a=t,s=this,c||(i?c++:r.apply(s,a),u=setTimeout(l.finish,o)),c++};return l.finish=function(){clearTimeout(u),1<c&&r.apply(s,a),c=0},l};window.jQuery.throttleFn=q;var z=function(e){for(var t=[],n=e.length,r=0;r<n;r++){var o=e[r];t.indexOf(o)<0&&t.push(o)}return t};console.warn('Module "qj/uniqueArray" is deprecated.\nUse "qj/dedupeArray" instead.');var L=z;window.jQuery.uniqueArray=L,window.jQuery.fn.unhide=function(){return this.css("display","")};var H=window.jQuery;H.fn.whenImageReady=function(e,t){var n=this;return e&&n.one("load.j2x5u",e),!t&&setTimeout(function(){n.each(function(e,t){t.complete&&0!==t.naturalWidth&&H(t).trigger("load.j2x5u")})},0),n};var D=function(e){var t=e&&e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}};window.jQuery.fn.zap=function(){return this.each(function(e,t){return D(t)})};var W=window.jQuery,Y=W.expr[":"];Y.is=function(e,t,n){return W(e).is(n[3])},Y.childof=function(e,t,n){return W(e.parentNode).is(n[3])},Y.descof=function(e,t,n){for(;(e=e.parentNode)&&e!==document;)if(W(e).is(n[3]))return!0;return!1},Y.target=function(e,t){return e.id&&(t=document.location.hash)&&t==="#"+e.id},W.fn.fin=function(){return W(this)},W.fn.toggleClasses=function(n,r,o){return this.each(function(){var e=W(this),t=2<arguments.length?o:e.hasClass(n);e.removeClass(t?n:r).addClass(t?r:n)})},W.namespace=function(e,t,n,r){var o,i=window,u=0;for("string"!=typeof e&&(i=e,e=t,t=n,n=r),e=e.split(n||".");o=e[u++];)i=i[o]||(i[o]={});return t?W.extend(i,t):i},W.toInt=function(e,t){return parseInt(e,t||10)},W.fn.hoverClass=function(e){return this.hover(function(){W(this).addClass(e)},function(){W(this).removeClass(e)})},W.fn.null=function(){return this};var K,X={},V=["Khtml","O","Ms","Moz","Webkit"],J=["-khtml-","-o-","-ms-","-moz-","-webkit-"];var G=function(e){K=K||document.createElement("div").style;var t=X[e];if(void 0===t){var n,r,o=e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()});if(o in K)r=o,n=e;else{o=o.replace(/^[a-z]/,function(e){return e.toUpperCase()});for(var i=V.length;i--;){var u=V[i]+o;if(u in K){r=u,n=J[i]+e;break}}}t=!!r&&{prop:r,css:n},X[e]=t}return t};var Z=function(e){var o={};return(e=(null!=e?e:document.location.search).trim().replace(/^[?&]/,"").replace(/&$/,""))&&e.replace(/\+/g," ").split("&").forEach(function(e){var t=e.split("="),n=t[0],r=t[1];n=decodeURIComponent(n),(o[n]||(o[n]=[])).push(decodeURIComponent(r||""))}),o};var ee=function(e,t){var n=Math.abs(e),r=Math.max(0,t-Math.floor(n).toString().length);return(e<0?"-":"")+(r=Math.pow(10,r).toString().substr(1))+n};RegExp.escape=E;var te=window.jQuery;te.cssSupport=G,te.parseParams=Z,te.zeroPad=ee,te.winWidth=function(){var e=document.documentElement;return window.innerWidth||e&&e.clientWidth||document.body.clientWidth},te.fn.run=function(e,t,n){var r=e.apply(this,t||[]);return n||void 0===r?this:r},te.fn.log=function(){var e=window.console;return e&&(arguments.length&&e.log.call(e,arguments),e.log(this)),this},te.fn.reverse=[].reverse}();

