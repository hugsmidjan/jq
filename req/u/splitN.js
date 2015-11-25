window.jQuery.fn.splitN = function (n, func) {
  var i = 0;
  var len = this.length;
  var args = [].slice.call(arguments, 2);
  while ( i<len ) {
    func.apply( this.slice(i, i+n), args );
    i += n;
  }
  return this;
};
