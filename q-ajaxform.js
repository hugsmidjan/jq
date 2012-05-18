// encoding: utf-8
// $.fn.ajaxForm 1.0  -- (c) 2010 Hugsmiðjan ehf.
(function(a){a.fn.ajaxForm=function(c){c=a.extend({afterSubmit:function(){}},c);this.submit(function(e){if(!e.isDefaultPrevented()){var b=a(this);a.get(b.attr('action'),b.serialize(),function(f){var d=a(f).find('.pgmain .boxbody:first');if(b.is('.boxbody')){b.html(d.html())}else{b.find('.boxbody').html(d.html())}b.addClass('submitted');if(a.isFunction(c.afterSubmit)){c.afterSubmit}});return false}});return this}})(jQuery);
