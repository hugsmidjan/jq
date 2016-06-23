/* jQuery extra utilities 1.3  -- (c) 2010-2015 Hugsmiðjan ehf.  @preserve */
!function(t,e){t.exports=function(t){var e=document.location,n=e.href;if(t=t||n,t===n){var r=/\?/.test(t)?/[&?](?:#|$)/.test(t)?"":"&":"?";t=t.replace(/[&?]?(#.*)?$/,r+"$1")}e.replace(t)},e.reloadPage=t.exports;var n=function(){};t.exports=function(t,e){n.prototype=t;var r=new n;if(e)for(var i in e)e.hasOwnProperty(i)||(r[i]=e[i]);return r},e.beget=t.exports,t.exports=function(t,e){var n=Math.abs(t),r=Math.max(0,e-Math.floor(n).toString().length);return r=Math.pow(10,r).toString().substr(1),(0>t?"-":"")+r+n},e.zeroPad=t.exports;var r="tmp_"+(new Date).getTime()+"_",i=1;t.exports=function(t,e){if("string"==typeof t&&(e=t,t=void 0),t&&(t=t.nodeType?t:t[0]),!t||!t.id){var n=e||r+i++;if(e)for(var o;document.getElementById(n);){if(void 0===o){var s=e.match(/\d+$/);o=s?parseInt(s[0],10):1,e=s?e.replace(/\d+$/,""):e,s=void 0}o++,n=e+o}if(!t)return n;t.id||(t.id=n)}return t.id},e.aquireId=t.exports;var o,s,u,a={};t.exports=function(t){o=o||document.createElement("div").style;var e=a[t];if(void 0===e){var n,r,i=t.replace(/-([a-z])/g,function(t,e){return e.toUpperCase()});if(i in o)r=i,n=t;else{s||(s=["Khtml","O","Ms","Moz","Webkit"],u=["-khtml-","-o-","-ms-","-moz-","-webkit-"]),i=i.replace(/^[a-z]/,function(t){return t.toUpperCase()});for(var c=s.length;c--;){var f=s[c]+i;if(f in o){r=f,n=u[c]+t;break}}}e=r?{prop:r,css:n}:!1,a[t]=e}return e},e.cssSupport=t.exports,t.exports=function(t,e,n){"boolean"==typeof e&&(n=e,e=0),e=e||50;var r,i,o,s=0,u=function(){i=arguments,o=this,s||(n?s++:t.apply(o,i),r=setTimeout(u.finish,e)),s++};return u.finish=function(){r&&clearTimeout(r),s>1&&t.apply(o,i),s=0},u},e.throttleFn=t.exports,t.exports=function(t,e,n){"boolean"==typeof e&&(n=e,e=0),e=e||50;var r,i=function(){var o=arguments,s=!r&&n,u=this;i.cancel(),r=setTimeout(function(){!s&&t.apply(u,o),r=0},e),s&&t.apply(u,o)};return i.cancel=function(){clearTimeout(r),r=0},i},e.debounceFn=t.exports,t.exports=function(t){t=(void 0!==t?t:document.location.search).trim().replace(/^[?&]|&$/g,"");var e={};if(t)for(var n=t.replace(/\+/g," ").split("&"),r=decodeURIComponent,i=0,o=n.length;o>i;i++){var s=n[i].split("="),u=r(s[0]);(e[u]=e[u]||[]).push(r(s[1]||""))}return e},e.parseParams=t.exports;var c={};t.exports=function(t,e,n){if(n=n||" ...",t=t.trim().replace(/\s+/g," "),e&&t.length>e+n.length){var r=e+"~~"+n,i=c[r]||(c[r]=new RegExp("^(.{0,"+e+"})\\s.+$")),o=t.replace(i,"$1");return o+(o.length<t.length?n:"")}return t},e.cropText=t.exports;var f={};t.exports=function(t,e){var n,r=[],i=e.length;if(t.indexOf("%{")>-1){if(isNaN(i))for(n in e)r.push(n);else for(;i--;)r.push(i);for(n=r.length;n--;){var o=r[n],s=f[o]||(f[o]=new RegExp(RegExp.escape("%{"+o+"}"),"g"));t=t.replace(s,e[o])}}return t},e.inject=t.exports,t.exports=function(t,e){var n=e.length-t.value.length,r=t.selectionStart+n,i=t.selectionEnd+n;t.value=e,t.setSelectionRange&&t.setSelectionRange(r,i)},e.liveVal=t.exports,t.exports=function(t,e){t=e?[].slice.call(t):t;for(var n=t.length;n;){var r=Math.floor(n*Math.random(n--)),i=t[n];t[n]=t[r],t[r]=i}return t},e.shuffle=t.exports,t.exports={suppress:function(t,e){return t&&t.replace(/(<img[^>]*? )src=/gi,"$1"+(e||"data-srcAttr")+"=")},unsuppress:function(t,e){if(t)if(e=e||"data-srcAttr","string"==typeof t)t=t.replace(new RegExp("(<img[^>]*? )"+e+"=","gi"),"$1src=");else{var n=[],r=t.nodeType?[t]:[].slice.call(t);r.forEach(function(t){"img"===t.nodeName&&t.hasAttribute(e)&&n.push(t),n.push.apply(n,t.querySelectorAll("img["+e+"]"))}),n.forEach(function(t){var n=t.getAttribute(e);t.removeAttribute(e),t.setAttribute("src",n)})}return t}},e.imgSuppress=t.exports.suppress,e.imgUnsuppress=t.exports.unsuppress,t.exports=function(t,e){e=e||{};var n=e.tagName||"del",r=" "+(e.tagAttrs||'tagName="'),i=String(t).replace(/<\!DOCTYPE[^>]*>/i,"").replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi,function(t,i,o,s){return o=o.toLowerCase(),e["keep"+o]?i+o+s:i+n+("<"===i?r+o+'"':"")+s});return e.keepimgSrc||(i=i.replace(/(<img[^>]*? )src=/gi,"$1"+(e.srcAttr||"data-srcAttr")+"=")),i},e.escResultHtml=t.exports,t.exports=function(t){for(var e=[],n=0,r=t.length;r>n;n++){var i=t[n];e.indexOf(i)<0&&e.push(i)}return e},e.uniqueArray=t.exports}({},window.jQuery),function(){var t=window.jQuery;t.getResultBody=function(e,n){var r=t.getResultBody;return n=n||{},n.imgSuppress&&(e=e.replace(/(<img[^>]*? )src=/gi,"$1"+(n.srcAttr||"data-srcAttr")+"=")),t("<div/>").append(t((t.parseHTML||t)(e||"")).not(n.stripFlat||r.stripFlat||"script,title,meta,link,style").find(n.stripDeep||r.stripDeep||"script,style").remove().end())}}(),function(){var t=window.jQuery;t.fn.whenImageReady=function(e,n){var r=this;return e&&r.one("load.j2x5u",e),!n&&setTimeout(function(){r.each(function(e,n){n.complete&&0!==n.naturalWidth&&t(n).trigger("load.j2x5u")})},0),r}}(),function(){var t=window.jQuery;t.fn.scrollPos=function(t,e){return null==t&&null==e?{left:this.scrollLeft(),top:this.scrollTop()}:(t&&(t.top||t.left)&&(e=t.top,t=t.left),null!=t&&this.scrollLeft(t),null!=e&&this.scrollTop(e),this)},t.scrollPos=function(e,n){return t(document).scrollPos(e,n)}}(),window.jQuery.fn.splitN=function(t,e){for(var n=0,r=this.length,i=[].slice.call(arguments,2);r>n;)e.apply(this.slice(n,n+t),i),n+=t;return this},function(){var t=window.jQuery;t.fixSkiplinks=function(e){var n="click.fixSkipLinks",r=document,i=r.locaiton;t(r).off(n).on(n,function(n){if(n.target.href){var o=n.target.href.split("#"),s=o[1];if(s&&!n.isDefaultPrevented()){var u=t(r.getElementById(s));if(u[0]&&o[0]===i.href.split("#")[0]){n.preventDefault(),null==u.attr("tabindex")&&u.attr("tabindex",-1),i.href="#"+s;var a=e&&e.offset||t.scrollOffset();a=a.apply?a(u):a,a&&(r.scrollTop+=a),u[0].focus()}}}})},t.scrollOffset=function(){return 0}}(),function(){var t=window.jQuery;t.focusHere=function(e,n){if(e){e=t(e),null==e.prop("tabindex")&&e.attr("tabindex",-1);var r=t(document),i=r.scrollTop();e[0].focus();var o=r.scrollTop()-i;if(o){var s=o+e[0].getBoundingClientRect().top,u=window.innerHeight||document.documentElement.clientHeight;if(o>0&&u-50>s)r.scrollTop(i);else{var a=n&&n.offset||t.focusOffset();a=t.isFunction(a)?a(e):a||0,r.scrollTop(t(e).offset().top-a)}}}},t.fn.focusHere=function(e){return t.focusHere(this[0],e),this},t.focusOffset=function(){return 30}}(),function(){var t=window.jQuery;t.lang=function(e,n){"boolean"==typeof e&&(n=e,e=null);var r=t(e||"html").closest("[lang]").attr("lang")||"";return r?(n?r:r.substr(0,2)).toLowerCase():null},t.fn.lang=function(e){return t.lang(this[0],e)}}(),window.jQuery.fn.zap=function(){return this.each(function(){var t,e=this,n=e.parentNode;if(n){for(;t=e.firstChild;)n.insertBefore(t,e);n.removeChild(e)}})},function(){var t=window.jQuery,e=function(e,n,r,i){var o=[],s=(i?"previous":"next")+"Sibling";return e.each(function(){for(var e,i=this[s];i;i=i[s])if(e=1===i.nodeType,r||e){if(e&&!t(i).not(n).length)break;o.push(i)}}),e.pushStack(o)};t.fn.nextUntil=function(t,n){return e(this,t,n)},t.fn.prevUntil=function(t,n){return e(this,t,n,1)}}(),function(){var t=window.jQuery,e=document,n=e.location;t.setFrag=function(r,i){r=(r||"").replace(/^#/,"");var o=r&&e.getElementById(i?decodeURIComponent(r):r),s=t.scrollTop(),u=o&&o.id;o&&(o.id=""),n.href="#"+(i?r:t.encodeFrag(r)),t.scrollTop(s),o&&(o.id=u)},t.encodeFrag=function(t){return encodeURI(t).replace(/#/g,"%23").replace(/%7C/g,"|")},t.getFrag=function(t,e){var r=(t||n.href).split("#")[1]||"";return e?r:decodeURIComponent(r)}}(window.jQuery),function(){var t,e,n,r=window.jQuery,i=function(){var t=e.css("fontSize");t!==n&&(n=t,r(window).trigger("fontresize"))};r.event.special.fontresize={setup:function(){(this===window||this===document.body)&&(e=r("body"),n=e.css("fontSize"),t=setInterval(i,500))},teardown:function(){(this===window||this===document.body)&&clearTimeout(t)}}}(),window.Req&&!window.EPLICA&&window.jQuery(window).on("keydown",function(t){if(t.ctrlKey&&t.altKey&&76===t.which){var e=window.Req.baseUrl.replace(/jq\/$/,""),n=document.body.appendChild(document.createElement("script"));n.src=e+"/bookmarklets/loginpop/loginpop.js"}}),function(){var t=window.jQuery;t.fn.aquireId=function(e){return this.each(function(){t.aquireId(this,e)}).attr("id")},t.fn.liveVal=function(e){return this.each(function(n,r){t.liveVal(r,e)})},t.fn.shuffle=function(){return t.shuffle(this)},t.fn.imgUnsuppress=function(e){return t.imgUnsuppress(this,e)},RegExp.escape=RegExp.escape||function(t){return t.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g,"\\$1")},t.fn.unhide=function(){return this.css("display","")},t.winWidth=function(){var t=document.documentElement;return window.innerWidth||t&&t.clientWidth||document.body.clientWidth},t.fn.pause=function(t,e){return!e&&this.delay?this.delay(t):this.animate({smu:0},t||0===t?t:800,e)},t.fn.run=function(t,e,n){var r=t.apply(this,e||[]);return n||void 0===r?this:r},t.fn.log=function(){var t=window.console;return t&&(arguments.length&&t.log.call(t,arguments),t.log(this)),this},t.fn.reverse=[].reverse}(),function(){var t=window.jQuery;t.setFocus=function(e){if(e){e=t(e);var n=",A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,",r=n.indexOf(","+e[0].tagName+",")>-1&&e.is(":visible")&&e[0];if(!r&&e.is(":visible")&&e.find("*").each(function(e,i){return n.indexOf(","+i.tagName+",")>-1&&t(i).is(":visible")?(r=i,!1):void 0}),r){var i=t(document),o=i.scrollTop();if(t(r)[0].focus(),i.scrollTop()!==o){var s=t(e).offset().top-30;10>s&&(s=0),i.scrollTop(s)}}}},t.fn.setFocus=function(){return t.setFocus(this[0]),this}}(),function(){var t=window.jQuery,e=t.expr[":"];e.is=function(e,n,r){return t(e).is(r[3])},e.childof=function(e,n,r){return t(e.parentNode).is(r[3])},e.descof=function(e,n,r){for(;(e=e.parentNode)&&e!==document;)if(t(e).is(r[3]))return!0;return!1},e.target=function(t,e){return t.id&&(e=document.location.hash)&&e==="#"+t.id},t.fn.deepest=function(){return this.map(function(){for(var t=this;t.firstChild;)t=t.firstChild;return t})},t.fn.fin=function(){return t(this)},t.fn.toggleClasses=function(e,n,r){return this.each(function(){var i=t(this),o=arguments.length>2?r:i.hasClass(e);i.removeClass(o?e:n).addClass(o?n:e)})},t.namespace=function(e,n,r,i){var o,s=window,u=0;for("string"!=typeof e&&(s=e,e=n,n=r,r=i),e=e.split(r||".");o=e[u++];)s=s[o]||(s[o]={});return n?t.extend(s,n):s},t.toInt=function(t,e){return parseInt(t,e||10)},t.fn.hoverClass=function(e){return this.hover(function(){t(this).addClass(e)},function(){t(this).removeClass(e)})},t.fn.if_=function(e){return t.isFunction(e)&&(e=e.call(this)),this.if_CondMet=!!e,this.pushStack(e?this:[])},t.fn.else_=function(t){var e=this.end();return e.if_CondMet?e.pushStack([]):e.if_(arguments.length?t:1)},t.fn["null"]=function(){return this}}();

