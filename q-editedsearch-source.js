/* $.fn.editedSeach 1.0  -- (c) 2016 Hugsmiðjan ehf. @preserve */
// ----------------------------------------------------------------------------------
// jQuery.fn.editedSeach v 1.0
// ----------------------------------------------------------------------------------
// (c) 2016 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.12
//  - eutils 1.2 (debounceFn, imgSuppress)
//  - x/ui-autocomplete 1.11
//  - ga (gaPing)

// Usage:
//  - $('.qsearch form').editedSeach();

(function($){

  var makeSearch = function (searchForm, cfg) {
        var searchInput = searchForm.find('input:text');
        var ajaxRequest;
        var isStatic = /^\.\//.test(Req.localPath);
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
                    var ajaxSearchUrl = isStatic ?
                                          'searchresults.html' :
                                          cfg.ajaxSearchUrl;
                    pingSearchResults.cancel();
                    ajaxRequest  &&  ajaxRequest.abort();
                    ajaxRequest = $.ajax({
                        url:     ajaxSearchUrl,
                        data:    form.serialize() +'&'+ $.param(cfg.ajaxParams)
                      })
                      .done(function (html/*, status, xhr*/) {
                          var resultData = [];
                          $( $.imgSuppress( html ) ).find(cfg.editedSearchSelextor + ' a')
                              .each(function (i) {
                                  var link = $(this);
                                  resultData.push({
                                      // value: '',
                                      label: link.html(),
                                      url:   link.attr('href'),
                                      pos:   (i + 1)
                                    });
                                });
                          cfg.useGaPing &&  pingSearchResults( request.term +' | curated:'+ resultData.length );
                          resultData.push({
                              label: cfg.searchForText + ' <strong>"' + request.term + '"</strong>',
                              className: 'search',
                              searchAction: true
                            });
                          callback( resultData );
                        });
                  },
                //autoFocus:  false, // default: false
                position: { /* default: { my: "left top", at: "left bottom", collision: "none" } */ },
                html:       true   // default: false
              })
            .on('autocompletefocus', function (e/*, ui*/) {
                e.preventDefault(); // prevent the default behaviour of focus - updating the input.value
              })
            .on('autocompleteselect', function (e, ui) {
                e.preventDefault();
                if ( ui.item.searchAction )
                {
                  var numItems = $(this).autocomplete('widget').children().length;
                  cfg.useGaPing &&  gaPing('sitessearch-box', 'ac-click-search', this.value +' | curated:'+ numItems);
                  $(this).closest('form').submit();
                }
                else
                {
                  cfg.useGaPing && gaPing('sitessearch-box', 'ac-click', this.value +' | listPos:'+ ui.item.pos +' | '+ ui.item.url );
                  location.href = ui.item.url;
                }
              });

      };

  $.fn.editedSeach = function(o) {
    var defaultCfg = {
          ajaxSearchUrl: '/search',
          useGaPing: false,
          searchForText: $.lang() === 'is' ? 'Leita að ' : 'Search for ',
          ajaxParams: { justPicPos:'pgmain' },
          editedSearchSelextor: '.curatedsearch',
          minSearchLength: 1,
          searchDelay: 200,
          autoFocus: false   // automatically focus the first item...
        };
    var cfg = $.extend(defaultCfg, o);

    return this.each(function() {
      makeSearch( $(this), cfg );
    });
  };
})(jQuery);