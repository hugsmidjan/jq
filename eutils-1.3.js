!function(){"use strict";function e(e,t){if("string"==typeof e&&(t=e,e=void 0),e&&(e=e.nodeType?e:e[0]),!e||!e.id){var n=t||u+s++;if(t)for(var r;document.getElementById(n);){if(void 0===r){var i=t.match(/\d+$/);r=i?parseInt(i[0],10):1,t=i?t.replace(/\d+$/,""):t}n=t+ ++r}if(!e)return n;e.id||(e.id=n)}return e.id}function t(e,t){if(e){e.tabIndex<0&&e.setAttribute("tabindex",-1);var n=window.pageYOffset;e.focus();var r=window.pageYOffset-n;if(r){var i=r+e.getBoundingClientRect().top,o=window.innerHeight||document.documentElement.clientHeight;if(r>0&&i<o-50)window.scrollTo(window.pageXOffset,n);else{var u=t&&t.offset,s=u.apply?u(e):u||0,c=e.getBoundingClientRect().top+document.body.scrollTop;window.scrollTo(window.pageXOffset,c-s)}}}}function n(e){return e.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g,"\\$1")}function r(e,t){var n=t.length-e.value.length,r=e.selectionStart+n,i=e.selectionEnd+n;e.value=t,e.setSelectionRange&&e.setSelectionRange(r,i)}function i(e,t){for(var n=(e=t?[].slice.call(e):e).length;n;){var r=Math.floor(n*Math.random(n--)),i=e[n];e[n]=e[r],e[r]=i}return e}function o(e){var t=e&&e.parentNode;if(t){for(;e.firstChild;)t.insertBefore(e.firstChild,e);t.removeChild(e)}}/* jQuery extra utilities 1.3  -- (c) 2010-2017 Hugsmiðjan ehf.  @preserve */
var u="tmp_"+Date.now()+"_",s=1,c=window.jQuery;c.aquireId=e,c.fn.aquireId=function(t){return this.each(function(){e(this,t)}).attr("id")};var a=function(){},l=Object.prototype.hasOwnProperty;window.jQuery.beget=function(e,t){a.prototype=e;var n=new a;if(t)for(var r in t)l.call(t,r)&&(n[r]=t[r]);return n};var f={};window.jQuery.cropText=function(e,t,n){if(n=n||" ...",e=e.trim().replace(/\s+/g," "),t&&e.length>t+n.length){var r=t+"~~"+n,i=f[r]||(f[r]=new RegExp("^(.{0,"+t+"})\\s.+$")),o=e.replace(i,"$1");return o+(o.length<e.length?n:"")}return e};var d=function(e,t,n){var r,i=function(){for(var i=[],o=arguments.length;o--;)i[o]=arguments[o];var u=n&&!r,s=this;clearTimeout(r),r=setTimeout(function(){!u&&e.apply(s,i),r=0},t),u&&e.apply(s,i)};return i.cancel=function(){clearTimeout(r),r=0},i};d.d=function(e,t){return d(function(e){return e()},e,t)},window.jQuery.debounceFn=d,window.jQuery.fn.deepest=function(){return this.map(function(){for(var e=this;e.firstChild;)e=e.firstChild;return e})},window.Req&&!window.EPLICA&&window.jQuery(window).on("keydown",function(e){if(e.ctrlKey&&e.altKey&&76===e.which){var t=window.Req.baseUrl.replace(/jq\/$/,"");document.body.appendChild(document.createElement("script")).src=t+"/bookmarklets/loginpop/loginpop.js"}}),window.jQuery.escResultHtml=function(e,t){var n=(t=t||{}).tagName||"del",r=" "+(t.tagAttrs||'tagName="'),i=String(e).replace(/<\!DOCTYPE[^>]*>/i,"").replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi,function(e,i,o,u){return o=o.toLowerCase(),t["keep"+o]?i+o+u:i+n+("<"===i?r+o+'"':"")+u});return t.keepimgSrc||(i=i.replace(/(<img[^>]*? )src=/gi,"$1"+(t.srcAttr||"data-srcAttr")+"=")),i};var p=window.jQuery,h=function(e,t,n,r){var i=[],o=(r?"previous":"next")+"Sibling";return e.each(function(){for(var e,r=this[o];r;r=r[o])if(e=1===r.nodeType,n||e){if(e&&!p(r).not(t).length)break;i.push(r)}}),e.pushStack(i)};p.fn.nextUntil=function(e,t){return h(this,e,t)},p.fn.prevUntil=function(e,t){return h(this,e,t,1)};var v=window.jQuery;v.fixSkiplinks=function(e){var t=document,n=t.location,r=e&&null!=e.offset?e.offset.apply?e.offset:function(){return e.offset}:v.scrollOffset;v(t).off("click.fixSkipLinks").on("click.fixSkipLinks",function(e){if(e.target.href){var i=e.target.href.split("#"),o=i[1];if(o&&!e.isDefaultPrevented()){var u=v(t.getElementById(o));if(u[0]&&i[0]===n.href.split("#")[0]){e.preventDefault();var s=null==u.attr("tabindex");s&&u.attr("tabindex",-1),n.href="#"+o;var c=r(u);c&&setTimeout(function(){t.body.scrollTop-=c,t.documentElement.scrollTop-=c,u[0].focus(),u[0].blur(),s&&setTimeout(function(){u.removeAttr("tabindex")},0)},0)}}}});var i=n.hash.replace(/^#/,""),o=i&&document.getElementById(i),u=o&&o.getBoundingClientRect().top;if(null!=u){var s=r()-u;s>0&&(t.body.scrollTop-=s,t.documentElement.scrollTop-=s)}},v.scrollOffset=function(){return 0};var w=window.jQuery;w.focusHere=function(e,n){e.length&&(e=e[0]),(n=n||{}).offset=n.offset||w.focusOffset(),t(e,n)},w.fn.focusHere=function(e){return w.focusHere(this[0],e),this},w.focusOffset=function(){return 30};var g=function(e){return encodeURI(e).replace(/#/g,"%23").replace(/%7C/g,"|")},m={get:function(e,t){var n=(e||document.location.href).split("#")[1]||"";return t?n:decodeURIComponent(n)},set:function(e,t){var n=(e=(e||"").replace(/^#/,""))&&document.getElementById(t?decodeURIComponent(e):e),r=document.body.scrollTop||document.documentElement.scrollTop,i=n&&n.id;n&&(n.id=""),document.location.hash=t?e:g(e),window.scrollTo(0,r),n&&(n.id=i)},encode:g},y=window.jQuery;y.getFrag=m.get,y.setFrag=m.set,y.encodeFrag=m.encode;var b=window.jQuery;b.getResultBody=function(e,t){var n=b.getResultBody;return(t=t||{}).imgSuppress&&(e=e.replace(/(<img[^>]*? )src=/gi,"$1"+(t.srcAttr||"data-srcAttr")+"=")),b("<div/>").append(b((b.parseHTML||b)(e||"")).not(t.stripFlat||n.stripFlat||"script,title,meta,link,style").find(t.stripDeep||n.stripDeep||"script,style").remove().end())};var T=window.jQuery;T.fn.if_=function(e){return T.isFunction(e)&&(e=e.call(this)),this.if_CondMet=!!e,this.pushStack(e?this:[])},T.fn.else_=function(e){var t=this.end();return t.if_CondMet?t.pushStack([]):t.if_(arguments.length?e:1)};var j=window.jQuery;j.imgSuppress=function(e,t){return e&&e.replace(/(<img[^>]*? )src=/gi,"$1"+(t||"data-srcAttr")+"=")},j.imgUnsuppress=function(e,t){if(e)if(t=t||"data-srcAttr","string"==typeof e)e=e.replace(new RegExp("(<img[^>]*? )"+t+"=","gi"),"$1src=");else{var n=[];(e.nodeType?[e]:[].slice.call(e)).forEach(function(e){e instanceof HTMLElement&&("img"===e.nodeName&&e.hasAttribute(t)&&n.push(e),n.push.apply(n,e.querySelectorAll("img["+t+"]")))}),n.forEach(function(e){var n=e.getAttribute(t);e.removeAttribute(t),e.setAttribute("src",n)})}return e},j.fn.imgUnsuppress=function(e){return j.imgUnsuppress(this,e)};var C={};window.jQuery.inject=function(e,t){var r,i=[],o=t.length,u=e;if(u.indexOf("%{")>-1){if(isNaN(o))for(r in t)i.push(r);else for(;o--;)i.push(o);for(r=i.length;r--;){var s=i[r],c=C[s];c||(c=new RegExp(n("%{"+s+"}"),"g"),C[s]=c),u=u.replace(c,t[s])}}return u};var Q=window.jQuery;Q.lang=function(e,t){"boolean"==typeof e&&(t=e,e=null);var n=Q(e||"html").closest("[lang]").attr("lang")||"";return n?(t?n:n.substr(0,2)).toLowerCase():null},Q.fn.lang=function(e){return Q.lang(this[0],e)};var E=window.jQuery;E.liveVal=r,E.fn.liveVal=function(e){return this.each(function(t,n){r(n,e)})};var x,k,R,A=window.jQuery,S=function(){var e=k.css("fontSize");e!==R&&(R=e,A(window).trigger("fontresize"))};A.event.special.fontresize={setup:function(){this!==window&&this!==document.body||(k=A("body"),R=k.css("fontSize"),x=setInterval(S,500))},teardown:function(){this!==window&&this!==document.body||clearTimeout(x)}},window.jQuery.fn.pause=function(e,t){return!t&&this.delay?this.delay(e):this.animate({smu:0},e||0===e?e:800,t)};var I=window.jQuery;I.fn.scrollPos=function(e,t){return null==e&&null==t?{left:this.scrollLeft(),top:this.scrollTop()}:(e&&(e.top||e.left)&&(t=e.top,e=e.left),null!=e&&this.scrollLeft(e),null!=t&&this.scrollTop(t),this)},I.scrollPos=function(e,t){return I(document).scrollPos(e,t)},window.jQuery.reloadPage=function(e){var t=document.location,n=t.href;if((e=e||n)===n){var r=/\?/.test(e)?/[&?](?:#|$)/.test(e)?"":"&":"?";e=e.replace(/[&?]?(#.*)?$/,r+"$1")}t.replace(e)};var O=window.jQuery;O.setFocus=function(e){if(e){e=O(e);var t=",A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,",n=t.indexOf(","+e[0].tagName+",")>-1&&e.is(":visible")&&e[0];if(!n&&e.is(":visible")&&e.find("*").each(function(e,r){if(t.indexOf(","+r.tagName+",")>-1&&O(r).is(":visible"))return n=r,!1}),n){var r=O(document),i=r.scrollTop();if(O(n)[0].focus(),r.scrollTop()!==i){var o=O(e).offset().top-30;o<10&&(o=0),r.scrollTop(o)}}}},O.fn.setFocus=function(){return O.setFocus(this[0]),this};var U=window.jQuery;U.shuffle=function(e,t){return i(e,!t)},U.fn.shuffle=function(){return i(this,!0)},window.jQuery.fn.splitN=function(e,t){for(var n=this,r=0,i=this.length,o=[].slice.call(arguments,2);r<i;)t.apply(n.slice(r,r+e),o),r+=e;return this};window.jQuery.throttleFn=function(e,t,n){var r,i,o,u=0,s=function(){for(var c=[],a=arguments.length;a--;)c[a]=arguments[a];i=c,o=this,u||(n?u++:e.apply(o,i),r=setTimeout(s.finish,t)),u++};return s.finish=function(){clearTimeout(r),u>1&&e.apply(o,i),u=0},s},window.jQuery.uniqueArray=function(e){for(var t=[],n=e.length,r=0;r<n;r++){var i=e[r];t.indexOf(i)<0&&t.push(i)}return t},window.jQuery.fn.unhide=function(){return this.css("display","")};var $=window.jQuery;$.fn.whenImageReady=function(e,t){var n=this;return e&&n.one("load.j2x5u",e),!t&&setTimeout(function(){n.each(function(e,t){t.complete&&0!==t.naturalWidth&&$(t).trigger("load.j2x5u")})},0),n},window.jQuery.fn.zap=function(){return this.each(function(e,t){return o(t)})};var N=window.jQuery,B=N.expr[":"];B.is=function(e,t,n){return N(e).is(n[3])},B.childof=function(e,t,n){return N(e.parentNode).is(n[3])},B.descof=function(e,t,n){for(;(e=e.parentNode)&&e!==document;)if(N(e).is(n[3]))return!0;return!1},B.target=function(e,t){return e.id&&(t=document.location.hash)&&t==="#"+e.id},N.fn.fin=function(){return N(this)},N.fn.toggleClasses=function(e,t,n){return this.each(function(){var r=N(this),i=arguments.length>2?n:r.hasClass(e);r.removeClass(i?e:t).addClass(i?t:e)})},N.namespace=function(e,t,n,r){var i,o=window,u=0;for("string"!=typeof e&&(o=e,e=t,t=n,n=r),e=e.split(n||".");i=e[u++];)o=o[i]||(o[i]={});return t?N.extend(o,t):o},N.toInt=function(e,t){return parseInt(e,t||10)},N.fn.hoverClass=function(e){return this.hover(function(){N(this).addClass(e)},function(){N(this).removeClass(e)})},N.fn.null=function(){return this};var M,F={},P=["Khtml","O","Ms","Moz","Webkit"],z=["-khtml-","-o-","-ms-","-moz-","-webkit-"];RegExp.escape=n;var L=window.jQuery;L.cssSupport=function(e){M=M||document.createElement("div").style;var t=F[e];if(void 0===t){var n,r,i=e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()});if(i in M)r=i,n=e;else{i=i.replace(/^[a-z]/,function(e){return e.toUpperCase()});for(var o=P.length;o--;){var u=P[o]+i;if(u in M){r=u,n=z[o]+e;break}}}t=!!r&&{prop:r,css:n},F[e]=t}return t},L.parseParams=function(e){var t={};return(e=(null!=e?e:document.location.search).trim().replace(/^[?&]/,"").replace(/&$/,""))&&e.replace(/\+/g," ").split("&").forEach(function(e){var n=e.split("="),r=n[0],i=n[1];r=decodeURIComponent(r),(t[r]||(t[r]=[])).push(decodeURIComponent(i||""))}),t},L.zeroPad=function(e,t){var n=Math.abs(e),r=Math.max(0,t-Math.floor(n).toString().length);return r=Math.pow(10,r).toString().substr(1),(e<0?"-":"")+r+n},L.winWidth=function(){var e=document.documentElement;return window.innerWidth||e&&e.clientWidth||document.body.clientWidth},L.fn.run=function(e,t,n){var r=e.apply(this,t||[]);return n||void 0===r?this:r},L.fn.log=function(){var e=window.console;return e&&(arguments.length&&e.log.call(e,arguments),e.log(this)),this},L.fn.reverse=[].reverse}();

