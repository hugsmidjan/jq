export default function jQueryOnload($) {
  window.jQuery = $;
  // BTW, Because we're operating in CommonJs/module land
  // there's no need to run $.noConflict(); at this point.
  // However, window.jQuery.noConflict(true); will work as normal!

  $.ajaxSettings.traditional = true; // (in jQuery 1.4+) Default to a backwards-compatible (non-PHP like) $.param() behaviour for serializing Arrays to query-strings.

  $.fn.andSelf = $.fn.andSelf || $.fn.addBack; // support old use af .andSelf (debatable?)

  $.fn.Req = $.fn.Req || function (...args) {
    const collection = this;
    if ( window.Req ) {
      window.Req.apply(null, $.map(args, (a) => ($.isFunction(a) ? () => { a.call(collection); } : a )) );
    }
    else {
      setTimeout(() => {
        args.forEach((queueItem) => {
          // This mock Req plugin simply ignores all script asset strings and objects
          // and just invokes the callbacks.
          if ( $.isFunction(queueItem) ) {
            queueItem.call( collection );
          }
        });
      }, 0);
    }
    return collection;
  };

}
