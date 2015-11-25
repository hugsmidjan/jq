import shuffle from 'qj/shuffle';

const $ = window.jQuery;

$.shuffle = (arr, immutable) => shuffle(arr, !immutable);
// collection should be .detached() for this to work properly (as many jQuery methods will automtaically resort the collection)
// `inline` parameter not supported yet - will update the DOM position of the elements directly.
$.fn.shuffle = function () { return shuffle(this, true); };
