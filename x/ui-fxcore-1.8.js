;jQuery.effects||(function(e,p){e.effects={};var m=['add','remove','toggle'],q={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};function n(){var a=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,d={},f,g;if(a&&a.length&&a[0]&&a[a[0]]){var h=a.length;while(h--){f=a[h];if(typeof a[f]=='string'){g=f.replace(/\-(\w)/g,function(c,b){return b.toUpperCase()});d[g]=a[f]}}}else{for(f in a){if(typeof a[f]==='string'){d[f]=a[f]}}}return d}function o(c){var b,a;for(b in c){a=c[b];if(a==null||e.isFunction(a)||b in q||(/scrollbar/).test(b)||(!(/color/i).test(b)&&isNaN(parseFloat(a)))){delete c[b]}}return c}function r(c,b){var a={_:0},d;for(d in b){if(c[d]!=b[d]){a[d]=b[d]}}return a}e.effects.animateClass=function(i,s,j,l){if(e.isFunction(j)){l=j;j=null}return this.each(function(){var a=e(this),d=a.attr('style')||' ',f=o(n.call(this)),g,h=a.attr('className');e.each(m,function(c,b){if(i[b]){a[b+'Class'](i[b])}});g=o(n.call(this));a.attr('className',h);a.animate(r(f,g),s,j,function(){e.each(m,function(c,b){if(i[b]){a[b+'Class'](i[b])}});if(typeof a.attr('style')=='object'){a.attr('style').cssText='';a.attr('style').cssText=d}else{a.attr('style',d)}if(l){l.apply(this,arguments)}})})};e.fn.extend({_0:e.fn.addClass,addClass:function(c,b,a,d){return b?e.effects.animateClass.apply(this,[{add:c},b,a,d]):this._0(c)},_1:e.fn.removeClass,removeClass:function(c,b,a,d){return b?e.effects.animateClass.apply(this,[{remove:c},b,a,d]):this._1(c)},_2:e.fn.toggleClass,toggleClass:function(c,b,a,d,f){if(typeof b=="boolean"||b===p){if(!a){return this._2(c,b)}else{return e.effects.animateClass.apply(this,[(b?{add:c}:{remove:c}),a,d,f])}}else{return e.effects.animateClass.apply(this,[{toggle:c},b,a,d])}},switchClass:function(c,b,a,d,f){return e.effects.animateClass.apply(this,[{add:b,remove:c},a,d,f])}});e.extend(e.effects,{version:"1.8.5",save:function(c,b){for(var a=0;a<b.length;a++){if(b[a]!==null){c.data("ec.storage."+b[a],c[0].style[b[a]])}}},restore:function(c,b){for(var a=0;a<b.length;a++){if(b[a]!==null){c.css(b[a],c.data("ec.storage."+b[a]))}}},setMode:function(c,b){if(b=='toggle'){b=c.is(':hidden')?'show':'hide'}return b},getBaseline:function(c,b){var a,d;switch(c[0]){case'top':a=0;break;case'middle':a=0.5;break;case'bottom':a=1;break;default:a=c[0]/b.height};switch(c[1]){case'left':d=0;break;case'center':d=0.5;break;case'right':d=1;break;default:d=c[1]/b.width};return{x:d,y:a}},createWrapper:function(a){if(a.parent().is('.ui-effects-wrapper')){return a.parent()}var d={width:a.outerWidth(true),height:a.outerHeight(true),'float':a.css('float')},f=e('<div></div>').addClass('ui-effects-wrapper').css({fontSize:'100%',background:'transparent',border:'none',margin:0,padding:0});a.wrap(f);f=a.parent();if(a.css('position')=='static'){f.css({position:'relative'});a.css({position:'relative'})}else{e.extend(d,{position:a.css('position'),zIndex:a.css('z-index')});e.each(['top','left','bottom','right'],function(c,b){d[b]=a.css(b);if(isNaN(parseInt(d[b],10))){d[b]='auto'}});a.css({position:'relative',top:0,left:0})}return f.css(d).show()},removeWrapper:function(c){if(c.parent().is('.ui-effects-wrapper')){return c.parent().replaceWith(c)}return c},setTransition:function(a,d,f,g){g=g||{};e.each(d,function(c,b){unit=a.cssUnit(b);if(unit[0]>0){g[b]=unit[0]*f+unit[1]}});return g}});function k(c,b,a,d){if(typeof c=='object'){d=b;a=null;b=c;c=b.effect}if(e.isFunction(b)){d=b;a=null;b={}}if(typeof b=='number'||e.fx.speeds[b]){d=a;a=b;b={}}if(e.isFunction(a)){d=a;a=null}b=b||{};a=a||b.duration;a=e.fx.off?0:typeof a=='number'?a:e.fx.speeds[a]||e.fx.speeds._5;d=d||b.complete;return[c,b,a,d]}e.fn.extend({effect:function(c,b,a,d){var f=k.apply(this,arguments),g={options:f[1],duration:f[2],callback:f[3]},h=e.effects[c];return h&&!e.fx.off?h.call(this,g):this},_3:e.fn.show,show:function(c){if(!c||typeof c=='number'||e.fx.speeds[c]||!e.effects[c]){return this._3.apply(this,arguments)}else{var b=k.apply(this,arguments);b[1].mode='show';return this.effect.apply(this,b)}},_4:e.fn.hide,hide:function(c){if(!c||typeof c=='number'||e.fx.speeds[c]||!e.effects[c]){return this._4.apply(this,arguments)}else{var b=k.apply(this,arguments);b[1].mode='hide';return this.effect.apply(this,b)}},__toggle:e.fn.toggle,toggle:function(c){if(!c||typeof c=='number'||e.fx.speeds[c]||!e.effects[c]||typeof c=='boolean'||e.isFunction(c)){return this.__toggle.apply(this,arguments)}else{var b=k.apply(this,arguments);b[1].mode='toggle';return this.effect.apply(this,b)}},cssUnit:function(a){var d=this.css(a),f=[];e.each(['em','px','%','pt'],function(c,b){if(d.indexOf(b)>0){f=[parseFloat(d),b]}});return f}})})(jQuery);