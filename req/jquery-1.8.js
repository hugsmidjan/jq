import $ from '../jquery-1.8-source';
import jQueryOnload from './_/jquery-onload';
jQueryOnload( $ );
// provide forwards compatibility with 1.9 for old versions
$.fn.addBack = $.fn.addBack || $.fn.andSelf;
