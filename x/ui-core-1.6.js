;(function($){var j=$.fn.remove;$.fn.remove=function(){$("*",this).add(this).triggerHandler("remove");return j.apply(this,arguments)};function isVisible(c){function checkStyles(a){var b=a.style;return(b.display!='none'&&b.visibility!='hidden')}var d=checkStyles(c);(d&&$.each($.dir(c,'parentNode'),function(){return(d=checkStyles(this))}));return d}$.extend($.expr[':'],{data:function(a,i,m){return $.data(a,m[3])},tabbable:function(a,i,m){var b=a.nodeName.toLowerCase();return(a.tabIndex>=0&&(('a'==b&&a.href)||(/input|select|textarea|button/.test(b)&&'hidden'!=a.type&&!a.disabled))&&isVisible(a))}});$.keyCode={BACKSPACE:8,CAPS_LOCK:20,COMMA:188,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38};function getter(c,d,e,f){function getMethods(a){var b=$[c][d][a]||[];return(typeof b=='string'?b.split(/,?\s+/):b)}var g=getMethods('getter');if(f.length==1&&typeof f[0]=='string'){g=g.concat(getMethods('getterSetter'))}return($.inArray(e,g)!=-1)}$.widget=function(g,h){var i=g.split(".")[0];g=g.split(".")[1];$.fn[g]=function(b){var c=(typeof b=='string'),args=Array.prototype.slice.call(arguments,1);if(c&&b.substring(0,1)=='_'){return this}if(c&&getter(i,g,b,args)){var d=$.data(this[0],g);return(d?d[b].apply(d,args):undefined)}return this.each(function(){var a=$.data(this,g);(!a&&!c&&$.data(this,g,new $[i][g](this,b)));(a&&c&&$.isFunction(a[b])&&a[b].apply(a,args))})};$[i][g]=function(c,d){var f=this;this.widgetName=g;this.widgetEventPrefix=$[i][g].eventPrefix||g;this.widgetBaseClass=i+'-'+g;this.options=$.extend({},$.widget.defaults,$[i][g].defaults,$.metadata&&$.metadata.get(c)[g],d);this.element=$(c).bind('setData.'+g,function(e,a,b){return f._setData(a,b)}).bind('getData.'+g,function(e,a){return f._getData(a)}).bind('remove',function(){return f.destroy()});this._init()};$[i][g].prototype=$.extend({},$.widget.prototype,h);$[i][g].getterSetter='option'};$.widget.prototype={_init:function(){},destroy:function(){this.element.removeData(this.widgetName)},option:function(c,d){var e=c,self=this;if(typeof c=="string"){if(d===undefined){return this._getData(c)}e={};e[c]=d}$.each(e,function(a,b){self._setData(a,b)})},_getData:function(a){return this.options[a]},_setData:function(a,b){this.options[a]=b;if(a=='disabled'){this.element[b?'addClass':'removeClass'](this.widgetBaseClass+'-disabled')}},enable:function(){this._setData('disabled',false)},disable:function(){this._setData('disabled',true)},_trigger:function(a,e,b){var c=(a==this.widgetEventPrefix?a:this.widgetEventPrefix+a);e=e||$.event.fix({type:c,target:this.element[0]});return this.element.triggerHandler(c,[e,b],this.options[a])}};$.widget.defaults={disabled:false};$.ui={plugin:{add:function(a,b,c){var d=$.ui[a].prototype;for(var i in c){d.plugins[i]=d.plugins[i]||[];d.plugins[i].push([b,c[i]])}},call:function(a,b,c){var d=a.plugins[b];if(!d){return}for(var i=0;i<d.length;i++){if(a.options[d[i][0]]){d[i][1].apply(a.element,c)}}}},cssCache:{},css:function(a){if($.ui.cssCache[a]){return $.ui.cssCache[a]}var b=$('<div class="ui-gen">').addClass(a).css({position:'absolute',top:'-5000px',left:'-5000px',display:'block'}).appendTo('body');$.ui.cssCache[a]=!!((!(/auto|default/).test(b.css('cursor'))||(/^[1-9]/).test(b.css('height'))||(/^[1-9]/).test(b.css('width'))||!(/none/).test(b.css('backgroundImage'))||!(/transparent|rgba\(0, 0, 0, 0\)/).test(b.css('backgroundColor'))));try{$('body').get(0).removeChild(b.get(0))}catch(e){}return $.ui.cssCache[a]},disableSelection:function(a){return $(a).attr('unselectable','on').css('MozUserSelect','none').bind('selectstart.ui',function(){return false})},enableSelection:function(a){return $(a).attr('unselectable','off').css('MozUserSelect','').unbind('selectstart.ui')},hasScroll:function(e,a){if($(e).css('overflow')=='hidden'){return false}var b=(a&&a=='left')?'scrollLeft':'scrollTop',has=false;if(e[b]>0){return true}e[b]=1;has=(e[b]>0);e[b]=0;return has}};$.ui.mouse={_mouseInit:function(){var a=this;this.element.bind('mousedown.'+this.widgetName,function(e){return a._mouseDown(e)});if($.browser.msie){this._mouseUnselectable=this.element.attr('unselectable');this.element.attr('unselectable','on')}this.started=false},_mouseDestroy:function(){this.element.unbind('.'+this.widgetName);($.browser.msie&&this.element.attr('unselectable',this._mouseUnselectable))},_mouseDown:function(e){(this._mouseStarted&&this._mouseUp(e));this._mouseDownEvent=e;var a=this,btnIsLeft=(e.which==1),elIsCancel=(typeof this.options.cancel=="string"?$(e.target).parents().add(e.target).filter(this.options.cancel).length:false);if(!btnIsLeft||elIsCancel||!this._mouseCapture(e)){return true}this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet){this._mouseDelayTimer=setTimeout(function(){a.mouseDelayMet=true},this.options.delay)}if(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)){this._mouseStarted=(this._mouseStart(e)!==false);if(!this._mouseStarted){e.preventDefault();return true}}this._mouseMoveDelegate=function(e){return a._mouseMove(e)};this._mouseUpDelegate=function(e){return a._mouseUp(e)};$(document).bind('mousemove.'+this.widgetName,this._mouseMoveDelegate).bind('mouseup.'+this.widgetName,this._mouseUpDelegate);return false},_mouseMove:function(e){if($.browser.msie&&!e.button){return this._mouseUp(e)}if(this._mouseStarted){this._mouseDrag(e);return false}if(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)){this._mouseStarted=(this._mouseStart(this._mouseDownEvent,e)!==false);(this._mouseStarted?this._mouseDrag(e):this._mouseUp(e))}return!this._mouseStarted},_mouseUp:function(e){$(document).unbind('mousemove.'+this.widgetName,this._mouseMoveDelegate).unbind('mouseup.'+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;this._mouseStop(e)}return false},_mouseDistanceMet:function(e){return(Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance)},_mouseDelayMet:function(e){return this.mouseDelayMet},_mouseStart:function(e){},_mouseDrag:function(e){},_mouseStop:function(e){},_mouseCapture:function(e){return true}};$.ui.mouse.defaults={cancel:null,distance:1,delay:0}})(jQuery);