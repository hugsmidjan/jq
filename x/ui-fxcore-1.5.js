;(function($){$.effects=$.effects||{};$.extend($.effects,{save:function(a,b){for(var i=0;i<b.length;i++){if(b[i]!==null)$.data(a[0],"ec.storage."+b[i],a[0].style[b[i]])}},restore:function(a,b){for(var i=0;i<b.length;i++){if(b[i]!==null)a.css(b[i],$.data(a[0],"ec.storage."+b[i]))}},setMode:function(a,b){if(b=='toggle')b=a.is(':hidden')?'show':'hide';return b},getBaseline:function(a,b){var y,x;switch(a[0]){case'top':y=0;break;case'middle':y=0.5;break;case'bottom':y=1;break;default:y=a[0]/b.height};switch(a[1]){case'left':x=0;break;case'center':x=0.5;break;case'right':x=1;break;default:x=a[1]/b.width};return{x:x,y:y}},createWrapper:function(a){if(a.parent().attr('id')=='fxWrapper')return a;var b={width:a.outerWidth({margin:true}),height:a.outerHeight({margin:true}),'float':a.css('float')};a.wrap('<div id="fxWrapper" style="font-size:100%;background:transparent;border:none;margin:0;padding:0"></div>');var c=a.parent();if(a.css('position')=='static'){c.css({position:'relative'});a.css({position:'relative'})}else{var d=a.css('top');if(isNaN(parseInt(d)))d='auto';var e=a.css('left');if(isNaN(parseInt(e)))e='auto';c.css({position:a.css('position'),top:d,left:e,zIndex:a.css('z-index')}).show();a.css({position:'relative',top:0,left:0})}c.css(b);return c},removeWrapper:function(a){if(a.parent().attr('id')=='fxWrapper')return a.parent().replaceWith(a);return a},setTransition:function(a,b,c,d){d=d||{};$.each(b,function(i,x){unit=a.cssUnit(x);if(unit[0]>0)d[x]=unit[0]*c+unit[1]});return d},animateClass:function(f,g,h,i){var j=(typeof h=="function"?h:(i?i:null));var k=(typeof h=="object"?h:null);return this.each(function(){var a={};var b=$(this);var c=b.attr("style")||'';if(typeof c=='object')c=c["cssText"];if(f.toggle){b.hasClass(f.toggle)?f.remove=f.toggle:f.add=f.toggle}var d=$.extend({},(document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle));if(f.add)b.addClass(f.add);if(f.remove)b.removeClass(f.remove);var e=$.extend({},(document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle));if(f.add)b.removeClass(f.add);if(f.remove)b.addClass(f.remove);for(var n in e){if(typeof e[n]!="function"&&e[n]&&n.indexOf("Moz")==-1&&n.indexOf("length")==-1&&e[n]!=d[n]&&(n.match(/color/i)||(!n.match(/color/i)&&!isNaN(parseInt(e[n],10))))&&(d.position!="static"||(d.position=="static"&&!n.match(/left|top|bottom|right/))))a[n]=e[n]}b.animate(a,g,k,function(){if(typeof $(this).attr("style")=='object'){$(this).attr("style")["cssText"]="";$(this).attr("style")["cssText"]=c}else $(this).attr("style",c);if(f.add)$(this).addClass(f.add);if(f.remove)$(this).removeClass(f.remove);if(j)j.apply(this,arguments)})})}});$.fn.extend({_4:$.fn.show,_3:$.fn.hide,__toggle:$.fn.toggle,_2:$.fn.addClass,_1:$.fn.removeClass,_0:$.fn.toggleClass,effect:function(a,o,b,c){return $.effects[a]?$.effects[a].call(this,{method:a,options:o||{},duration:b,callback:c}):null},show:function(){if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0])))return this._4.apply(this,arguments);else{var o=arguments[1]||{};o['mode']='show';return this.effect.apply(this,[arguments[0],o,arguments[2]||o.duration,arguments[3]||o.callback])}},hide:function(){if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0])))return this._3.apply(this,arguments);else{var o=arguments[1]||{};o['mode']='hide';return this.effect.apply(this,[arguments[0],o,arguments[2]||o.duration,arguments[3]||o.callback])}},toggle:function(){if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0]))||(arguments[0].constructor==Function))return this.__toggle.apply(this,arguments);else{var o=arguments[1]||{};o['mode']='toggle';return this.effect.apply(this,[arguments[0],o,arguments[2]||o.duration,arguments[3]||o.callback])}},addClass:function(a,b,c,d){return b?$.effects.animateClass.apply(this,[{add:a},b,c,d]):this._2(a)},removeClass:function(a,b,c,d){return b?$.effects.animateClass.apply(this,[{remove:a},b,c,d]):this._1(a)},toggleClass:function(a,b,c,d){return b?$.effects.animateClass.apply(this,[{toggle:a},b,c,d]):this._0(a)},morph:function(a,b,c,d,e){return $.effects.animateClass.apply(this,[{add:b,remove:a},c,d,e])},switchClass:function(){return this.morph.apply(this,arguments)},cssUnit:function(b){var c=this.css(b),val=[];$.each(['em','px','%','pt'],function(i,a){if(c.indexOf(a)>0)val=[parseFloat(c),a]});return val}})})(jQuery);