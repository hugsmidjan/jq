// ----------------------------------------------------------------------------------
// jQuery.fn.treeCollapse v 2.0
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
//    * jQuery 1.3+
//    * eutils (if_)
//
(function($){

    $.fn.treeCollapse = function (cfg) {
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

      var i18n = {
              en: {
                  plusTitle:  'Show sub-items',
                  minusTitle: 'Hide sub-items'
                },
              is: {
                  plusTitle:  'Birta undirlínur',
                  minusTitle: 'Fela undirlínur'
                }
            },
          lang = (this.closest('[lang]').attr('lang')||'en').substr(0,2),
          txt = i18n[lang] || i18n.en;
      i18n = lang = undefined;

      var uniBranched  = !cfg.branch;
      if (uniBranched) { this.aquireId(); }


      // shortcuts to compress the code...
      var _branch         = cfg.branch,
          _openClass      = cfg.openClass,
          _closedClass    = cfg.closedClass,
          _parentClass    = cfg.parentClass,
          _selectClass    = cfg.selectClass,

          _togglerInt     = cfg.togglerInt,
          _togglerPlus       = cfg.togglerPlus,
          _togglerMinus      = cfg.togglerMinus,
          _togglerPlusTitle  = txt.plusTitle,
          _togglerMinusTitle = txt.minusTitle,
          _doTogglers     = cfg.doTogglers;

      this
          .addClass(cfg.rootClass)
          .if_(cfg.doSelect)
              .each(function(){ // closure to scope _selBranch for each individual tree
                  var boxElm = $(this),
                      _selBranch = $(boxElm).find(cfg.leaf+'.'+_selectClass).eq(0);
                  $(boxElm)
                      .bind('click', function(e) { // delegated event handling
                          var leaf = $(e.target).closest(cfg.leaf);
                          if ( leaf[0]  &&  leaf[0] !== _selBranch[0] )
                          {
                            var _thisBranch = _branch || '#'+boxElm.id;

                            if (_selBranch.length)
                            {
                              _selBranch
                                  .removeClass(_selectClass)
                                  .parents(_thisBranch)
                                      .removeClass(_parentClass);
                            }
                            _selBranch = leaf;
                            _selBranch
                                .addClass(_selectClass)
                                .parents(_thisBranch)
                                    .addClass(_parentClass);
                          }
                        });

                })
          .end()
          .each(function(){
              var boxElm = this,
                  _thisBranch = _branch || '#'+boxElm.id;
              $(boxElm)
                  .bind('click', function(e) { // delegated event handling
                      if ( $(e.target).closest(_thisBranch+' '+cfg.toggler)[0] )
                      {
                        var _theBranch = $(e.target).closest(_thisBranch),
                            _doOpen = _theBranch.hasClass(_closedClass);

                        $(this)
                            .trigger('Branch'+(_doOpen?'Open':'Close'), { branch: _theBranch[0] });

                        _theBranch
                            .toggleClasses(_openClass, _closedClass)
                            .if_(_doTogglers)
                                .find(_togglerInt)
                                    .attr( 'title', _doOpen ? _togglerMinusTitle : _togglerPlusTitle )
                                    .text(_doOpen ? _togglerMinus : _togglerPlus );
                                //.end();
                            //.end();

                        return false;
                      }
                    });
            });

      var _branches = uniBranched ? this : this.find(_branch);
      _branches
          .if_(_doTogglers)
              .prepend(
                  $(cfg.togglerHtml)
                      .attr( 'title', _togglerPlusTitle )
                      .text( _togglerPlus )
                )
          .end()
          .addClass(_closedClass)
          .filter(cfg.startOpen)
              .removeClass(_closedClass)
              .addClass(_openClass)
              .if_(_doTogglers)
                  .find(_togglerInt)
                      .attr( 'title', _togglerMinusTitle )
                      .text( _togglerMinus )
                  //.end();
              //.end();
          //.end()
          ;

      return this;
    };

})(jQuery);
