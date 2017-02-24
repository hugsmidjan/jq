/* jQuery.fn.listscroller 1.1  -- (c) 2009-2017 Hugsmiðjan ehf.  @preserve */
!function(e,t,a){function s(e){var t=e.eq(1),s=e.eq(0).offset(),l=t.offset();return l&&t.is(":visible")?Math.abs(l.top-s.top)<=Math.abs(l.left-s.left)?"horizontal":"vertical":a}function l(e,t){var a="visible"==t.overflow?e.length-(e.length%t.stepSize||t.stepSize):e.length-t.windowSize;return a}function i(t,a,s){clearTimeout(t.scrollTimeout),s=s||{};var l=t.block,i=t.list;if(t.lastIndex=t.index,t.index=e.listscroller.wrap[t.wrap||"none"](a,i,t),t.index!=t.lastIndex){i.addClass(t.hideClass).removeClass(t.cursorItemClass).removeClass(t.currentItemClass).slice(t.index,t.index+t.windowSize).addClass(t.currentItemClass).removeClass(t.hideClass).eq(0).addClass(t.cursorItemClass),e.isFunction(t.moveCallback)&&t.moveCallback.call(l,i,t),e.isFunction(t.animation)?t.animation.call(l,i,t):e.listscroller.animate[t.animation||"none"].call(l,i,t),!s._noFocus&&t.setFocus&&setTimeout(function(){i.eq(t.index).setFocus()},t.speed||1),l.removeClass(t.topClass).removeClass(t.bottomClass),0==t.index&&l.addClass(t.topClass),i.length-t.index<=t.windowSize&&l.addClass(t.bottomClass),s._noFlash||(l.addClass(t.classPrefix+"-changed"),setTimeout(function(){l.removeClass(t.classPrefix+"-changed")},t.speed||1));var o=Math.ceil(t.index/t.stepSize);t.jumps&&t.jumps.removeClass(t.currentPageClass).eq(o).addClass(t.currentPageClass);var n=t.itemStatusPager?t.index:o;if(t.inputPager&&t.inputPager.val(o+1),t.status&&t.status.text(n+1),t.status&&t.itemStatusPager&&t.windowSize>1){var r=n+t.windowSize;r=r>i.length?i.length:r,t.status.append("-"+r)}t.autoScrollDelay&&l.queue(function(){l.trigger("afterMove").dequeue()})}}function o(e){var t=e.data;return i(t,t.index-t.stepSize),a}function n(e){var t=e.data;return i(t,t.index+t.stepSize),a}function r(t){var s=t.data,l=parseInt(e(this).text(),10)-1||0;return i(s,l*s.stepSize),a}function p(t){var s=t.data,o=Math.max(0,parseInt("0"+e(this).val(),10)-1)||0,n=Math.min(o*s.stepSize,l(s.list,s));return i(s,n),a}function u(t){var a,s,l=e(t.nextBtnTemplate),i=e(t.prevBtnTemplate);if(e(l.find("a")[0]||l).bind("click",t,n).attr("title",t.titleNext).text(t.labelNext),e(i.find("a")[0]||i).bind("click",t,o).attr("title",t.titlePrev).text(t.labelPrev),t.paging){var u=Math.ceil(t.index/t.stepSize),c=Math.ceil(t.list.length/t.stepSize),d=t.itemStatusPager?t.list.length:c;if(t.statusPager||t.inputPager){s=e(t.statusTempl),e(t.statusLabelTempl).html(t.statusLabel).appendTo(s);var m=e(t.statusWrapTempl).appendTo(s);e(t.statusTotalTempl).html(t.ofTotalSeparator+d+t.statusLabelAfter).appendTo(m),t.inputPager?t.inputPager=e(t.inputPagerTempl).prependTo(m).val(u+1).bind("change",t,p):t.status=e(t.statusCurrTempl).prependTo(m)}if(t.jumpPager){var f=[];a=e(t.jumpTemplate),t.jumpLabelTemplate&&e(t.jumpLabelTemplate).text(t.jumpLabel).appendTo(a);for(var v=0;v<c;v++){var g=e(t.jumpBtnTemplate),h=e(g.find("a")[0]||g).text(v+1).attr("title",t.statusLabel+(v+1)).addClass("p"+(v+1)).bind("click",t,r);t.index==v&&h.addClass(t.currentPageClass),f.push(g[0])}t.jumps=e(f),e(t.jumpWrapTemplate||[]).append(t.jumps).appendTo(a)}}return e(t.pagingTemplate).deepest().append(l,i,a).end().prepend(s)}function c(a,l,o){var n,r,p=l.data("listscrollerCfg");if(p){l.removeData("listscrollerCfg"),n=p.list.parent(),r=n.parent(),a.destroy&&(n.filter("div").zap(),r.zap(),n=r=void 0),clearTimeout(p.scrollTimeout);var c=l[0].style.display||"";l.hide().removeClass(p.classPrefix+"-active").removeClass(p.topClass).removeClass(p.bottomClass).removeClass("block-mouseover").unbind(".lscr").data("lstscr_pagingElms").remove(),l.removeData("lstscr_pagingElms"),p.list.removeClass(p.hideClass).removeClass(p.cursorItemClass).removeClass(p.currentItemClass).css({display:""}),p.flipover&&p.flipover.remove(),n&&n.removeClass(p.classPrefix+"-clip").css("position",""),r&&r.scroll(0,0).removeClass(p.classPrefix+"-wrapper").removeClass(p.classPrefix+"-"+p.aspect).css("position",""),l.css("display",c)}if(!a.destroy){o="string"==typeof o?l.find(o):o,p||(n=o.eq(0).is("li")?o.parent():o.wrapAll("<div />").parent(),r=n.wrap("<div />").parent()),a.list=o,a.block=l,l.data("listscrollerCfg",a),l.addClass(a.classPrefix+"-active"),r.addClass(a.classPrefix+"-wrapper").addClass(a.classPrefix+"-"+a.aspect),n.addClass(a.classPrefix+"-clip").add(r).css("position","relative"),"loop"==a.wrap&&(a.flipover=o.slice(0,a.windowSize).clone(t).addClass("listscroller-clone"),o.parent().append(a.flipover));var d=[];"none"!==a.controls&&o.length>0&&(/^(above|both)$/.test(a.controls)&&(d.unshift(u(a).addClass(a.pagingTopClass)[0]),r.before(d[0])),/^(below|both)$/.test(a.controls)&&(d.unshift(u(a).addClass(a.pagingBottomClass)[0]),r.after(d[0]))),l.data("lstscr_pagingElms",e(d)),"auto"==a.aspect&&(a.aspect=s(o)||e.listscroller.aspectDefaults[a.animation]||"horizontal"),r.addClass(a.classPrefix+"-"+a.aspect),"random"==a.startPos&&(a.startPos=Math.floor(Math.ceil(o.length/a.stepSize)*Math.random())*a.stepSize),i(a,a.startPos||0,{_noFlash:t,_noFocus:t});var m=function(e){i(a,a.index+a.stepSize,{_noFlash:t,_noFocus:t})},f=function(e){i(a,a.index-a.stepSize,{_noFlash:t,_noFocus:t})},v=a.autoScrollDelay;v&&(a.scrollTimeout=setTimeout(m,v),l.bind("mouseenter.lscr",function(e){l.addClass("block-mouseover"),clearTimeout(a.scrollTimeout)}).bind("mouseleave.lscr",function(e){l.removeClass("block-mouseover"),clearTimeout(a.scrollTimeout),a.scrollTimeout=setTimeout(m,v)}).bind("afterMove.lscr",function(e){l.is(".block-mouseover")||(clearTimeout(a.scrollTimeout),a.scrollTimeout=setTimeout(m,v))})),"horizontal"==a.aspect?l.on("swipeleft",function(e){m()}).on("swiperight",function(e){f()}):"vertical"==a.aspect&&l.on("swipeup",function(e){m()}).on("swipedown",function(e){f()})}}e.listscroller={version:1,defaultConfig:{item:"",windowSize:3,stepSize:1,startPos:0,hideClass:"overflow",topClass:"at-top",bottomClass:"at-bottom",wrap:"both",overflow:"visible",controls:"below",animation:"none",easing:"swing",speed:600,aspect:"auto",jumpPager:t,autoScrollDelay:0,setFocus:t,moveCallback:function(){},classPrefix:"listscroller",currentPageClass:"current",currentItemClass:"visible",cursorItemClass:"current",pagingTopClass:"paging paging-top",pagingBottomClass:"paging paging-bottom",pagingTemplate:'<div><ul class="stepper"/></div>',nextBtnTemplate:'<li class="next"><a href="#"/></li>',prevBtnTemplate:'<li class="prev"><a href="#"/></li>',jumpTemplate:'<li class="jump"/>',jumpLabelTemplate:"<strong/>",jumpWrapTemplate:"<span/>",jumpBtnTemplate:'<a href="#"/>',statusTempl:'<div class="status"/>',statusLabelTempl:"<strong/>",statusWrapTempl:"<span/>",statusCurrTempl:"<b/>",statusTotalTempl:"<i/>",inputPagerTempl:'<input type="text" value="" size="2"/>'},i18n:{en:{labelNext:"Next",labelPrev:"Previous",titleNext:"Page forward",titlePrev:"Page back",jumpLabel:"Pages:",statusLabel:"Page: ",ofTotalSeparator:" of ",statusLabelAfter:""},is:{labelNext:"Næsta",labelPrev:"Fyrri",titleNext:"Fletta áfram",titlePrev:"Fletta til baka",jumpLabel:"Síður:",statusLabel:"Síða: ",ofTotalSeparator:" af ",statusLabelAfter:""},no:{labelNext:"Neste",labelPrev:"Tidligere",titleNext:"Bla frem",titlePrev:"Bla tilbake",jumpLabel:"Sider:",statusLabel:"Side: ",ofTotalSeparator:" af ",statusLabelAfter:""},da:{labelNext:"Næste",labelPrev:"Tidligere",titleNext:"Rul frem",titlePrev:"Rul tilbage",jumpLabel:"Sider:",statusLabel:"Side: ",ofTotalSeparator:" af ",statusLabelAfter:""}},animate:{none:function(e,t){},carousel:function(e,t){var a,s=e.eq(0).closest("."+t.classPrefix+"-wrapper"),l=e.eq(e.length-1),i=e.length-t.stepSize,o="horizontal"===t.aspect,n=o?"scrollLeft":"scrollTop",r=o?"left":"top",p=o?"outerWidth":"outerHeight",u={};s.stop(),a=e.eq(t.index).position(),u[n]=a[r],"loop"==t.wrap&&0==t.lastIndex&&t.index==i?(s[n](l.position()[r]+l[p]()),s.animate(u,t.speed,t.easing)):"loop"==t.wrap&&t.lastIndex==i&&0==t.index?(u[n]=l.position()[r]+l[p](),s.animate(u,t.speed,t.easing,function(){s[n](0)})):s.animate(u,t.speed,t.easing)},crossfade:function(t,a){t.each(function(t,s,l){s=t>=a.index&&t<a.index+a.windowSize,l=null==a.lastIndex||t>=a.lastIndex&&t<a.lastIndex+a.windowSize,s||null!=a.lastIndex?s&&!l?e(this).stop().hide().fadeIn(a.speed):!s&&l&&e(this).stop().show().css({opacity:1}).fadeOut(a.speed):e(this).stop().hide()})},accordion:function(t,a){var s,l="vertical"==a.aspect?"height":"width";t.each(function(t,i,o){i=t>=a.index&&t<a.index+a.windowSize,o=null==a.lastIndex||t>=a.lastIndex&&t<a.lastIndex+a.windowSize,s={},i||null!=a.lastIndex?(s[l]=i&&!o?"show":!i&&o?"hide":void 0,s[l]&&e(this).stop().animate(s,a.speed,a.easing,function(){this.style[l]=""})):e(this).stop().hide()})}},wrap:{none:function(e,t,a){return Math.max(Math.min(e,l(t,a)),0)},start:function(e,t,a){var s=l(t,a);return e<0?0==a.index?s:0:e>s?s:e},end:function(e,t,a){var s=l(t,a);return e<0?0:e>s?a.index==s?0:s:e},both:function(e,t,a){var s=l(t,a);return e<0?0==a.index?s:0:e>s?a.index==s?0:s:e},random:function(e,t,a){return Math.floor(Math.random()*t.length)},loop:function(e,t,a){return(t.length+e)%t.length}},aspectDefaults:{none:"vertical",carousel:"horizontal",crossfade:"horizontal",accordion:"vertical"}},e.fn.listscroller=function(t){var s=e.listscroller.defaultConfig;return t&&(t.item||t.destroy)||s.item?this.each(function(){var l=e(this),i=l.closest("[lang]").attr("lang")||"",o=e.listscroller.i18n,n=o[i.toLowerCase()]||o[i.substr(0,2)]||o.en,r=e.extend({},s,n,t);r.itemStatusPager&&(r.inputPager=a),c(r,l,r.item)}):this.length&&this.eq(0).parent().listscroller(e.extend({},t,{item:this})),this}}(jQuery,!0,!1);
