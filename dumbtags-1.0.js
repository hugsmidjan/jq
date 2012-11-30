// $.fn.dumbTags 1.0  -- (c) 2012 Hugsmiðjan ehf.
(function(e){var s=e.fn.dumbTags=function(y){this.each(function(){var c=e(this),a=e.extend(true,{},s.defaults,y),z=c.closest('[lang]').attr('lang').substr(0.2),o=e.extend({},a.i18n[z]||a.i18n.en),t=c.attr('name'),A=a.ajax&&(('acUrl'in a&&a.acUrl)||c.closest('['+a.acUrlAttr+']',this.form.parentNode).attr(a.acUrlAttr)||e(this.form).attr('action')||''),B=a.ajax&&encodeURIComponent(c.attr(a.acNameAttr)||a.acName||t),l=[],m=[],k=[],u=function(h){var i=[];e.each(h,function(b,d){var f={value:d.id||d.value,tag:d.value},g=e(a.tagTempl);if(f.value){g[a.htmlTags?'html':'text'](f.tag).data('dumbTag',f).each(function(){a.processTag&&a.processTag(g,d)}).append(e('<input type="hidden"/>').attr({name:t,value:f.value})).append(e(a.tagDelTempl).attr('title',o.delTitle||o.delLabel).html(o.delLabel));k.push(f.tag.toLowerCase());i.push(g[0],document.createTextNode(' '))}});return e(i).insertBefore(c)},n=function(b,d){b=e(b);var f=e.Event('dumbTagRemove');f.autoDelete=d;b.trigger(f);if(d||!f.isDefaultPrevented()){var g=e.inArray(b.data('dumbTag').tag.toLowerCase(),k);if(g>-1){k.splice(g,1)}b.remove();!d&&c.trigger('focus');return true}return false},v=function(d){if(d.value||d.id){var f=d.value.toLowerCase(),g=c.prevAll(a.tagSel).filter(function(){var b=e(this).data('dumbTag').tag.toLowerCase()===f;if(b){n(this,true)}return!b});if(a.maxTags&&g.length>=a.maxTags){n(c.prev(a.tagSel),true)}var h=u([d]);c.val('');h.trigger('dumbTagAdded')}},p=function(){var b=c.val();if(!a.limitVocab&&b&&!c.autocomplete('widget').find('a.ui-state-hover')[0]){b=e.trim(b.replace(/\s+/g,' '));v({value:b})}setTimeout(function(){c.autocomplete('close')},0)},j;a.splitter=a.splitter!==undefined?a.splitter:/,|;/;if(c.is('select')){j=c;c=j.siblings('input:text');if(!c[0]){if(!('limitVocab'in a)){a.limitVocab=true}c=e('<input type="text" />').insertAfter(j)}}else{j=c.siblings('select')}j.detach().find('option').each(function(){var b=e(this),d={id:b.val(),value:b.text()};d.label=d.value;l.push(d);if(b.is('[selected]')){m.push({id:b.val(),value:b.text()})}});var q=c.attr('value');if(q){if(a.splitter){e.each(q.split(a.splitter),function(b,d){d=e.trim(d).replace(/\s+/g,'');if(d){m.push({id:d,value:d})}})}if(c.val()===q){c.val('')}}c.attr('name','').wrap(a.wrapperTempl).parent().bind('click',function(b){if(b.target===this){c.trigger('focus')}else if(e(b.target).is(a.delSel)){n(e(b.target).closest(a.tagSel));return false}}).end().attr('autocomplete','off').bind('focus',function(){clearTimeout(a.blurTimeout);e(this.parentNode).addClass(a.focusClass)}).one('focus',function(){c.bind('keydown',function(f){if(!this.value&&f.which===8){var g=e(this);setTimeout(function(){var b=g.prev(a.tagSel),d=b.data('dumbTag').tag;if(n(b)){g.val(a.htmlTags?d.replace(/<.+?>/g,''):d)[0].select()}},0)}if(f.which===13){f.preventDefault();p()}}).bind('blur',function(){a.blurTimeout=setTimeout(function(){p();c.val('').parent().removeClass(a.focusClass)},150)});if(a.splitter){c.bind('keypress',function(b){if(a.splitter.test(String.fromCharCode(b.which))){b.preventDefault();p()}})}if(a.ajax||l[0]){var C=l[0]?{minLength:0}:{};c.autocomplete(e.extend({position:{of:c.parent()}},a.acCfg,C,{source:function(g,h){var i=e.trim(g.term.toLowerCase()).replace(/\s+/g,' ');if(a.ajax&&g.term.length>=a.acCfg.minLength){if(a.ajaxMethod){a.ajaxMethod({term:i,input:c,config:a,callback:h})}else{e.ajax({url:A,type:a.ajaxCfg.type,data:B+'='+encodeURIComponent(i),dataType:a.ajaxCfg.dataType,success:function(d){if(a.acFixResults){var f=a.acFixResults(d);d=f===undefined?d:f}d=e.map(d,function(b){if(a.acFixItem){a.acFixItem(b)}else{b.id=b.value;b.value=b.tag}delete b.tag;return(e.inArray(b.value.toLowerCase(),k)===-1)?b:null});h(d)}})}}else{var w=[],D=0,r;while((r=l[D++])){var x=r.label.toLowerCase();if(x.indexOf(i)>-1){if(e.inArray(x,k)===-1){w.push(r)}}}h(w)}}})).one('autocompleteopen',function(){c.autocomplete('widget').attr('class',a.acMenuClass)}).bind('autocompleteopen',function(){c.autocomplete('widget').width(c.parent().outerWidth())}).bind('autocompletefocus',function(){return false}).bind('autocompleteselect',function(b,d){v(d.item);if(a.reShowLocals){setTimeout(function(){c.autocomplete('search')},100)}return false});if(!a.acCfg.minLength||a.showLocals){c.bind('focus',function(){c.autocomplete('search')}).autocomplete('search')}}});u(m);m=j=undefined});return this};s.defaults={i18n:{en:{delTitle:'Remove this value',delLabel:'x'},is:{delTitle:'Eyða þessu gildi',delLabel:'x'}},wrapperTempl:'<span class="tagswrap"/>',tagTempl:'<span class="tag">',tagDelTempl:'<a href="#" class="del">x</a>',focusClass:'focused',tagSel:'.tag',delSel:'a.del',ajax:true,showLocals:true,acUrlAttr:'data-suggesturl',acNameAttr:'data-acname',acMenuClass:'tags-acmenu ui-autocomplete ui-menu',acCfg:{minLength:2,delay:300,html:true},ajaxCfg:{dataType:'json'}}})(jQuery);
