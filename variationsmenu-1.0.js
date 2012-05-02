// encoding: utf-8
// $.fn.variationsMenu 1.0 -- (c) 2012 Hugsmiðjan ehf.
(function(b){var I=function(c,a){var g,e=c.length,l=-1;varsLoop:while(++l<e){var h=c[l],j=h.length,i=-1;while(++i<j){if(h[i]!=a[i]){continue varsLoop}}g=h;break}return g},J=function(c,a,g){var e={},l=a.length,h=-1;varsLoop:while(++h<l){var j=a[h],i=j.length,f=-1;while(++f<i){if(g[f]!==undefined&&f!=c&&j[f]!=g[f]){continue varsLoop}}e[j[c]]=true}return e};b.fn.variationsMenu=function(d){d=b.extend({imgCont:'.imagelist',imgItems:'>*',imgContOnClass:'variated',imgOnClass:'active',imgOnBuilder:function(c){if(!c.is('.image')){var a=c.find('a');c.addClass('image');a.addClass('img');b('<img/>').attr({src:a.attr('data-img'),alt:a.text()}).appendTo(a.empty())}},imgClickFirst:!!b.fn.bigimgSwitcher,tagJoint:'-',wrapper:'<fieldset class="variationsmenu"><i headline/><i menus/></fieldset>',wrapperHl:'<h3/>',menuTmpl:'<fieldset class="fi_rdo req"><h4>{legend}</h4><ul><li items/></ul></fieldset>',menuItem:'<li class="{value}"><input type="radio" name="{tagname}" value="{value}" id="{id}" /><label for="{id}">{label}</label></li>',emptyLabel:'--',currentClass:'current',disabledClass:'disabled'},d);var B=[];this.each(function(){var q=b(this),o=q.find('select'),K=b(d.imgCont).addClass(d.imgContOnClass),C=q.find('label').contents(),w=(new Date()).getTime(),D=b('<input type="hidden" />').attr({name:o[0].name}),r=(o.attr('data-tagnames')||'').split('|'),E=(o.attr('data-taglabels')||'').split('|'),F=r.length,G=new RegExp('\s*'+(o.attr('data-tagjoint')||d.tagJoint)+'\s*'),x=[],m,p=[],s=b.map(r,function(c,a){return{name:r[a],legend:E[a],vals:{},tagData:{}}});o.children().each(function(c){var a=b(this),g=a.attr('value');if(g){var e=a.text().split(G),l=a.attr('data-tags').split('|'),h=a.attr('data-tagdata'),j=a.is(':selected'),i=[];h=h?h.split('|'):[];i.id=g;for(var f=0;f<F;f++){var k=l[f]||'';i.push(k);s[f].vals[k]=e[f]||d.emptyLabel;s[f].tagData[k]=h[f];j&&(p[f]=k)}if(j){m=i}x.push(i)}});var y=b.map(s,function(n,z){var H=b(d.menuTmpl.replace(/\{legend\}/g,n.legend)).addClass(n.name),L=0,t,u=b.map(n.vals,function(c,a){var g=d.menuItem.replace(/\{id\}/g,n.name+w+'-'+(L++)).replace(/\{tagname\}/g,n.name+w).replace(/\{label\}/g,c).replace(/\{value\}/g,a),e=b(g).data('varValue',a);if(a==p[z]){e.addClass(d.currentClass).find('input').prop('checked',true);t=e[0]}if(d.itemBuilder){e=d.itemBuilder(e,n.name,n.tagData[a],a,c)||e}return e.toArray()});u=b(u).on('click.variationmenu',function(i,f){var k=this,v=b(k);if(f||(t!=k&&!v.data('varDisabled'))){if(!f||v.is('.'+d.currentClass)){if(b(i.target).closest('[href]',k)[0]){i.preventDefault()}b(t).removeClass(d.currentClass);t=k;p[z]=v.addClass(d.currentClass).find('input').prop('checked',true).end().data('varValue');m=I(x,p);b(y).data('selectedvariation',m).each(function(g){var e=J(g,x,p);b(this).data('varMenuItems').each(function(){var c=b(this),a=!e[c.data('varValue')];c.toggleClass(d.disabledClass,a).data('varDisabled',a).find('input:radio, button').prop('disabled',a)})})}K.each(function(){var l=b(this).find(d.imgItems),h=[],j=l.filter(function(){var c=b(this),a=c.attr('data-forvariation'),g=m&&m.id,e=a?b.inArray(g,a.split('|'))>-1:!g;!a&&h.push(c[0]);c.toggleClass(d.imgOnClass,e);if(e&&!c.data('variationinited')){d.imgOnBuilder&&d.imgOnBuilder(c);c.trigger('variationImageActive').data('variationinited',true)}return e});if(!j[0]){b(h).addClass(d.imgOnClass)}if(d.imgClickFirst&&(j[0]||!f)){b(j[0]||h[0]).trigger('click')}});!f&&v.trigger('variationchanged',[m,n.name,p[z]]);D.val(m?m.id:'')}});H.data('varMenuItems',u).find('[items]').replaceWith(u);return H.toArray()});var A=b(d.wrapper);B.push(A[0]);A.find('[headline]').replaceWith(b(d.wrapperHl).append(C)).end().find('[menus]').replaceWith(y).end().replaceAll(q).after(D);b(y[0]).data('varMenuItems').filter(':first, .'+d.currentClass).last().triggerHandler('click.variationmenu',[true]);r=E=F=G=s=q=o=C=w=A=undefined});return this.pushStack(B)}})(jQuery);
