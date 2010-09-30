// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.virtualBrowser v 1.1
// ----------------------------------------------------------------------------------
// Copyright 2010
//   Hugsmiðjan ehf. (http://www.hugsmidjan.is)  &
//   Már Örlygsson  (http://mar.anomy.net/)
//
// Dual licensed under a MIT licence (http://en.wikipedia.org/wiki/MIT_License)
// and GPL 2.0 or above (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html).
// ----------------------------------------------------------------------------------

/*
  jQuery.fn.virtualBrowser();
    Turns any element into a virtual browser window (or iframe), attempting to
    capture all link-clicks and form submits and convert them into ajax-requests,
    and then (manipulate and) insert the response document into the
    virtualBrowser element (which is the semantic equivalient of a real browser's <body>).

  Requires:
    * jQuery 1.4.2+


  Usage/Init:
    * $('#popupBody').virtualBrowser(options);
    * $('#popupBody').virtualBrowser(options, url);  // initial URL to load.


  Options:
    * url:           null,                      // String|linkElm|formElm|collection: Initial URL for the frame (Uses the 'href' or 'action' attributes in case elements were passed.)
    * params:        null,                      // Object/String: Persistent request data (as in $.get(url, data, callback) ) that gets added to *every* 'load' request.
    * noCache:       null,                      // Boolean: Controls the $.ajax() cache option
    * onBeforeload:  null,                      // Function: Shorthand for .bind('VBbeforeload' handler);
    * onLoad:        null,                      // Function: Shorthand for .bind('VBload', handler);
    * onLoaded:      null,                      // Function: Shorthand for .bind('VBloaded', handler);
    * loadmsgElm:    '<div class="loading" />'  // String/Element: Template for a loading message displayed while loading a URL
    * loadmsgMode:   'none',                    // String: Options: (none|overlay|replace)  // none == no load message; overlay == overlays the old content with the loadmsg; replace == removes the old content before displaying the loadmsg

  Localization:
    * jQuery.fn.virtualBrowser.i18n['lang'] = {
          loading: 'loading message in your language'
        };



  Events:
    * 'VBbeforeload'  // Triggered before the $.ajax call.
                      //  .bind('VBbeforeload', function (e, request) {
                              this  // the virtualBrowser body element
                              $(this).data('virtualBrowser').cfg  // config object
                              $(this).data('virtualBrowser').lastRequest // the request object from the last 'load'
                              request  // Object: {
                                       //   url:  // String the URL that was just loaded (Modifiable by handler)
                                       //   elm:  // jQuery collection containing (when applicable) the link (or form element) that was clicked/submitted
                                       // }
                              // Cancellable via e.preventDefault()
                              // cancel caching of the request by explicitly setting `request.noCache = true;`
                              // e.passThrough = true;  // Instructs the virtualBrowser to disable any click events and pass the click through to the web browser
                            });
    * 'VBload'        // Triggered after the $.ajax request has completed, *before* any DOM injection has taken place
                      //  .bind('VBload', function (e, request) {
                              this  // the virtualBrowser body element
                              $(this).data('virtualBrowser').cfg  // config object
                              $(this).data('virtualBrowser').lastRequest // the request object from the last 'load'
                              request  // Object: {
                                       //   result:     // String: The $.ajax()/$.get() callback responseText parameter (Read by handler)
                                       //   resultDOM:  // Element(s)/Collection to insert into the virtualBrowser body  (Set by handler)
                                       //   xhr:        // The XMLHTTPRequest object
                                       //   status:  // The friendly status msg returned by .ajax Complete callback (i.e. "notmodified", "success", "error", "timeout", etc.)
                                       //   url:     // String the URL that was just loaded
                                       //   params:  // String the contents of the $.ajax data property
                                       //   method:  // String the method that was used (either "GET" or "POST")
                                       //   noCache: // boolean (defaults to false)
                                       //   elm:     // jQuery collection containing (when applicable) the link (or form element) that was clicked/submitted
                                       // }
                              // Cancellable via e.preventDefault()
                            });

    * 'VBloaded'      // Triggered *after* the resultDOM has been injected into the virtualBrowser body. Think of it as `window.onload` of sorts.
                      //  .bind('VBloaded', function (e, request) {
                              this  // the virtualBrowser body element
                              $(this).data('virtualBrowser').cfg // config object
                              $(this).data('virtualBrowser').lastRequest // the *current* request object
                              request  // Object: {
                                       // ...all the same properties as the 'VBload' event EXCEPT: `result`, `resultDOM` and `xhr`...
                                       // }
                              // Uncancellable!
                            });


  Methods:
    * 'load'    // .virtualBrowser('load', url|linkElm|formElm|collection);  // loads an url (or the 'href' or 'action' attributes of an element) inside the virtualBrwoser 'body' element. Triggers the normal 'vbrowserpreload' and 'vbrowserload' events
    * 'data'    // syntactic sugar method that returns .data('virtualBrowser') - an object containing:
                //    cfg:          // the config object for his virtualBrowser
                //    lastRequest:  // the request object used in the last 'load' action (updated just *before* 'VBloaded' is triggered)


  TODO/ideas:
    * Consider rewriting $.injectBaseHrefToHtml() to use DOM-based methods instead of those crazy RegExps. (See below.)
    * Consider adding history buffer 'back' (and 'forward'?) methods
        * and an off-by-default 'storeDomWithHistory' option that would store the previous DOM states as-is (with events, data and all) in the history buffer.
        * and 'request' method to retrieve requests from a history buffer.
    * Consider adding 'reload' sugar method (Already possible via performing 'load' on the VBdata.lastRequest object).

*/

