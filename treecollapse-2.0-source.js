// Handle collapse functionality of a navigaion tree.
//
// Todo:
//  * animate the open/close actions
//  * make expand links carry localized text.
//
// version: 2.0.0
//
//  Requires:
//    * $.delegate plugin
//    * if_ ... else_ plugin
//
jQuery.fn.treeCollapse = function (cfg)
{
  cfg = $.extend({
      rootClass:    'tree-active',

      branch:       'li.branch',
      toggler:      '> a',
      openClass:    'open',
      closedClass:  'closed',

      leaf:         'li',
      parentClass:  'parent',
      selectClass:  'selected',
      doSelect:     0,

      startOpen:    '.parent, .selected, .open', // things that start opened have these/this class

      togglerInt:   '> a.expand',
      togglerHtml:  '<a class="expand" href="#"></a>',
      togglerPlus:  '+',
      togglerMinus: '-',
      doTogglers:   0 // inject new links rather than hook exisitng ones

    }, cfg);

  var uniBranched  = !cfg.branch;
  if (uniBranched) { this.aquireId(); }


  // shortcuts to compress the code...
  var _branch         = cfg.branch,
      _openClass      = cfg.openClass,
      _closedClass    = cfg.closedClass,
      _parentClass    = cfg.parentClass,
      _selectClass    = cfg.selectClass,

      _togglerInt     = cfg.togglerInt,
      _togglerPlus    = cfg.togglerPlus,
      _togglerMinus   = cfg.togglerMinus,
      _doTogglers     = cfg.doTogglers;

  this
      .addClass(cfg.rootClass)
      .if_(cfg.doSelect)
          .each(function(){ // closure to scope _selBranch for each individual tree
              var _selBranch = $(this).find(cfg.leaf+'.'+_selectClass).eq(0);
              $(this)
                  .delegate(cfg.leaf, 'click', function(e) { // delegated event handling
                  
                      var _thisBranch = _branch || '#'+this.id;

                      if (_selBranch.length)
                      {
                        _selBranch
                            .removeClass(_selectClass)
                            .parents(_thisBranch)
                                .removeClass(_parentClass);
                      }
                      _selBranch = $(e.delegate);
                      _selBranch
                          .addClass(_selectClass)
                          .parents(_thisBranch)
                              .addClass(_parentClass);

                    });

            })
      .end()
      .each(function(){
          var _thisBranch = _branch || '#'+this.id;
          $(this)
              .delegate(_thisBranch+' '+cfg.toggler, 'click', function(e) { // delegated event handling

                  var _theBranch = $(e.delegate).parents(_thisBranch).eq(0),
                      _wasClosed = _theBranch.hasClass(_closedClass);

                  $(this)
                      .trigger('Branch'+(_wasClosed?'Open':'Close'), { branch: _theBranch[0] });

                  _theBranch
                      .toggleClasses(_openClass, _closedClass)
                      .if_(_doTogglers)
                          .find(_togglerInt)
                              .text(_wasClosed ? _togglerMinus : _togglerPlus );
                              
                          //.end();
                      //.end();

                  return false;
                });
        });

  var _branches = uniBranched ? this : this.find(_branch);
  _branches
      .if_(_doTogglers)
          .prepend( $(cfg.togglerHtml).text(_togglerPlus) )
      .end()
      .addClass(_closedClass)
      .filter(cfg.startOpen)
          .removeClass(_closedClass)
          .addClass(_openClass)
          .if_(_doTogglers)
              .find(_togglerInt)
                  .text(_togglerMinus);
              //.end();
          //.end();
      //.end();

  return this;
};




