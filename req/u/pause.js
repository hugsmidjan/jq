// Pause an animation for duration milliseconds
window.jQuery.fn.pause = function (duration, callback) {
  return !callback&&this.delay ?
      this.delay(duration):
      this.animate({ smu:0 }, (duration||duration===0)?duration:800, callback);
};
