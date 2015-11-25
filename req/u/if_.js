const $ = window.jQuery;

$.fn.if_ = function (cond) {
  if ($.isFunction(cond)) { cond = cond.call(this); }
  this.if_CondMet = !!cond;
  return this.pushStack(cond ? this : []);
};

$.fn.else_ = function (cond) {
  var _this = this.end();
  return _this.if_CondMet ?
              _this.pushStack([]):
              _this.if_(arguments.length ? cond : 1);
};