(function($, undefined){

  // make all relative URLs explicitly Absolute - based on a base URL
  $.injectBaseHrefToHtml = function (html, url) {
      // WARNING: horrendous RegExp based HTML parsing follows...
      // I'm not sure, however, if it's even possible to do this via DOM methods -
      // since the HTML to DOM conversion may mangle the relative URLs...
      // Needs research.

      // Example: url == 'http://foo.com/path/file?bar=1#anchor'
      var fileUrl = url.split('#')[0],                                      // 'http://foo.com/path/file?bar=1'
          filePart = fileUrl[_replace](/([^?]*\/)?(.*)/, '$2'),              // file?bar=1
          pathPrefix = fileUrl.split('?')[0][_replace](/(.*\/)?.*/, '$1');  // 'http://foo.com/path/'

      html =  html
                  [_replace](/(<[^>]+ (href|src|action)=["'])(["'#])/gi, '$1'+filePart+'$3') // prepend all empty/withinpage urls with filePart
                  [_replace](/(<[^>]+ (href|src|action)=["'])\?/gi, '$1'+filePart.split('?')[0]+'?') // prepend all samepage querystring URLs ("?baz=1") with just the filename
                  [_replace](/(["'])([a-z]{3,12}:)/gi, '$1`<<`>>$2') // Escape all protocol names (potential URLs) for easy, cross-browser RegExp detection
                  [_replace](/(<[^>]+ (href|src|action)=["'])([^\/`])/gi, '$1'+pathPrefix+'$3') // prepend pathPrefix to all relative URLs (not starting with `/`, `//`, ` ({protocol}:)
                  [_replace](/\`<<`>>/g, ''); // Unescape "protocol" back to normal
      return html;
    };


  // Turns `$.get`/`$.ajax` responseText HTML document source into a DOM tree, wrapped in a `<div/>` element for easy `.find()`ing
  // Stripping out all nasty `<script>`s and such things.
  $.getResultBody = function (responseText) {
      //return $('<body/>').append( // <-- this seems to cause crashes in IE8. (Note: Crash doesn't seem to happen on first run)
      return $('<div/>').append(
                  $(responseText||[])
                      .not('script,title,meta,link,style')
                          .find('script,style')
                              .remove()
                          .end()
                );
    };

  var _docLoc            = document.location,
      _isDefaultPrevented = 'isDefaultPrevented',  // ...to save bandwidth
      _stopPropagation    = 'stopPropagation',     // ...to save bandwidth
      _passThrough        = 'passThrough',         // ...to save bandwidth
      _virtualBrowser     = 'virtualBrowser',      // ...to save bandwidth
      _VBbeforeload       = 'VBbeforeload',        // ...to save bandwidth
      _VBload             = 'VBload',              // ...to save bandwidth
      _VBloaded           = 'VBloaded',            // ...to save bandwidth
      _replace            = 'replace',             // ...to save bandwidth
      _protocolSlash      = /^(https?:)?\/\//,



      _methods = {
          'load': function (url) {
              var elm = typeof url != 'string' ? $(url) : undefined,
                  body = $(this),
                  VBdata = body.data(_virtualBrowser),
                  config = VBdata.cfg,
                  evBeforeload = $.Event(_VBbeforeload),
                  evLoad, evLoaded,
                  loadmsgMode = config.loadmsgMode,
                  request = { elm: elm };

              if (elm)
              {
                url = elm.attr('href');
                url = url === undefined ? elm.attr('action') : url;
              }
              // Correctly resolve relative empty-string URLs (like <form action="">)
              url = request.url = url === '' ? _docLoc.href : url;

              if (url)
              {
                evBeforeload[_stopPropagation]();
                body.trigger(evBeforeload, request);
                // trap external (non-AJAXable) URLs or links targeted at another window and set .passThrough as true
                if (  // if passThrough is already set, then there's not need for further checks, and...
                      !evBeforeload[_passThrough] &&
                      (
                        (
                          // if event handler hasn't explicitly set passThrough to false
                          evBeforeload[_passThrough] === undefined  &&
                          // and elm is defined, and is `target`ted at an external window  // IDEA: allow named virtualBrowsers to target and trigger 'open' actions on eachother
                          elm  &&  elm[0].target  &&  elm[0].target != window.name
                        )
                          || // ...or...
                        (
                          /^([a-z]{3,12}:|\/\/)/i.test(url)  &&  // the URL starts with a protocol (as well as "protocol-neutral" URLs (//host.com/).)
                          // and the URL doesn't start with the same hostName and portNumber as the current page.
                          !url.toLowerCase()[_replace](_protocolSlash, '').indexOf( _docLoc.href.toLowerCase()[_replace](_protocolSlash, '').split('/')[0] ) == 0
                        )
                      )
                    )
                {
                  evBeforeload[_passThrough] = true;
                }
                // virtualBrowser should not handle .passThrough events.
                evBeforeload[_passThrough]  &&  evBeforeload.preventDefault();

                if ( !evBeforeload[_isDefaultPrevented]() )
                {
                  var noCache = request.noCache =  request.noCache !== undefined ? request.noCache : config.noCache,
                      params = config.params || '',
                      method = 'GET';
                  if (elm && elm.is('form'))
                  {
                    method = elm.attr('method') || method;
                    params += '&' + elm.serialize();
                    var clickedButton = VBdata._clickedBtn;
                    if ( clickedButton )
                    {
                      params += '&'+ $.param( clickedButton );
                      delete VBdata._clickedBtn
                    }
                  }
                  request.params = params;
                  request.method = method;

                  $.ajax({
                      url: request.url.split('#')[0],  // just to be safe :)
                      data: params,
                      type: method,
                      cache: !noCache,
                      complete:  function (xhr, status) {
                                    request.result = $.injectBaseHrefToHtml(xhr.responseText, request.url);
                                    request.xhr = xhr;
                                    request.status = status;
                                    evLoad = $.Event(_VBload);
                                    evLoad[_stopPropagation]();
                                    body.trigger(evLoad, request);
                                    if ( !evLoad[_isDefaultPrevented]() )
                                    {
                                      evLoaded = $.Event(_VBloaded);
                                      evLoaded[_stopPropagation]();
                                      config.loadmsgElm.detach();
                                      body
                                          .empty()
                                          .append( request.resultDOM || $.getResultBody(request.result).contents() );
                                      // Throw out unneccessary properties that we don't want to store. (Saves memory among other things.)
                                      delete request.resultDOM;
                                      delete request.result;
                                      delete request.xhr;
                                      VBdata.lastRequest = request;
                                      body
                                          .trigger(evLoaded, request);
                                    }
                                  }
                      });
                  if (loadmsgMode && loadmsgMode != 'none')
                  {
                    config.loadmsgMode == 'replace'  &&  body.empty();
                    body.append(config.loadmsgElm);
                  }
                }
              }
              return evBeforeload;
            },

          'data': function () {
              return $(this).data(_virtualBrowser);
            }

        },


      _handleHttpRequest = function (e) {
          var elm = $(e.target).closest(
                          e.type == 'click' ?
                              '[href], input:submit, button:submit' :
                              'form' // e.type == 'submit'
                        );
          if (elm[0])
          {
            if ( !e[_isDefaultPrevented]() )
            {
              if ( !elm.is(':submit') )
              {
                var bfloadEv = _methods['load'].call(this, elm);
                bfloadEv.isPropagationStopped()  &&  e[_stopPropagation]();
                !bfloadEv[_passThrough] && e.preventDefault();
              }
              else if ( elm.is('[name]') )
              {
                var VBdata = $(this).data(_virtualBrowser);
                // make note of which submit button was clicked.
                VBdata._clickedBtn = elm;
                // in case the 'submit' event on the form gets cancelled we need to guarantee that this value gets removed.
                // A timeout should (theoretically at least) accomplish that.
                setTimeout(function(){ delete VBdata._clickedBtn; }, 0);
              }
            }
          }
        },



      fnVB = $.fn[_virtualBrowser] = function (config, args) {
          var confIsString = typeof config == 'string';
          if (confIsString)
          {
            var method = _methods[config];
            method  &&  this.each(function(){
                  method.apply( this, [].concat(args) );  // Normalize `args` into an array. ([].concat() does that :-)
                });
          }
          else
          {
            config = $.extend(
                    {
                      //url:          null,                     // String: Initial URL for the frame
                      //noCache:      false,                    // Boolean: Controls the $.ajax() cache option
                      //params:       null,                     // Object/String: Persistent request data (as in $.get(url, data, callback) ) that gets added to *every* 'load' request.
                      //onBeforeload: null,                     // Function: Shorthand for .bind('VBbeforeload' handler);
                      //onLoad:       null,                     // Function: Shorthand for .bind('VBload' handler);
                      //onLoaded:     null,                     // Function: Shorthand for .bind('VBloaded' handler);
                      //loadmsgElm:  '<div class="loading" />'  // String/Element: Template for a loading message displayed while loading a URL
                      loadmsgMode:    'none'                    // String: available: "none", "overlay" & "replace"
                    },
                    config || {}
                  );
            args && (config.url = args);
            var body = this,
                loadmsgElm = config.loadmsgElm || '<div class="loading" />',
                // Automatically sniff the document language and choose a loading message accordingly - defaulting on English
                loadmsg = (fnVB.i18n[body.closest('*[lang]').attr('lang')] || {}).loading || fnVB.i18n.en.loading;

            if (loadmsgElm.charAt)
            {
              loadmsgElm = loadmsgElm.replace(/%\{msg\}/g, loadmsg);
            }
            loadmsgElm = config.loadmsgElm = $(loadmsgElm);
            if ( !loadmsgElm.text() )
            {
              loadmsgElm.append(loadmsg);
            }

            body
                .data(_virtualBrowser, { cfg: config })
                // Depend on 'click' events bubbling up to the virtualBrowser element to allow event-delegation
                // Thus, we assume that any clicks who's bubbling were cancelled should not be handled by virtualBrowser.
                .bind( 'click submit', _handleHttpRequest);

            config.onLoad  &&  body.bind(_VBload, config.onLoad);
            config.onLoaded  &&  body.bind(_VBloaded, config.onLoaded);
            config.onBeforeload  &&  body.bind(_VBbeforeload, config.onBeforeload);
            config.params = typeof config.params == 'string' ?
                                config.params:
                                $.param(config.params||{});

            config.url  &&  body[_virtualBrowser]('load', config.url)
          }

          return this;
        };



  fnVB.i18n = {
      // FIXME: add more translations...
      en: { loading: 'Loading...' },
      is: { loading: 'Sæki gögn...' }
    }

})(jQuery);