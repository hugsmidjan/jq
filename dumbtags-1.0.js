// encoding: utf-8
// $.fn.dumbTags 1.0  -- (c) 2012 Hugsmiðjan ehf.
(function(b){var j=b.fn.dumbTags=function(n){this.each(function(o){var d=b(this),a=b.extend(true,{},j.defaults,n);lang=d.closest('[lang]').attr('lang').substr(0.2),i18n=b.extend({},a.i18n[lang]||a.i18n.en,a.texts);submName=d.attr('name'),acUrl=a.ajax&&(('acUrl'in a&&a.acUrl)||d.closest('['+a.acUrlAttr+']',this.form.parentNode).attr(a.acUrlAttr)||b(this.form).attr('action')||''),acName=a.ajax&&encodeURIComponent(d.attr(a.acNameAttr)||a.acName||submName),acLocalValues=[],prefills=[],buildTagElms=function(f){var g=[];b.each(f,function(c,e){g.push(b(a.tagTempl).text(e.value).append(b('<input type="hidden"/>').attr({name:submName,value:e.id})).append(b(a.tagDelTempl).attr('title',i18n.delTitle||i18n.delLabel).html(i18n.delLabel)).attr('title',e.value)[0])});return g};d.siblings('select').detach().find('option').each(function(){var c=b(this);if(!a.ajax){item={id:c.val(),value:c.text()};item.label=item.value;acLocalValues.push(item)}if(c.is('[selected]')){prefills.push({id:c.val(),value:c.text()})}});var h=d.attr('value');if(h){if(d.val()==h){d.val('')}prefills.push({id:h,value:h})}d.attr('name','').wrap(a.wrapperTempl).parent().prepend(buildTagElms(prefills)).end().bind('keypress',function(f){if(!this.value&&f.which==8){var g=b(this);setTimeout(function(){var c=g.prev(a.tagSel),e=c.attr('title');c.find(a.delSel).trigger('click');g.val(e);g[0].select()},0)}}).bind('focus',function(c){b(this).parent().addClass(a.focusClass)}).bind('blur',function(c){b(this).val('').parent().removeClass(a.focusClass)}).parent().bind('click',function(c){if(c.target==this){d.trigger('focus')}else if(b(c.target).is(a.delSel)){b(c.target).closest(a.tagSel).remove();return false}}).end().autocomplete(b.extend({position:{of:d.parent(),offset:'0 18'}},a.acCfg,{minLength:a.ajax?a.acCfg.minLength:0,source:function(g,k){var l=b.trim(g.term.toLowerCase()).replace(/\s+/g,' ');if(a.ajax){b.ajax({url:acUrl,type:a.ajaxCfg.type,data:acName+"="+encodeURIComponent(l),dataType:a.ajaxCfg.dataType,success:function(f){if(a.acFixResults){f=a.acFixResults(f)}b.each(f,function(c,e){if(a.acFixItem){a.acFixItem(e)}else{e.id=e.value;e.value=e.tag}delete e.tag});k(f)}})}else{var m=[];i=0;while(acLocalValues[i]){if(acLocalValues[i].label.toLowerCase().indexOf(l)>-1){m.push(acLocalValues[i])}i++}k(m)}}})).bind('autocompleteopen',function(c,e){d.autocomplete('widget').attr('class',a.acMenuClass).width(d.parent().outerWidth())}).bind('autocompletefocus',function(c,e){return false}).bind('autocompleteselect',function(c,e){setTimeout(function(){if(a.maxTags&&a.maxTags==d.prevAll(a.tagSel).length){d.prev(a.tagSel).remove()}d.before(buildTagElms([e.item])).val('')},0)});prefills=undefined});return this};j.defaults={i18n:{en:{delTitle:'Remove this value',delLabel:'x'},is:{delTitle:'Eyða þessu gildi',delLabel:'x'}},wrapperTempl:'<span class="tagswrap"/>',tagTempl:'<span class="tag">',tagDelTempl:'<a href="#" class="del">x</a>',focusClass:'focused',tagSel:'.tag',delSel:'a.del',ajax:1,acUrlAttr:'data-suggesturl',acNameAttr:'data-acname',acMenuClass:'tags-acmenu ui-autocomplete ui-menu',acCfg:{minLength:2,autoFocus:true,delay:300,html:true},ajaxCfg:{dataType:'json'}}})(jQuery);
