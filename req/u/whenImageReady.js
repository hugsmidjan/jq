// Bind one-time 'load' events to images and ensure they trigger for already loaded (i.e. cached) images
// NOTE: This plugin does not pretend to fix or trigger existing normally bound 'load' events.
// NOTE: If you update an <img>'s src="" - then you need to re-run the plugin and
//       re-bind the event handler if you also want it to handle the new image.
var $ = window.jQuery;

$.fn.whenImageReady = function (eventHandler, noTriggering) {
  var images = this;
  eventHandler && images.one('load.j2x5u', eventHandler);
  // use timeout to ensure a slightly more predictable behaviour
  // across a mixed collection of load and not-loaded images
  !noTriggering && setTimeout(function () {
    images.each(function (src, img) {
      // Firefox and Chrome have (had?) tendency to report 404 images as complete -
      // so we also check for .naturalWidth to make sure the image has really loaded.
      if ( img.complete  &&  img.naturalWidth !== 0 ) {
        // use namespace to avoid triggering existing (normally bound) load-events a second time
        $(img).trigger('load.j2x5u');
      }
    });
  }, 0);

  return images;
};
