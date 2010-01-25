// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.treeCollapse v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// Handle collapse functionality of a navigaion tree.
//
// Todo:
//  * allow option of having togglers return true
//  * find/write an elegant plugin that handles the event delegation... This is a common pattern!
//      * Check out http://plugins.jquery.com/project/Listen as a starting point
//  * make expand links carry localized text.
//
(function($){

$.fn.treeCollapse = function (cfg)
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

  var _closedClass = cfg.closedClass,
      _openClass = cfg.openClass,
      _togglerPlus = cfg.togglerPlus,
      _togglerMinus = cfg.togglerMinus,
      _togglerHtml = cfg.injectTogglers
                        ? $(cfg.togglerHtml)
                              .text(_togglerPlus)
                        : '',

      _branches = this
          .addClass(cfg.rootClass)
          .find(cfg.branch)
              .addClass(_closedClass)
              .prepend(_togglerHtml)
              .filter(cfg.startOpen)
                  .removeClass(_closedClass)
                  .addClass(_openClass)
                  .find(cfg.togglerInt)
                      .text(_togglerMinus)
                  .end()
              .end()
          .end()
          .click(function(e) { // delegated event handling
              var _target = e.target,
                  _parents = $(_target).parents(cfg.branch),
                  _parent = _parents.eq(0);

              if ($.inArray( _target, _parent.find(cfg.toggler).get() ) > -1)
              {
                var _isOpen = _parent.hasClass(cfg.openClass);
                _parent
                    .removeClass(_isOpen? _openClass : _closedClass)
                    .addClass   (_isOpen? _closedClass : _openClass)
                    .find(cfg.togglerInt)
                        .text(_isOpen? _togglerPlus : cfg.togglerMinus);
                return false;
              }

            });
  
  return this;
};

})(jQuery);

