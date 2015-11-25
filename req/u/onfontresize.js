// define a custom event, window.onfontresize that fires whenever the document.body font-size changes.
// TODO: allow binding to elements other than just window/body
var $ = window.jQuery;

var _fontresizeInterval;
var _body;
var _lastSize;
var _monitorFontSize = function () {
  var _spanSize = _body.css('fontSize');
  if (_spanSize !== _lastSize) {
    _lastSize = _spanSize;
    $(window).trigger('fontresize');
  }
};

$.event.special.fontresize = {

  setup: function () {
    if (this === window  || this === document.body) {
      _body = $('body');
      _lastSize = _body.css('fontSize');
      _fontresizeInterval = setInterval(_monitorFontSize, 500);
    }
  },

  teardown: function () {
    if (this === window  ||  this === document.body) {
      clearTimeout( _fontresizeInterval );
    }
  },

};
