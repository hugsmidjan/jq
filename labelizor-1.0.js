// encoding: utf-8
// $.fn.labelizor 1.0  -- (c) 2009 Hugsmiðjan ehf. 
(function(e){e.fn.labelizor=function(a,n){var k=a&&a.charAt?a:'';a=e.extend({useLabel:true,blurClass:n||'labelized',hideClass:k||'stream'},!k&&a);var l=a.hideClass,j=a.blurClass,f=a.labelFilter,g=a.useLabel;return this.each(function(){var c=this,d=e(c);if((c.id||c.title)&&d.is(':text, :password, textarea')){var b=a.labelText,h=c.title,i=!g&&b&&!l?e([]):e(d.parents('form:first, :last').eq(0).find('label[for="'+c.id+'"]:first')),m=function(o){if(d.val()==b){d.val('').removeClass(j)}};if(!b){b=!g||!f?(a.preferTitle&&h)||(g&&i.text())||h:e.isFunction(f)?f(i,d):i.find(f).text();b=e.trim(b.replace(a.lRe||/(\*|:[\W\S]*$)/g,a.lPlace||''))}if(!a.condHide||(g&&(a.preferTitle&&b!=h)&&!a.labelText)){i.addClass(l)}d.attr('title',h||b).bind('focus',m).bind('blur',function(o){if(!d.val()){d.val(b).addClass(j)}});if(b&&!c.getAttribute('value')&&(!c.value||c.value==b)){d.val(b).addClass(j)}e(c.form).bind('submit',m)}})}})(jQuery);
