// $.fn.dumbTags 1.0  -- (c) 2012 Hugsmiðjan ehf.
(function(d){var r=d.fn.dumbTags=function(x){this.each(function(){var e=d(this),a=d.extend(true,{},r.defaults,x),y=e.closest('[lang]').attr('lang').substr(0.2),o=d.extend({},a.i18n[y]||a.i18n.en),s=e.attr('name'),z=a.ajax&&(('acUrl'in a&&a.acUrl)||e.closest('['+a.acUrlAttr+']',this.form.parentNode).attr(a.acUrlAttr)||d(this.form).attr('action')||''),A=a.ajax&&encodeURIComponent(e.attr(a.acNameAttr)||a.acName||s),l=[],m=[],k=[],t=function(h){var i=[];d.each(h,function(b,c){var f={value:c.id||c.value,tag:c.value},g=d(a.tagTempl);if(f.value){g[a.htmlTags?'html':'text'](f.tag).data('dumbTag',f).each(function(){a.processTag&&a.processTag(g,c)}).append(d('<input type="hidden"/>').attr({name:s,value:f.value})).append(d(a.tagDelTempl).attr('title',o.delTitle||o.delLabel).html(o.delLabel));k.push(f.tag.toLowerCase());i.push(g[0],document.createTextNode(' '))}});return d(i).insertBefore(e)},n=function(b,c){b=d(b);var f=d.Event('dumbTagRemove');f.autoDelete=c;b.trigger(f);if(c||!f.isDefaultPrevented()){var g=d.inArray(b.data('dumbTag').tag.toLowerCase(),k);if(g>-1){k.splice(g,1)}b.remove();e.trigger('focus');return true}return false},u=function(c){if(c.value||c.id){var f=c.value.toLowerCase(),g=e.prevAll(a.tagSel).filter(function(){var b=d(this).data('dumbTag').tag.toLowerCase()===f;if(b){n(this,true)}return!b});if(a.maxTags&&g.length>=a.maxTags){n(e.prev(a.tagSel),true)}var h=t([c]);e.val('');h.trigger('dumbTagAdded')}},j;a.splitter=a.splitter!==undefined?a.splitter:/,|;/;if(e.is('select')){j=e;e=j.siblings('input:text');if(!e[0]){if(!('limitVocab'in a)){a.limitVocab=true}e=d('<input type="text" />').insertAfter(j)}}else{j=e.siblings('select')}j.detach().find('option').each(function(){var b=d(this),c={id:b.val(),value:b.text()};c.label=c.value;l.push(c);if(b.is('[selected]')){m.push({id:b.val(),value:b.text()})}});var p=e.attr('value');if(p){if(a.splitter){d.each(p.split(a.splitter),function(b,c){c=d.trim(c).replace(/\s+/g,'');if(c){m.push({id:c,value:c})}})}if(e.val()===p){e.val('')}}e.attr('name','').wrap(a.wrapperTempl).parent().bind('click',function(b){if(b.target===this){e.trigger('focus')}else if(d(b.target).is(a.delSel)){n(d(b.target).closest(a.tagSel));return false}}).end().attr('autocomplete','off').bind('focus',function(){d(this).parent().addClass(a.focusClass)}).one('focus',function(){e.bind('keydown',function(f){if(!this.value&&f.which===8){var g=d(this);setTimeout(function(){var b=g.prev(a.tagSel),c=b.data('dumbTag').tag;if(n(b)){g.val(a.htmlTags?c.replace(/<.+?>/g,''):c)[0].select()}},0)}if(f.which===13){f.preventDefault();if(!a.limitVocab&&this.value&&!d(this).autocomplete('widget').find('a.ui-state-hover')[0]){var h=d.trim(this.value.replace(/\s+/g,' '));u({value:h})}var i=d(this);setTimeout(function(){i.autocomplete('close')},0)}}).bind('blur',function(){var b=jQuery.Event('keydown');b.which=13;d(this).trigger(b).val('').parent().removeClass(a.focusClass)});if(a.splitter){e.bind('keypress',function(b){if(a.splitter.test(String.fromCharCode(b.which))){b.preventDefault();var c=jQuery.Event('keydown');c.which=13;d(this).trigger(c)}})}if(a.ajax||l[0]){var B=l[0]?{minLength:0}:{};e.autocomplete(d.extend({position:{of:e.parent()}},a.acCfg,B,{source:function(g,h){var i=d.trim(g.term.toLowerCase()).replace(/\s+/g,' ');if(a.ajax&&g.term.length>=a.acCfg.minLength){if(a.ajaxMethod){a.ajaxMethod({term:i,input:e,config:a,callback:h})}else{d.ajax({url:z,type:a.ajaxCfg.type,data:A+'='+encodeURIComponent(i),dataType:a.ajaxCfg.dataType,success:function(c){if(a.acFixResults){var f=a.acFixResults(c);c=f===undefined?c:f}c=d.map(c,function(b){if(a.acFixItem){a.acFixItem(b)}else{b.id=b.value;b.value=b.tag}delete b.tag;return(d.inArray(b.value.toLowerCase(),k)===-1)?b:null});h(c)}})}}else{var v=[],C=0,q;while((q=l[C++])){var w=q.label.toLowerCase();if(w.indexOf(i)>-1){if(d.inArray(w,k)===-1){v.push(q)}}}h(v)}}})).one('autocompleteopen',function(){e.autocomplete('widget').attr('class',a.acMenuClass)}).bind('autocompleteopen',function(){e.autocomplete('widget').width(e.parent().outerWidth())}).bind('autocompletefocus',function(){return false}).bind('autocompleteselect',function(b,c){u(c.item);if(a.reShowLocals){setTimeout(function(){e.autocomplete('search')},100)}return false});if(!a.acCfg.minLength||a.showLocals){e.bind('focus',function(){e.autocomplete('search')}).autocomplete('search')}}});t(m);m=j=undefined});return this};r.defaults={i18n:{en:{delTitle:'Remove this value',delLabel:'x'},is:{delTitle:'Eyða þessu gildi',delLabel:'x'}},wrapperTempl:'<span class="tagswrap"/>',tagTempl:'<span class="tag">',tagDelTempl:'<a href="#" class="del">x</a>',focusClass:'focused',tagSel:'.tag',delSel:'a.del',ajax:true,showLocals:true,acUrlAttr:'data-suggesturl',acNameAttr:'data-acname',acMenuClass:'tags-acmenu ui-autocomplete ui-menu',acCfg:{minLength:2,delay:300,html:true},ajaxCfg:{dataType:'json'}}})(jQuery);
