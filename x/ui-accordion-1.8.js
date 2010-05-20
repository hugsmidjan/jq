(function(e){e.widget("ui.accordion",{options:{active:0,animated:'slide',autoHeight:true,clearStyle:false,collapsible:false,event:"click",fillSpace:false,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:false,navigationFilter:function(){return this.href.toLowerCase()==location.href.toLowerCase()}},_create:function(){var a=this.options,c=this;this.running=0;this.element.addClass("ui-accordion ui-widget ui-helper-reset");if(this.element[0].nodeName=="UL"){this.element.children("li").addClass("ui-accordion-li-fix")}this.headers=this.element.find(a.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){e(this).addClass('ui-state-hover')}).bind("mouseleave.accordion",function(){e(this).removeClass('ui-state-hover')}).bind("focus.accordion",function(){e(this).addClass('ui-state-focus')}).bind("blur.accordion",function(){e(this).removeClass('ui-state-focus')});this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");if(a.navigation){var d=this.element.find("a").filter(a.navigationFilter);if(d.length){var i=d.closest(".ui-accordion-header");if(i.length){this.active=i}else{this.active=d.closest(".ui-accordion-content").prev()}}}this.active=this._findActive(this.active||a.active).toggleClass("ui-state-default").toggleClass("ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");this.active.next().addClass('ui-accordion-content-active');this._createIcons();this.resize();this.element.attr('role','tablist');this.headers.attr('role','tab').bind('keydown',function(b){return c._keydown(b)}).next().attr('role','tabpanel');this.headers.not(this.active||"").attr('aria-expanded','false').attr("tabIndex","-1").next().hide();if(!this.active.length){this.headers.eq(0).attr('tabIndex','0')}else{this.active.attr('aria-expanded','true').attr('tabIndex','0')}if(!e.browser.safari)this.headers.find('a').attr('tabIndex','-1');if(a.event){this.headers.bind((a.event)+".accordion",function(b){c._clickHandler.call(c,b,this);b.preventDefault()})}},_createIcons:function(){var b=this.options;if(b.icons){e("<span/>").addClass("ui-icon "+b.icons.header).prependTo(this.headers);this.active.find(".ui-icon").toggleClass(b.icons.header).toggleClass(b.icons.headerSelected);this.element.addClass("ui-accordion-icons")}},_destroyIcons:function(){this.headers.children(".ui-icon").remove();this.element.removeClass("ui-accordion-icons")},destroy:function(){var b=this.options;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role").unbind('.accordion').removeData('accordion');this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("tabIndex");this.headers.find("a").removeAttr("tabIndex");this._destroyIcons();var a=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active");if(b.autoHeight||b.fillHeight){a.css("height","")}return this},_setOption:function(b,a){e.Widget.prototype._setOption.apply(this,arguments);if(b=="active"){this.activate(a)}if(b=="icons"){this._destroyIcons();if(a){this._createIcons()}}},_keydown:function(b){var a=this.options,c=e.ui.keyCode;if(a.disabled||b.altKey||b.ctrlKey)return;var d=this.headers.length;var i=this.headers.index(b.target);var g=false;switch(b.keyCode){case c.RIGHT:case c.DOWN:g=this.headers[(i+1)%d];break;case c.LEFT:case c.UP:g=this.headers[(i-1+d)%d];break;case c.SPACE:case c.ENTER:this._clickHandler({target:b.target},b.target);b.preventDefault()}if(g){e(b.target).attr('tabIndex','-1');e(g).attr('tabIndex','0');g.focus();return false}return true},resize:function(){var b=this.options,a;if(b.fillSpace){if(e.browser.msie){var c=this.element.parent().css('overflow');this.element.parent().css('overflow','hidden')}a=this.element.parent().height();if(e.browser.msie){this.element.parent().css('overflow',c)}this.headers.each(function(){a-=e(this).outerHeight(true)});this.headers.next().each(function(){e(this).height(Math.max(0,a-e(this).innerHeight()+e(this).height()))}).css('overflow','auto')}else if(b.autoHeight){a=0;this.headers.next().each(function(){a=Math.max(a,e(this).height())}).height(a)}return this},activate:function(b){this.options.active=b;var a=this._findActive(b)[0];this._clickHandler({target:a},a);return this},_findActive:function(b){return b?typeof b=="number"?this.headers.filter(":eq("+b+")"):this.headers.not(this.headers.not(b)):b===false?e([]):this.headers.filter(":eq(0)")},_clickHandler:function(b,a){var c=this.options;if(c.disabled)return;if(!b.target){if(!c.collapsible)return;this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").find(".ui-icon").removeClass(c.icons.headerSelected).addClass(c.icons.header);this.active.next().addClass('ui-accordion-content-active');var d=this.active.next(),i={options:c,newHeader:e([]),oldHeader:c.active,newContent:e([]),oldContent:d},g=(this.active=e([]));this._toggle(g,d,i);return}var f=e(b.currentTarget||a);var h=f[0]==this.active[0];c.active=c.collapsible&&h?false:e('.ui-accordion-header',this.element).index(f);if(this.running||(!c.collapsible&&h)){return}this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").find(".ui-icon").removeClass(c.icons.headerSelected).addClass(c.icons.header);if(!h){f.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").find(".ui-icon").removeClass(c.icons.header).addClass(c.icons.headerSelected);f.next().addClass('ui-accordion-content-active')}var g=f.next(),d=this.active.next(),i={options:c,newHeader:h&&c.collapsible?e([]):f,oldHeader:this.active,newContent:h&&c.collapsible?e([]):g,oldContent:d},k=this.headers.index(this.active[0])>this.headers.index(f[0]);this.active=h?e([]):f;this._toggle(g,d,i,h,k);return},_toggle:function(a,c,d,i,g){var f=this.options,h=this;this.toShow=a;this.toHide=c;this.data=d;var k=function(){if(!h)return;return h._completed.apply(h,arguments)};this._trigger("changestart",null,this.data);this.running=c.size()===0?a.size():c.size();if(f.animated){var m={};if(f.collapsible&&i){m={toShow:e([]),toHide:c,complete:k,down:g,autoHeight:f.autoHeight||f.fillSpace}}else{m={toShow:a,toHide:c,complete:k,down:g,autoHeight:f.autoHeight||f.fillSpace}}if(!f.proxied){f.proxied=f.animated}if(!f.proxiedDuration){f.proxiedDuration=f.duration}f.animated=e.isFunction(f.proxied)?f.proxied(m):f.proxied;f.duration=e.isFunction(f.proxiedDuration)?f.proxiedDuration(m):f.proxiedDuration;var n=e.ui.accordion.animations,j=f.duration,l=f.animated;if(l&&!n[l]&&!e.easing[l]){l='slide'}if(!n[l]){n[l]=function(b){this.slide(b,{easing:l,duration:j||700})}}n[l](m)}else{if(f.collapsible&&i){a.toggle()}else{c.hide();a.show()}k(true)}c.prev().attr('aria-expanded','false').attr("tabIndex","-1").blur();a.prev().attr('aria-expanded','true').attr("tabIndex","0").focus()},_completed:function(b){var a=this.options;this.running=b?0:--this.running;if(this.running)return;if(a.clearStyle){this.toShow.add(this.toHide).css({height:"",overflow:""})}this.toHide.removeClass("ui-accordion-content-active");this._trigger('change',null,this.data)}});e.extend(e.ui.accordion,{version:"1.8.1",animations:{slide:function(d,i){d=e.extend({easing:"swing",duration:300},d,i);if(!d.toHide.size()){d.toShow.animate({height:"show"},d);return}if(!d.toShow.size()){d.toHide.animate({height:"hide"},d);return}var g=d.toShow.css('overflow'),f=0,h={},k={},m=["height","paddingTop","paddingBottom"],n;var j=d.toShow;n=j[0].style.width;j.width(parseInt(j.parent().width(),10)-parseInt(j.css("paddingLeft"),10)-parseInt(j.css("paddingRight"),10)-(parseInt(j.css("borderLeftWidth"),10)||0)-(parseInt(j.css("borderRightWidth"),10)||0));e.each(m,function(b,a){k[a]='hide';var c=(''+e.css(d.toShow[0],a)).match(/^([\d+-.]+)(.*)$/);h[a]={value:c[1],unit:c[2]||'px'}});d.toShow.css({height:0,overflow:'hidden'}).show();d.toHide.filter(":hidden").each(d.complete).end().filter(":visible").animate(k,{step:function(b,a){if(a.prop=='height'){f=(a.end-a.start===0)?0:(a.now-a.start)/(a.end-a.start)}d.toShow[0].style[a.prop]=(f*h[a.prop].value)+h[a.prop].unit},duration:d.duration,easing:d.easing,complete:function(){if(!d.autoHeight){d.toShow.css("height","")}d.toShow.css("width",n);d.toShow.css({overflow:g});d.complete()}})},bounceslide:function(b){this.slide(b,{easing:b.down?"easeOutBounce":"swing",duration:b.down?1000:200})}}})})(jQuery);