import zapElm from 'qj/zapElm';

// the reverse of $.fn.wrap()
// only works if the target element is in the DOM.
window.jQuery.fn.zap = function () {
  return this.each((i, elm) => zapElm(elm));
};
