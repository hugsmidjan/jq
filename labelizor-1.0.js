(function(b){b.fn.labelizor=function(c,l){var h=c&&c.charAt?c:'';c=b.extend({blurClass:l||'labelized',hideClass:h||'stream'},!h&&c);var i=c.hideClass,f=c.blurClass,e=c.labelFilter;return this.each(function(){var a=this;if(a.id||a.title&&b(a).is(':text, textarea')){var d=c.labelText,g=(d||i)&&b('label[for='+a.id+']').addClass(i),j=function(k){if(a.value==d){a.value='';b(a).removeClass(f)}};if(!d){d=!e?g.text():b.isFunction(e)?e(g):b(e,g).text();d=b.trim((d||a.title).replace(c.lRe||/(\*|:[\W\S]*$)/g,c.lPlace||''))}b(a).attr('title',d).bind('focus',function(k){j()}).bind('blur',function(k){if(!a.value){a.value=d;b(a).addClass(f)}});if(!a.getAttribute('value')){a.value=d;b(a).addClass(f)}b(a.form).bind('submit',j)}})}})(jQuery);
