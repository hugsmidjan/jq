/* $.fn.sharebtns 1.0  -- (c) 2012-2014 Hugsmiðjan ehf.  @preserve */

// ----------------------------------------------------------------------------------
// jQuery.fn.sharebtns v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012-2014 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
/*
  Inserts standard share/tweet/like/plus buttons into the dom.


  Requires:  jQuery 1.4+


  Usage:
   $('.container').sharebtns( optionsObject );


  Plugin Options (defaults):
     twitter:   true,     // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Twitter "Tweet" button
              size:     'm',    // or 'l'
              via:      '',     // Optional twitter username to mention/link to. Example: "foobar"
              related:  '',     // Optional list of recommended usernames. Example: "anywhere:The Javascript API,sitestreams,twitter:The official account"
              lang:     '',     // Optional language setting ??? defaults to 'en'
              hashtags: '',     // Optional comma-delmited list of hashtags. (e.g. 'cooloption,hipster,socool')
              text:     '',     // Optional default tweet body text.
              custom:   false,  // Defaults to using the standard <iframe> embed code
              txt:      null,   // Link text for customized links

     facebook:  true,     // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Facebook "Like" button
              width:    10,             // suggested width for the iframe
              count:    'button_count', // 'standard', 'box_count'
              //sendBtn:  false, <-- Seems to be depricated ??
              shareBtn: false,
              faces:    false,
              color:    '',    // 'dark' or 'light' (default),
              verb:     '',    // 'recommend' or 'like' (default)
              // NOTE: Facebook like button CAN NOT be customized!

     fbshare:   false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Facebook "Share" button
              width:    10,             // suggested width for the iframe
              count:    'button_count', // 'button', 'box_count'
              custom:   false,          // Defaults to using the standard <iframe> embed code
              txt:      null,           // Link text for customized links

     gplus:     false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Google+ "+1" button
              width:    null,     // width for the iframe
              count:    '',       // 'inline' (facebook-style) or 'none' (defaults to "bubble" (== '') )
              size:     'medium', // 'small', 'medium', 'standard', 'tall' (tall combined with count:'bubble' displays a vertically positioned counter)
              txt:      null,     // Link text for customized links

     pinterest: false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Pinterest "PinIt" button
              imgsrc:      '',  //  defaults to the first image on the page or the opengraph image
              count:       'beside',       // '' (horizontal). Other options: 'none', 'above'
              imgSelector: '.pgmain img',  // The `imgSrcAttr` value of the first image matching this selector will be used
              imgSrcAttr:  '',  // defaults to 'src'
              custom:      false,        // Defaults to using the standard <iframe> embed code
              txt:         'Pin it',     // Link text for customized links

     linkedin:  false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert LinkedIn "share" button
              count:   'right', // (facebook-style) or 'top' or 'none' (defaults to "bubble" (== '') )
              // NOTE: LinkedIn's share button CAN NOT be customized!

    tumblr:  false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert tumblr "post" button
              count:       'none',       // Other options: 'right', 'top'
              color:       'blue',        // Other options: 'white', 'black'

     email: false,  // Boolean|Number(non-zero position index)|Object(button config) - non-falsy values insert a mailto: link


     wrap:      null,     // String(tagName) - if non-empty each button is wrapped in a "tagName" Element with "buttonName" as its className.
                          //                   i.e.  wrap:'li', -->  .wrap(<li class="twitter"/>);
     wrapClassPrefix: '', // String  - prefix for each wrap element's className

     process:   function ( btnHTML, btnName, btnCfg ) { // allows modifying each button before injection
                     // do stuff - like adding a wrapper, or modifying the HTML, or whatever...
                     return updatedHTMLorElm || btnHTML;
                  }
     insertion: 'append', // String  - jQuery method used to insert the buttons.  Accepted values: 'append', 'prepend', 'after', 'before'

     url:       '',       // String  - Url to share. Defaults to document.location.href

     source:    '',       // String  - Site name (for such custom buttons that need it)
     sourceSel: '',       // String(css-selector)  - Custom selector for finding source text
     title:     '',       // String  - Page/resource title/headline  (for such custom buttons that need it)
     titleSel: '',       // String(css-selector)  - Custom selector for finding title text
     description: '',     // String  - Page/resource description (for such custom buttons that need it)
     descriptionSel: '',       // String(css-selector)  - Custom selector for finding description text

     large:     false,    // Boolean  - true prints a large version of the button, where supported (not supported by Facebook)
     countNone: false,    // Boolean  - true suppresses the display of tweet-/like-/share counter balloons. (not supported by Facebook)
     countV:    false,    // Boolean  - true displays vertically positioned share-counter ballonons.
     custom:    false,    // Boolean  - true inserts plaintext links and skips the $init phase, where possible.

     ...additionally each button type has its own config object.
     See "btnDefaults" below for details.

*/


