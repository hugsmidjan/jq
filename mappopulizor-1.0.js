// encoding: utf-8
(function(a){var h=function(c,d){if(d){var e=(typeof c=='string'&&c.indexOf('<')==-1)?a(c,d):a(c);if(!e.closest('html').length){e.appendTo(d)}return e}return a(c)};a.mapPopulizor={defaults:{mapElm:'<div class="map" />',listCont:'<ul class="itemlist" />',closeBtn:'<a href="#" title="Loka" class="closebtn">x</a>',activeClass:'maplist-active',mappoints:{},getXY:function(c){var d=this.getLinkUrl(c),e=d&&d.replace(/^.*\/(\d+)(\/|$)/,'$1');return this.mappoints[e]||{x:0,y:0}},markerTempl:'<a href="#" class="marker"><span /><i><b>%{label}</b></i></a>',buildMarker:function(c){return a(a.inject(this.markerTempl,{label:this.getLabel(c)}))},itemTempl:'<li><a href="%{url}">%{label}</a></li>',buildItem:function(c){var d={url:this.getLinkUrl(c)||'#',label:this.getLabel(c)};return a(a.inject(this.itemTempl,d))},labelSelector:'h3',getLabel:function(c){return a.trim(a(c).find(this.labelSelector).text())},linkSelector:'h3 > a, span.more a',getLinkUrl:function(c){return a(c).find(this.linkSelector).attr('href')},itemselector:'div.item',markerActiveClass:'marker-active',liActiveClass:'marker-active',x_flip:1000,markerFlipClass:'marker-flip',bubbleFlipClass:'bubble-flip',dotOffset:[0,0]}};a.fn.mapPopulizor=function(b){b=a.extend({},a.mapPopulizor.defaults,b);this.addClass(b.activeClass).each(function(){var i=a(this),j=h(b.mapElm,i),l=h(b.listCont,i);a(b.itemselector,i).hide().each(function(){var d=a(this),e=b.buildItem(d).appendTo(l),f=b.buildMarker(d),k=h(b.closeBtn),g=b.getXY(d);if(g){a([f[0],d.find('h3')[0],e.find('a')[0],k[0]]).bind('click',function(c){if(d.is(':visible')){d.stop().fadeOut(function(){a(this).css('opacity','');e.removeClass(b.liActiveClass)});f.removeClass(b.markerActiveClass)}else{d.stop().fadeIn(function(){a(this).css('opacity','');f.addClass(b.markerActiveClass)});e.addClass(b.liActiveClass)}return false});f.css({left:g.x+b.dotOffset[0],top:g.y+b.dotOffset[1]}).bind('mouseenter mouseleave',function(c){a('i',this).stop()[c.type=='mouseenter'?'fadeIn':'fadeOut'](function(){a(this).css('opacity','')})});if(g.x>=b.x_flip){d.addClass(b.bubbleFlipClass);f.addClass(b.markerFlipClass)}d.css({left:g.x+b.dotOffset[0],top:g.y+b.dotOffset[1]}).hide().append(k);j.append(d);j.prepend(f)}})});return this}})(jQuery);
