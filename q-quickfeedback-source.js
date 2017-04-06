/* jQuery quickFeedback 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */
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

  // These texts are now embedded as data-attributes in the HTML to allow
  // all i18n to happen in the same place.
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
              gaPing:         true,
              yayBtnSel:      'a.yay',
              nayBtnSel:      'a.nay',
              ajaxParams:     { justPicPos:'pgmain' },
              feedbackformSel: '.quickfeedback',
              thankyouSel:    '.thankyou',
              logShortPaths:  false
            }, cfg );

    return this.each(function(){
              var promptElm = $(this);
              var i18n = $.quickFeedback.i18n[promptElm.lang()] || $.quickFeedback.i18n.is;
              var myPath = cfg.logShortPaths ? document.location.pathname : document.location.href;

              promptElm
                  .on('click', cfg.yayBtnSel, function (e) {
                      var thanksText = this.getAttribute('data-thankstext') || i18n.qfeedbackThanks;
                      e.preventDefault();
                      promptElm
                          .addClass('submitted')
                          .pause(200, function () {
                              promptElm
                                  .html( '<strong class="thanks">'+thanksText+'</strong>' )
                                  .focusHere();
                            })
                          .pause(4000)
                          .fadeOut(1000, function () {
                              promptElm.remove();
                            });
                      cfg.gaPing && window.ga.eventPing('quickfeedback', 'clicked-yes', myPath, 1, false);
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
                              var hideText = feedbackform[0].getAttribute('data-hidetext') || i18n.qfeedbackClose;

                              $('<a class="action cancel" role="button" href="#">'+ hideText +'</a>')
                                  .on('click', function (e) {
                                      e.preventDefault();
                                      feedbackform
                                          .pause(200)
                                          .fadeOut(500, function () { feedbackform.remove(); });
                                    })
                                  .insertAfter( feedbackform.find('.fi_btn') );

                              var nonEmptyFeedback;

                              var mySubmitForm = feedbackform.is('form') ? feedbackform : feedbackform.find('form:first');
                              mySubmitForm
                                  .on('submit', function (/*e*/) {
                                      nonEmptyFeedback = !!feedbackform.find('input:checked')[0] ||
                                                         !!feedbackform.find('textarea').val();
                                    });

                              feedbackform
                                  .hide()
                                  .insertAfter( promptElm )
                                  .fadeIn(500, function () {
                                      feedbackform.focusHere();
                                    });

                              promptElm
                                  .detach();

                              var respEmail = feedbackform.find('.resp_email');
                              if ( respEmail.length )
                              {
                                respEmail.find('[name="send_response"]').on('change', function () {
                                    respEmail[$(this).is(':checked') ? 'addClass' : 'removeClass']('email-active');
                                  });
                              }

                              $(document).trigger('domupdated', [feedbackform]);
                              feedbackform.find('.boxbody')
                                  .on('VBload', function (e, req) {
                                      req.resultDOM.find('h1, h2').detach();
                                      req.resultDOM = req.resultDOM.find('.boxbody').contents();
                                    })
                                  .on('VBloaded', function (/*e, req*/) {
                                      if ( nonEmptyFeedback )
                                      {
                                        cfg.gaPing && window.ga.eventPing('quickfeedback', 'clicked-no', myPath, 1, false);
                                        feedbackSubmitted = true;
                                      }
                                      feedbackform
                                          .pause(4000)
                                          .fadeOut(1000, function () {
                                              feedbackform.remove();
                                            });
                                    })
                                  // do this after domupdated to allow autovalidate to assign first
                                  .virtualBrowser({
                                      params:       cfg.ajaxParams,
                                      loadmsgMode:  'replace',
                                      selector:     cfg.thankyouSel
                                    });
                            });

                        $(window)
                            .on('unload beforeunload', function (/*e*/) {
                                !feedbackSubmitted  &&  cfg.gaPing &&  window.ga.eventPing('quickfeedback', 'clicked-no-only', myPath, 1, false);
                                feedbackSubmitted = true;
                              });
                    });

        });
  };

})(window.jQuery);
