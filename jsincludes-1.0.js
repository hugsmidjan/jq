!function(e){var t,s,a,n,o="jsincludes",r="virtualBrowser",i="disengage",l=function(t,s){s.isFirst&&e(this).remove()[r](i)},c=function(t,s){var a=e(this),n=a.data(r).cfg,o=s.resultDOM;n[i]&&(a.before(o).detach(),setTimeout(function(){e("<div/>").append(a).empty()},999)),n.setFocus&&e.setFocus&&o.setFocus()},f=function(s){var a=e(this),n=a.data(o);if(n){var l=n.link,c=n.vb.data(r).cfg,f=l[0].href.split("#")[1],d=c.selector;c.selector=l.attr("data-selectors")||f&&"#"+f||d,s!==t&&(u.splice(e.inArray(a[0],u),1),s.target&&(s.preventDefault(),c.setFocus!==!1&&(c.setFocus=1))),n.vb.addClass(c.firstLoadClass).replaceAll(a)[r]("load",l),c[i]||n.vb.one("VBloaded",function(){n.vb.removeClass(c.firstLoadClass),c.selector=d})}},d=function(){clearTimeout(s),s=setTimeout(function(){h()},v.refresh)},u=[],h=function(t){t=t||[],a=a||e(window);var s=a.scrollTop()+a.height();if(t.length||s!==n){u.push.apply(u,t);for(var i,l,c=u.length,d=c-(t.length||c);c-- >d;)i=e(u[c]),l=i.data(o).vb.data(r).cfg,i.offset().top<s+(l.unseenBuffer||0)&&(f.call(i[0]),u.splice(c,1));n=s}},v=e.fn[o]=function(t){if("refresh"===t)d();else{if("load"!==t){var s=[],a=[],n=[];return this.each(function(){var d=e(this),u=e.extend(new p,p,t,{url:null});if(!d.data(o)){var h=d.is("a")?d:d.find("a").not(u.noIncl);h.each(function(){var v=e(this),g=d;h.length>1&&(u=e.extend(new p,p,t),v.insertBefore(g).addClass(g.attr("class")),g=v),g.is(u.recurse)||(u[i]=!0);var m=e("<div/>").on("VBerror",l).one("VBloaded",c)[r](u),y={elm:g,link:v,vb:m};a.push(m[0]),g.add(m).data(o,y),u.lazyLoad===!0||g.is(u.lazyLoad||"")?(n.push(g[0]),g.on("click",f)):!u.delayUnseen||g.is(u.forceLoad)?setTimeout(function(){f.call(g[0])},0):s.push(g[0])}),h.length>1&&d.remove()}}),s.length&&(setTimeout(function(){h(s)},0),e(window).on("resize scroll",d)),{vbBodies:e(a),lazyElms:e(n)}}this.each(f)}return this},p=v.config=function(){};p.prototype={lazyLoad:".lazyload",noIncl:".no-include",firstLoadClass:"jsi-loading",unseenBuffer:100,forceLoad:".forceload",recurse:""},v.refresh=100}(jQuery);
