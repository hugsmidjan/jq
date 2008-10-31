// Handle collapse functionality of a navigaion tree.
//
// Todo:
//  * allow option of having togglers return true
//  * find/write an elegant plugin that handles the event delegation... This is a common pattern!
//      * Check out http://plugins.jquery.com/project/Listen as a starting point
//  * make expand links carry localized text.
//
jQuery.fn.treeCollapse = function (cfg)
{
  cfg = $.extend({
            rootClass:      'tree-active',
            openClass:      'open',
            closedClass:    'closed',
            branch:         'li.branch',
            toggler:        '> a',
            startOpen:      '.parent, .selected, .open', // things that start opened have these/this class
            togglerInt:     '> a.expand',
            togglerHtml:    '<a class="expand" href="#"></a>',
            togglerPlus:    '+',
            togglerMinus:   '-',
            injectTogglers: 0 // inject new links rather than hook exisitng ones 
          }, cfg);

  var _closedClass  = cfg.closedClass,
      _openClass    = cfg.openClass,

      _togglerPlus  = cfg.togglerPlus,
      _togglerMinus = cfg.togglerMinus,

      _branches = this
          .addClass(cfg.rootClass)
          .click( $.delegate(cfg.branch, function(e, delegateElm) {
                if ($.inArray( e.target, delegateElm.find(cfg.toggler) ) > -1)
                {
                  delegateElm
                      .toggleClasses(_openClass, _closedClass)
                      .if_(cfg.injectTogglers)
                          .find(cfg.togglerInt)
                              .text( _parent.hasClass(_openClass) ? _togglerMinus : _togglerPlus )
                          //.end();
                      //.end();
                  return false;
                }
              })
            })
          .find(cfg.branch)
              .if_(cfg.injectTogglers)
                  .prepend( $(cfg.togglerHtml).text(_togglerPlus) )
              .end()
              .addClass(_closedClass)
              .filter(cfg.startOpen)
                  .removeClass(_closedClass)
                  .addClass(_openClass)
                  .if_(cfg.injectTogglers)
                      .find(cfg.togglerInt)
                          .text(_togglerMinus);

  return this;
};




