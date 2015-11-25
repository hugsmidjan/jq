// Utility method to turn `$.get`/`$.ajax` xhr.responseText HTML document source
// into a DOM tree, wrapped in a `<div/>` element for easy `.find()`ing
// ...stripping out all nasty `<script>`s and such things.
var $ = window.jQuery;

$.getResultBody = function (responseText, cfg) {
  var myown = $.getResultBody;
  cfg = cfg || {};
  if ( cfg.imgSuppress ) {
    responseText = responseText.replace( /(<img[^>]*? )src=/gi, '$1'+(cfg.srcAttr||'data-srcAttr')+'=' );
  }

  //return $('<body/>').append( // <-- this seems to cause crashes in IE8. (Note: Crash doesn't seem to happen on first run)
  return $('<div/>')
      .append(
        $(($.parseHTML||$)(responseText||''))
            .not( cfg.stripFlat || myown.stripFlat || 'script,title,meta,link,style' )
                .find( cfg.stripDeep || myown.stripDeep || 'script,style' )
                    .remove()
                .end()
      );
};
