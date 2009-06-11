// encoding: utf-8
(function($){var f=function(a,b){if(b){var c=(typeof a=='string'&&a.indexOf('<')==-1)?$(a,b):$(a);if(!c.closest('html').length){c.appendTo(b)}return c}return $(a)};$.mapPopulizor={defaults:{mapElm:'<div class="map" />',listCont:'<ul class="itemlist" />',closeBtn:'<a href="#" title="Loka" class="closebtn">x</a>',activeClass:'maplist-active',mappoints:{},getXY:function(a){var b=this.getLinkUrl(a),itemId=b&&b.replace(/^.*\/(\d+)(\/|$)/,'$1');return this.mappoints[itemId]||{x:0,y:0}},markerTempl:'<a href="#" class="marker"><span /><i><b>%{label}</b></i></a>',buildMarker:function(a){return $($.inject(this.markerTempl,{label:this.getLabel(a)}))},itemTempl:'<li><a href="%{url}">%{label}</a></li>',buildItem:function(a){var b={url:this.getLinkUrl(a)||'#',label:this.getLabel(a)};return $($.inject(this.itemTempl,b))},labelSelector:'h3',getLabel:function(a){return $.trim($(a).find(this.labelSelector).text())},linkSelector:'h3 > a, span.more a',getLinkUrl:function(a){return $(a).find(this.linkSelector).attr('href')},itemselector:'div.item',markerActiveClass:'marker-active',liActiveClass:'marker-active',x_flip:1000,markerFlipClass:'marker-flip',bubbleFlipClass:'bubble-flip',dotOffset:[0,0],fadeSpeed:[400,400]}};$.fn.mapPopulizor=function(d){d=$.extend({},$.mapPopulizor.defaults,d);this.addClass(d.activeClass).each(function(){var b=$(this),map=f(d.mapElm,b),listCont=f(d.listCont,b);$(d.itemselector,b).hide().each(function(){var a=$(this),listItem=d.buildItem(a).appendTo(listCont),marker=d.buildMarker(a),close=f(d.closeBtn),c=d.getXY(a);if(c){$([marker[0],a.find('h3')[0],listItem.find('a')[0],close[0]]).bind('click',function(e){if(a.is(':visible')){a.stop().fadeOut(d.fadeSpeed[1],function(){$(this).css('opacity','');listItem.removeClass(d.liActiveClass)});marker.removeClass(d.markerActiveClass)}else{a.stop().fadeIn(d.fadeSpeed[0],function(){$(this).css('opacity','');marker.addClass(d.markerActiveClass)});listItem.addClass(d.liActiveClass)}return false});marker.css({left:c.x+d.dotOffset[0],top:c.y+d.dotOffset[1]}).find('i').hide().end().bind('mouseenter mouseleave',function(e){$('i',this).stop()[e.type=='mouseenter'?'fadeIn':'fadeOut'](e.type=='mouseenter'?d.fadeSpeed[0]:d.fadeSpeed[1],function(){$(this).css('opacity','')})});if(c.x>=d.x_flip){a.addClass(d.bubbleFlipClass);marker.addClass(d.markerFlipClass)}a.css({left:c.x+d.dotOffset[0],top:c.y+d.dotOffset[1]}).hide().append(close);map.append(a);map.prepend(marker)}})});return this}})(jQuery);
