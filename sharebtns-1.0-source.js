// ----------------------------------------------------------------------------------
// jQuery.fn.sharebtns v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
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
     facebook:  true,     // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Facebook "Like" button
     fbshare:   false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Facebook "Share" button
     gplus:     false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Google+ "+1" button
     pinterest: false,    // Boolean|Number(non-zero position index)|Object(button config)  - non-falsy values insert Pinterest "PinIt" button

     wrap:      null,     // String(tagName) - if non-empty each button is wrapped in a "tagName" Element with "buttonName" as its className.
                          //                   i.e.  wrap:'li', -->  .wrap(<li class="twitter"/>);
     process:   function ( btnHTML, btnName, btnCfg ) { // allows modifying each button before injection
                     // do stuff - like adding a wrapper, or modifying the HTML, or whatever...
                     return updatedHTMLorElm || btnHTML;
                  }
     insertion: 'append', // String  - jQuery method used to insert the buttons.  Accepted values: 'append', 'prepend', 'after', 'before'

     url:       '',       // String  - Url to share. Defaults to document.location.href

     large:     false,    // Boolean  - true prints a large version of the button, where supported (not supported by Facebook)
     countNone: false,    // Boolean  - true suppresses the display of tweet-/like-/share counter balloons. (not supported by Facebook)
     countV:    false,    // Boolean  - true displays vertically positioned share-counter ballonons.
     dark:      false,    // Boolean  - true hints that the buttons should use a "dark" color-scheme.
     custom:    false,    // Boolean  - true inserts plaintext links and skips the $init phase, where possible.

     ...additionally each button type has its own config object.
     See "btnDefaults" below for details.

*/


