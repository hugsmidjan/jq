// ----------------------------------------------------------------------------------
// jQuery.fn.quickFeedback v 1.0
// ----------------------------------------------------------------------------------
// (c) 20014 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson             -- http://mar.anomy.net
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.8
//  - eutils  ( uses: $.gaEvtPing() )
//  - virtualbrowser


(function($){

  $.quickFeedback = {
      i18n: {
        en: {
          qfeedbackThanks: 'That was nice. Thanks!',
          qfeedbackClose:  'Hide'
        },
        is: {
          qfeedbackThanks: 'Gott að vita. Takk!',
          qfeedbackClose:  'Fela'
        }
      }
  };

  $.fn.quickFeedback = function ( cfg ) {

    cfg = $.extend({
              yayBtnSel:      'a.yay',
              nayBtnSel:      'a.nay',
              ajaxParams:     { justPicPos:'pgmain' },
              feedbackformSel: '.quickfeedback'
            }, cfg );

    return this.each(function(){
              var promptElm = $(this),
                  i18n = $.quickFeedback.i18n[promptElm.lang()] || $.alistDateSplit.i18n.is;

              promptElm
                  .on('click', cfg.yayBtnSel, function (e) {
                      e.preventDefault();
                      promptElm
                          .pause(200, function () {
                              promptElm
                                  .html( '<strong class="thanks">'+i18n.qfeedbackThanks+'</strong>' )
                                  .focusHere();
                            })
                          .pause(4000)
                          .fadeOut(1000, function () { promptElm.remove(); });
                      $.gaEvtPing('quickfeedback', 'clicked-yes');
                    })
                  .on('click', cfg.nayBtnSel, function (e) {
                      e.preventDefault();
                      var link = this;
                      var feedbackSubmitted;

                      $.get(link.href, cfg.ajaxParams)
                          .done(function (html) {
                              var ajaxElms = $(html);
                              var feedbackform = ajaxElms.find(cfg.feedbackformSel)
                                                    .append( ajaxElms.filter('script[data-spm]') );

                              $('<a class="action cancel" role="button" href="#">'+ i18n.qfeedbackClose +'</a>')
                                  .on('click', function (e) {
                                      e.preventDefault();
                                      feedbackform
                                          .pause(200)
                                          .fadeOut(500, function () { feedbackform.remove(); });
                                    })
                                  .insertAfter( feedbackform.find('.fi_btn') );

                              var nonEmptyFeedback;

                              feedbackform
                                  .on('submit', function (/*e*/) {
                                      nonEmptyFeedback = !!feedbackform.find('input:checked')[0] ||
                                                         !!feedbackform.find('textarea').val();
                                    })
                                  .hide()
                                  .insertAfter( promptElm )
                                  .fadeIn(500, function () {
                                      feedbackform.focusHere();
                                    });
                              promptElm
                                  .detach();
                              $doc.trigger('domupdated', [feedbackform]);
                              feedbackform.find('.boxbody')
                                  .on('VBload', function (e, req) {
                                      req.resultDOM.find('h1, h2').detach();
                                      req.resultDOM = req.resultDOM.find('.boxbody').contents();
                                    })
                                  .on('VBloaded', function (/*e, req*/) {
                                      if ( nonEmptyFeedback )
                                      {
                                        $.gaEvtPing('quickfeedback', 'clicked-no', 'form-submitted');
                                        feedbackSubmitted = true;
                                      }
                                      feedbackform
                                          .pause(4000)
                                          .fadeOut(1000, function () {
                                              feedbackform.remove();
                                            });
                                    })
                                  .virtualBrowser(); // do this after domupdated to allow autovalidate to assign first
                            });

                        $win
                            .on('unload beforeunload', function (/*e*/) {
                                !feedbackSubmitted  &&  $.gaEvtPing('quickfeedback', 'clicked-no', 'button-only');
                                feedbackSubmitted = true;
                              });
                    });

        });
  };

})(jQuery);