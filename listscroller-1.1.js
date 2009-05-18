(function(f){f.listscroller={version:1.0,defaultConfig:{item:'',windowSize:3,stepSize:1,startPos:0,hideClass:'overflow',topClass:'at-top',bottomClass:'at-bottom',wrap:'both',overflow:'hidden',controls:'below',animation:'none',easing:'swing',speed:600,aspect:'auto',paging:false,jumpPager:true,inputPager:false,statusPager:false,autoScrollDelay:0,initCallback:function(){},moveCallback:function(){},classPrefix:'listscroller',currentPageClass:'current',currentItemClass:'visible',cursorItemClass:'current',pagingTopClass:'paging-top',pagingBottomClass:'paging-bottom',pagingTemplate:'<div class="paging"><ul class="stepper"/></div>',nextBtnTemplate:'<li class="next"><a href="#"/></li>',prevBtnTemplate:'<li class="prev"><a href="#"/></li>',jumpTemplate:'<li class="jump"/>',jumpLabelTemplate:'<strong/>',jumpWrapTemplate:'<span/>',jumpBtnTemplate:'<a href="#"/>',statusTempl:'<div class="status"/>',statusLabelTempl:'<strong/>',statusWrapTempl:'<span/>',statusCurrTempl:'<b/>',statusTotalTempl:'<i/>',inputPagerTempl:'<input type="text" value="" size="2"/>',labelNext:'Next',labelPrev:'Previous',titleNext:'Page forward',titlePrev:'Page back',jumpLabel:'Pages:',statusLabel:'Page:',ofTotalSeparator:' of '},i18n:function(a,b){return a},animate:{none:function(a,b){},carousel:function(a,b){var d,c=a.eq(0).closest('.'+b.classPrefix+'-wrapper'),e=a.eq(a.length-1),h=a.length-b.stepSize,g=(b.aspect==='horizontal')?'scrollLeft':'scrollTop',j=(b.aspect==='horizontal')?'outerWidth':'outerHeight',i={};c.stop();d=a.eq(b.index).position();i[g]=d.left;if(b.wrap=='loop'&&b.lastIndex==0&&b.index==h){c[g](e.position().left+e[j]());c.animate(i,b.speed,b.easing)}else if(b.wrap=='loop'&&b.lastIndex==h&&b.index==0){i[g]=e.position().left+e[j]();c.animate(i,b.speed,b.easing,function(){c[g](0)})}else{c.animate(i,b.speed,b.easing)}},crossfade:function(c,e){c.each(function(a,b,d){b=(a>=e.index&&a<e.index+e.windowSize);d=(e.lastIndex==null)||(a>=e.lastIndex&&a<e.lastIndex+e.windowSize);if(b&&!d){f(this).stop().hide().fadeIn(e.speed)}else if(!b&&e.lastIndex==null){f(this).stop().hide()}else if(!b&&d){f(this).stop().show().fadeOut(e.speed)}})},accordion:function(c,e){var h,g=(e.aspect=='vertical')?'height':'width';c.each(function(a,b,d){b=(a>=e.index&&a<e.index+e.windowSize);d=(e.lastIndex==null)||(a>=e.lastIndex&&a<e.lastIndex+e.windowSize);h={};if(b&&!d){h[g]='show';f(this).stop().animate(h,e.speed,e.easing,function(){this.style[g]=''})}else if(!b&&e.lastIndex==null){f(this).stop().hide()}else if(!b&&d){h[g]='hide';f(this).stop().animate(h,e.speed,e.easing,function(){this.style[g]=''})}})}},wrap:{none:function(a,b,d){return Math.max(Math.min(a,l(b,d)),0)},start:function(a,b,d){var c=l(b,d);if(a<0){return(d.index==0)?c:0}if(a>c){return c}return a},end:function(a,b,d){var c=l(b,d);if(a<0){return 0}if(a>c){return(d.index==c)?0:c}return a},both:function(a,b,d){var c=l(b,d);if(a<0){return(d.index==0)?c:0}if(a>c){return(d.index==c)?0:c}return a},random:function(a,b,d){return Math.floor(Math.random()*b.length)},loop:function(a,b,d){return((b.length+a)%b.length)}},aspectDefaults:{none:'vertical',carousel:'horizontal',crossfade:'horizontal',accordion:'vertical'}};function s(a){var b,d=a.eq(1);p1=a.eq(0).offset(),p2=d.offset();if(p2&&d.is(':visible')){return(Math.abs(p2.top-p1.top)<=Math.abs(p2.left-p1.left))?'horizontal':'vertical'}return false}function l(a,b){return(b.overflow=='visible')?Math.floor(a.length/b.stepSize)*b.stepSize:a.length-b.windowSize}function k(a,b,d){var c=a.block;var e=a.list;a.lastIndex=a.index;a.index=f.listscroller.wrap[a.wrap||'none'](b,e,a);e.addClass(a.hideClass).removeClass(a.cursorItemClass).removeClass(a.currentItemClass).slice(a.index,a.index+a.windowSize).addClass(a.currentItemClass).removeClass(a.hideClass).eq(0).addClass(a.cursorItemClass);if(f.isFunction(a.moveCallback)){a.moveCallback.call(c,e,a)}if(f.isFunction(a.animation)){a.animation.call(c,e,a)}else{f.listscroller.animate[a.animation||'none'].call(c,e,a)}c.removeClass(a.topClass).removeClass(a.bottomClass);if(a.index==0){c.addClass(a.topClass)}if(a.index==e.length-a.windowSize){c.addClass(a.bottomClass)}if(!d){c.addClass(a.classPrefix+'-changed');setTimeout(function(){c.removeClass(a.classPrefix+'-changed')},a.speed||1)}if(a.jumps){a.jumps.removeClass(a.currentPageClass).eq(Math.ceil(a.index/a.stepSize)).addClass(a.currentPageClass)}else if(a.pager){a.pager.val(Math.ceil(a.index/a.stepSize)+1)}else if(a.status){a.status.text(Math.ceil(a.index/a.stepSize)+1)}}function t(a){var b=a.data;k(b,b.index-b.stepSize);return false}function u(a){var b=a.data;k(b,b.index+b.stepSize);return false}function v(a){var b=a.data,d=(parseInt(f(this).text(),10)-1)||0;k(b,d*b.stepSize);return false}function w(a){var b=a.data,d=(parseInt(f(this).val(),10)-1)||0;k(b,d*b.stepSize);return false}function o(a,b){var d=f(a.nextBtnTemplate),c=f(a.prevBtnTemplate),e,h,g=f.listscroller.i18n;d.find('a').andSelf().eq(0).bind('click',a,u).attr('title',g(a.titleNext,b)).text(g(a.labelNext,b));c.find('a').andSelf().eq(0).bind('click',a,t).attr('title',g(a.titlePrev,b)).text(g(a.labelPrev,b));if(a.paging){var j=[],i=Math.ceil(a.index/a.stepSize),p=Math.ceil(a.list.length/a.stepSize);if(a.statusPager||a.inputPager){h=f(a.statusTempl);f(a.statusLabelTempl).html(a.statusLabel).appendTo(h);var n=f(a.statusWrapTempl).appendTo(h);f(a.statusTotalTempl).html(a.ofTotalSeparator+p).appendTo(n);if(a.inputPager){a.pager=f(a.inputPagerTempl).prependTo(n).val(i+1).bind('change',a,w)}else{a.status=f(a.statusCurrTempl).prependTo(n)}}if(a.jumpPager){e=f(a.jumpTemplate);if(a.jumpLabelTemplate){f(a.jumpLabelTemplate).text(g(a.jumpLabel,b)).appendTo(e)}for(var m=0;m<p;m++){var x=f(a.jumpBtnTemplate),q=x.find('a').andSelf().eq(0).text(m+1).bind('click',a,v);if(a.index==m){q.addClass(a.currentPageClass)}j.push(q[0])}a.jumps=f(j);f(a.jumpWrapTemplate||[]).append(a.jumps).appendTo(e)}}return f(a.pagingTemplate).deepest().append(d,c,e).end().prepend(h)}function r(b,d,c){if(d.hasClass(b.classPrefix+'-active')){return false}b.list=c;b.block=d;var e,h,g;if(c.eq(0).is('li')){h=c.parent()}else{h=c.wrapAll('<div />').parent()}g=h.wrap('<div />').parent();h.addClass(b.classPrefix+'-clip');g.addClass(b.classPrefix+'-wrapper');d.addClass(b.classPrefix+'-active');h.add(g).css('position','relative');g.addClass(b.classPrefix+'-'+b.aspect);if(b.wrap=='loop'){b.flipover=c.slice(0,b.windowSize).clone(true);c.parent().append(b.flipover)}if(b.controls!=='none'&&c.length>0){var j=c.parents('[lang]').attr('lang')||'en';if(/^(above|both)$/.test(b.controls)){g.before(o(b,j).addClass(b.pagingTopClass))}if(/^(below|both)$/.test(b.controls)){g.after(o(b,j).addClass(b.pagingBottomClass))}}if(b.aspect=='auto'){b.aspect=s(c)||f.listscroller.aspectDefaults[b.animation]||'horizontal'}g.addClass(b.classPrefix+'-'+b.aspect);k(b,b.startPos||0,true);if(b.autoScrollDelay){function i(a){d.find('.next a').click()}scrollInterval=setInterval(i,b.autoScrollDelay);d.bind('mouseenter',function(){clearInterval(scrollInterval)}).bind('mouseleave',function(){scrollInterval=setInterval(i,b.autoScrollDelay)})}}f.fn.listscroller=function(d){var c=f.listscroller.defaultConfig;if((d&&d.item)||c.item){this.each(function(){var a=f.extend({},c,d),b=f(this);r(a,b,b.find(a.item))})}else if(this.length){r(f.extend({},c,d),this.eq(0).parent(),this)}return this}})(jQuery);