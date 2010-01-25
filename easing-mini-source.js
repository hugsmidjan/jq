// $.easing.ease(In|Out|InOut)  -- GPL/MIT Licence
jQuery.extend(jQuery.easing, {

  easeIn: function (x, t, b, c, d) { // easeInQuad from jquery.easing.js
    return c*(t/=d)*t + b;
  },
  easeOut: function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOut: function (x, t, b, c, d) {
    return ((t/=d/2) < 1) ? 
        c/2*t*t + b:
        -c/2 * ((--t)*(t-2) - 1) + b;
  }

});
jQuery.easing.swing = jQuery.easing.easeIn;
