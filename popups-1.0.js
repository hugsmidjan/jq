// encoding: utf-8
// $.fn.popUps 1.0  -- (c) 2008 Hugsmiðjan ehf. 
(function(d,j,k,l,m){m=d.fn.popUps=function(b){b=b||{};var e=[];if(b.width){e.push('width='+b.width)}if(b.height){e.push('height='+b.height)}b.titleSuffix=d.extend({},m.titleSuffix,b.titleSuffix||{});d.each(['location','menubar','scrollbars','status','toolbar'],function(g,a){if(b[a]!==l){e.push(a+(b[a]?'=yes':'=no'))}else if(b.minimal){e.push(a+'=no')}});e.length&&e.push('resizable='+((b.resizable===l||b.resizable)?'yes':'no'));b._0=e.join(',');return this.each(function(g,a){var c=d(a);c.data(f,b);if(b.markTitle&&a.tagName!='FORM'){var h=(d.lang&&d.lang(a))||d('html').attr('lang')||'en';a.title=(a.title||c.text()||a.value)+' '+(b.titleSuffix[h]||b.titleSuffix.en)}switch(a.tagName){case'FORM':c.bind('submit',i);break;case'INPUT':case'BUTTON':c.bind('click',n);break;default:c.bind('click',i);break}})};d.extend(d.fn.popUps,{v:1.0,titleSuffix:{is:'(opnast í nýjum glugga)',en:'(opens in a new window)'}});var f='pop'+(new Date()).getTime(),o=0,i=function(g){if(g.isDefaultPrevented&&!g.isDefaultPrevented()){var a=this,c=d(a).data(f),h=a.target||c.target||j+k;if(c.url||h.indexOf(j)!=0){var b=(c.window||window).open(c.url||'about:'+k,h,c._0);setTimeout(function(){b.focus()},150)}if(!a.target){a.target=h;setTimeout(function(){a.target=''},150)}}},n=function(g){var a=d(this.form),c=a.data(f);a.data(f,d(this).data(f)).bind('submit',i);setTimeout(function(){if(c){a.data(f,c)}else{a.removeData(f).unbind('submit',i)}},150)}})(jQuery,'_','blank');
