// encoding: utf-8
// $.fn.liveSum 1.0  -- (c) 2009 Hugsmiðjan ehf. 
(function(d){d.fn.liveSum=function(a){a=d.extend({instant:1,sumElm:this.slice(-1)},a);var g=this.not(a.sumElm),e=d(a.sumElm);g.bind((a.instant?'keyup ':'')+'change.liveSum',function(h){var b=0;g.each(function(){var f=d(this),c=f[f.is(':input')?'val':'text']();c=a.parseFunc?a.parseFunc(c,f):parseFloat(c);if(!isNaN(c)){b+=c}});b=a.sumFormatFunc?a.sumFormatFunc(b,e):b;e.is(':input')?e.val(b).trigger('change'):e.text(b)}).eq(0).trigger('change.liveSum');return this}})(jQuery);
