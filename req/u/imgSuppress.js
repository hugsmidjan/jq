// Escape img[src] values in incoming Ajax html result bodies to avoid automatic preloading of all images.
// don't use data-src="" by default - to avoid conflict with data-src="" set on the server-side as a part of deliberate lazyloading, etc.

var $ = window.jQuery;

$.imgSuppress = (html, attr) => {
  return html && html.replace( /(<img[^>]*? )src=/gi, '$1'+(attr||'data-srcAttr')+'=' );
};

$.imgUnsuppress = (dom, attr) => {
  if ( dom ) {
    attr = attr || 'data-srcAttr';
    if ( typeof dom === 'string') {
      dom = dom.replace( new RegExp('(<img[^>]*? )'+attr+'=', 'gi') ,'$1src=' );
    }
    else {
      var elms = [];
      var domArr = dom.nodeType ? [dom] : [].slice.call(dom);
      domArr.forEach(function (elm) {
        if ( elm.nodeName === 'img' && elm.hasAttribute(attr) ) {
          elms.push(elm);
        }
        elms.push.apply( elms, elm.querySelectorAll('img['+ attr +']') );
      });
      elms.forEach(function (img) {
        var attrVal = img.getAttribute(attr);
        img.removeAttribute( attr );
        img.setAttribute( 'src', attrVal );
      });
    }
  }
  return dom;
};

// Reinserts img[src] values escaped by $.imgSuppress()
$.fn.imgUnsuppress = function (attr) { return $.imgUnsuppress(this, attr); };
