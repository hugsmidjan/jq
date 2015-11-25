import aquireId from 'qj/aquireId';

const $ = window.jQuery;

$.aquireId = aquireId;
// enforces DOM-ids on all items in the collection and returns the id of the first item.
$.fn.aquireId = function (prefDefaultId) { return this.each(function () { aquireId(this, prefDefaultId); }).attr('id'); };