(function(win, docLoc, encURI, readystateevents){
  'use strict';

  var $ = win.jQuery;
  var
      pageLang,
      link,

      sharebtns = $.fn.sharebtns = function ( cfg ) {
          pageLang = pageLang || $('html').attr('lang').substr(0,2) || 'en';
          var buttonsToInsert = [],
              refElm = this.eq(0);
          if ( refElm[0] )
          {
            cfg = $.extend(true, {}, defaultCfg, cfg);
            link = link || $('<a/>')[0];
            $.each(btnDefaults, function (btnName, btnDefault) {
                var btnSpecificCfg = cfg[btnName];
                if ( btnSpecificCfg )
                {
                  var bCfg = cfg[btnName] = $.extend({
                          custom:cfg.custom,
                          url:cfg.url,
                          lang:pageLang,
                          source: cfg.source,
                          sourceSel: cfg.sourceSel,
                          title:  cfg.title,
                          titleSel: cfg.titleSel,
                          description: cfg.description,
                          descriptionSel: cfg.descriptionSel,
                        }, btnDefault);
                  $.each(presets, function(propName, presetVals){
                      presetVals = presetVals[btnName];
                      cfg[propName]  &&   presetVals  &&  $.extend(bCfg, presetVals);
                    });
                  $.isPlainObject(btnSpecificCfg) && $.extend(bCfg, btnSpecificCfg);
                  link.href = bCfg.url; // normalize the url as a full URL
                  bCfg.url = link.href;
                  // allow btnSpecificCfg itself to be a $pos number
                  bCfg.$pos = typeof btnSpecificCfg === 'number' ? btnSpecificCfg : bCfg.$pos || 0;
                  bCfg.$prep && bCfg.$prep( cfg );
                  var newBtn = ((bCfg.custom&&bCfg.$tmpl2)||bCfg.$tmpl)
                                  .replace(/(%=?)?\{(.+?)\}/g, function(m,p1,p2){
                                      var val = bCfg[p2];
                                      val = val==null ? '' : val;
                                      return  !p1 ? // we have a plain {key} marker (i.e. NOT preceeded by % or %=)
                                                  val:
                                              p1==='%' ? // %{key} marker means we should URI encode
                                                  encURI(val):
                                              // We must have a %={key} marker. (Prints a full (encoded) URL parameter -- i.e. "key=keyValue&amp;" )
                                              val ? // but only if it has some value.
                                                  p2+'='+encURI(val)+'&amp;':
                                                  ''; // default to not printing anything...
                                      });
                  if ( cfg.wrap ) { newBtn = '<'+cfg.wrap+' class="'+(cfg.wrapClassPrefix||'')+btnName+'">'+newBtn+'</'+cfg.wrap+'>'; }
                  newBtn = $( cfg.process ? cfg.process(newBtn, btnName, bCfg) : newBtn );
                  newBtn.$pos = bCfg.$pos;
                  buttonsToInsert.push( newBtn );
                  !bCfg.custom  &&  bCfg.$init  &&  setTimeout(function(){ bCfg.$init(newBtn, cfg); }, 0);
                }
              });
            buttonsToInsert = $.map(
                                  // sort the buttons before inserting
                                  buttonsToInsert.sort(function(a,b){ var d = a.$pos-b.$pos; return d>0 ? 1 : d<0 ? -1 : 0; }),
                                  function (btnCollection) { return btnCollection.toArray(); }
                                );
            refElm[cfg.insertion]( buttonsToInsert );
          }
          return this.pushStack( buttonsToInsert );
        },

      defaultCfg = sharebtns.defaults = {
          twitter:  true, // or a non-zero Number to indicate $pos
          facebook: true,
          // fbshare: false,
          // gplus: false,
          // pinterest: false,
          // linkedin: false,
          // email: false,
          // tumblr: false,
          // process:  function ( btnHTML, btnName, btnCfg ) {
          //               // do stuff - like adding a wrapper, or modifying the HTML, or whatever...
          //               return updatedHTMLorElm || btnHTML;
          //             }
          insertion: 'append',
          // countNone: false,
          // countV:    false,
          // large:     false,
          // color:     dark,
          // custom:    false,
          url: $('link[rel="canonical"]').prop('href') || docLoc.href.split('#')[0].replace(/[?&]fb_action_ids=.+/,''),
          // source: '',
          // sourceSel: '',
          // title: '',
          // titleSel: '',
          // description: '',
          // descriptionSel: '',
        },
      countNone={ count:'none' },
      presets = {
          large:     { twitter:{size:'l'},            gplus:{size:''}      },
          countNone: {                                gplus:countNone,               fbshare:{count:'button'},/*  facebook:{count:'standard'}, */pinterest:countNone,          linkedin:{count:''},     tumblr:countNone },
          countV:    {                                gplus:{count:'',size:'tall'},  fbshare:{count:'box_count'}, facebook:{count:'box_count'},  pinterest:{ count:'above' },  linkedin:{count:'top'},  tumblr:{count:'top'} }
        },


      _locs = {
          is: 'is_IS',
          dk: 'dk_DK',
          pl: 'pl_PL',
          fo: 'fo_FO',
          no: 'nn_NO',
          se: 'sv_SE',
          de: 'de_DE',
          fr: 'fr_FR',
          es: 'es_ES',
          en: 'en_US'
        },
      _getLocale = function (lang, def) {
          return _locs[lang] || _locs[def||'en'];
        },
      _getTxt = function ( bCfg, i18n, prop ) {
          return bCfg[prop||'txt'] || i18n[bCfg.lang] || i18n.en;
        },
      _getSource = function ( bCfg ) {
          return  bCfg.source ||
                  $(bCfg.sourceSel).text() ||
                  $('.brand > a').text() ||
                  $('.brand img.logo').attr('alt');
        },
      _getTitle = function ( bCfg ) {
          return  bCfg.title ||
                  $(bCfg.titleSel).text() ||
                  $('meta[property="og:title"]').attr('content')  || // fallback to using the open-graph image
                  $('h1:first').text() ||
                  document.title;
        },
      _getDescription = function ( bCfg ) {
          return  bCfg.description ||
                  $(bCfg.descriptionSel).text() ||
                  $('meta[property="og:description"]').attr('content')  || // fallback to using the open-graph image
                  $('meta[name="description"]').attr('content');//|| // fallback to using the open-graph image
                  // $('.pgmain .summary:first').text();
        },

      dodgyPopupAttrs = ' onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target=',
      fbshareLnk = '<a'+ dodgyPopupAttrs +'"fbshare" aria-type="button" href="//www.facebook.com/sharer.php?u=',

      btnDefaults = sharebtns.btnDefaults = {

          twitter: {
              size:     'm',   // or 'l'
              //via:      '',    // Optional twitter username to mention/link to. Example: "foobar"
              //related:  '',    // Optional list of recommended usernames. Example: "anywhere:The Javascript API,sitestreams,twitter:The official account"
              //lang:     '',    // Optional language setting ??? defaults to 'en'
              //hashtags: '',    // Optional comma-delmited list of hashtags. (e.g. 'cooloption,hipster,socool')
              //text:     '',    // Optional default tweet body text.
              //custom:   false, // Defaults to using the standard <iframe> embed code
              //txt:      null,  // Link text for customized links

            // private
              $prep: function( /*pluginCfg*/ ) {
                  var b = this;
                  b.text = b.text || _getTitle(b)+'\n';
                  if ( b.custom )
                  {
                    b.txt = _getTxt(b, { en:'Tweet this!', is:'Senda á Twitter' });
                  }
                  else
                  {
                    var large = b.size === 'l';
                    // we must size the iframe manually because Twitter doesn't provide an API for initing/parsing ajax-injected buttons
                    b.width =  large ? '78px' : '62px';
                    b.height = large ?  '28px' : '20px'; // vercial && large seems not to be supported by Twitter
                  }
                },
              $tmpl:  '<iframe src="//platform.twitter.com/widgets/tweet_button.html?%={size}%={via}%={related}%={hashtags}%={text}%={url}%={lang}" style="width:{width}; height:{height};" allowtransparency="true" frameborder="0" scrolling="no" title="Twitter Tweet Button" />',
              $tmpl2: '<a'+ dodgyPopupAttrs +'"tweetit" aria-type="button" href="https://twitter.com/intent/tweet?%={via}%={related}%={hashtags}%={text}%={url}%={lang}">{txt}</a>',
              $pos:  20 // lowest $pos comes first
            },


          fbshare: {
              width:  10,             // suggested width for the iframe
              count:  'button_count', // 'button', 'box_count', 'icon', 'icon_link', 'link',
              //custom: false,          // Defaults to using the standard <iframe> embed code
              //txt:    null,           // Link text for customized links

            // private
              $prep: function ( /*pluginCfg*/ ) {
                  var b = this;
                  if ( b.custom  &&  !b.txt )
                  {
                    b.txt = _getTxt(b, { en: 'Share on Facebook',  is: 'Deila á Facebook' });
                  }
                },
              $tmpl:  '<div class="fb-share-button" data-href="{url}" data-width="{width}" data-type="{count}"/>',
              $tmpl2: fbshareLnk+'%{url}" class="fbsharebtn">{txt}</a>',
              $init: function ( /*btn, cfg*/ ) {
                  btnDefaults.facebook.$init.call(this);
                },
              $pos:  11
            },

          facebook: {
              width:    10,             // suggested width for the iframe
              count:    'button_count', // 'standard', 'box_count'
              //sendBtn:  false, <-- Seems to be depricated
              shareBtn: false,
              faces:    false,
              //color:   '', // 'dark' or 'light' (default),
              //verb:     '',    // 'recommend' or 'like' (default)
              custom:   false, // NOTE: facebook like button CAN NOT be customized!

            // private
              // $prep: function ( /*pluginCfg*/) {},
              $tmpl: '<div class="fb-like"'/*data-send="{sendBtn}"*/+' data-share="{shareBtn}" data-layout="{count}" data-width="{width}" data-show-faces="{faces}" data-action="{verb}" data-href="{url}" data-colorScheme="{color}"/>',
              $init: function (/* btn, cfg */) {
                  // https://developers.facebook.com/docs/plugins/like-button/
                  if ( !$('#fb-root')[0] )
                  {
                    $('body').prepend('<div id="fb-root"/>');
                  }
                  injectScriptIfNeeded(
                      '//connect.facebook.net/'+ _getLocale(this.lang, 'en') +'/sdk.js#xfbml=1&version=v2.0&appId=113869198637480',
                      function(){  win.FB  &&  win.FB.XFBML.parse();  }
                    )
                      .attr('id', 'facebook-jssdk');
                },
              $pos:  10 // defaults to last position because when 'count' is set to '' - loads of text appear to the right of the button
            },


          gplus: {
              //width:  null,     // width for the iframe
              count:  '',       //  'inline' (facebook-style) or 'none' (defaults to "bubble" (== '') )
              size:   'medium', // 'small', 'medium', 'standard', 'tall' (tall combined with count:'bubble' displays a vertically positioned counter)
              //custom: false,    // Defaults to using the standard <iframe> embed code
              //txt:    null,     // Link text for customized links

            // private
              $prep: function ( /*pluginCfg*/ ) {
                  var b = this;
                  if ( b.custom )
                  {
                    b.txt = _getTxt(b, { en: 'Share on Google+',  is: 'Deila á Google+' });
                  }
                  else
                  {
                    b.count = b.count ? ' data-annotation="'+b.count+'"' : '';
                  }
                },
              $tmpl:  '<div class="g-plusone" data-size="{size}"{count} data-href="{url}"/>',
              $tmpl2: '<a href="https://plus.google.com/share?url=%{url}" aria-type="button" class="gplusbtn"'+ dodgyPopupAttrs +'"gpluswin">{txt}</a>',
              $init: function (/* btn, cfg */) {
                  // https://developers.google.com/+/web/+1button/
                  //win.___gcfg = win.___gcfg || {lang:b.lang};
                  injectScriptIfNeeded(
                      '//apis.google.com/js/platform.js',
                      function(){  win.gapi  &&  win.gapi.plusone.go();  }
                    );
                },
              $pos:  30
            },


          email: {
              //txt:      null,  // Link text for customized links
              //subject:  '', // Email Subject line
              //body:     '', // Optional default email body text, to start off the email (follwed by the title and link)

            // private
              $prep: function( /*pluginCfg*/ ) {
                  var b = this;
                  var title = _getTitle(b);
                  b.txt = _getTxt(b, { en:'Share by e-mail', is:'Deila í tölvupósti' });
                  b.subject = _getTxt(b, { en:'Look at this!', is:'Kíktu á þetta!' }, 'subject');
                  b.body =  (b.body ? b.body+'\n\n' : '') +
                            (title ? title+'\n' : '') +
                            b.url +
                            '\n\n';
                },
              $tmpl: '<a href="mailto:?body=%{body}&amp;subject=%{subject}" class="emailbtn" title="{txt}">{txt}</a>',
            },


          linkedin: {
              count:   'right', // (facebook-style) or 'top' or 'none' (defaults to "bubble" (== '') )
              // txt: null, // Link text for Customized links
              // custom:   false,  // Defaults to using the standard button

            // private
              $prep: function ( /*pluginCfg*/ ) {
                  var b = this;
                  if ( b.custom )
                  {
                    b.txt = _getTxt(b, { en:'Share on LinkedIn', is:'Deila á LinkedIn' });
                    b.source =  _getSource(b);
                    b.title =  _getTitle(b);
                    b.description =  _getDescription(b);
                  }
                  else
                  {
                    b.count = b.count ? ' data-counter="'+b.count+'"' : '';
                  }
                },
              $tmpl: '<script type="IN/Share" data-url="{url}"{count} data-showzero="true"/>',
              $tmpl2: '<a href="https://www.linkedin.com/shareArticle?mini=true&amp;url=%{url}&amp;title=%{title}&amp;summary=%{description}&amp;source=%{source}" class="linkedinbtn"'+ dodgyPopupAttrs +'"linkedinwin" aria-type="button">{txt}</a>',
              $init: function (b/* , cfg */) {
                  // http://developer.linkedin.com/plugins/share-plugin-generator
                  // NOTE: LinkedIn's plugin is crap and can only be injected once,
                  // and cann't be commanded to re-run for newly injected button templates.
                  injectScriptIfNeeded(
                      '//platform.linkedin.com/in.js',
                      null,
                      'lang: ' + _getLocale( b.lang )
                    );
                },
              $pos:  50
            },


          pinterest: {
              count:       'beside',       // '' (horizontal). Other options: 'none', 'above'
              //custom:      false,        // Defaults to using the standard image-based button
              txt:         'Pin it',     // Link text for customized links
              imgsrc:      '',  //  defaults to the first image on the page or the opengraph image
              //imgSrcAttr:  '',  // defaults to 'src'
              imgSelector: '.pgmain img',  // The `imgSrcAttr` value of the first image matching this selector will be used

            // private
              $prep: function( /*pluginCfg*/ ) {
                  var b = this;
                  if ( !b.imgsrc )
                  {
                    b.imgsrc =  (b.imgSelector  &&  $(b.imgSelector).attr(b.imgSrcAttr||'src'))  ||
                                $('meta[property="og:image"]').attr('content')  || // fallback to using the open-graph image
                                $('img').attr('src');
                    if ( !/^(https?:)?\/\//.test(b.imgsrc) )
                    {
                      b.imgsrc = docLoc.protocol +'//'+ docLoc.host +'/'+ b.imgsrc.replace(/^\//,'');
                    }
                  }
                },
              $tmpl: '<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pin-it-button" data-pin-do="buttonPin" data-pin-config="{count}" lang="en" aria-type="button">{txt}</a>',
                        //<img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" />
              $tmpl2: '<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pinitbtn"'+ dodgyPopupAttrs +'"pinitwin" lang="en" aria-type="button">{txt}</a>',

              $init: function (/* btn, cfg */) {
                  // http://business.pinterest.com/widget-builder/#do_pin_it_button
                  injectScript( 'https://assets.pinterest.com/js/pinit.js' );
                },
              $pos:  40
            },


          tumblr: {
              count:       'none',       // Other options: 'right', 'top'
              color:       'blue',        // Other options: 'white', 'black'
              txt:         'Post',     // Link text for customized links

            // private
              // $prep: function ( /*pluginCfg*/) {},
              $tmpl: '<a class="tumblr-share-button" data-color="{color}" data-notes="{count}" href="https://embed.tumblr.com/share" aria-type="button">{txt}</a>',

              $init: function (/* btn, cfg */) {
                  // https://www.tumblr.com/buttons
                  injectScript( 'https://secure.assets.tumblr.com/share-button.js' );
                },
              $pos:  50
            }
        };


  btnDefaults.fbshare2 = $.extend({}, btnDefaults.fbshare, { custom:1 }); // <-- Left in for posterity for backwards compatibility



  // =====================================================================

  var loadedScripts = {},
      delay = 300,
      injectScript = function (url, callback, html) {
          injectScriptIfNeeded(url, callback, html, true);
        },
      injectScriptIfNeeded = function ( scriptURL, callback, body, _multiple ) {
          var scriptState = loadedScripts[scriptURL];
          if ( _multiple || !scriptState )
          {
            loadedScripts[scriptURL] = scriptState = scriptState || { elm: $('<script/>') };

            clearTimeout( scriptState.s );
            scriptState.s = setTimeout(function(){
                // we do this instead of $.getScript() to avoid an annoying
                // cross-frame access violation error in Google Chrome. Ack!
                scriptState.elm
                    .attr('src', scriptURL)
                    .html( body||'' )
                    .each(function () {
                        // This seems like the only way to persistently insert a <script> element with jQuery...
                        // normal appendTo or insertBefore methods seem not to work
                        $('head')[0].appendChild(this);
                      })
                    .on(readystateevents, function (/*e*/) {
                        var js = this;
                        if ( !js.readyState || /^(loaded|complete)$/.test(js.readyState) )
                        {
                          scriptState.loaded = 1;
                          if ( callback )
                          {
                            clearTimeout( scriptState.t );
                            scriptState.t = setTimeout(callback, _multiple?0:delay);
                          }
                          $(js).off(readystateevents);
                        }
                      });
              }, _multiple?delay:0);
          }
          else if ( callback  &&  scriptState.loaded )
          {
            clearTimeout( scriptState.t );
            scriptState.t = setTimeout(callback, delay);
          }
          return scriptState.elm;
        };




})(window, document.location, encodeURIComponent, 'load readystatechange');
