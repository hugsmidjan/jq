// encoding: utf-8
// $.fn.variationsMenu 1.0 -- (c) 2012 Hugsmiðjan ehf. 
(function(a){var D=function(f,b){var g,e=f.length,l=-1;varsLoop:while(++l<e){var h=f[l],k=h.length,i=-1;while(++i<k){if(h[i]!=b[i]){continue varsLoop}}g=h;break}return g},E=function(f,b,g){var e={},l=b.length,h=-1;varsLoop:while(++h<l){var k=b[h],i=k.length,c=-1;while(++c<i){if(g[c]!==undefined&&c!=f&&k[c]!=g[c]){continue varsLoop}}e[k[f]]=true}return e};a.fn.variationsMenu=function(d){d=a.extend({imgCont:'.imagelist',imgItems:'>*',imgContOnClass:'variated',imgOnClass:'active',tagJoint:'-',wrapper:'<fieldset class="variationsmenu"><i headline/><i menus/></fieldset>',wrapperHl:'<h3/>',menuTmpl:'<fieldset class="fi_rdo req"><h4>{legend}</h4><ul><li items/></ul></fieldset>',menuItem:'<li class="{value}"><input type="radio" name="{tagname}" value="{value}" id="{id}" /><label for="{id}">{label}</label></li>',emptyLabel:'--',currentClass:'current',disabledClass:'disabled'},d);var F=[];this.each(function(){var o=a(this),m=o.find('select'),G=a(d.imgCont).addClass(d.imgContOnClass),x=o.find('label').contents(),u=(new Date()).getTime(),H=a('<input type="hidden" />').attr({name:m[0].name}),p=(m.attr('data-tagnames')||'').split('|'),y=(m.attr('data-taglabels')||'').split('|'),z=p.length,A=new RegExp('\s*'+(m.attr('data-tagjoint')||d.tagJoint)+'\s*'),v=[],q,n=[],r=a.map(p,function(f,b){return{name:p[b],legend:y[b],vals:{},tagData:{}}});m.children().each(function(f){var b=a(this),g=b.attr('value');if(g){var e=b.text().split(A),l=b.attr('data-tags').split('|'),h=b.attr('data-tagdata'),k=b.is(':selected'),i=[];h=h?h.split('|'):[];i.id=g;for(var c=0;c<z;c++){var j=l[c]||'';i.push(j);r[c].vals[j]=e[c]||d.emptyLabel;r[c].tagData[j]=h[c];k&&(n[c]=j)}if(k){q=i}v.push(i)}});var w=a.map(r,function(j,B){var C=a(d.menuTmpl.replace(/\{legend\}/g,j.legend)).addClass(j.name),I=0,s,t=a.map(j.vals,function(f,b){var g=d.menuItem.replace(/\{id\}/g,j.name+u+'-'+(I++)).replace(/\{tagname\}/g,j.name+u).replace(/\{label\}/g,f).replace(/\{value\}/g,b),e=a(g).data('varValue',b);if(b==n[B]){e.addClass(d.currentClass).find('input').prop('checked',true);s=e[0]}if(d.itemBuilder){e=d.itemBuilder(e,j.name,j.tagData[b],b,f)||e}return e.toArray()});t=a(t).on('click.variationmenu',function(k,i){var c=this;if(i||(s!=c&&!a(c).data('varDisabled'))){if(!i||a(c).is('.'+d.currentClass)){if(a(k.target).closest('[href]',c)[0]){k.preventDefault()}a(s).removeClass(d.currentClass);s=c;n[B]=a(c).addClass(d.currentClass).find('input').prop('checked',true).end().data('varValue');q=D(v,n);a(w).each(function(g){var e=E(g,v,n);a(this).data('varMenuItems').each(function(){var f=a(this),b=!e[f.data('varValue')];f.toggleClass(d.disabledClass,b).data('varDisabled',b).find('input:radio, button').prop('disabled',b)})})}G.each(function(){var l=a(this).find(d.imgItems),h=[];activeImgs=l.filter(function(){var f=a(this),b=f.attr('data-forvariation'),g=q&&q.id,e=b?a.inArray(g,b.split('|'))>-1:!g;!b&&h.push(f[0]);f.toggleClass(d.imgOnClass,e);e&&f.trigger('variationImageActive');return e});if(!activeImgs.length){a(h).addClass(d.imgOnClass)}})}});C.data('varMenuItems',t).find('[items]').replaceWith(t);return C.toArray()});var J=a(d.wrapper);J.find('[headline]').replaceWith(a(d.wrapperHl).append(x)).end().find('[menus]').replaceWith(w).end().replaceAll(o).after(H);a(w[0]).data('varMenuItems').filter(':first, .'+d.currentClass).last().triggerHandler('click.variationmenu',[true]);p=y=z=A=r=o=m=x=u=undefined});return this.pushStack(F)}})(jQuery);
