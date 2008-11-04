// Handle collapse functionality of a navigaion tree.
//
// Todo:
//  * animate the open/close actions
//  * make expand links carry localized text.
//
// version: 2.0.0
//
jQuery.fn.treeCollapse = function (cfg)
{
  var _branch         = cfg.branch         || 'li.branch',
      _toggler        = cfg.toggler        || '> a',

      _rootClass      = cfg.toggler        || 'tree-active',
      _openClass      = cfg.openClass      || 'open',
      _closedClass    = cfg.closedClass    || 'closed',
      _parentClass    = cfg.parentClass    || 'parent',
      _selectClass    = cfg.selectClass    || 'selected',

      _startOpen      = cfg.startOpen      || '.parent, .selected, .open', // things that start opened have these/this class

      _togglerInt     = cfg.togglerInt     || '> a.expand',
      _togglerHtml    = cfg.togglerHtml    || '<a class="expand" href="#"></a>',
      _togglerPlus    = cfg.togglerPlus    || '+',
      _togglerMinus   = cfg.togglerMinus   || '-',
      _injectTogglers = cfg.injectTogglers || 0, // inject new links rather than hook exisitng ones 

      _selBranch;

    return this
        .addClass(_rootClass)
        .delegate('click', _branch+' '+_toggler, function(e, _delegateElm) { // delegated event handling

            if (_selBranch)
            {
              _selBranch
                  .removeClass(_selectClass)
                  .parents(_branch)
                      .removeClass(_parentClass);
            }

            var _parents = $(_delegateElm).parents(_branch);
                _selBranch = _parents.eq(0);
            
            _parents
                .slice(1)
                    .addClass(_parentClass);

            _selBranch
                .addClass(_selectClass)
                .toggleClasses(_openClass, _closedClass)
                .if_(_injectTogglers)
                    .find(_togglerInt)
                        .text(_selBranch.hasClass(_openClass) ? _togglerMinus : _togglerPlus )
                    //.end();
                //.end();

            return false;
          })
        .find(_branch)
            .if_(_injectTogglers)
                .prepend( $(_togglerHtml).text(_togglerPlus) )
            .end()
            .addClass(_closedClass)
            .filter(_startOpen)
                .removeClass(_closedClass)
                .addClass(_openClass)
                .if_(_injectTogglers)
                    .find(_togglerInt)
                        .text(_togglerMinus);
                    //.end();
                //.end();
            //.end();
        //.end();

};




