// $.fn.autoFillup 1.0  -- (c) 2012 Hugsmiðjan ehf.
(function(b){b.fn.autoFillup=function(){var d=b.browser;if(!d.msie&&!d.opera){var i=this.find('form').andSelf().filter('form'),e=i.find('input').not(':submit,:button,:reset,:checkbox,:radio,[type="hidden"]').filter(function(){return!this.value}),f='';e.each(function(g,a){f+='<input name="'+a.name+'" type="'+a.type+'"/>'});var h=jQuery('<iframe style="width:0;height:0;position:fixed;visibility:hidden;"/>').appendTo('body'),c=h.contents()[0];c.write('<form>'+f+'</form>');c.close();setTimeout(function(){b(c).find('input').each(function(g){var a=e[g];a.value||(a.value=this.value)});h.remove()},100)}return this}})(jQuery);
