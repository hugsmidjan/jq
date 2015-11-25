// DEPRICATED: Use .focusHere() instead!
// Focus an _element (or it's first focusable _subElm)
// (for screen-reader accessibility)
var $ = window.jQuery;

$.setFocus = function (_elm) {
  if (_elm) {
    _elm = $(_elm);
    var _focusables = ',A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,';
    var _focusElm = _focusables.indexOf(','+_elm[0].tagName+',')>-1  &&  _elm.is(':visible')  &&  _elm[0];

    if ( !_focusElm  &&  _elm.is(':visible') ) {
      _elm.find('*').each(function (i, elm) {
        if ( _focusables.indexOf(','+elm.tagName+',') > -1  &&  $(elm).is(':visible') ) {
          _focusElm = elm;
          return false;  // break the .each loop
        }
      });
    }
    if (_focusElm) {
      // Make note of current scroll position
      var $$ = $(document);
      var _before = $$.scrollTop();

      // Focus the element!
      $(_focusElm)[0].focus();

      // Check for new scroll position
      if ($$.scrollTop() !== _before) {
        // if the browser jumped to the anchor...  (the browser only scrolls the page if the _focusElm was outside the viewport)
        // ...then scroll the window to place the anchor at the top of the viewport.
        // (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
        var _newTop = $(_elm).offset().top - 30;
        if (_newTop < 10) { _newTop = 0; }
        $$.scrollTop(_newTop);
      }
    }
    //return focusElm;  // <-- Idea: return the focuesed element?
  }
};

$.fn.setFocus = function () {
  $.setFocus(this[0]);
  return this;
};

