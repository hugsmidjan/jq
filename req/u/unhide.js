// Un-opinionated .show()
// simply removes style="display:none" and hands things over to the CSS
window.jQuery.fn.unhide = function () {
  return this.css('display', '');
};
