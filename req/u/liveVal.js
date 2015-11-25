import liveVal from 'qj/liveVal';

const $ = window.jQuery;

$.liveVal = liveVal;
// update input/textarea values while maintaining cursor-position *from end*
$.fn.liveVal = function (value) {
  return this.each(function (i, input) { liveVal(input, value); });
};
