/* jQuery MobileMenu and StickyHeader 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */
!function(e){var t,n=e.jQuery,o=n(e),r=function(t){!e.FormatChange&&o.trigger(t,[n.formatChange.media])};n.initMobileMenu=function(i,a){i!==!1&&i!==!0&&(a=i,i=!1),a=n.extend({menuButton:".skiplink a",resetScroll:!0,minimal:i},a);var l,s,c,u,m,d,f,p,g=a.name||"menu",h=(a.evPrefix||"mobile")+g,v=".toggle-"+h,C="is-"+g,y=C+"-closed",S=C+"-open",k=C+"-active",H=a.resetScroll.apply?a.resetScroll:function(){return a.resetScroll},w={start:function(){l||(u||(u=n(a.container||"html"),m=H()&&n(a.scrollElm||e),c=n(a.evTarget||document),a.menuButton&&(d=n(a.menuButton),f=n.focusHere&&d&&d.attr("href"),f=f&&n(f))),l=!0,s=a.startOpen,u.addClass(s?S:y).addClass(k),d&&d.on("click"+v,function(e){e.preventDefault(),s?w.close():w.open()}))},open:function(){l&&!s&&(c.trigger(h+"open"),p=H()&&m.scrollTop(),u.addClass(S).removeClass(y),f&&f.focusHere(),H()&&m.scrollTop(0),s=!0,c.trigger(h+"opened"))},close:function(e){l&&s&&(t=null,c.trigger(h+"close"),u.removeClass(S),e||(u.addClass(y),H()&&m.scrollTop(p),d&&d[0].blur()),s=!1,c.trigger(h+"closed"))},stop:function(){l&&(l=!1,w.close(!0),d.off("click"+v),u.removeClass(k+" "+y))}};if(!a.minimal){a.container="html",a.scrollElm=e,a.evTarget=document;var L="formatchange"+v,T="mediaGroup"in a?a.mediaGroup:"Small",x="function"==typeof T?T:function(e,t){return!T||e[t+T]};return o.on(L,function(e,n){!l&&x(n,"became")?(w.start(),c.on(h+"open"+v,function(){t&&t.close(),t=w}).on(h+"closed"+v,function(){t=null}),!T&&o.off(L)):l&&x(n,"left")&&(w.stop(),c.off(v))}),r(L),a.stickyHeader!==!1&&(w.stickyHeaderWidget=n.initStickyHeader(n.extend({},a,{name:"header"}))),n}return a.autoStart&&w.start(),w},n.initStickyHeader=function(i,a){i!==!1&&i!==!0&&(a=i,i=!1),a=n.extend({delay:50,recede:!0,upLimit:70,downLimit:50,minimal:i},a);var l,s,c=a.name||"header",u=".sticky-"+c,m="scroll"+u,d=m+(a.onresize?" resize"+u:""),f="is-"+c,p=f+"-fixed",g=f+"-hidden",h=f+"-shown",v=!1,C={upLimit:a.upLimit,downLimit:a.downLimit,recede:a.recede.apply?a.recede:function(){return a.recede},headerHeight:a.headerHeight||function(){return parseInt(l.css("padding-top"),10)},start:function(){if(!v){v=!0;var o,r=0,i="pageXOffset"in e,c=!1,u=!1,f=a.delay,y=function(){if(!t){var n=i?e.pageYOffset:document.documentElement.scrollTop,a=C.distY=n-C.headerHeight(),s=a>0;if(o&&clearTimeout(o),s!==c&&(c=s,r=n,l.toggleClass(p+" "+g,c),c||(l.removeClass(h),u=!1)),C.recede()&&c){var m,d=n-r;(m=d>C.downLimit)?u&&(l.removeClass(h).addClass(g),u=!1):(m=d<-C.upLimit)&&(u||(l.removeClass(g).addClass(h),u=!0)),m?r=n:o=setTimeout(function(){r=n},1e3)}C.isFixed=s,C.isShown=u}};l=l||n(a.container||"html"),s=s||n(a.scrollElm||e),s.on(d,f&&n.throttleFn?n.throttleFn(y,!0,f):y).trigger(m)}},stop:function(){v&&(v=!1,s.off(d),l.removeClass(p+" "+h+" "+g))}};if(!a.minimal){a.container="html",a.scrollElm=e;var y="formatchange"+u,S="mediaGroup"in a?a.mediaGroup:"Small",k="function"==typeof S?S:function(e,t){return!S||e[t+S]};return o.on(y,function(e,t){!v&&k(t,"became")?(C.start(),!S&&o.off(y)):v&&k(t,"left")&&C.stop()}),r(y),n}return a.autoStart&&C.start(),C}}(window);
