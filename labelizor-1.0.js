(function(d){d.fn.labelizor=function(b,m){var i=b&&b.charAt?b:'';b=d.extend({blurClass:m||'labelized',hideClass:i||'stream'},!i&&b);var j=b.hideClass,g=b.blurClass,f=b.labelFilter;return this.each(function(){var a=this,e=d(a);if(a.id||a.title&&e.is(':text, textarea')){var c=b.labelText,h=(c||j)&&e.parents('form:first').add(e.parents(':last')).find('label[for="'+a.id+'"]:first').addClass(j),k=function(l){if(a.value==c){a.value='';e.removeClass(g)}};if(!c){c=!f?h.text():d.isFunction(f)?f(h):d(f,h).text();c=d.trim((c||a.title).replace(b.lRe||/(\*|:[\W\S]*$)/g,b.lPlace||''))}e.attr('title',c).bind('focus',function(l){k()}).bind('blur',function(l){if(!a.value){a.value=c;e.addClass(g)}});if(!a.getAttribute('value')){a.value=c;e.addClass(g)}d(a.form).bind('submit',k)}})}})(jQuery);
