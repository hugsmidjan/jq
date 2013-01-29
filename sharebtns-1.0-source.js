// ----------------------------------------------------------------------------------
// jQuery.fn.sharebtns v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
// Inserts standard share/tweet/like/plus buttons into the dom.
//
//
// Requires:  jQuery 1.4+
//
//
// Usage:
//  $('.container').sharebtns({ /* options */ });
//
//
// Plugin Options (defaults):
//    twitter:   true,     // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Twitter "Tweet" button
//    facebook:  true,     // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Facebook "Like" button
//    fbshare:   false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Facebook "Share" button
//    fbshare2:  false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert *customized* Facebook "Share" button
//    gplus:     false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Google+ "+1" button
//    pinterest: false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Pinterest "PinIt" button
//
//    process:   function ( btnHTML, btnName, btnCfg ) { // allows modifying each button before injection
//                    // do stuff - like adding a wrapper, or modifying the HTML, or whatever...
//                    return updatedHTMLorElm || btnHTML;
//                 }
//    insertion: 'append', // String  - jQuery method used to insert the buttons.  Accepted values: 'append', 'prepend', 'after', 'before'
//
//    url:       '',       // String  - Url to share. Defaults to document.location.href
//
//    large:     false,    // Boolean  - true prints a large version of the button, where supported (not supported by Facebook)
//    countNone: false,    // Boolean  - true suppresses the display of tweet-/like-/share counter balloons. (not supported by Facebook)
//    countV:    false,    // Boolean  - true displays vertically positioned share-counter ballonons.
//    dark:      false,    // Boolean  - true hints that the buttons should use a "dark" color-scheme.
//
//    ...additionally each button type has its own config object.
//    See "btnDefaults" below for details.
//
//
//

