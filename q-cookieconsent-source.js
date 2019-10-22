/* $.cookieConsent 1.0  -- (c) 2019 Hugsmiðjan ehf. @preserve */
// ----------------------------------------------------------------------------------
// jQuery.cookieConsent v 1.0
// ----------------------------------------------------------------------------------
// (c) 2019 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Þórarinn Stefánsson
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery
//  - cookie
//  - eutils (lang, inject)

(function ($) {
  var initCookieDisclaimer = function (cfg) {
      if ( !$.cookie('cookie') ) {
          var txt = $.cookieConsent.lang[cfg.lang] || $.cookieConsent.lang['en'];
          var $disclaimer = $($.inject(cfg.disclaimerTempl, {
              disclaimerIntro   : $.inject(txt['disclaimer-Intro'], { trackers: txt['disclaimer-trackers'] }),
              disclaimerAccept  : txt['disclaimer-Accept'],
              disclaimerDeny    : txt['disclaimer-Deny'],
              disclaimerClose   : txt['disclaimer-Close'],
              privacyPolicyLink : $.inject(cfg.privacyPolicyTempl, {
                                      privacyPolicyPreText : txt['disclaimer-PrivacyPolicy-PreText'],
                                      privacyPolicyLink : txt['disclaimer-PrivacyPolicy-link'],
                                      privacyPolicyLinkText : txt['disclaimer-PrivacyPolicy-linktext'],
                                      privacyPolicyPostText : txt['disclaimer-PrivacyPolicy-PostText'],
                                  })
            }));
          $disclaimer.appendTo('body');

          setTimeout(function () {
            $disclaimer.addClass('disclaimer--visible');
          }, 1000);
          $disclaimer.on('click', '.disclaimer__accept--all', function (e) {
            _setConsentCookie(e, '2');
          });
          $disclaimer.on('click', '.disclaimer__accept', function (e) {
            _setConsentCookie(e, '1');
          });
          $disclaimer.on('click', '.disclaimer__deny', function (e) {
            _setConsentCookie(e, '0');
          });
          $disclaimer.on('click', '.disclaimer__close', function (e) {
            $.cookie('cookie', '-1', { expires: 0, path: '/' });
            $disclaimer.remove();
          });
      }
  };

  var initCookieConsent = function (cfg) {
    var $myConsentTarget = $(cfg.injectSelector);

    if ( $myConsentTarget.length ) {
        var txt = $.cookieConsent.lang[cfg.lang] || $.cookieConsent.lang['en'];
        var consentDate = $.cookie('cookieConsentDate');
        var consentValue = $.cookie('cookie');
        var consentString = !consentValue || consentValue === '-1' ?
                              txt['myConsent-Undecided'] :
                            consentValue === '0' ?
                              txt['myConsent-Denied'] + ' ' + txt['myConsent-Date'] :
                            consentValue === '1' ?
                              txt['myConsent-Accepted'] + ' ' + txt['myConsent-Date'] :
                            consentValue === '2' ?
                              txt['myConsent-Accept-all'] + ' ' + txt['myConsent-Date'] :
                              '';

        var $myConsent = $($.inject(cfg.myConsentTempl, {
            myConsentIntro: $.inject(consentString, {
              trackers: txt['myConsent-trackers'],
              consentDate: consentDate,
            }),
        }));

        if ( consentValue && consentValue !== '-1' ) {
          $myConsent.append(
            $.inject(cfg.myConsentBtnTempl, {
              myConsentPretext: txt['myConsent-button-Pretext'],
              myConsentAccept:  txt['myConsent-button-Accept'],
              myConsentDeny:    txt['myConsent-button-Deny'],
            })
          );
        }

        $myConsentTarget[cfg.injectFn]($myConsent);

        $myConsent.on('click', '.my-consent__accept--all', function (e) {
            _setConsentCookie(e, '2');
        });
        $myConsent.on('click', '.my-consent__accept', function (e) {
            _setConsentCookie(e, '1');
        });
        $myConsent.on('click', '.my-consent__deny', function (e) {
            _setConsentCookie(e, '0');
        });
    }
  };

  var _setConsentCookie = function (e, value) {
    e.preventDefault();
    $.cookie('cookie', value, { expires: 180, path: '/' });

    // set a date cookie, just for show
    var now = new Date();
    var daystring = now.toISOString().split('T')[0];
    $.cookie('cookieConsentDate', daystring, { expires: 180, path: '/' });

    window.location.reload(); // start (or stop) the tracking
  };

  $.cookieConsent = function (o) {
    var defaultCfg = {
      injectSelector: '.privacy-policy h1',
      injectFn: 'after',
      lang: $.lang(),
      disclaimerTempl: '<div class="disclaimer">'+
                          '<p class="disclaimer__intro">%{disclaimerIntro}</p>'+
                          '<span class="disclaimer__act">'+
                            '<button type="button" class="disclaimer__accept">%{disclaimerAccept}</button>'+
                            '<button type="button" class="disclaimer__deny">%{disclaimerDeny}</button>'+
                            '%{privacyPolicyLink}'+
                          '</span>'+
                          '<button type="button" class="disclaimer__close">%{disclaimerClose}</button>'+
                        '</div>',
      privacyPolicyTempl: '<p>%{privacyPolicyPreText} <a class="button" href="%{privacyPolicyLink}">%{privacyPolicyLinkText}</a> %{privacyPolicyPostText}</p>',
      myConsentTempl: '<div class="my-consent">'+
                        '<p class="my-consent__intro">%{myConsentIntro}</p>'+
                      '</div>',
      myConsentBtnTempl: '<div class="my-consent__buttons">'+
                            '%{myConsentPretext}'+
                            '<div class="my-consent__act">'+
                              '<button class="my-consent__accept">%{myConsentAccept}</button>'+
                              '<button class="my-consent__deny">%{myConsentDeny}</button>'+
                            '</div>'+
                          '</div>',
    };

    var cfg = $.extend(defaultCfg, o);

    initCookieDisclaimer(cfg);
    initCookieConsent(cfg);
  };

  $.cookieConsent.lang = {
    en: {
      'disclaimer-trackers': 'cookies',
      'disclaimer-Intro': 'This website uses %{trackers} to measure traffic.',
      'disclaimer-Accept': 'Accept',
      'disclaimer-Deny': 'Deny',
      'disclaimer-Close': 'Close',
      'disclaimer-PrivacyPolicy-PreText': 'See more on',
      'disclaimer-PrivacyPolicy-linktext': 'our privacy policy page',
      'disclaimer-PrivacyPolicy-link': '/privacy-policy',
      'disclaimer-PrivacyPolicy-PreText': 'what this means.',
      'myConsent-trackers': 'Google Analytics',
      'myConsent-Undecided': 'You have not made a decision regarding tracking cookies, therefore %{trackers} have <strong>not been activated</strong>.',
      'myConsent-Accept-all': 'You choose <strong>to allow all cookies</strong>.',
      'myConsent-Accepted': 'You choose <strong>to allow us to track your visit</strong> with %{trackers}.',
      'myConsent-Denied': 'You choose <strong>not to allow %{trackers}</strong>. Your visit will not be tracked.',
      'myConsent-Date': 'That decision was made on <code>%{consentDate}</code> and is stored for 6 months.',
      'myConsent-button-Pretext': 'You can reconsider your choice here:',
      'myConsent-button-Accept-all': 'Allow all cookies',
      'myConsent-button-Accept': 'Allow tracking cookies',
      'myConsent-button-Deny': 'Deny tracking cookies',
    },
    is: {
      'disclaimer-trackers': 'vafrakökum',
      'disclaimer-Intro': 'Þessi vefur mælir umferð um vefinn með %{trackers}.',
      'disclaimer-Accept': 'Samþykja',
      'disclaimer-Deny': 'Hafna',
      'disclaimer-Close': 'Loka',
      'disclaimer-PrivacyPolicy-PreText': 'Sjáðu nánar á',
      'disclaimer-PrivacyPolicy-text': 'persónuverndarsíðu okkar ',
      'disclaimer-PrivacyPolicy-link': '/personuverndarstefna',
      'disclaimer-PrivacyPolicy-PostText': 'hvaða áhrif svar þitt hefur.',
      'myConsent-trackers': 'Google Analytics',
      'myConsent-Undecided': 'Þú hefur ekki tekið afstöðu til þess hvort okkur er leyfilegt er að mæla þína notkun og því hefur %{trackers} <strong>ekki verið virkjað</strong>.',
      'myConsent-Accept-all': 'Þú valdir að <strong>leyfa allar kökur</strong>.',
      'myConsent-Accepted': 'Þú valdir að <strong>leyfa okkur að mæla notkun þína</strong> með %{trackers}.',
      'myConsent-Denied': 'Þú valdir að <strong>leyfa ekki notkun %{trackers}</strong>. Notkun þín er því ekki mæld.',
      'myConsent-Date': 'Sú ákvörðun þín er dagsett <code>%{consentDate}</code> og gildir í 6 mánuði. Eftir það spyrjum við þig aftur.',
      'myConsent-button-Pretext': 'Þú getur að sjálfsögðu endurskoðað ákvörðun þína hér:',
      'myConsent-button-Accept-all': 'Ég leyfi allar kökur',
      'myConsent-button-Accept': 'Ég leyfi mælingar',
      'myConsent-button-Deny': 'Ég leyfi ekki mælingar',
    }
  }
})(window.jQuery);
