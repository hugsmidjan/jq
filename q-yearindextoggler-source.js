/* $.fn.yearindextoggler 1.0  -- (c) 2016 Hugsmiðjan ehf. @preserve */
// ----------------------------------------------------------------------------------
// jQuery.fn.yearindextoggler v 1.0
// ----------------------------------------------------------------------------------
// (c) 2016 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4
//  - eutils
//  - delayedhightlight

// Usage:
//  - $('.yearindex').yearindexToggler();

(function($){

  var yearIndex = function (yindexElm, cfg) {

          var yearIndexList = yindexElm.find('ul');
          var yearLinks = yearIndexList.find('h3 a');
          var monthLinks = yearIndexList.find('li h3 .current').closest('li').find('p a');

          if (!monthLinks.length) {
            monthLinks = yearIndexList.find('p:first a');
          }

          // typeOfList should equal 'year' or 'month'
          // defaultText is the default text if no current link is found
          var listContainerGenerator = function listContainerGenerator(links, typeOfList, defaultText) {

            // Creating container around filter by 'year' or 'month'
            var listContainer = $('<div class="'+ cfg.bemPrefix +'__wrapper '+ cfg.bemPrefix +'__wrapper--' + typeOfList + '">' + '<button class="'+ cfg.bemPrefix +'__button">' + defaultText + '</button>' + '<ul class="'+ cfg.bemPrefix +'__list"></ul>' + '</div>');
            links.filter('.current')[0];

            // Add links to ul in 'listContainer'
            var currentLink = links.filter('.current')[0];
            if (currentLink) {
              listContainer.find('button').text(
                  (typeOfList === 'month' && cfg.shortMonths && currentLink.textContent.length > 4) ?
                      currentLink.textContent.substring(0, 3) :
                      currentLink.textContent
                );
            }

            links.detach().addClass(cfg.bemPrefix +'__list__item__link').wrap('<li class="'+ cfg.bemPrefix +'__list__item"/>').parent().appendTo(listContainer.find('ul'));

            return listContainer;
          };

          // We have to generate the month list first so the dom exist
          var monthContainer = listContainerGenerator(monthLinks, 'month', cfg.monthText);
          var yearContainer = listContainerGenerator(yearLinks, 'year', cfg.yearText);

          if ( cfg.shortMonths )
          {
            monthContainer.find('a').each( function() {
                var innerText = this.textContent;
                if ( innerText.length > 4 )
                {
                  this.innerHTML = innerText.substring(0, 3) +'<span class="sep">.</span>';
                }
              });

          }

          $('<div class="'+ cfg.bemPrefix +'"/>').append(yearContainer).append(monthContainer).appendTo(yindexElm.empty());

          // Click, focused, blur events
          yindexElm.delayedHighlight({
              delegate: '.'+ cfg.bemPrefix +'__wrapper',
              className: ''+ cfg.bemPrefix +'__wrapper--focused',
              click: true,
              clickToggles: true
            });

      };

  $.fn.yearindexToggler = function(o) {
    var defaultCfg = {
          bemPrefix: 'yearindex',
          shortMonths: false,
          monthText: $.lang() === 'is' ? 'Mánuður' : 'Month',
          yearText: $.lang() === 'is' ? 'Ár' : 'Year'
        },
        cfg = $.extend(defaultCfg, o);

    return this.each(function() {
      yearIndex( $(this), cfg );
    });
  };
})(jQuery);