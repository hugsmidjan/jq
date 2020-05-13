/* jQuery.fn.elsearch v 1.0  -- (c) 2016 Hugsmiðjan ehf.  @preserve */
// ----------------------------------------------------------------------------------
// (c) 2016 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
//   * Sara Arnadottir
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery
//  - eutils  (uses: $.inject() )

(function ($) {

	$.search = {
		defaultConfig: {
			apiKey: 'api-unset',
			url: 'https://search-api.hugsmidjan.is/v1/search',
			pageSize: 10,
			paginator: true,
			minCharacters: 2,
			maxCharacters: 100,
			pages: true, // If false then 'load more' button - If true then 'pagination' at bottom
		},
		i18n: {
			en: {
				minCharactersError: 'Minimum ${minChar} characters in search term',
				noResultsText: 'No results for <strong>${text}</strong>',
				singleResultText: '${hits} result for <strong>${text}</strong>',
				multipleResultsText: '${hits} results for <strong>${text}</strong>',
				loadMoreText: 'Load more',
				pagingTitle: 'Pages: ',
				searchPending: 'Searching...',
			},
			is: {
				minCharactersError: 'Minnst ${minChar} stafir í leitarstreng',
				noResultsText: 'Engar niðurstöður fyrir <strong>${text}</strong>',
				singleResultText: '${hits} niðurstaða fyrir <strong>${text}</strong>',
				multipleResultsText: '${hits} niðurstöður fyrir <strong>${text}</strong>',
				loadMoreText: 'Fleiri niðurstöður',
				pagingTitle: 'Síður: ',
				searchPending: 'Leit í gangi...',
			},
		},
	};


	let $searchform;
	let $results;
	let $hitsTitle;
	let $resultsList;
	let $paging;

	let searchXHR;
	let currentPage = 0;
	let searchText = '';
	let prevSearchText = '';

	const _resetSearch = () => {
		$resultsList.empty();
		$paging.empty().removeClass('searchresults__paging--active');
	};

	const _generatePaging = (hits, cfg) => {
		const pageCount = Math.ceil(hits / cfg.pageSize);

		if (cfg.pages) {
			$paging
				.append(`<span class="searchresults__paging__title">${cfg.pagingTitle}</span>`)
				.addClass('searchresults__paging--active');

			for (let p = 0; p < pageCount; p++) {
				$paging.append(
					`<button class="searchresults__paging__button ${
					p === currentPage ? 'current' : ''
					}" type="button" data-page="${p}" title="Síða: ${p + 1}">${p + 1}</button>`
				);

				if (p === 9) {
					break;
				}
			}
			$hitsTitle.append(` <span>(Síða ${currentPage + 1})</span>`);
		} else {
			$paging.empty().removeClass('searchresults__paging--active');
			if (currentPage < pageCount - 1) {
				$paging
					.append(`<button class="searchresults__loadmore__button button" type="button" data-page="${currentPage + 1}" >${cfg.loadMoreText}</button>`)
					.addClass('searchresults__paging--active');
			}
		}
	};

	const _updateSearchResults = (hits, results, txt, cfg) => {
		if (txt === '') {
			$hitsTitle.html('');
		} else if (txt.length <= cfg.minCharacters) {
			$hitsTitle.html(
				cfg.minCharactersError.replace('${minChar}', cfg.minCharacters)
			);
		} else if (hits === 0) {
			$hitsTitle.html(cfg.noResultsText.replace('${text}', txt));
		} else {
			if (('' + hits).substr(-1) === '1') {
				$hitsTitle.html(
					cfg.singleResultText.replace('${hits}', hits).replace('${text}', txt)
				);
			} else {
				$hitsTitle.html(
					cfg.multipleResultsText.replace('${hits}', hits).replace('${text}', txt)
				);
			}

			for (let i = 0; i < results.length; i++) {
				const result = results[i];
				$resultsList.append(`<li>
						<a class="title" href="${result.url}">${result.title}</a>
						<div class="snippets">${result.snippets ? result.snippets.join(' ... ') : ''}</div>
					</li>`);
			}

			if (hits > cfg.pageSize) {
				_generatePaging(hits, cfg);
			}
		}
	};

	const _fetchdata = (searchStr, pageNo, cfg) => {
		if (searchStr !== prevSearchText || pageNo !== currentPage) {
			if (searchXHR && searchXHR.readyState !== 4) {
				searchXHR.abort();
			}

			if (cfg.pages || searchStr !== prevSearchText) {
				_resetSearch(cfg);
			}

			$searchform.addClass('searchform--searching');
			currentPage = pageNo;

			searchXHR = $.ajax({
				url: cfg.url,
				type: 'GET',
				dataType: 'json',
				crossDomain: true,
				beforeSend: (xhr) => xhr.setRequestHeader('x-api-key', cfg.apiKey),
				data: {
					inflect: true,
					q: searchStr,
					page_size: cfg.pageSize,
					page_no: pageNo,
				},
			})
				.done(function (data) {
					_updateSearchResults(data.hits, data.results, searchStr, cfg);
				})
				.always(function () {
					$searchform.removeClass('searchform--searching');
				});
		}
	};

	const _search = (cfg) => {
		currentPage = 0;
		$hitsTitle.html(cfg.searchPending);

		if (searchText.length > cfg.minCharacters) {
			if (searchText.length > cfg.maxCharacters) {
				searchText = $.trim($.cropText(searchText, cfg.maxCharacters, ' '));
			}
			_fetchdata(searchText, 0, cfg);
		} else {
			_resetSearch();
			_updateSearchResults(0, [], searchText, cfg);
		}
		prevSearchText = searchText;
	};

	const _initialize = ($this) => {
		$searchform = $this;
		$results = $('<div class="searchresults" />').appendTo($searchform);
		$hitsTitle = $('<h3 class="searchresults__title"></h3>').insertBefore($results);
		$resultsList = $('<ul class="searchresults__list"/>').appendTo($results);
		$paging = $('<div class="searchresults__paging"/>').appendTo($results);
	};

	$.fn.search = function (cfg) {
		if (this.length) {
			_initialize($(this));
			let block = $(this);
			let dc = $.search.defaultConfig;
			let _lang = block.closest('[lang]').attr('lang') || '';
			let i18n = $.extend($.search.i18n, cfg.i18n);
			let txts = i18n[_lang.toLowerCase()] || i18n[_lang.substr(0, 2)] || i18n.en;
			cfg = $.extend(dc, txts, cfg);

			// if searchbox has initial search value
			searchText = block.find('.searchform__field').val();

			if (searchText) {
				_search(cfg);
			}

			$('.searchform__field').on('keyup', (e) => {
				searchText = $(e.target)
					.val()
					.trim();
				_search(cfg);
			});

			$paging.on('click', 'button', (e) => {
				const $btn = $(e.target);
				_fetchdata(searchText, parseInt($btn.data('page'), 10), cfg);
			});
		}
	};

})(window.jQuery);