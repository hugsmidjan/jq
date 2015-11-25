import './jquery-onload';

const $ = window.jQuery;
// provide forwards compatibility with 1.9 for old versions
$.fn.addBack = $.fn.addBack || $.fn.andSelf;
$.fn.andSelf = $.fn.andSelf || $.fn.addBack; // and back
