// Throw away the current jQuery instance,
// if there's a pre-existing jQuery instance
// and use it instead.
const $ = window.jQuery.noConflict(true);
if ( !window.jQuery ) {
  window.jQuery = $;
}