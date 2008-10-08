// Handle collapse functionality of a navigaion tree.
//
// Todo:
//  * make expand links carry localized text.
//  * 
//
jQuery.fn.treeCollapse = function (cfg)
{
  cfg = $.extend({
    activeClass: 'collapse-active',
    openClass:   'open',
    closedClass: 'closed',
    branches:    'li.branch',
    branchlink:  '> a',
    startOpen:   '.parent, .selected, .open', // things that start opened have these/this class
    linkTemplate: '<a class="expand" href="#">&#8900;</a>',
    injectLinks:  0 // inject new links rather than hook exisitng ones 
  }, cfg);

  var branches = $(this)
      .click(function(e) {
          var _target = e.target,
              _parent = $(_target).parents(cfg.branches).eq(0);

          if ($.inArray( _target, _parent.find(cfg.branchlink).get() ) > -1)
          {
            var _isOpen = _parent.hasClass(cfg.openClass);
            _parent
                .removeClass(cfg[(_isOpen? 'open' : 'closed')+'Class'])
                .addClass   (cfg[(_isOpen? 'closed' : 'open')+'Class']);
          }

          return false;
        })
      .find(cfg.branches)
          .addClass(cfg.closedClass)
          .filter(cfg.startOpen)
              .removeClass(cfg.closedClass)
              .addClass(cfg.openClass)
              .end();

  if (cfg.injectLinks)
  {
    branches.prepend(cfg.linkTemplate);
  }

  return this;
};




