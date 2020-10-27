/* jQuery.fn.elasticSearch v 1.0  -- (c) 2020 Hugsmiðjan ehf.  @preserve */
!function(t){const e={inputSelector:'input[type="text"]',apiKey:"api-unset",url:"https://search-api.hugsmidjan.is/v1/search",pageSize:10,paginator:!0,minCharacters:2,maxCharacters:100,pages:!0,i18n:{en:{minCharactersError:"Minimum ${minChar} characters in search term",noResultsText:"No results for <strong>${text}</strong>",singleResultText:"${hits} result for <strong>${text}</strong>",multipleResultsText:"${hits} results for <strong>${text}</strong>",loadMoreText:"Load more",pagingTitle:"Pages: ",searchPending:"Searching..."},is:{minCharactersError:"Minnst ${minChar} stafir í leitarstreng",noResultsText:"Engar niðurstöður fyrir <strong>${text}</strong>",singleResultText:"${hits} niðurstaða fyrir <strong>${text}</strong>",multipleResultsText:"${hits} niðurstöður fyrir <strong>${text}</strong>",loadMoreText:"Fleiri niðurstöður",pagingTitle:"Síður: ",searchPending:"Leit í gangi..."}}};let s,a,r=t('<div class="searchresults" />'),n=t('<h3 class="searchresults__title"></h3>'),i=t('<ul class="searchresults__list"/>'),l=t('<div class="searchresults__paging"/>'),o=0,p="",c="";const g=()=>{i.empty(),l.empty().removeClass("searchresults__paging--active")},u=(t,e,s,a)=>{if(""===s)n.html("");else if(s.length<=a.minCharacters)n.html(a.minCharactersError.replace("${minChar}",a.minCharacters));else if(0===t)n.html(a.noResultsText.replace("${text}",s));else{"1"===(""+t).substr(-1)?n.html(a.singleResultText.replace("${hits}",t).replace("${text}",s)):n.html(a.multipleResultsText.replace("${hits}",t).replace("${text}",s));for(let t=0;t<e.length;t++){const s=e[t];i.append(`<li>\n\t\t\t\t\t\t<a class="title" href="${s.url}">${s.title}</a>\n\t\t\t\t\t\t<div class="snippets">${s.snippets?s.snippets.join(" ... "):""}</div>\n\t\t\t\t\t</li>`)}t>a.pageSize&&((t,e)=>{const s=Math.ceil(t/e.pageSize);if(e.pages){l.append(`<span class="searchresults__paging__title">${e.pagingTitle}</span>`).addClass("searchresults__paging--active");for(let t=0;t<s&&(l.append(`<button class="searchresults__paging__button ${t===o?"current":""}" type="button" data-page="${t}" title="Síða: ${t+1}">${t+1}</button>`),9!==t);t++);n.append(` <span>(Síða ${o+1})</span>`)}else l.empty().removeClass("searchresults__paging--active"),o<s-1&&l.append(`<button class="searchresults__loadmore__button button" type="button" data-page="${o+1}" >${e.loadMoreText}</button>`).addClass("searchresults__paging--active")})(t,a)}},h=(e,r,n)=>{e===c&&r===o||(a&&4!==a.readyState&&a.abort(),(n.pages||e!==c)&&g(),s.addClass("searchform--searching"),o=r,a=t.ajax({url:n.url,type:"GET",dataType:"json",crossDomain:!0,beforeSend:t=>t.setRequestHeader("x-api-key",n.apiKey),data:{inflect:!0,q:e,page_size:n.pageSize,page_no:r}}).done(function(t){u(t.hits,t.results,e,n)}).always(function(){s.removeClass("searchform--searching")}))},d=e=>{o=0,n.html(e.searchPending),p.length>e.minCharacters?(p.length>e.maxCharacters&&(p=t.trim(t.cropText(p,e.maxCharacters," "))),h(p,0,e)):(g(),u(0,[],p,e)),c=p};t.fn.elasticSearch=function(a,o){if(this.length){const c=(s=t(this)).lang()||"",g=(o=t.extend(e.i18n,o))[c.toLowerCase()]||o[c.substr(0,2)]||o.en;a=t.extend(e,g,a);const u=s.find(a.inputSelector);(e=>{r.appendTo(s),n.insertBefore(r),i.appendTo(r),l.appendTo(r),l.on("click","button",s=>{const a=t(s.target);h(p,parseInt(a.data("page"),10),e)})})(a),(p=u.val())&&d(a),u.on("keyup.search",e=>{p=t(e.target).val().trim(),d(a)})}}}(window.jQuery);