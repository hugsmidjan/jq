// jQuery.fn.fieldsetCloner v 1.1 - (c) 2011-2013 Hugsmiðjan ehf
!function(e,a){e.fn.fieldsetCloner=a=function(t){return this.each(function(){var n=e(this),o=a.i18n[n.closest("[lang]").attr("lang")]||a.i18n.en,r=e.extend({},a.defaults,o,t);r.rowName=(n.attr(r.rowNameSel||"")||n.find(r.rowNameSel).eq(0).text()||r.rowName).replace(/:/g,""),r.$protoFS=n.clone(!!r.cloneEvents).each(function(){var a=e.trim(this.className);a&&(a=(a+" ").replace(/\s+/g,"-"+r.cloneClass+" ")+a),a+=" "+r.cloneClass,this.className=a}),r.$delBtn=r.addDelBtn&&e(r.delBtnTemplate.replace(/%\{className\}/g,r.delBtnClass).replace(/%\{label\}/g,r.delBtnLabel).replace(/%\{tooltip\}/g,r.delBtnTitle+r.rowName)).on("click",function(a){a.preventDefault();var t=e(this).data("$fsclnr");r.cloneCount--,t.slideUp(r.showSpeed,function(){t.remove()}),r.cloneMax&&r.cloneCount<r.cloneMax&&d.show(),"appendTo"===r.$place&&t.find("."+r.addBtnClass)[r.$place](t.prev())}),r.$place={after:"insertAfter",bottom:"appendTo"}[r.buttonPlacement]||"insertAfter",r.$num=1,r.cloneCount=1,r.cloneMax=parseInt(n.attr(r.cloneMaxSel||""),10)||null;var d=e(r.addBtnTemplate.replace(/%\{className\}/g,r.addBtnClass).replace(/%\{label\}/g,r.addBtnLabel+r.rowName).replace(/%\{tooltip\}/g,r.addBtnTitle+r.rowName))[r.$place](n);d.on("click",function(e){e.preventDefault();var a,t="appendTo"===r.$place,n=t?d.parent():d.prev();r.cloneCount++,r.cloneMax&&r.cloneCount===r.cloneMax&&d.hide(),t&&d.detach(),a=l(r).hide().insertAfter(n).slideDown(r.showSpeed),t&&d[r.$place](a),r.afterClone&&r.afterClone(a)})})},a.defaults={buttonPlacement:"after",addBtnTemplate:'<a class="%{className}" href="#" title="%{tooltip}">%{label}</a>',addBtnClass:"addrow",cloneClass:"clone",showSpeed:"fast",delBtnTemplate:'<a class="%{className}" href="#" title="%{tooltip}">%{label}</a>',delBtnClass:"delrow"},a.i18n={en:{addBtnLabel:"Add ",addBtnTitle:"Add new ",delBtnLabel:"Delete",delBtnTitle:"Delete this ",rowName:"row"},is:{addBtnLabel:"Bæta við ",addBtnTitle:"Bæta við auka ",delBtnLabel:"Eyða",delBtnTitle:"Eyða þessari ",rowName:"röð"}};var t=8>parseInt((/MSIE ([\w.]+)/.exec(navigator.userAgent)||[])[1],10),l=function(a){var l,n=a.$protoFS.clone(!!a.cloneEvents),o="-"+(a.cloneClass||"clone")+"-",r=new RegExp("("+o+"\\d+)?$");return o+=a.$num++,a.$delBtn&&a.$delBtn.clone(!0).data("$fsclnr",n).appendTo(n.find(a.delBtnAppendTo).add(n).last()),(l=n[0].id)&&(n[0].id=l.replace(r,o)),n.find("*").each(function(){var n=this;if((l=n.id)&&(n.id=l.replace(r,o)),(l=e(n).attr("for"))&&e(n).attr("for",l.replace(r,o)),l=n.name){var d=l.match(/^(.*)(\d+)(\D*)$/);n.name=d?d[1]+(parseInt(d[2],10)+a.$num)+d[3]:l+"-"+a.$num}if(t&&/^(?:INPUT|SELECT|TEXTAREA|BUTTON)$/.test(n.tagName)){var c=e(n.outerHTML.replace(/( name=)[^ >]+/,'$1"'+l+'"'));e(n).replaceWith(c)}}),n}}(jQuery);
