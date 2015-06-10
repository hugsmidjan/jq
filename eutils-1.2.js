/* jQuery extra utilities 1.2  -- (c) 2010-2013 Hugsmiðjan ehf.  @preserve */
!function(t,e,n){var r=e.jQuery,i=t.location,s={};RegExp.escape=RegExp.escape||function(t){return t.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g,"\\$1")},r.extend(r.expr[":"],{is:function(t,e,n){return r(t).is(n[3])},childof:function(t,e,n){return r(t.parentNode).is(n[3])},descof:function(e,n,i){for(;(e=e.parentNode)&&e!==t;)if(r(e).is(i[3]))return!0;return!1},target:function(t,e){return t.id&&(e=i.hash)&&e==="#"+t.id}});var o,u,l,a=function(){var t=u.css("fontSize");t!==l&&(l=t,r(e).trigger("fontresize"))};r.event.special.fontresize={setup:function(){(this===e||this===t.body)&&(u=r("body"),l=u.css("fontSize"),o=setInterval(a,500))},teardown:function(){(this===e||this===t.body)&&clearTimeout(o)}};var c=function(t,e,n,i){var s=[],o=(i?"previous":"next")+"Sibling";return t.each(function(){for(var t,i=this[o];i;i=i[o])if(t=1===i.nodeType,n||t){if(t&&!r(i).not(e).length)break;s.push(i)}}),t.pushStack(s)};r.fn.extend({nextUntil:function(t,e){return c(this,t,e)},prevUntil:function(t,e){return c(this,t,e,1)}}),r.fn.unhide=function(){return this.css("display","")},r.fn.zap=function(){return this.each(function(){this.parentNode&&r(this.childNodes).insertBefore(this)}).remove()},r.fn.splitN=function(t,e){for(var n=0,r=this.length,i=[].slice.call(arguments,2);r>n;)e.apply(this.slice(n,n+t),i),n+=t;return this},r.fn.liveVal=function(t){return this.each(function(e,n){var r=t.length-n.value.length,i=n.selectionStart+r,s=n.selectionEnd+r;n.value=t,n.setSelectionRange&&n.setSelectionRange(i,s)})},r.fn.if_=function(t){return r.isFunction(t)&&(t=t.call(this)),this.if_CondMet=!!t,this.pushStack(t?this:[])},r.fn.else_=function(t){var e=this.end();return e.if_CondMet?e.pushStack([]):e.if_(arguments.length?t:1)},r.fn.extend({"null":function(){return this},fin:function(){return r(this)},shuffle:function(){for(var t=this,e=t.length;e;){var n=Math.floor(e*Math.random(e--)),r=t[e];t[e]=t[n],t[n]=r}return t},imgUnsuppress:function(t){return r.imgUnsuppress(this,t),this},pause:function(t,e){return!e&&r.fn.delay?this.delay(t):this.animate({smu:0},t||0===t?t:800,e)},log:function(){var t=e.console;return t&&(arguments.length&&t.log.call(t,arguments),t.log(this)),this},reverse:[].reverse,deepest:function(){return this.map(function(){for(var t=this;t.firstChild;)t=t.firstChild;return t})},hoverClass:function(t){return this.hover(function(){r(this).addClass(t)},function(){r(this).removeClass(t)})},run:function(t,e,r){var i=t.apply(this,e||[]);return r||i===n?this:i},setFocus:function(){return r.setFocus(this[0]),this},scrollPos:function(t,e){return null==t&&null==e?{left:this.scrollLeft(),top:this.scrollTop()}:(t&&(t.top||t.left)&&(e=t.top,t=t.left),null!=t&&this.scrollLeft(t),null!=e&&this.scrollTop(e),this)},toggleClasses:function(t,e,n){return this.each(function(){var i=r(this),s=arguments.length>2?n:i.hasClass(t);i.removeClass(s?t:e).addClass(s?e:t)})},whenImageReady:function(t,e){var n=this;return t&&n.one("load.j2x5u",t),!e&&setTimeout(function(){n.each(function(t,e){e.complete&&0!==e.naturalWidth&&r(e).trigger("load.j2x5u")})},0),n}}),r.beget=function(t,e){var n=r.beget.F;return n.prototype=t,e?r.extend(new n,e):new n},r.beget.F=function(){},r.lang=function(t,e){"boolean"==typeof t&&(e=t,t=null);var n=r(t||"html").closest("[lang]").attr("lang")||"";return n?(e?n:n.substr(0,2)).toLowerCase():null},r.fn.lang=function(t){return r.lang(this[0],t)},r.focusHere=function(n,i){if(n){n=r(n),null==n.attr("tabindex")&&n.attr("tabindex",-1);var s=r(t),o=s.scrollTop();n[0].focus();var u=s.scrollTop()-o;if(u){var l=u+n[0].getBoundingClientRect().top,a=e.innerHeight||t.documentElement.clientHeight;if(u>0&&a-50>l)s.scrollTop(o);else{var c=i&&i.offset||r.focusOffset();c=r.isFunction(c)?c(n):c||0,s.scrollTop(r(n).offset().top-c)}}}},r.fn.focusHere=function(t){return r.focusHere(this[0],t),this},r.focusOffset=function(){return 30},r.fixSkiplinks=function(e){var n="click.fixSkipLinks";r(t).off(n).on(n,function(n){var s,o=n.target.href;if(o&&!n.isDefaultPrevented()&&(s=(o=o.split("#"))[1])){var u=r("#"+s);if(u[0]&&o[0]===i.href.split("#")[0]){n.preventDefault(),null==u.attr("tabindex")&&u.attr("tabindex",-1),i.href="#"+s;var l=e&&e.offset||r.scrollOffset();l=r.isFunction(l)?l(u):l,l&&r(t).scrollTop(r(t).scrollTop()-l),u[0].focus()}}})},r.scrollOffset=function(){return 0},r.aquireId=function(e,i){if("string"==typeof e&&(i=e,e=n),e=r(e||[])[0],!e||!e.id){var s=i||r.aquireId._guidPrefix+r.aquireId._guid++;if(i)for(var o=i.match(/\d+$/),u=o?parseInt(o[0],10):1;r(t.getElementById(s))[0];)o&&(i=i.replace(/\d+$/,""),o=n),s=i+u++;if(!e)return s;e.id||(e.id=s)}return e.id},r.aquireId._guidPrefix="tmp_"+(new Date).getTime()+"_",r.aquireId._guid=1,r.fn.aquireId=function(t){return this.each(function(){r.aquireId(this,t)}).attr("id")},r.throttleFn=function(t,e,n){"number"==typeof e&&(n=e,e=!1),n=n||50;var r,i,s,o=0,u=function(){i=arguments,s=this,o||(e?o++:t.apply(s,i),r=setTimeout(u.finish,n)),o++};return u.finish=function(){r&&clearTimeout(r),o>1&&t.apply(s,i),o=0},u},r.debounceFn=function(t,e,n){"number"==typeof e&&(n=e,e=!1),n=n||50;var r,i=function(){var s=arguments,o=!r&&e,u=this;i.cancel(),r=setTimeout(function(){!o&&t.apply(u,s),r=0},n),o&&t.apply(u,s)};return i.cancel=function(){clearTimeout(r),r=0},i},r.extend({namespace:function(t,n,i,s){var o,u=e,l=0;for("string"!=typeof t&&(u=t,t=n,n=i,i=s),t=t.split(i||".");o=t[l++];)u=u[o]||(u[o]={});return n?r.extend(u,n):u},reloadPage:function(t){if(!t||t===i.href){t=t||i.href;var e=/\?/.test(t)?/[&?](?:#|$)/.test(t)?"":"&":"?";t=t.replace(/[&?]?(#.*)?$/,e+"$1")}i.replace(t)},winWidth:function(){var n=t.documentElement;return e.innerWidth||n&&n.clientWidth||t.body.clientWidth},cssSupport:function(t,e,i,s,o,u){return function(l){if(t||(t=r("<div/>")[0],e="Khtml Ms O Moz Webkit".split(" "),s={}),o=l in s?s[l]:l in t.style||n,o===n)for(u=l.replace(/^[a-z]/,function(t){return t.toUpperCase()}),i=e.length;i--;)if(e[i]+u in t.style){o=!0;break}return o=s[l]=o||!1}}(),getResultBody:function(t,e){var n=r.getResultBody;return e=e||{},r("<div/>").append(r((r.parseHTML||r)(t||"")).not(e.stripFlat||n.stripFlat||"script,title,meta,link,style").find(e.stripDeep||n.stripDeep||"script,style").remove().end())},escResultHtml:function(t,e){e=e||{};var n=e.tagName||"del",i=" "+(e.tagAttrs||'tagName="'),s=String(t).replace(/<\!DOCTYPE[^>]*>/i,"").replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi,function(t,r,s,o){return s=s.toLowerCase(),e["keep"+s]?r+s+o:r+n+("<"===r?i+s+'"':"")+o});return s=e.keepimgSrc?s:r.imgSuppress(s,e.srcAttr)},imgSuppress:function(t,e){return t.replace(/(<img[^>]*? )src=/gi,"$1"+(e||"data-srcAttr")+"=")},imgUnsuppress:function(t,e){return e=e||"data-srcAttr","string"==typeof t?t=t.replace(new RegExp("(<img[^>]*? )"+e+"=","gi"),"$1src="):(t=r(t),t.find("img").add(t.filter("img")).filter("["+e+"]").each(function(){var t=r(this);t.attr("src",t.attr(e)).removeAttr(e)})),t},scrollPos:function(e,n){return r(t).scrollPos(e,n)},setFrag:function(e,n){e=(e||"").replace(/^#/,"");var s=e&&t.getElementById(n?decodeURIComponent(e):e),o=r.scrollPos();s&&(s.id=""),i.href="#"+(n?e:r.encodeFrag(e)),r.scrollPos(o),s&&(s.id=e)},encodeFrag:function(t){return encodeURI(t).replace(/#/g,"%23").replace(/%7C/g,"|")},getFrag:function(t,e){var n=(t||i.href).split("#")[1]||"";return e?n:decodeURIComponent(n)},setFocus:function(e){if(e){e=r(e);var n=",A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,",i=n.indexOf(","+e[0].tagName+",")>-1&&e.is(":visible")&&e[0];if(!i&&e.is(":visible")&&e.find("*").each(function(t,e){return n.indexOf(","+e.tagName+",")>-1&&r(e).is(":visible")?(i=e,!1):void 0}),i){var s=r(t),o=s.scrollTop();if(r(i)[0].focus(),s.scrollTop()!==o){var u=r(e).offset().top-30;10>u&&(u=0),s.scrollTop(u)}}}},toInt:function(t,e){return parseInt(t,e||10)},parseParams:function(t){t=r.trim(t!==n?t:i.search).replace(/^[?&]|&$/g,"");var e={};if(t)for(var s=t.replace(/\+/g," ").split("&"),o=decodeURIComponent,u=0,l=s.length;l>u;u++){var a=s[u].split("="),c=o(a[0]);(e[c]=e[c]||[]).push(o(a[1]||""))}return e},cropText:function(t,e,n){if(n=n||" ...",t=r.trim(t).replace(/\s+/g," "),e&&t.length>e+n.length){var i=r.cropText.re||(r.cropText.re={}),s=e+"~~"+n,o=i[s]||(i[s]=new RegExp("^(.{0,"+e+"})\\s.+$")),u=t.replace(o,"$1");return u+(u.length<t.length?n:"")}return t},inject:function(t,e){var n,r=[],i=e.length;if(t.indexOf("%{")>-1){if(isNaN(i))for(n in e)r.push(n);else for(;i--;)r.push(i);for(n=r.length;n--;){var o=r[n],u=s[o]||(s[o]=new RegExp(RegExp.escape("%{"+o+"}"),"g"));t=t.replace(u,e[o])}}return t}}),r(e).on("keydown",function(n){if(e.Req&&!e.EPLICA){var r=Req.baseUrl.replace(/jq\/$/,"");if(n.ctrlKey&&n.altKey&&76===n.which){var i=t.body.appendChild(t.createElement("script"));i.src=r+"/bookmarklets/loginpop/loginpop.js"}}}),r.setHash=r.setFrag,r.scroll=r.scrollPos,r.fn.scroll=r.fn.scrollPos}(document,window);