(function($, docLoc, encURI, readystateevents){

  var
      pageLang,

      sharebtns = $.fn.sharebtns = function ( cfg ) {
          pageLang = pageLang || $('html').attr('lang').substr(0,2) || 'en';

          var buttonsToInsert = [];
          if ( this.length )
          {
            cfg = $.extend(true, {}, defaultCfg, cfg);
            $.each(btnDefaults, function (btnName, btnDefaultCfg) {
                var cfgBtnName = cfg[btnName];
                if ( cfgBtnName )
                {
                  var bCfg = cfg[btnName] = $.extend({ custom:cfg.custom, url:cfg.url, lang:pageLang }, btnDefaultCfg);
                  $.each(presets, function(propName, presetVals){
                      presetVals = presetVals[btnName];
                      cfg[propName]  &&   presetVals  &&  $.extend(bCfg, presetVals);
                    });
                  $.extend(bCfg, cfgBtnName);
                  // allow cfgBtnName itself to be a $pos number
                  bCfg.$pos = typeof cfgBtnName === 'number' ? cfgBtnName : bCfg.$pos || 0;
                  bCfg.$prep && bCfg.$prep( cfg );
                  var newBtn = bCfg.$tmpl.replace(/(%=?)?\{(.+?)\}/g, function(m,p1,p2){
                                                                          var val = bCfg[p2];
                                                                          return  !p1 ? // we have a plain {key} marker (i.e. NOT preceeded by % or %=)
                                                                                      val:
                                                                                  p1==='%' ? // %{key} marker means we should URI encode
                                                                                      encURI(val):
                                                                                  // We must have a %={key} marker. (Prints a full (encoded) URL parameter -- i.e. "key=keyValue&amp;" )
                                                                                  val!=null ? // but only if it has some value.
                                                                                      p2+'='+encURI(val)+'&amp;':
                                                                                      ''; // default to not printing anything...
                                                                        });
                  if ( cfg.wrap ) { newBtn = '<'+cfg.wrap+' class='+btnName+'>'+newBtn+'</'+cfg.wrap+'>'; }
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
          //custom:    false,
          url: $('link[rel="canonical"]').prop('href') || docLoc.href.split('#')[0].replace(/[?&]fb_action_ids=.+/,'')
        },
      countNone={ count:'none' },
      presets = {
          dark:      { fbshare:{color:'dark'}, facebook:{color:'dark'}  },
          large:     { twitter:{size:'l'},     facebook:{},                   gplus:{size:''},               pinterest:{} },
          countNone: { twitter:countNone,      facebook:{count:'standard'},   gplus:countNone,               pinterest:countNone },
          countV:    { twitter:{ count:'vertical' },  facebook:{count:'box_count'},  gplus:{count:'',size:'tall'},  pinterest:{ count:'above' } }
        },




      btnDefaults = sharebtns.btnDefaults = {

          twitter: {
              size:     'm', // or 'l'
              count:    '',       // '' == 'horizontal'. Other options: 'none', 'vertical'
              via:      '',       // Optional twitter username to mention/link to. Example: "foobar"
              related:  '',       // Optional list of recommended usernames. Example: "anywhere:The Javascript API,sitestreams,twitter:The official account"
              lang:     '',       // Optional language setting ??? defaults to 'en'
              hashtags: '',       // Optional comma-delmited list of hashtags. (e.g. 'cooloption,hipster,socool')
              text:     '',       // Optional default tweet body text.
              //url:      '',       // defaults to document.location.href
              //txt:      null,     // Link text for customized links

            // private
              $prep: function( /*pluginCfg*/ ) {
                  var b = this;
                  if ( b.custom )
                  {
                    var txt = { en:'Tweet this!', is:'Senda á Twitter' };
                    b.txt = b.txt || txt[b.lang] || txt.en;
                    b.$tmpl = '<a onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="tweetit"'+
                                ' href="https://twitter.com/intent/tweet?%={via}%={related}%={hashtags}%={text}%={url}%={lang}"'+
                              '>{txt}</a>';
                  }
                  else
                  {
                    var hCount = !b.count || b.count === 'horizontal',
                        vCount = b.count === 'vertical',
                        large = b.size === 'l';
                    // we must size the iframe manually because Twitter doesn't provide an API for initing/parsing ajax-injected buttons
                    b.width =  (hCount && large) ? '138px' : hCount ? '110px' : large ? '76px' : '58px';
                    b.height = large ?  '28px' : vCount ?  '62px' : '20px'; // vercial && large seems not to be supported by Twitter
                  }
                },
              $tmpl:  '<iframe src="//platform.twitter.com/widgets/tweet_button.html?%={size}%={count}%={via}%={related}%={hashtags}%={text}%={url}%={lang}" style="width:{width}; height:{height};" allowtransparency="true" frameborder="0" scrolling="no" />',
              $pos:  10 // lowest $pos comes first
            },


          fbshare: {
              color: '', // 'dark',
              //url:   '',    // defaults to document.location.href
              //txt:   null,  // Link text for customized links

            // private
              $prep: function ( /*pluginCfg*/ ) {
                  var b = this;
                  if ( !b.txt )
                  {
                    var txts = { en: 'Share',  is: 'Deila' };
                    b.txt = txts[ b.lang ];
                    if ( !b.txt )
                    {
                      b.lang = 'en';
                      b.txt = txts.en;
                    }
                  }
                  if ( b.custom )
                  {
                    b.$tmpl = btnDefaults.fbshare.$lnk+'%{url}" class="fbsharebtn">{txt}</a>';
                  }
                  else
                  {
                    b.width =  '5.636em'; // 62px @ 11px font-size
                    b.height = '1.818em'; // 20px @ 11px font-size
                  }
                },
              $lnk: '<a onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="fbshare" href="//www.facebook.com/sharer.php?u=',
              $tmpl: '<iframe data-sharebtns="fbshare" style="width:{width};height:{height};font-size:11px;" allowtransparency="true" frameborder="0" scrolling="no" />',
              $init: function ( btn/*, cfg*/ ) {
                  var b = this,
                      iframeDoc = btn.filter('iframe').add(btn.find('iframe')).eq(0) // btn might have been wrapped or otherwise modified by the optional custom "process" method
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
              $pos:  40
            },


          facebook: {
              width:   null,           // min-width for the iframe
              count:   'button_count', // 'standard', 'box_count'
              sendBtn: false,
              faces:   false,
              color:   '', // 'dark',
              verb:    '', // 'recommend' (default text is "like")
              custom:  false, // facebook like button CAN NOT be customized!
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
              count:   '', //  'inline' (facebook-style) or 'none' (defaults to "bubble" (== '') )
              size:    'medium', // 'small', 'medium', '' (large), 'tall' (tall combined with count:'bubble' displays a vertically positioned counter)
              custom:  false, // Google Plus +1 button CAN NOT be customized!

            // private
              $prep: function ( /*pluginCfg*/ ) {
                  this.count = this.count ? ' data-annotation="'+this.count+'"' : '';
                },
              $tmpl: '<div class="g-plusone" data-size="{size}"{count} data-href="{url}"/>',
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
              //url:         '',  //  defaults to document.location.href
              imgsrc:      '',  //  defaults to the first image on the page or the opengraph image
              count:       'beside',       // '' (horizontal). Other options: 'none', 'above'
              //imgSrcAttr:  '',  // defaults to 'src'
              imgSelector: '.pgmain img',  // The `imgSrcAttr` value of the first image matching this selector will be used
              txt:         'Pin it',     // Link text for customized links

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
                  if ( b.custom )
                  {
                    b.$tmpl = '<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pinitbtn" onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="pinitwin" lang="en">{txt}</a>';
                  }
                },
              $tmpl: '<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pin-it-button" data-pin-do="buttonPin" data-pin-config="{count}" lang="en">{txt}</a>',
                        //<img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" />
              $init: function (/* btn, cfg */) {
                  // http://business.pinterest.com/widget-builder/#do_pin_it_button
                  injectScript( 'https://assets.pinterest.com/js/pinit.js' );
                },
              $pos:  30
            }
        };


  btnDefaults.fbshare2 = $.extend({}, btnDefaults.fbshare, { custom:1 }); // <-- Left in for posterity for backwards compatibility



  // =====================================================================

  var loadedScripts = {},
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




})(jQuery, document.location, encodeURIComponent, 'load readystatechange');
