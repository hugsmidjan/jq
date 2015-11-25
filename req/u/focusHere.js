import focusElm from 'qj/focusElm';

const $ = window.jQuery;

$.focusHere = function (_elm, opts) {
  if ( _elm.length ) {
    _elm = _elm[0];
  }
  opts = opts || {};
  opts.offset = opts.offset || $.focusOffset();
  focusElm(_elm, opts);
};

// place .focusHere() on the first element in the collection
$.fn.focusHere = function (opts) {
  $.focusHere(this[0], opts);
  return this;
};

// $.focusOffset provides a default scroll-offset value for $.focusHere()
$.focusOffset = function (/*elm*/) { return 30; };
