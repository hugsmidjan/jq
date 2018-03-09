/* $.fn.editedSeach 1.0  -- (c) 2016-2017 Hugsmiðjan ehf. @preserve */
// ----------------------------------------------------------------------------------
// jQuery.fn.editedSeach v 1.0
// ----------------------------------------------------------------------------------
// (c) 2016-2017 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.12
//  - eutils 1.2 (debounceFn, imgSuppress)
//  - x/ui-autocomplete 1.11
//  - ga (ga.eventPing)

// Usage:
//  - $('.qsearch form').editedSeach();

(function ($) {

  var makeSearch = function (searchForm, cfg) {
        var searchInput = searchForm.find('input:text');
        var ajaxRequest;
        var gaPing = (window.ga && window.ga.eventPing) ? window.ga.eventPing : function () {};
        var pingSearchResults = $.debounceFn(function (value) {
                gaPing('sitessearch-box', 'ac-result', value);
              }, 800);

        searchInput
            .autocomplete({
                minLength:  cfg.minSearchLength,
                delay:    cfg.searchDelay,
                autoFocus:  cfg.autoFocus,
                appendTo: searchForm,
                source: function (request, callback) {
                    var input = this.element;
                    var form = $( input[0].form );

                    // clean form input data
                    var ajaxData = form.serializeArray();
                    for (var i=0; i<ajaxData.length; i++) {
                      ajaxData[i].value = ajaxData[i].value.trim().replace(/\s+/g, ' ');
                    }
                    ajaxData = $.param(ajaxData);

                    pingSearchResults.cancel();
                    ajaxRequest  &&  ajaxRequest.abort();
                    ajaxRequest = $.ajax({
                        url:     cfg.ajaxSearchUrl,
                        data:    ajaxData +'&'+ $.param(cfg.ajaxParams),
                      })
                      .done(function (html/*, status, xhr*/) {
                          var $dom = $( $.imgSuppress( html ) );
                          var curatedResults = [];
                          var normalResults = [];
                          $dom.find(cfg.editedSearchSelector + ' a')
                              .each(function (i, link) {
                                curatedResults.push({
                                    // value: '',
                                    label: link.innerHTML,
                                    url:   link.href,
                                    pos:   (i + 1),
                                  });
                              });
                          if ( cfg.includeNormalSearch ) {
                            curatedResults.forEach(function (item) {
                              item.className = 'curated-result';
                            });
                            $dom.find(cfg.normalSearchSelector + ' .item > h3 > a')
                                .each(function (i, link) {
                                  normalResults.push({
                                      className: 'regular-result',
                                      // value: '',
                                      label: link.innerHTML,
                                      url:   link.href,
                                      pos:   'regular '+(i + 1),
                                    });
                                });
                          }
                          var numResults = curatedResults.length + normalResults.length;
                          if ( !cfg.includeNormalSearch || cfg.maxResults < numResults ) {
                            normalResults = normalResults.slice(
                                Math.max(0, cfg.maxResults - curatedResults.length)
                              );
                            normalResults.push({
                                label: cfg.searchForText + ' <strong>"' + request.term + '"</strong>',
                                className: 'search',
                                isSearchAction: true,
                              });
                          }
                          if ( cfg.useGaPing ) {
                            var curatedCount = ' | curated:'+ curatedResults.length;
                            var normalCount = cfg.includeNormalSearch ? ' | regular:'+ normalResults.length : '';
                            pingSearchResults( request.term + curatedCount + normalCount );
                          }
                          callback( curatedResults.concat(normalResults) );
                        });
                  },
                //autoFocus:  false, // default: false
                position: { /* default: { my: "left top", at: "left bottom", collision: "none" } */ },
                html:       true,   // default: false
              })
            .on('autocompletefocus', function (e/*, ui*/) {
                e.preventDefault(); // prevent the default behaviour of focus - updating the input.value
              })
            .on('autocompleteselect', function (e, ui) {
                e.preventDefault();
                if ( ui.item.isSearchAction ) {
                  var numItems = $(this).autocomplete('widget').children().length;
                  cfg.useGaPing &&  gaPing('sitessearch-box', 'ac-click-search', this.value +' | curated:'+ numItems);
                  $(this).closest('form').submit();
                }
                else {
                  cfg.useGaPing && gaPing('sitessearch-box', 'ac-click', this.value +' | listPos:'+ ui.item.pos +' | '+ ui.item.url );
                  location.href = ui.item.url;
                }
              });

      };

  $.fn.editedSearch = function (o) {
    var defaultCfg = {
          ajaxSearchUrl: '/search',
          useGaPing: false,
          searchForText: $.lang() === 'is' ? 'Leita að ' : 'Search for ',
          ajaxParams: { justPicPos:'pgmain' },
          editedSearchSelector: '.curatedsearch',
          includeNormalSearch: false,
          normalSearchSelector: '.searchresults',
          maxResults: 100,  // Only caps the list of "normalSearch" results.
          minSearchLength: 1,
          searchDelay: 200,
          autoFocus: false,   // automatically focus the first item...
        };
    var cfg = $.extend(defaultCfg, o);

    // Support old speling-errors
    if ( 'editedSearchSelextor' in o ) {
      /* eslint-disable no-console */
      console.warn('Please rename option `editedSearchSelextor` to `editedSearchSelector`');
      /* eslint-enable no-console */
      cfg.editedSearchSelector = o.editedSearchSelextor;
    }
    $.fn.editedSeach = function () {
      /* eslint-disable no-console */
      console.warn('Please rename `editedSeach()` to `editedSearch()`');
      /* eslint-enable no-console */
      $.fn.editedSearch.apply(this, [].call.slice(arguments));
    };

    return this.each(function () {
      makeSearch( $(this), cfg );
    });
  };
})(window.jQuery);
