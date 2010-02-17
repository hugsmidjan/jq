// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.roundCorners v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

jQuery.fn.roundCorners = function (cfg)
{
  var prefix = (cfg && cfg.prefix) || 'c_ c_',
      opts = jQuery.extend({
              tag : 'span',
              //out: false,  // Booleanoid: `true` inserts the corner elements *outside* the element.
              tr  : prefix+'tr',
              tl  : prefix+'tl',
              br  : prefix+'br',
              bl  : prefix+'bl'
            }, cfg),
      S = '<'+opts.tag+' class="',
      E = '" />';

  this
      .not(':has(>'+opts.tag+'.'+opts.tr+')')
          [opts.out?'before':'prepend']( S+opts.tr+E  +  S+opts.tl+E )
          [opts.out?'after':'append']( S+opts.bl+E  +  S+opts.br+E );

  return this;
};
