const $ = window.jQuery;

const findUntil = function (collection, expr, inclTextNodes, goBackwards) {
  var match = [];
  var method = (goBackwards ? 'previous':'next')+'Sibling';
  collection.each(function () {
    for (var next = this[method], isElm; next; next = next[method] ) {
      isElm = (next.nodeType === 1);
      if ( inclTextNodes || isElm ) {
        if (isElm && !$(next).not(expr).length ) {
          break;
        }
        match.push( next );
      }
    }
  });
  return collection.pushStack(match);
};

// different from the built-in jQuery 1.4 methods, because it (optionally) also collects textNodes as well as Elements
$.fn.nextUntil = function (expr, inclTextNodes) { return findUntil(this, expr, inclTextNodes); };
$.fn.prevUntil = function (expr, inclTextNodes) { return findUntil(this, expr, inclTextNodes, 1); };
