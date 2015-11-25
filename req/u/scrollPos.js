  // Yes this is strictly speaking completely redundant,
  // but jQuery's fn.scrollLeft and fn.scrollTop methods are so #$% inelegant to use.
  //
  // Usage:
  // collection.scroll();                    // returns { left:pageXOffset,  top:pageYOffset }
  // collection.scroll(xPos, yPos);          // scrolls to xPos, yPos
  // collection.scroll(xPos);                // scrolls to xPos - maintaining the current pageYOffset
  // collection.scroll(null, yPos);          // scrolls to yPos - maintaining the current pageXOffset
  // collection.scroll({ left:xPos, top:yPos });  // scrolls to xPos, yPos
var $ = window.jQuery;

$.fn.scrollPos = function (x, y) {
  if ( x == null  &&  y == null ) {
    return {
      left:this.scrollLeft(),
      top:this.scrollTop(),
    };
  }
  if ( x  &&  (x.top || x.left) ) {
    y = x.top;
    x = x.left;
  }
  x!=null  &&  this.scrollLeft(x);
  y!=null  &&  this.scrollTop(y);
  return this;
};

// shorthand for $(document).scrollPos()
$.scrollPos = function (x, y) {
  return $(document).scrollPos(x, y);
};

// // DEPRICATED! (Because our $.fn.scroll overwrites the native method of same name. Oops!)
// $.scroll =    $.scrollPos;
// $.fn.scroll = $.fn.scrollPos;
