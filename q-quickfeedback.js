/* jQuery quickFeedback 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */
!function(e){e.quickFeedback={i18n:{en:{qfeedbackThanks:"That was nice. Thanks!",qfeedbackClose:"Hide"},is:{qfeedbackThanks:"Gott að vita. Takk!",qfeedbackClose:"Fela"}}},e.fn.quickFeedback=function(n){return n=e.extend({gaPing:!0,yayBtnSel:"a.yay",nayBtnSel:"a.nay",ajaxParams:{justPicPos:"pgmain"},feedbackformSel:".quickfeedback",thankyouSel:".thankyou"},n),this.each(function(){var a=e(this),t=e.quickFeedback.i18n[a.lang()]||e.quickFeedback.i18n.is;a.on("click",n.yayBtnSel,function(e){e.preventDefault(),a.pause(200,function(){a.html('<strong class="thanks">'+t.qfeedbackThanks+"</strong>").focusHere()}).pause(4e3).fadeOut(1e3,function(){a.remove()}),n.gaPing&&window.ga.eventPing("quickfeedback","clicked-yes",document.location.href,1,!1)}).on("click",n.nayBtnSel,function(c){c.preventDefault();var o,i=this;e.get(i.href,n.ajaxParams).done(function(c){var i=e(c),d=i.find(n.feedbackformSel).append(i.filter("script[data-spm]"));e('<a class="action cancel" role="button" href="#">'+t.qfeedbackClose+"</a>").on("click",function(e){e.preventDefault(),d.pause(200).fadeOut(500,function(){d.remove()})}).insertAfter(d.find(".fi_btn"));var f;d.on("submit",function(){f=!!d.find("input:checked")[0]||!!d.find("textarea").val()}).hide().insertAfter(a).fadeIn(500,function(){d.focusHere()}),a.detach(),e(document).trigger("domupdated",[d]),d.find(".boxbody").on("VBload",function(e,n){n.resultDOM.find("h1, h2").detach(),n.resultDOM=n.resultDOM.find(".boxbody").contents()}).on("VBloaded",function(){f&&(n.gaPing&&window.ga.eventPing("quickfeedback","clicked-no",document.location.href,1,!1),o=!0),d.pause(4e3).fadeOut(1e3,function(){d.remove()})}).virtualBrowser({params:n.ajaxParams,loadmsgMode:"replace",selector:n.thankyouSel})}),e(window).on("unload beforeunload",function(){!o&&n.gaPing&&window.ga.eventPing("quickfeedback","clicked-no-only",document.location.href,1,!1),o=!0})})})}}(jQuery);
