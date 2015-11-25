const $ = window.jQuery;
$.noConflict(); // be strict about jQuery usage.
$.ajaxSettings.traditional = true; // (in jQuery 1.4+) Default to a backwards-compatible (non-PHP like) $.param() behaviour for serializing Arrays to query-strings.

$.fn.Req = $.fn.Req || function (...args) {
  const collection = this;
  args.forEach((queueItem) => {
    // This mock Req plugin simply ignores all script asset strings and objects
    // and just invokes the callbacks.
    if ( $.isFunction(queueItem) ) {
      queueItem.call( collection );
    }
  });
  return collection;
};
