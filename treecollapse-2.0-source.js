// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.collapsible v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

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
(function($){

$.fn.collapsible = function (cfg)
{
  if (this.length)
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
        doSelect:     0,           // mark the clicked branch as "selected" and it's parent branches as such...

        startOpen:    '.parent, .selected, .open', // Things that match this selector start in their "open" state.
                                                   // A numerical value opens the first N elements.
        togglerInt:   '> a.expand',
        togglerHtml:  '<a class="expand" href="#"></a>',
        togglerPlus:  '+',
        togglerMinus: '-',
        doTogglers:   0 // inject new links rather than hook exisitng ones

/* TODO: */
        clickToggle : true,
        hoverClose  : 0, // set to a positive non-zero intger to specify delay in milliseconds. (`0/null/undefined/false` cancels the effect)
        hoverOpen   : 0, // ditto...
        closeLast   : false, // opening a branch closes the last one (problematic with trees / nested blocks)

        showControls     : false,   // configures the display of 'open all'/'close all' control links.
                                    // options: `before`, `after` and `both`.
        getCtrlSibling   : function (_myBlock, _atBottom) { return _myBlock; }, // great for making sure that controls for <li> elemnts get planted *outside* the <ul> container.
        ctrlBlockTmpl    : '<div class="collapsesections-ctrl %{0}-ctrl"> \n</div>',
        ctrlBtnOpenTmpl  : '<a href="#" class="openall" title="%{0}">%{0}</a>',
        ctrlBtnCloseTmpl : '<a href="#" class="closeall" title="%{0}">%{0}</a>',

        texts : {
          en : {
            openAll : 'Open all',
            closeAll : 'Close all'
          },
          is : {
            openAll : 'Opna alla',
            closeAll : 'Loka öllum'
          }
        }
/* /TODO */


      }, cfg);


    // shortcuts to compress the code...
    var _branch         = cfg.branch,
        _openClass      = cfg.openClass,
        _closedClass    = cfg.closedClass,
        _parentClass    = cfg.parentClass,
        _selectClass    = cfg.selectClass,

        _startOpen      = cfg.startOpen,

        _togglerInt     = cfg.togglerInt,
        _togglerPlus    = cfg.togglerPlus,
        _togglerMinus   = cfg.togglerMinus,
        _doTogglers     = cfg.doTogglers;

    this
        .addClass(cfg.rootClass)
        .each(function(){ // closure to scope for each individual tree
            var _this = $(this);

            if (cfg.doSelect)
            {
              var _selBranch = _this.find(cfg.leaf+'.'+_selectClass).eq(0);
              $(this)
                  .delegate(cfg.leaf, 'click', function(e) { // delegated event handling

                      if (_selBranch.length)
                      {
                        _selBranch
                            .removeClass(_selectClass)
                            .parents(_branch)
                                .removeClass(_parentClass);
                      }
                      _selBranch = $(e.delegate);
                      _selBranch
                          .addClass(_selectClass)
                          .parents(_branch)
                              .addClass(_parentClass);

                    });
            }

            _this
                .delegate(_branch+' '+cfg.toggler, 'click', function(e) { // delegated event handling

                    var _theBranch = $(e.delegate).parents(_branch).eq(0),
                        _wasClosed = (_closedClass && _theBranch.hasClass(_closedClass)) || (_openClass && !_theBranch.hasClass(_openClass)),
                        _fakeEvent = { branch: _theBranch[0] };

                    if ( $(this).trigger('Collapser'+(_wasClosed?'Open':'Close'), _fakeEvent) !== false )
                    {
                      _theBranch
                          .toggleClasses(_openClass, _closedClass)
                          .if_(_doTogglers)
                              .find(_togglerInt)
                                  .text(_wasClosed ? _togglerMinus : _togglerPlus );
                              //.end();
                          //.end();
                      $(this).trigger('Collapser'+(_wasClosed?'Opened':'Closed'), _fakeEvent)
                    }

                    return false;
                  })
                .find(_branch)
                    .if_(_doTogglers)
                        .prepend( $(cfg.togglerHtml).text(_togglerPlus) )
                    .end()
                    .addClass(_closedClass)
                    .filter(typeof _startOpen == 'number' ? function(e,i){ return i<_startOpen; } : _startOpen)
                        .removeClass(_closedClass)
                        .addClass(_openClass)
                        .if_(_doTogglers)
                            .find(_togglerInt)
                                .text(_togglerMinus);
                            //.end();
                        //.end();
                    //.end();
          });

  }
  return this;
};


})(jQuery);



