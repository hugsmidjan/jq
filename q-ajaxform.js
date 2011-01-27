// encoding: utf-8
// $.fn.ajaxForm 1.0  -- (c) 2010 Hugsmiðjan ehf.
(function(b){b.fn.ajaxForm=function(f){this.submit(function(d){if(!d.isDefaultPrevented()){var a=b(this);b.get(a.attr('action'),a.serialize(),function(e){var c=b(e).find('.pgmain .boxbody:first');if(a.is('.boxbody')){a.html(c.html())}else{a.find('.boxbody').html(c.html())}a.addClass('submitted')});return false}});return this}})(jQuery);
