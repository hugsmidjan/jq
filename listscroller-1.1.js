(function($){$.listscroller={version:1.0,defaultConfig:{item:'',windowSize:3,stepSize:1,startPos:0,hideClass:'overflow',topClass:'at-top',bottomClass:'at-bottom',wrap:'both',overflow:'hidden',controls:'below',animation:'none',easing:'swing',speed:600,aspect:'auto',paging:false,jumpPager:true,inputPager:false,statusPager:false,autoScrollDelay:0,initCallback:function(){},moveCallback:function(){},classPrefix:'listscroller',currentPageClass:'current',currentItemClass:'visible',cursorItemClass:'current',pagingTopClass:'paging-top',pagingBottomClass:'paging-bottom',pagingTemplate:'<div class="paging"><ul class="stepper"/></div>',nextBtnTemplate:'<li class="next"><a href="#"/></li>',prevBtnTemplate:'<li class="prev"><a href="#"/></li>',jumpTemplate:'<li class="jump"/>',jumpLabelTemplate:'<strong/>',jumpWrapTemplate:'<span/>',jumpBtnTemplate:'<a href="#"/>',statusTempl:'<div class="status"/>',statusLabelTempl:'<strong/>',statusWrapTempl:'<span/>',statusCurrTempl:'<b/>',statusTotalTempl:'<i/>',inputPagerTempl:'<input type="text" value="" size="2"/>'},i18n:{en:{labelNext:'Next',labelPrev:'Previous',titleNext:'Page forward',titlePrev:'Page back',jumpLabel:'Pages:',statusLabel:'Page:',ofTotalSeparator:' of '},en:{labelNext:'Næsta',labelPrev:'Fyrri',titleNext:'Fletta áfram',titlePrev:'Fletta til baka',jumpLabel:'Síður:',statusLabel:'Síða:',ofTotalSeparator:' af '}},animate:{none:function(l,c){},carousel:function(l,c){var p,w=l.eq(0).closest('.'+c.classPrefix+'-wrapper'),z=l.eq(l.length-1),last=l.length-c.stepSize,prop=(c.aspect==='horizontal')?'scrollLeft':'scrollTop',dimp=(c.aspect==='horizontal')?'outerWidth':'outerHeight',conf={};w.stop();p=l.eq(c.index).position();conf[prop]=p.left;if(c.wrap=='loop'&&c.lastIndex==0&&c.index==last){w[prop](z.position().left+z[dimp]());w.animate(conf,c.speed,c.easing)}else if(c.wrap=='loop'&&c.lastIndex==last&&c.index==0){conf[prop]=z.position().left+z[dimp]();w.animate(conf,c.speed,c.easing,function(){w[prop](0)})}else{w.animate(conf,c.speed,c.easing)}},crossfade:function(l,c){l.each(function(i,a,b){a=(i>=c.index&&i<c.index+c.windowSize);b=(c.lastIndex==null)||(i>=c.lastIndex&&i<c.lastIndex+c.windowSize);if(a&&!b){$(this).stop().hide().fadeIn(c.speed)}else if(!a&&c.lastIndex==null){$(this).stop().hide()}else if(!a&&b){$(this).stop().show().fadeOut(c.speed)}})},accordion:function(l,c){var d,ap=(c.aspect=='vertical')?'height':'width';l.each(function(i,a,b){a=(i>=c.index&&i<c.index+c.windowSize);b=(c.lastIndex==null)||(i>=c.lastIndex&&i<c.lastIndex+c.windowSize);d={};if(a&&!b){d[ap]='show';$(this).stop().animate(d,c.speed,c.easing,function(){this.style[ap]=''})}else if(!a&&c.lastIndex==null){$(this).stop().hide()}else if(!a&&b){d[ap]='hide';$(this).stop().animate(d,c.speed,c.easing,function(){this.style[ap]=''})}})}},wrap:{none:function(i,l,c){return Math.max(Math.min(i,max(l,c)),0)},start:function(i,l,c){var m=max(l,c);if(i<0){return(c.index==0)?m:0}if(i>m){return m}return i},end:function(i,l,c){var m=max(l,c);if(i<0){return 0}if(i>m){return(c.index==m)?0:m}return i},both:function(i,l,c){var m=max(l,c);if(i<0){return(c.index==0)?m:0}if(i>m){return(c.index==m)?0:m}return i},random:function(i,l,c){return Math.floor(Math.random()*l.length)},loop:function(i,l,c){return((l.length+i)%l.length)}},aspectDefaults:{none:'vertical',carousel:'horizontal',crossfade:'horizontal',accordion:'vertical'}};function detectAspect(a){var b,i2=a.eq(1);p1=a.eq(0).offset(),p2=i2.offset();if(p2&&i2.is(':visible')){return(Math.abs(p2.top-p1.top)<=Math.abs(p2.left-p1.left))?'horizontal':'vertical'}return false}function max(l,c){return(c.overflow=='visible')?Math.floor(l.length/c.stepSize)*c.stepSize:l.length-c.windowSize}function setPos(c,a,b){var d=c.block;var e=c.list;c.lastIndex=c.index;c.index=$.listscroller.wrap[c.wrap||'none'](a,e,c);e.addClass(c.hideClass).removeClass(c.cursorItemClass).removeClass(c.currentItemClass).slice(c.index,c.index+c.windowSize).addClass(c.currentItemClass).removeClass(c.hideClass).eq(0).addClass(c.cursorItemClass);if($.isFunction(c.moveCallback)){c.moveCallback.call(d,e,c)}if($.isFunction(c.animation)){c.animation.call(d,e,c)}else{$.listscroller.animate[c.animation||'none'].call(d,e,c)}d.removeClass(c.topClass).removeClass(c.bottomClass);if(c.index==0){d.addClass(c.topClass)}if(c.index==e.length-c.windowSize){d.addClass(c.bottomClass)}if(!b){d.addClass(c.classPrefix+'-changed');setTimeout(function(){d.removeClass(c.classPrefix+'-changed')},c.speed||1)}var f=Math.ceil(c.index/c.stepSize);if(c.jumps){c.jumps.removeClass(c.currentPageClass).eq(f).addClass(c.currentPageClass)}c.status&&c.status.text(f+1);c.pager&&c.pager.val(f+1)}function movePrev(e){var c=e.data;setPos(c,c.index-c.stepSize);return false}function moveNext(e){var c=e.data;setPos(c,c.index+c.stepSize);return false}function movePage(e){var c=e.data,p=(parseInt($(this).text(),10)-1)||0;setPos(c,p*c.stepSize);return false}function inputChange(e){var c=e.data,p=(parseInt($(this).val(),10)-1)||0;setPos(c,p*c.stepSize);return false}function buildControls(c){var n=$(c.nextBtnTemplate),p=$(c.prevBtnTemplate),j,status;n.find('a').andSelf().eq(0).bind('click',c,moveNext).attr('title',c.titleNext).text(c.labelNext);p.find('a').andSelf().eq(0).bind('click',c,movePrev).attr('title',c.titlePrev).text(c.labelPrev);if(c.paging){var b=[],page=Math.ceil(c.index/c.stepSize),l=Math.ceil(c.list.length/c.stepSize);if(c.statusPager||c.inputPager){status=$(c.statusTempl);$(c.statusLabelTempl).html(c.statusLabel).appendTo(status);var d=$(c.statusWrapTempl).appendTo(status);$(c.statusTotalTempl).html(c.ofTotalSeparator+l).appendTo(d);if(c.inputPager){c.pager=$(c.inputPagerTempl).prependTo(d).val(page+1).bind('change',c,inputChange)}else{c.status=$(c.statusCurrTempl).prependTo(d)}}if(c.jumpPager){j=$(c.jumpTemplate);if(c.jumpLabelTemplate){$(c.jumpLabelTemplate).text(c.jumpLabel).appendTo(j)}for(var i=0;i<l;i++){var e=$(c.jumpBtnTemplate),a=e.find('a').andSelf().eq(0).text(i+1).bind('click',c,movePage);if(c.index==i){a.addClass(c.currentPageClass)}b.push(a[0])}c.jumps=$(b);$(c.jumpWrapTemplate||[]).append(c.jumps).appendTo(j)}}return $(c.pagingTemplate).deepest().append(n,p,j).end().prepend(status)}function initScroller(c,a,b){if(a.hasClass(c.classPrefix+'-active')){return false}c.list=b;c.block=a;var d,_inner,_outer;if(b.eq(0).is('li')){_inner=b.parent()}else{_inner=b.wrapAll('<div />').parent()}_outer=_inner.wrap('<div />').parent();_inner.addClass(c.classPrefix+'-clip');_outer.addClass(c.classPrefix+'-wrapper');a.addClass(c.classPrefix+'-active');_inner.add(_outer).css('position','relative');_outer.addClass(c.classPrefix+'-'+c.aspect);if(c.wrap=='loop'){c.flipover=b.slice(0,c.windowSize).clone(true);b.parent().append(c.flipover)}if(c.controls!=='none'&&b.length>0){if(/^(above|both)$/.test(c.controls)){_outer.before(buildControls(c).addClass(c.pagingTopClass))}if(/^(below|both)$/.test(c.controls)){_outer.after(buildControls(c).addClass(c.pagingBottomClass))}}if(c.aspect=='auto'){c.aspect=detectAspect(b)||$.listscroller.aspectDefaults[c.animation]||'horizontal'}_outer.addClass(c.classPrefix+'-'+c.aspect);if(c.startPos=='random'){c.startPos=Math.floor(b.length*Math.random())}setPos(c,c.startPos||0,true);if(c.autoScrollDelay){function nexttrigger(e){setPos(c,c.index+c.stepSize)}scrollInterval=setInterval(nexttrigger,c.autoScrollDelay);a.bind('mouseenter',function(){clearInterval(scrollInterval)}).bind('mouseleave',function(){scrollInterval=setInterval(nexttrigger,c.autoScrollDelay)})}}$.fn.listscroller=function(a){var c=$.listscroller.defaultConfig;if((a&&a.item)||c.item){this.each(function(){var b=$(this),_lang=b.closest('[lang]').attr('lang')||'',i18n=$.listscroller.i18n,txts=i18n[_lang.toLowerCase()]||i18n[_lang.substr(0,2)]||i18n.en,cfg=$.extend({},c,txts,a);initScroller(cfg,b,typeof cfg.item=='string'?b.find(cfg.item):cfg.item)})}else if(this.length){this.eq(0).parent().listscroller($.extend({},a,{item:this}))}return this}})(jQuery);
