// Finds and returns a collection of the (first) deepest child element...
// Useful when you want to emulate .wrap() and .wrapAll(), without cloning...
window.jQuery.fn.deepest = function () {
  return this.map(function () {
      var elem = this;
      while ( elem.firstChild ) {
        elem = elem.firstChild;
      }
      return elem;
    });
};
