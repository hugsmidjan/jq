// encoding: utf-8
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
//    twitter:   true,     // Boolean|Number(non-zero order index)|Object(button config)  - non-falsy values insert Twitter "Tweet" button
//    facebook:  true,     // Boolean|Number(non-zero order index)|Object(button config)  - non-falsy values insert Facebook "Like" button
//    gplus:     false,    // Boolean|Number(non-zero order index)|Object(button config)  - non-falsy values insert Google+ "+1" button
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
//
//    ...additionally each button type has its own config object.
//    See "btnDefeaults" below for details.
//
//
//

(function($,doc,script){

  var sharebtns = $.fn.sharebtns = function ( cfg ) {
          var buttonsToInsert = [];
          if ( this.length )
          {
            cfg = $.extend(true, {}, defaultCfg, cfg);
            $.each(btnDefeaults, function (btnName, btnDefaultCfg) {
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
                  bCfg.$pos = bCfg.$pos || 1*cfgBtnName || 0;
                  bCfg.$prep && bCfg.$prep( bCfg, cfg );
                  var newBtn = bCfg.$tmpl.replace(/(%)?\{(.+?)\}/g, function(m,p1,p2){
                                                                          var val = bCfg[p2];
                                                                          return !p1 ? val : val ? p2+'='+encodeURIComponent(val)+'&' : '';
                                                                        });
                  newBtn = $( cfg.process ? cfg.process(newBtn, btnName, bCfg) : newBtn );
                  newBtn.$pos = bCfg.$pos;
                  buttonsToInsert.push( newBtn );
                  bCfg.$init && setTimeout(function(){ bCfg.$init(); }, 0);
                }
              });
            buttonsToInsert.sort(function(a,b){ var d = a.$pos-b.$pos; return d>0 ? 1 : d<0 ? -1 : 0; });
            this[cfg.insertion].apply( this, buttonsToInsert );
          }
          return this.pushStack( buttonsToInsert );
        },

      defaultCfg = sharebtns.defaults = {
          twitter:   true, // or a non-zero Number to indicate $pos
          facebook:  true,
          //gplus:   false,
          //process:   function ( btnHTML, btnName, btnCfg ) {
          //                // do stuff - like adding a wrapper, or modifying the HTML, or whatever...
          //                return updatedHTMLorElm || btnHTML;
          //             }
          insertion: 'append',
          //countNone: false,
          //countV:    false,
          //large:     false,
          url: ''
        },
      presets = {
          large:     { twitter:{size:'l'},         facebook:{},                   gplus:{size:''}               },
          countNone: { twitter:{count:'none'},     facebook:{count:'standard'},   gplus:{count:'none'}          },
          countV:    { twitter:{count:'vertical'}, facebook:{count:'box_count'},  gplus:{count:'',size:'tall'}  }
        },

      btnDefeaults = sharebtns.btnDefeaults = {

          twitter: {
              size:     'm', // or 'l'
              count:    '',       // '' == 'horizontal'. Other options: 'none', 'vertical'
              via:      '',       // Twitter username. Example: "foobar"
              related:  '',       // Recommended usernames. Example: "anywhere:The Javascript API,sitestreams,twitter:The official account"
              lang:     '',       // defaults to 'en'
              hashtags: '',       // 
              text:     '',       // defaults to <title>
              url:      '',       // defaults to document.location.href

              // we must inject a manually-sized iframe because Twitter doesn't provide an API for initing/parsing ajax-injected buttons
              $prep: function( b, pluginCfg ) {
                  var hCount = !b.count || b.count == 'horizontal',
                      vCount = b.count == 'vertical',
                      large = b.size == 'l';
                  b.width =  (hCount && large) ? '138px' : hCount ? '110px' : large ? '76px' : '58px';
                  b.height = large ?  '28px' : vCount ?  '62px' : '20px'; // vercial && large seems not to be supported by Twitter
                },
              $tmpl:  '<iframe src="//platform.twitter.com/widgets/tweet_button.html?%{size}%{count}%{via}%{related}%{hashtags}%{text}%{url}%{lang}" style="width:{width}; height:{height};" allowtransparency="true" frameborder="0" scrolling="no" />',
              $pos:  10 // highest $pos comes first
            },

          facebook: {
              width:   100,            // min-width for the iframe
              count:   'button_count', // 'standard', 'box_count'
              sendBtn: false,
              faces:   false, 
              color:   '', // 'dark',
              verb:    '', // 'recommend' (default text is "like")
              url:     '', // defaults to document.location.href

              $tmpl: '<div class="fb-like" data-send="{sendBtn}" data-layout="{count}" data-width="{width}" data-show-faces="{faces}" data-action="{verb}" data-colorscheme="{color}" data-href="{url}" />',
              $init: function () {
                  // https://developers.facebook.com/docs/reference/plugins/like/
                  if ( !$('#fb-root')[0] )
                  {
                    $('body').prepend('<div id="fb-root"/>');
                    injectScriptIfNeeded( 'facebook-jssdk', '//connect.facebook.net/'+ this.$locale() +'/all.js#xfbml=1' );
                  }
                  window.FB  &&  FB.XFBML.parse();
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
              $pos:  30 // defaults to last position because when 'count' is set to '' - loads of text appear to the right of the button
            },

          gplus: {
              url:   '', //  defaults to document.location.href
              count: '', //  'inline' (facebook-style) or 'none' (defaults to "bubble" (== '') )
              size:  'medium', // 'small', 'medium', '' (large), 'tall' (tall combined with count:'bubble' displays a vertically positioned counter)

              $tmpl: '<div class="g-plusone" data-size="{size}" data-annotation="{count}" data-href="{url}"/>',
              $init: function () {
                  // https://www.google.com/intl/en/webmasters/+1/button/index.html
                  injectScriptIfNeeded( 'gplus-script', 'https://apis.google.com/js/plusone.js' );
                  window.gapi  &&  gapi.plusone.go();
                },
              $pos:  20
            }
        },

      injectScriptIfNeeded = function ( id, url ) {
          if ( !doc.getElementById( id ) ) 
          {
            var firstScript = doc.getElementsByTagName(script)[0],
                js = doc.createElement(script);
            js.id = id;
            js.src = url;
            firstScript.parentNode.insertBefore(js, firstScript);
          }
        };



})(jQuery, document, 'script');