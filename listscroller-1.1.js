// encoding: utf-8
// $.fn.listscroller 1.1  -- (c) 2009 Hugsmiðjan ehf.
(function(f,m,n){f.listscroller={version:1.0,defaultConfig:{item:'',windowSize:3,stepSize:1,startPos:0,hideClass:'overflow',topClass:'at-top',bottomClass:'at-bottom',wrap:'both',overflow:'visible',controls:'below',animation:'none',easing:'swing',speed:600,aspect:'auto',jumpPager:m,autoScrollDelay:0,setFocus:m,moveCallback:function(){},classPrefix:'listscroller',currentPageClass:'current',currentItemClass:'visible',cursorItemClass:'current',pagingTopClass:'paging paging-top',pagingBottomClass:'paging paging-bottom',pagingTemplate:'<div><ul class="stepper"/></div>',nextBtnTemplate:'<li class="next"><a href="#"/></li>',prevBtnTemplate:'<li class="prev"><a href="#"/></li>',jumpTemplate:'<li class="jump"/>',jumpLabelTemplate:'<strong/>',jumpWrapTemplate:'<span/>',jumpBtnTemplate:'<a href="#"/>',statusTempl:'<div class="status"/>',statusLabelTempl:'<strong/>',statusWrapTempl:'<span/>',statusCurrTempl:'<b/>',statusTotalTempl:'<i/>',inputPagerTempl:'<input type="text" value="" size="2"/>'},i18n:{en:{labelNext:'Next',labelPrev:'Previous',titleNext:'Page forward',titlePrev:'Page back',jumpLabel:'Pages:',statusLabel:'Page: ',ofTotalSeparator:' of ',statusLabelAfter:''},is:{labelNext:'Næsta',labelPrev:'Fyrri',titleNext:'Fletta áfram',titlePrev:'Fletta til baka',jumpLabel:'Síður:',statusLabel:'Síða: ',ofTotalSeparator:' af ',statusLabelAfter:''}},animate:{none:function(a,b){},carousel:function(a,b){var c,d=a.eq(0).closest('.'+b.classPrefix+'-wrapper'),e=a.eq(a.length-1),g=a.length-b.stepSize,i=(b.aspect==='horizontal'),h=i?'scrollLeft':'scrollTop',l=i?'left':'top',k=i?'outerWidth':'outerHeight',j={};d.stop();c=a.eq(b.index).position();j[h]=c[l];if(b.wrap=='loop'&&b.lastIndex==0&&b.index==g){d[h](e.position()[l]+e[k]());d.animate(j,b.speed,b.easing)}else if(b.wrap=='loop'&&b.lastIndex==g&&b.index==0){j[h]=e.position()[l]+e[k]();d.animate(j,b.speed,b.easing,function(){d[h](0)})}else{d.animate(j,b.speed,b.easing)}},crossfade:function(d,e){d.each(function(a,b,c){b=(a>=e.index&&a<e.index+e.windowSize);c=(e.lastIndex==null)||(a>=e.lastIndex&&a<e.lastIndex+e.windowSize);if(!b&&e.lastIndex==null){f(this).stop().hide()}else if(b&&!c){f(this).stop().hide().fadeIn(e.speed)}else if(!b&&c){f(this).stop().show().css({opacity:1}).fadeOut(e.speed)}})},accordion:function(d,e){var g,i=(e.aspect=='vertical')?'height':'width';d.each(function(a,b,c){b=(a>=e.index&&a<e.index+e.windowSize);c=(e.lastIndex==null)||(a>=e.lastIndex&&a<e.lastIndex+e.windowSize);g={};if(!b&&e.lastIndex==null){f(this).stop().hide()}else{g[i]=(b&&!c)?'show':(!b&&c)?'hide':undefined;g[i]&&f(this).stop().animate(g,e.speed,e.easing,function(){this.style[i]=''})}})}},wrap:{none:function(a,b,c){return Math.max(Math.min(a,p(b,c)),0)},start:function(a,b,c){var d=p(b,c);if(a<0){return(c.index==0)?d:0}if(a>d){return d}return a},end:function(a,b,c){var d=p(b,c);if(a<0){return 0}if(a>d){return(c.index==d)?0:d}return a},both:function(a,b,c){var d=p(b,c);if(a<0){return(c.index==0)?d:0}if(a>d){return(c.index==d)?0:d}return a},random:function(a,b,c){return Math.floor(Math.random()*b.length)},loop:function(a,b,c){return(b.length+a)%b.length}},aspectDefaults:{none:'vertical',carousel:'horizontal',crossfade:'horizontal',accordion:'vertical'}};function t(a){var b,c=a.eq(1),d=a.eq(0).offset(),e=c.offset();if(e&&c.is(':visible')){return(Math.abs(e.top-d.top)<=Math.abs(e.left-d.left))?'horizontal':'vertical'}return n}function p(a,b){var c=(b.overflow=='visible')?a.length-(a.length%b.stepSize||b.stepSize):a.length-b.windowSize;return c}function o(a,b,c){clearTimeout(a.scrollTimeout);c=c||{};var d=a.block;var e=a.list;a.lastIndex=a.index;a.index=f.listscroller.wrap[a.wrap||'none'](b,e,a);if(a.index!=a.lastIndex){e.addClass(a.hideClass).removeClass(a.cursorItemClass).removeClass(a.currentItemClass).slice(a.index,a.index+a.windowSize).addClass(a.currentItemClass).removeClass(a.hideClass).eq(0).addClass(a.cursorItemClass);if(f.isFunction(a.moveCallback)){a.moveCallback.call(d,e,a)}if(f.isFunction(a.animation)){a.animation.call(d,e,a)}else{f.listscroller.animate[a.animation||'none'].call(d,e,a)}if(!c._0&&a.setFocus){setTimeout(function(){e.eq(a.index).setFocus()},a.speed||1)}d.removeClass(a.topClass).removeClass(a.bottomClass);if(a.index==0){d.addClass(a.topClass)}if((e.length-a.index)<=a.windowSize){d.addClass(a.bottomClass)}if(!c._1){d.addClass(a.classPrefix+'-changed');setTimeout(function(){d.removeClass(a.classPrefix+'-changed')},a.speed||1)}var g=Math.ceil(a.index/a.stepSize);if(a.jumps){a.jumps.removeClass(a.currentPageClass).eq(g).addClass(a.currentPageClass)}var i=a.itemStatusPager?a.index:g;a.inputPager&&a.inputPager.val(g+1);a.status&&a.status.text(i+1);if(a.status&&a.itemStatusPager&&a.windowSize>1){var h=i+a.windowSize;h=(h>e.length)?e.length:h;a.status.append('-'+h)}if(a.autoScrollDelay){d.queue(function(){d.trigger('afterMove').dequeue()})}}}function u(a){var b=a.data;o(b,b.index-b.stepSize);return n}function v(a){var b=a.data;o(b,b.index+b.stepSize);return n}function w(a){var b=a.data,c=(parseInt(f(this).text(),10)-1)||0;o(b,c*b.stepSize);return n}function x(a){var b=a.data,c=Math.max(0,parseInt('0'+f(this).val(),10)-1)||0,d=Math.min(c*b.stepSize,p(b.list,b));o(b,d);return n}function r(a){var b=f(a.nextBtnTemplate),c=f(a.prevBtnTemplate),d,e;b.find('a').andSelf().eq(0).bind('click',a,v).attr('title',a.titleNext).text(a.labelNext);c.find('a').andSelf().eq(0).bind('click',a,u).attr('title',a.titlePrev).text(a.labelPrev);if(a.paging){var g=Math.ceil(a.index/a.stepSize),i=Math.ceil(a.list.length/a.stepSize),h=a.itemStatusPager?a.list.length:i;if(a.statusPager||a.inputPager){e=f(a.statusTempl);f(a.statusLabelTempl).html(a.statusLabel).appendTo(e);var l=f(a.statusWrapTempl).appendTo(e);f(a.statusTotalTempl).html(a.ofTotalSeparator+h+a.statusLabelAfter).appendTo(l);if(a.inputPager){a.inputPager=f(a.inputPagerTempl).prependTo(l).val(g+1).bind('change',a,x)}else{a.status=f(a.statusCurrTempl).prependTo(l)}}if(a.jumpPager){var k=[];d=f(a.jumpTemplate);if(a.jumpLabelTemplate){f(a.jumpLabelTemplate).text(a.jumpLabel).appendTo(d)}for(var j=0;j<i;j++){var q=f(a.jumpBtnTemplate),s=q.find('a').andSelf().eq(0).text(j+1).attr('title',a.statusLabel+(j+1)).addClass('p'+(j+1)).bind('click',a,w);if(a.index==j){s.addClass(a.currentPageClass)}k.push(s[0])}a.jumps=f(k);f(a.jumpWrapTemplate||[]).append(a.jumps).appendTo(d)}}return f(a.pagingTemplate).deepest().append(b,c,d).end().prepend(e)}function y(b,c,d){var e,g,i;var h=c.data('listscrollerCfg');if(h){c.removeData('listscrollerCfg');g=h.list.parent();i=g.parent();if(b.destroy){g.filter('div').zap();i.zap();g=i=undefined}clearTimeout(h.scrollTimeout);var l=c.css('display');c.hide().removeClass(h.classPrefix+'-active').removeClass(h.topClass).removeClass(h.bottomClass).removeClass('block-mouseover').unbind('.lscr').data('lstscr_pagingElms').remove();c.removeData('lstscr_pagingElms');h.list.removeClass(h.hideClass).removeClass(h.cursorItemClass).removeClass(h.currentItemClass).css({'display':''});h.flipover&&h.flipover.remove();g&&g.removeClass(h.classPrefix+'-clip').css('position','');i&&i.scroll(0,0).removeClass(h.classPrefix+'-wrapper').removeClass(h.classPrefix+'-'+h.aspect).css('position','');c.css('display',l)}if(!b.destroy){d=typeof d=='string'?c.find(d):d;if(!h){g=d.eq(0).is('li')?d.parent():d.wrapAll('<div />').parent();i=g.wrap('<div />').parent()}b.list=d;b.block=c;c.data('listscrollerCfg',b);c.addClass(b.classPrefix+'-active');i.addClass(b.classPrefix+'-wrapper').addClass(b.classPrefix+'-'+b.aspect);g.addClass(b.classPrefix+'-clip').add(i).css('position','relative');if(b.wrap=='loop'){b.flipover=d.slice(0,b.windowSize).clone(m).addClass('listscroller-clone');d.parent().append(b.flipover)}var k=[];if(b.controls!=='none'&&d.length>0){if(/^(above|both)$/.test(b.controls)){k.unshift(r(b).addClass(b.pagingTopClass)[0]);i.before(k[0])}if(/^(below|both)$/.test(b.controls)){k.unshift(r(b).addClass(b.pagingBottomClass)[0]);i.after(k[0])}}c.data('lstscr_pagingElms',f(k));if(b.aspect=='auto'){b.aspect=t(d)||f.listscroller.aspectDefaults[b.animation]||'horizontal'}i.addClass(b.classPrefix+'-'+b.aspect);if(b.startPos=='random'){b.startPos=Math.floor(Math.ceil(d.length/b.stepSize)*Math.random())*b.stepSize}o(b,b.startPos||0,{_1:m,_0:m});var j=b.autoScrollDelay;if(j){var q=function(a){o(b,b.index+b.stepSize,{_1:m,_0:m})};b.scrollTimeout=setTimeout(q,j);c.bind('mouseenter.lscr',function(a){c.addClass('block-mouseover');clearTimeout(b.scrollTimeout)}).bind('mouseleave.lscr',function(a){c.removeClass('block-mouseover');clearTimeout(b.scrollTimeout);b.scrollTimeout=setTimeout(q,j)}).bind('afterMove.lscr',function(a){if(!c.is('.block-mouseover')){clearTimeout(b.scrollTimeout);b.scrollTimeout=setTimeout(q,j)}})}}}f.fn.listscroller=function(g){var i=f.listscroller.defaultConfig;if((g&&(g.item||g.destroy))||i.item){this.each(function(){var a=f(this),b=a.closest('[lang]').attr('lang')||'',c=f.listscroller.i18n,d=c[b.toLowerCase()]||c[b.substr(0,2)]||c.en,e=f.extend({},i,d,g);if(e.itemStatusPager){e.inputPager=n}y(e,a,e.item)})}else if(this.length){this.eq(0).parent().listscroller(f.extend({},g,{item:this}))}return this}})(jQuery,!0,!1);
