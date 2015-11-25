// escapes HTML documents (e.g. received via Ajax calls)
// by changing <head>, <body>, <meta/>, <script/>, etc. elements into
// <del tagName="[head|body|meta|script|etc.]" ... elements
// and changing <img/> src="" attributes into data-imgsrc="" attributes.
//
// config options include:
//    srcAttr:    replacement attribute name for data-imgsrc=""
//    keepimgSrc: if true, <img> src escaping is skipped.
//    tagName:    tagName for the escaped tags.
//                    Defaults to 'del'. (<del> is especially nice, both because of its semantic meaning, and also because of its ambigious either-block-or-inline status)
//    tagAttrs:   attribute prefix for escaped (opening) tags.
//                    Defaults to:  'tagName="'.
//    keepscript: if true, <script> escaping is skipped.
//    keepstyle:  if true, <style> escaping is skipped.
//    keepmeta:   if true, <meta>  escaping is skipped.
//    keepfoobar: if true, <foobar>  escaping is skipped.

// escResultHtml
window.jQuery.escResultHtml = function (html, cfg) {
  cfg = cfg || {};
  const tagName = cfg.tagName || 'del';
  const tagAttrs = ' ' + (cfg.tagAttrs || 'tagName="');
  let resultStr = String(html)
      .replace(/<\!DOCTYPE[^>]*>/i, '')
      .replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi, (m, p1, p2, p3) => {
        p2 = p2.toLowerCase();
        return cfg['keep'+p2] ?
                  p1+p2+p3: // leave unchanged
                  p1 + tagName + // rewrite '<body ' to '<del tagName="body" '
                    ((p1==='<') ? tagAttrs+p2+'"' : '')+
                    p3;
      });
  if ( !cfg.keepimgSrc ) {
    // $.imgSuppress
    resultStr = resultStr.replace( /(<img[^>]*? )src=/gi, '$1'+(cfg.srcAttr||'data-srcAttr')+'=' );
  }
  return resultStr;
};
