/* jQuery equalizeHeights v 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */
!function(e){var t,i,n=8>parseInt((/MSIE ([\w.]+)/.exec(navigator.userAgent)||[])[1],10),a=document,s="MozBoxSizing"in a.createElement("p").style?"-moz-":"",r="box-sizing",h="eqh_setId",o=0,c=0,g={},l={},u=function(){t||(clearTimeout(i),i=setTimeout(d,100))},d=function(){t=1;for(var e in g)f(g[e],l[e].margins,l[e].hMethod);setTimeout(function(){t=0},0)},f=function(t,i,h){var o=e(t).filter(":visible");if(h=h?h:"min-height",o.length){var c=0,g=[];o.each(function(t){var a=e(this);a.css({"min-height":"",height:""});var h,o=a.outerHeight(),l=0,u=e.fn.jquery.substr(0,3)>=1.8;i&&(l=(parseInt(a.css("margin-top"),10)||0)+(parseInt(a.css("margin-bottom"),10)||0)),n||(u?h=a.css(r):(h=a.data("cache-"+r),h||(h=a.css(r)||a.css(s+r),a.data("cache-"+r,h||"x")))),g[t]=n||"border-box"!==h?l+o-a.height():l,c=Math.max(o,c)}).each(function(t){e(this).css(h,c-g[t]+.5)}).triggerHandler("equalizeheights",c),a.body.className+=""}};e.fn.equalizeHeights=function(t){var i,n=this;if("destroy"===t)n.each(function(t){var a=e(this);i=a.data(h);var s=g[i];if(s){var r=e.inArray(this,s);r>-1&&(a.removeData(h).css({"min-height":"",height:""}),s.splice(r,1),1===s.length&&e.inArray(s[0],n.slice(t))<0?e(s).equalizeHeights("destroy"):s.length||(delete g[i],delete l[i],c--),c||e(window).unbind(".eqh"))}});else{i=n.data(h);var a="refresh"===t;(a||n.length>1)&&(t=a?l[i]:e.extend({},"boolean"==typeof t?{margins:t}:t),t&&(a?n=g[i]:(c||e(window).on("resize.eqh",u).on("load.eqh fontresize.eqh",d),t.onceOnly||null!=i||(n.data(h,o),g[o]=n.toArray(),l[o]=t,c++,o++)),f(n,t.margins,t.hMethod)))}return n},e.equalizeHeights=u}(jQuery);
