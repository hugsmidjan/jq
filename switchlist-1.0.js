(function($){var g={items:'div.item',contClass:'switchlist-active',activeClass:'active',listClass:'newsheadlinelist itemlist',inclmeta:true,incltitle:true,topwrap:false,bottomwrap:false,switchdelay:350,fadeoutspeed:125,fadeoutease:'',fadeinspeed:400,fadeinease:''};$.fn.switchlist=function(d){if(d){_config=$.extend({},g,d)}this.addClass(_config.contClass);var f=this.find(_config.items),_visibleIndex=0,_switchHlTimeout,_headlinelist=$('<ul class="'+_config.listClass+'" />'),_headlines;f.slice(1).hide().end().each(function(i){var c=$(this),_newsheadline=$('<li>').addClass(this.className.replace(/(^| )((item|itm\d*|firstitem)( |$))+/g,'$1')).addClass(i===0?_config.activeClass:'').append(_config.topwrap?'<i class="top" />':'').append(_config.inclmeta?c.find('span.meta').clone():'').append(_config.incltitle?c.find('h3 > a').clone():'').append(_config.bottomwrap?'<i class="bottom" />':'').bind('mouseenter',function(e){var b=this;if(!_headlinelist.queue().length&&_visibleIndex!=b.listIndex){_switchHlTimeout=setTimeout(function(){var a=_visibleIndex;_visibleIndex=b.listIndex;_headlinelist.queue(function(){f.eq(a).fadeOut(_config.fadeoutspeed,_config.fadeoutease).queue(function(){_headlinelist.dequeue();$(this).dequeue()})}).queue(function(){_headlines.eq(a).removeClass(_config.activeClass);$(b).addClass(_config.activeClass);_headlinelist.dequeue();f.eq(b.listIndex).fadeIn(_config.fadeinspeed,function(){if($.browser.msie&&$.browser.version<8){this.style.removeAttribute('filter')}},_config.fadeinease)})},_config.switchdelay)}}).bind('mouseleave',function(e){clearTimeout(_switchHlTimeout);_switchHlTimeout=null}).appendTo(_headlinelist);_newsheadline[0].listIndex=i});_headlinelist.prependTo(this);_headlines=_headlinelist.find('li');return this}})(jQuery);
