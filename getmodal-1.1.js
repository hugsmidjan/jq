/* $.getModal 1.1  -- (c) 2012 Hugsmiðjan ehf.  @preserve */
!function(e,o,n){n=e.getModal=function(l){l=e.extend({},n.defaults,l);var t=e(l.template),a=e(l.opener||"html").closest("[lang]").attr("lang")||"en",s=t.find(l.closebtnSel),i=n.i18n;return i=i[a.substr(0,2)]||i.en,s.attr("title",i.closeT||i.close).html(i.close||i.closeT),l.content&&t.find(l.bodySel).append(l.content),t.data("popclosebtn",s).data("popbody",t.find(l.bodySel)).data("popwin",t.find(l.winSel)).addClass(l.className).on("click",function(o){var n=o.target;return!l.modal&&(n===this||l.curtainSel&&n===e(this).find(l.curtainSel)[0])||e(n).closest(l.closebtnSel)[0]?(e(this).fickle("close"),!1):void 0}).on("fickleopen",function(){if(e(this).appendTo(l.appendTo||"body"),null!==l.marginTop){var n=l.marginTop;n=n===o?e(window).scrollTop():e.isFunction(n)?n.call(this):n,e(this).find(l.winSel).css("margin-top",n)}var t=l.parentModal?l.parentModal.charAt?e(l.opener||[]).closest(".modalpop"):e(l.parentModal):[];t[0]&&setTimeout(function(){t.one("fickleclose.getmodal",function(e){e.preventDefault()}).on("mousemove.getmodal focusin.getmodal",function(){t.unbind(".getmodal")})},100)}).fickle(e.extend({focusElm:l.winSel,onClosed:function(){t.remove()}},l.fickle,{opener:l.opener})),a=s=i=o,t},n.defaults={template:'<div class="modalpop"><span class="curtain"/><div class="popwin"><div class="popbody"/><a class="closebtn" href="#"/></div></div>',parentModal:".modalpop",curtainSel:".curtain",winSel:".popwin",bodySel:".popbody",closebtnSel:".closebtn"},n.i18n={dk:{closeT:"Luk popup",close:"Luk"},en:{closeT:"Close popup",close:"Close"},is:{closeT:"Loka glugga",close:"Loka"}}}(jQuery);

