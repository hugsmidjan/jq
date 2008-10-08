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

  var _closedClass = cfg.closedClass,
      _openClass = cfg.openClass,
      _branches = $(this)
          .addClass(cfg.activeClass)
          .click(function(e) {
              var _target = e.target,
                  _parent = $(_target).parents(cfg.branches).eq(0);

              if ($.inArray( _target, _parent.find(cfg.branchlink).get() ) > -1)
              {
                var _isOpen = _parent.hasClass(cfg.openClass);
                _parent
                    .removeClass(_isOpen? _openClass : _closedClass)
                    .addClass   (_isOpen? _closedClass : _openClass);
              }

              return false;
            })
          .find(cfg.branches)
              .addClass(_closedClass)
              .filter(cfg.startOpen)
                  .removeClass(_closedClass)
                  .addClass(_openClass)
                  .end();

  if (cfg.injectLinks)
  {
    _branches.prepend(cfg.linkTemplate);
  }

  return this;
};




