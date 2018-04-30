/* $.fn.yearpicker 1.0  -- (c) 2018 Hugsmiðjan ehf. @preserve */

(function ($) {

  var yearPicker = function (ypContainer, cfg) {
        var ypInput = ypContainer.find(cfg.inpSel).prop('readonly', true);
        var pickList = $('<ul class="yearpicker"></ul>');
        var startYear = parseInt(cfg.startYear, 10);
        var endYear = parseInt(cfg.endYear, 10);
        var isOpen = false;
        var allowRange = cfg.allowRange;
        var ypVal = [];

        // sane limits to ranges
        startYear = startYear < 1990 ?
                      1990 :
                    startYear >= endYear ?
                      endYear-1 :
                      startYear;

        endYear = endYear <= startYear ?
                      startYear+1 :
                  endYear > 2100 ?
                      2100 :
                      endYear;

        for (var i=startYear; i<=endYear; i++) {
          pickList.append('<li data-year="'+ i +'"><button type="button">'+ i +'</button></li>');
        }

        if ( ypInput.val() ) {
          ypVal = ypInput.val().trim().split(' - ');
        }

        var active = {
          start: parseInt(ypVal[0], 10) || 0,
          end: parseInt(ypVal[1], 10) || 0,
        };
        _setRangeClasses(pickList, active, 'active');

        var yptoggler = $('<button class="yptoggler" type="button">'+ cfg.pickText +'</button>')
            .on('click', function (e) {
                e.stopPropagation();
                if ( isOpen ) {
                  isOpen = false;
                  ypContainer.removeClass('yp-open');
                  pickList.detach();
                }
                else {
                  isOpen = true;
                  ypContainer
                      .addClass('yp-open')
                      .append(pickList);
                }
              })
            .appendTo(ypContainer);

        var ypClear = $('<button class="ypclear" type="button">x</button>')
            .on('click', function (e) {
                e.stopPropagation();
                if ( isOpen ) {
                  yptoggler.trigger('click');
                }
                ypClear.detach();
                ypInput.val('');
                active.start = 0;
                active.end = 0;
                _setRangeClasses(pickList, active, 'active');
              });
        if ( ypInput.val() ) {
          ypClear.appendTo(ypContainer);
        }


        pickList
            .on('click', function (e) {
              e.stopPropagation();
              })
            .on('click', 'li', function () {
                var btn = $(this);
                var btnVal = parseInt(btn.data('year'), 10);
                var yearString = '';

                // handle ranges
                if ( !active.start ) {
                  active.start = btnVal;
                }
                else if ( btnVal === active.start ) {
                  if ( allowRange && active.end ) {
                    active.start = active.end;
                    active.end = 0;
                  }
                  else {
                    active.start = 0;
                  }
                }
                else if ( btnVal === active.end ) {
                  active.end = 0;
                }
                else if ( btnVal > active.start ) {
                  if ( allowRange  ) {
                    active.end = btnVal;
                  }
                  else {
                    active.start = btnVal;
                  }
                }
                else if ( btnVal < active.start ) {
                  if ( allowRange && !active.end ) {
                    active.end = active.start;
                  }
                  active.start = btnVal;
                }

                // update actives
                _setRangeClasses(pickList, active, 'active');
                btn.trigger('mouseenter'); // recalc highlight

                // update input value
                if ( active.start ) {
                  yearString = ''+active.start;

                  if ( active.end ) {
                    yearString += ' - ' + active.end;
                  }
                }
                ypInput.val(yearString);

                if ( yearString ) {
                  ypClear.appendTo(ypContainer);
                }
                else {
                  ypClear.detach();
                }
              })
            .on('mouseenter', 'li', function () {
                if ( allowRange ) {
                  var btnVal = parseInt($(this).data('year'), 10);
                  var range = {};

                  // highlight range
                  if ( active.start && btnVal > active.start ) {
                    range.start = active.start;
                    range.end = btnVal;
                  }
                  else if ( active.start && btnVal < active.start ) {
                    range.start = btnVal;
                    range.end = active.start;
                  }
                  else {
                    range.start = active.start;
                  }

                  _setRangeClasses(pickList, range, 'highlight');
                }
              })
            .on('mouseleave', function () {
                if ( allowRange ) {
                  pickList.find('li').removeClass('highlight');
                }
              });

        // close on outside clicks
        $(document).on('click', function () {
            if ( isOpen) {
              yptoggler.trigger('click');
            }
          });

        $(window).on('keyup', function (e) {
            if ( e.which === 27 && isOpen ) {
              yptoggler.trigger('click');
            }
          });

      };

  var _setRangeClasses = function ($list, range, cn) {
        $list.find('li').removeClass(cn);
        var $range = _fetchRange($list, range.start, range.end);
        $range.addClass(cn);
  };

  var _fetchRange = function ($list, start, end) {
          var $collection = start ? $list.find('li[data-year="'+ start +'"]') : $();
          var $endElm = start && end ? $list.find('li[data-year="'+ end +'"]') : null;
          if ( end ) {
            $collection = $collection.nextUntil($endElm).add($collection).add($endElm);
          }
          return $collection;
    };

  $.fn.yearPicker = function (o) {
    var now = new Date();

    return this.each(function () {
      var ypContainer = $(this);
      var defaultCfg = {
            inpSel: '> input:text',
            allowRange: ypContainer.data('range') !== false,
            startYear: ypContainer.data('start') || now.getFullYear() - 10,
            endYear: ypContainer.data('end') || now.getFullYear(),
            pickText: $.lang() === 'is' ? 'Velja ár' : 'Choose year',
          };
      var cfg = $.extend(defaultCfg, o);

      yearPicker( ypContainer, cfg, now );
    });
  };
})(window.jQuery);
