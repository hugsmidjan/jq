// encoding: utf-8
jQuery.fn.roundcorners = function (opts)
{
  opts = jQuery.extend({
              tag : 'span',
              tr  : 'c_tr',
              tl  : 'c_tl',
              br  : 'c_br',
              bl  : 'c_bl',
              activeClass : 'roundbox-active'
            }, opts);
  var S = '<'+opts.tag+' class="',
      E = '" />';

  return this
          .not(':has(>'+opts.tag+'.'+opts.tr+')')
          .addClass( opts.activeClass )
          .prepend( S+opts.tr+E  +  S+opts.tl+E )
          .append( S+opts.bl+E  +  S+opts.br+E );

};
