// encoding: utf-8
// $.fn.abcnavize 1.0  -- (c) 2009 Hugsmiðjan ehf. 
(function(b){var l=b.fn.abcnavize=function(a){a=b.extend({menuTmpl:'<div class="abcnav"><span>%{title}</span> <b /></div>',listSel:'b',itmTmpl:'<a href="%{frag}">%{label}</a>',itmSel:'a',noFoundTmpl:'<tr class="nothingfound"><td colspan="%{colspan}"><strong>%{msg}</strong></td></tr>',rowSelector:'tbody tr',activeClass:'current',fragmPrefix:'index:',allBtn:!0,zebraize:!0},a);return this.each(function(){var i=b(this),j=i.find(a.rowSelector),k=k||l.texts[i.closest('[lang]').attr('lang')]||l.texts.en,e,p=function(f){var g=b(f.target).closest('a'),c=g.closest(a.itmSel),d=a.activeClass;if(!c.is('.'+d)){h.find(a.itmSel+'.'+d).removeClass(d);c.addClass(d);var m=b.getFrag(g.attr('href'));f.type=='click'&&b.setFrag(m);var q=j.hide().filter(function(){return!m||b(this).data('abcnav-fragm')==m}).css('display','');if(q.length){e&&e.detach();if(a.zebraize){q.removeClass('even').filter(':odd').addClass('even')}}else{if(!e){e=b(a.noFoundTmpl.replace('%{msg}',k.noFoundMsg).replace('%{colspan}',j.eq(0).children().length))}e.insertBefore(j[0])}}return false},n={},h=b(a.menuTmpl.replace('%{title}',k.abcTitle)).bind('click',p),o=h.find(a.listSel);if(a.allBtn){b(a.itmTmpl.replace('%{frag}','#').replace('%{label}',k.abcAll)).appendTo(o)}j.each(function(){var f=b(this),g=b.trim(f.text()).charAt(0).toUpperCase(),c=a.fragmPrefix+g;f.data('abcnav-fragm',c);if(!n[c]){n[c]=1;var d=b(a.itmTmpl.replace('%{frag}','#'+b.encodeFrag(c)).replace('%{label}',g));o.append(' ',d)}});var r=b.getFrag()||(a.startOn&&a.fragmPrefix+a.startOn),s=n[r]?'[href$="#'+b.encodeFrag(r)+'"]':'';p.call(null,{target:h.find('a'+s)[0]});h.insertBefore(i);o=undefined;i.data('abcnav',{menu:h,cfg:a})})};l.texts={en:{abcTitle:'Initial:',abcAll:'Show all',noFoundMsg:'No items match this criteria.'},is:{abcTitle:'Upphafsstafur:',abcAll:'Sýna alla',noFoundMsg:'Engar línur uppfylla þessi leitarskilyrði.'}}})(jQuery);
