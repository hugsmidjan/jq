/* jQuery MobileMenu and StickyHeader 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */
!function(e){var r,n=e(window),t=e(document),a=e("html"),o=!window.FormatChange;e.initMobileMenu=function(i){i=e.extend({stickyHeader:!0,startOpen:!1,mediaGroup:"Small",name:"menu",evPrefix:"mobile",menuButton:".skiplink a"},i);var l="function"==typeof i.mediaGroup?i.mediaGroup:function(e,r){return!i.mediaGroup||e[r+i.mediaGroup]},s="formatchange."+i.evPrefix+i.name,d=i.startOpen,u="is-"+i.name,c=u+"-closed",f=u+"-open",m=u+"-active",g=i.evPrefix+i.name;return n.on(s,function(o,u){if(l(u,"became")){var m;a.addClass(i.startOpen?f:c),e(i.menuButton).on("click.toggleMenu",function(o){var i=this;if(o.preventDefault(),d)r=null,t.trigger(g+"close"),a.removeClass(f),a.addClass(c),n.scrollTop(m),i.blur(),t.trigger(g+"closed");else{r&&e(r).trigger("click.toggleMenu"),r=i,t.trigger(g+"open"),m=n.scrollTop()||1,a.addClass(f),a.removeClass(c);var l=e(e(i).attr("href"));l.focusHere(),n.scrollTop(1),t.trigger(g+"opened")}d=!d}),!u&&n.off(s)}else l(u,"left")&&(d&&(r=null,t.trigger(g+"close"),d=!1,a.removeClass(f+" "+c),t.trigger(g+"closed")),e(i.menuButton).off("click.toggleMenu"))}),o&&n.trigger(s,[e.formatChange.media]),a.addClass(m),i.stickyHeader&&e.initStickyHeader(e.extend({},i,{name:"header"})),e},e.initStickyHeader=function(t){t=e.extend({name:"header",upDelay:50,mediaGroup:"Small",headerHeight:function(){return parseInt(a.css("padding-top"),10)}},t);var i="function"==typeof t.mediaGroup?t.mediaGroup:function(e,r){return!t.mediaGroup||e[r+t.mediaGroup]},l="formatchange.stickyheader",s="scroll.stickyheader",d="is-"+t.name,u=d+"-fixed",c=d+"-shown";return n.on(l,function(o,d){if(i(d,"became")){var f=0,m=t.headerHeight(),g="pageXOffset"in window,p=!1,v=!1;n.on(s,e.throttleFn(function(){if(!r){var e=g?window.pageYOffset:window.document.documentElement.scrollTop,n=e>m;if(n!==p&&(a.toggleClass(u,n),p&&(a.removeClass(c),v=!1),f=e,p=n),p){var o=e-f;o>0?(v&&(a.removeClass(c),v=!1),f=e):o<-t.upDelay&&(v||(a.addClass(c),v=!0),f=e)}}},!0,50)).trigger(s),!d&&n.off(l)}else i(d,"left")&&(n.off(s),a.removeClass(u+" "+c))}),o&&n.trigger(l,[e.formatChange.media]),e}}(jQuery);
