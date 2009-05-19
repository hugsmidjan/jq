// encoding: utf-8
jQuery.fn.roundCorners = function (cfg)
{
  var prefix = cfg.prefix || 'c_ c_',
      opts = jQuery.extend({
              tag : 'span',
              //out: false,  // out:true, inserts the corner elements *outside* the element.
              tr  : prefix+'tr',
              tl  : prefix+'tl',
              br  : prefix+'br',
              bl  : prefix+'bl',
              activeClass : 'roundbox-active'
            }, cfg),
      S = '<'+opts.tag+' class="',
      E = '" />';

  this
      .not(':has(>'+opts.tag+'.'+opts.tr+')')
          .addClass( opts.activeClass )
          [opts.out?'before':'prepend']( S+opts.tr+E  +  S+opts.tl+E )
          [opts.out?'after':'append']( S+opts.bl+E  +  S+opts.br+E );

  return this;
};
