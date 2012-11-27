// $.fn.roundCorners 1.0  -- (c) 2008 Hugsmiðjan ehf.
(function(f){f.fn.roundCorners=function(e){var b=(e&&e.prefix)||'c_ c_',a=f.extend({tag:'span',tr:b+'tr',tl:b+'tl',br:b+'br',bl:b+'bl'},e),c='<'+a.tag+' class="',d='" />';this.not(':has(>'+a.tag+'.'+a.tr+')')[a.out?'before':'prepend'](c+a.tr+d+c+a.tl+d)[a.out?'after':'append'](c+a.bl+d+c+a.br+d);return this}})(jQuery);
