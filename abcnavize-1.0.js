// encoding: utf-8
// $.fn.abcnavize 1.0  -- (c) 2009 Hugsmiðjan ehf. 
(function(a){var j=a.fn.abcnavize=function(d){d=a.extend({allBtn:!0},d);return this.each(function(){var k=a(this),g=k.find('tbody tr'),m='index:',h=h||j.texts[k.closest('[lang]').attr('lang')]||j.texts.en,e,n=function(f){var c=a(f.target).closest('a');if(c.is('a:not(.current)')){c.addClass('current');abcNav.find('a').removeClass('current');var b=a.getFrag(c.attr('href'));f.type=='click'&&a.setFrag(b);var i=g.hide().filter(function(){return!b||a(this).data('abcnav-fragm')==b}).show();if(i.length){e&&e.detach();i.removeClass('even').filter(':odd').addClass('even')}else{e=e||a('<tr class="nothingfound"><td colspan="'+g.eq(0).find('td, th').length+'"><strong>'+h.noFoundMsg+'</strong></td></tr>');e.insertBefore(g[0])}}return false},l={};abcNav=a('<div class="abcnav"><span>'+h.abcTitle+'</span> <b /></div>').bind('click',n),abcNavList=abcNav.find('b'),d.allBtn&&abcNavList.append('<a href="#">'+h.abcAll+'</a>');g.each(function(){var f=a(this),c=a.trim(f.text()).charAt(0).toUpperCase(),b=m+c;f.data('abcnav-fragm',b);if(!l[b]){l[b]=1;var i=a('<a>'+c+'</a>').attr('href','#'+a.encodeFrag(b));abcNavList.append(' ',i)}});var o=a.getFrag()||(d.startOn&&m+d.startOn),p=l[o]?'[href$="#'+a.encodeFrag(o)+'"]':'';n.call(null,{target:abcNav.find('a'+p)[0]});abcNav.insertBefore(k);abcNavList=undefined})};j.texts={en:{abcTitle:'Initial:',abcAll:'Show all',noFoundMsg:'No items match this criteria.'},is:{abcTitle:'Upphafsstafur:',abcAll:'Sýna alla',noFoundMsg:'Engar línur uppfylla þessi leitarskilyrði.'}}})(jQuery);