(function($, docLoc, encURI, readystateevents){

  var sharebtns = $.fn.sharebtns = function ( cfg ) {
          var buttonsToInsert = [];
          if ( this.length )
          {
            cfg = $.extend(true, {}, defaultCfg, cfg);
            $.each(btnDefaults, function (btnName, btnDefaultCfg) {
                var cfgBtnName = cfg[btnName];
                if ( cfgBtnName )
                {
                  var bCfg = cfg[btnName] = $.extend({}, btnDefaultCfg, cfgBtnName);
                  $.each(presets, function(propName, presetVals){
                      presetVals = presetVals[btnName];
                      cfg[propName]  &&   presetVals  &&  $.extend(bCfg, presetVals);
                    });
                  bCfg.url = bCfg.url || cfg.url; // button-specific custom URLs take precendence over global cfg.url settings
                  $.extend(bCfg, cfgBtnName);
                  // allow cfgBtnName itself to be a $pos number
                  bCfg.$pos = typeof cfgBtnName === 'number' ? cfgBtnName : bCfg.$pos || 0;
                  bCfg.$prep && bCfg.$prep( cfg );
                  var newBtn = bCfg.$tmpl.replace(/(%=?)?\{(.+?)\}/g, function(m,p1,p2){
                                                                          var val = bCfg[p2];
                                                                          return  !p1 ?
                                                                                      val:
                                                                                  p1==='%' ?
                                                                                      encURI(val):
                                                                                  val ?
                                                                                      p2+'='+encURI(val)+'&':
                                                                                      '';
                                                                        });
                  newBtn = $( cfg.process ? cfg.process(newBtn, btnName, bCfg) : newBtn );
                  newBtn.$pos = bCfg.$pos;
                  buttonsToInsert.push( newBtn );
                  bCfg.$init && setTimeout(function(){ bCfg.$init(newBtn, cfg); }, 0);
                }
              });
            buttonsToInsert = $.map(
                                  buttonsToInsert.sort(function(a,b){ var d = a.$pos-b.$pos; return d>0 ? 1 : d<0 ? -1 : 0; }),
                                  function (btnCollection) { return btnCollection.toArray(); }
                                );
            this[cfg.insertion]( buttonsToInsert );
          }
          return this.pushStack( buttonsToInsert );
        },

      defaultCfg = sharebtns.defaults = {
          twitter:  true, // or a non-zero Number to indicate $pos
          facebook: true,
          // fbshare:  false,
          // fbshare2: false,
          // gplus:    false,
          // process:  function ( btnHTML, btnName, btnCfg ) {
          //               // do stuff - like adding a wrapper, or modifying the HTML, or whatever...
          //               return updatedHTMLorElm || btnHTML;
          //             }
          insertion: 'append',
          //countNone: false,
          //countV:    false,
          //large:     false,
          //color:     dark,
          url: $('link[rel="canonical"]').prop('href') || docLoc.href.split('#')[0]
        },
      countNone={ count:'none' },
      countVertical={ count:'vertical' },
      presets = {
          dark:      { fbshare:{color:'dark'}, facebook:{color:'dark'}  },
          large:     { twitter:{size:'l'},     facebook:{},                   gplus:{size:''},               pinterest:{} },
          countNone: { twitter:countNone,      facebook:{count:'standard'},   gplus:countNone,               pinterest:countNone },
          countV:    { twitter:countVertical,  facebook:{count:'box_count'},  gplus:{count:'',size:'tall'},  pinterest:countVertical }
        },




      btnDefaults = sharebtns.btnDefaults = {

          twitter: {
              size:     'm', // or 'l'
              count:    '',       // '' == 'horizontal'. Other options: 'none', 'vertical'
              via:      '',       // Twitter username. Example: "foobar"
              related:  '',       // Recommended usernames. Example: "anywhere:The Javascript API,sitestreams,twitter:The official account"
              lang:     '',       // defaults to 'en'
              hashtags: '',       //
              text:     '',       // defaults to <title>
              //url:      '',       // defaults to document.location.href

            // private
              $prep: function( /*pluginCfg*/ ) {
                  var b = this,
                      hCount = !b.count || b.count === 'horizontal',
                      vCount = b.count === 'vertical',
                      large = b.size === 'l';
                  // we must size the iframe manually because Twitter doesn't provide an API for initing/parsing ajax-injected buttons
                  b.width =  (hCount && large) ? '138px' : hCount ? '110px' : large ? '76px' : '58px';
                  b.height = large ?  '28px' : vCount ?  '62px' : '20px'; // vercial && large seems not to be supported by Twitter
                },
              $tmpl:  '<iframe src="//platform.twitter.com/widgets/tweet_button.html?%={size}%={count}%={via}%={related}%={hashtags}%={text}%={url}%={lang}" style="width:{width}; height:{height};" allowtransparency="true" frameborder="0" scrolling="no" />',
              $pos:  10 // lowest $pos comes first
            },


          fbshare: {
              color: '', // 'dark',
              //url:   '', // defaults to document.location.href

            // private
              $prep: function ( /*pluginCfg*/) {
                  var b = this;
                  b.width =  '5.636em'; // 62px @ 11px font-size
                  b.height = '1.818em'; // 20px @ 11px font-size
                  b.$prep2();
                },
              $prep2: function () {
                  var b = this,
                      txts = { en: 'Share',  is: 'Deila' };
                  if ( !b.txt )
                  {
                    b.lang = $('html').attr('lang').substr(0,2);
                    b.txt = txts[ b.lang ];
                    if ( !b.txt )
                    {
                      b.lang = 'en';
                      b.txt = txts.en;
                    }
                  }
                },
              $lnk: '<a onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="fbshare" href="//www.facebook.com/sharer.php?u=',
              $init: function ( btn/*, cfg*/ ) {
                  var b = this,
                      iframeDoc = btn.find('iframe').andSelf().filter('iframe').first() // btn might have been wrapped or otherwise modified by the optional custom "process" method
                                      .contents()[0];
                  iframeDoc.write(
                      '<!DOCTYPE html><html lang="'+ b.lang +'">' +
                      '<head><meta charset="UTF-8" /><title>.</title>' +
                      '<link href="https://codecentre.eplica.is/f/fb-share.css" rel="stylesheet" type="text/css" />' +
                      '</head><body class="'+ (b.color||'') +'">' +
                      b.$lnk + encURI(b.url) +'">'+ b.txt +'</a>' +
                      '</body></html>'
                    );
                  iframeDoc.close();
                },
              $tmpl: '<iframe style="width:{width};height:{height};font-size:11px;" allowtransparency="true" frameborder="0" scrolling="no" />',
              $pos:  40
            },


          facebook: {
              width:   null,           // min-width for the iframe
              count:   'button_count', // 'standard', 'box_count'
              sendBtn: false,
              faces:   false,
              color:   '', // 'dark',
              verb:    '', // 'recommend' (default text is "like")
              //url:     '', // defaults to document.location.href

            // private
              $prep: function ( /*pluginCfg*/) {
                  var b = this;
                  b.width = b.width ||  (b.count==='box_count' ? 85 : 120);
                },
              $tmpl: '<div class="fb-like" data-send="{sendBtn}" data-layout="{count}" data-width="{width}" data-show-faces="{faces}" data-action="{verb}" data-colorscheme="{color}" data-href="{url}" />',
              $init: function (/* btn, cfg */) {
                  // https://developers.facebook.com/docs/reference/plugins/like/
                  if ( !$('#fb-root')[0] )
                  {
                    $('body').prepend('<div id="fb-root"/>');
                  }
                  injectScriptIfNeeded(
                      '//connect.facebook.net/'+ this.$locale() +'/all.js#xfbml=1',
                      function(){  window.FB  &&  FB.XFBML.parse();  }
                    );
                },
              $loc: '',
              $locs: {
                  is: 'is_IS',
                  dk: 'dk_DK',
                  pl: 'pl_PL',
                  fo: 'fo_FO',
                  no: 'nn_NO',
                  se: 'sv_SE',
                  de: 'de_DE'
                },
              $locale: function () {
                  this.$loc = this.$loc  ||  this.$locs[ $('html').attr('lang').substr(0,2) ]  ||  'en_US';
                  return this.$loc;
                },
              $pos:  50 // defaults to last position because when 'count' is set to '' - loads of text appear to the right of the button
            },


          gplus: {
              //url:   '', //  defaults to document.location.href
              count: '', //  'inline' (facebook-style) or 'none' (defaults to "bubble" (== '') )
              size:  'medium', // 'small', 'medium', '' (large), 'tall' (tall combined with count:'bubble' displays a vertically positioned counter)

            // private
              $tmpl: '<div class="g-plusone" data-size="{size}" data-annotation="{count}" data-href="{url}"/>',
              $init: function (/* btn, cfg */) {
                  // https://www.google.com/intl/en/webmasters/+1/button/index.html
                  injectScriptIfNeeded(
                      '//apis.google.com/js/plusone.js',
                      function(){  window.gapi  &&  gapi.plusone.go();  }
                    );
                },
              $pos:  20
            },


          pinterest: {
              //url:   '',  //  defaults to document.location.href
              imgsrc:'',  //  defaults to the first image on the page or the opengraph image
              count: '',       // '' == 'horizontal'. Other options: 'none', 'vertical'
              //imgSrcAttr: '',  // defaults to 'src'
              imgSelector: '.pgmain img',  // The `imgSrcAttr` value of the first image matching this selector will be used

            // private
              $tmpl: '<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pin-it-button" count-layout="{count}" lang="en">Pin It</a>',
                        //<img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" />
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
              $init: function (/* btn, cfg */) {
                  // http://pinterest.com/about/goodies/#button_for_websites
                  injectScript( 'https://assets.pinterest.com/js/pinit.js' );
                },
              $pos:  30
            }
        },



      loadedScripts = {},
      injectScript = function (url/*, callback */) {
          clearTimeout( loadedScripts[url] );
          loadedScripts[url] = setTimeout(function(){
              $.ajax({
                  dataType: 'script',
                  cache: true,
                  //success: callback,
                  url: url
                });
            }, 100);
        },
      injectScriptIfNeeded = function ( scriptURL, callback ) {
          var scriptState = loadedScripts[scriptURL];
          if ( !scriptState )
          {
            loadedScripts[scriptURL] = scriptState = {};

            // we do this instead of $.getScript() to avoid an annoying
            // cross-frame access violation error in Google Chrome. Ack!
            $('<script/>')
                .attr('src', scriptURL)
                .each(function () {
                    // This seems like the only way to insert a <script> element with jQuery...
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
                        clearTimeout( scriptState.timeout );
                        scriptState.timeout = setTimeout(callback, 100);
                      }
                      $(js).off(readystateevents);
                    }
                  });
          }
          else if ( callback  &&  scriptState.loaded )
          {
            clearTimeout( scriptState.timeout );
            scriptState.timeout = setTimeout(callback, 100);
          }
        };


  btnDefaults.fbshare2 = {
      url: '', // defaults to document.location.href

      $prep: function( /*pluginCfg*/ ) {
          btnDefaults.fbshare.$prep2.call(this);
        },
      $tmpl: btnDefaults.fbshare.$lnk+'%{url}" class="fbsharebtn">{txt}</a>',
      $pos:  40
    };




})(jQuery, document.location, encodeURIComponent, 'load readystatechange');
