// $.fn.ajaxForm 1.0  -- (c) 2010 Hugsmiðjan ehf.
(function(b){b.fn.ajaxForm=function(){return this.submit(function(d){if(!d.isDefaultPrevented()){var a=b(this);a.trigger('beforeSubmit');b.get(a.attr('action'),a.serialize(),function(e){var c=b(e).find('.pgmain .boxbody:first');if(a.find('.boxbody').length){a.find('.boxbody').html(c.html())}else{a.html(c.html())}a.addClass('submitted').trigger('afterSubmit')});return false}})}})(jQuery);
