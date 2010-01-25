// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.expandTable v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson             -- http://mar.anomy.net
//   * Borgar Þorsteinsson       -- http://borgar.undraland.com
//   * Einar Kristján Einarsson  -- einarkristjan (at) gmail.com
// ----------------------------------------------------------------------------------

// usage:
//   $('div.persona').expandTable( options );
// 
(function($){

  // this method will be part of jQuery 1.3.3, so until then...
  // Simply pull elements out of the DOM without killing their events or data...
  // (This is how most jQuery newbies expect .remove() to work.)
  $.fn.detach || ($.fn.detach = function () {
      return this.each(function(){
          var parent = this.parentNode;
          parent  &&  parent.nodeType==1  &&  parent.removeChild(this);
        });
    });


  $.fn.expandTable = function (cfg) {
      cfg = $.extend({
            getUrl:           function(link){ return link.href; },
            //getParams:        null,  // Example: 'justPicPos=pgmain',
            //getSelector:      null,  // Example: 'div.emplyee',
            //getRemove:        null,  // Example: '.boxhead',
            //onLoad:           null,  // Example: function (cfg) { this === Collection; }
            openTrClass:      'subrow-open',
            rowSelector:      'tbody tr',
            togglerSelector:  'a:first',
            //slideUp:          0,
            //slideDown:        0,
            subrowHtml:       '<tr class="subrow"><td colspan="%{colspan}"><a class="closebtn"/><div class="loading"/></td></tr>',
            subrowSelector:   'tr.subrow',
            closebtnSelector: 'a.closebtn',
            loadMsgSelector:  '.loading',
            multiOpen:        1 // Booleanoid (auto-close previous open row)
          },
          cfg || {}
        );

      return this.each(function(){

          var container = $(this),
              lang = container.closest('[lang]').attr('lang').toLowerCase(),
              txt = texts[lang] || texts[lang.substr(0,2)] || texts.en;

          container.find(cfg.rowSelector).each(function(i, tr){
              tr = $(tr);
              tr.find(cfg.togglerSelector)
                  .bind('click', function(e){
                      if (!cfg.multiOpen)
                      {
                        container.find(cfg.subrowSelector +' '+ cfg.closebtnSelector).trigger('click');
                      }

                      var subrow = tr.data(dataKey),
                          isOpen = subrow && subrow.parent().length;
                      if (!subrow)
                      {
                        var colspan = 0;
                        tr.children().each(function(){ colspan += this.colSpan||0; });

                        subrow = $( cfg.subrowHtml.replace("%{colspan}", colspan) );
                        subrow.find(cfg.loadMsgSelector)
                            .html(txt.loadingMsg);
                        subrow.find(cfg.closebtnSelector)
                            .attr({
                                href: '#',
                                title: txt.closeTooltip || txt.closeLabel
                              })
                            .text(txt.closeLabel)
                            .bind('click', function(e){
                                tr.next().slideUp(cfg.slideUp||0, function(){
                                    tr.removeClass(cfg.openTrClass);
                                    $(this).detach();
                                  });
                                return false;
                              });
                        tr.data(dataKey, subrow);

                        $.get(
                            cfg.getUrl(this),
                            cfg.getParams||'',
                            function (result) {
                                var resultDOM = $( result.replace(/<script( |>)[\s\S]*?<\/script>/ig, '') );
                                cfg.getSelector  &&  ( resultDOM = $('<body>').append(resultDOM).find(cfg.getSelector) );
                                cfg.getRemove    &&  resultDOM.find(cfg.getRemove).remove();
                                cfg.onLoad       &&  cfg.onLoad.call(resultDOM, cfg);
                                subrow.find(cfg.loadMsgSelector).replaceWith( resultDOM );
                              }
                          );
                      }

                      if (isOpen)
                      {
                        subrow.find(cfg.closebtnSelector).trigger('click');
                      }
                      else
                      {
                        tr.toggleClass(cfg.openTrClass, !isOpen);
                        subrow.insertAfter(tr).slideDown(cfg.slideDown||0);
                      }
                      return false;
                    });

            });
        });

    };


  var dataKey = 'expandTable.subrow',
      texts = $.fn.expandTable.i18n = {
          is: {
              loadingMsg:   'Sæki gögn...',
              //closeTooltip: 'Loka',
              closeLabel:   'Loka'
            },
          en: {
              loadingMsg:   'Loading...',
              //closeTooltip: 'Close',
              closeLabel:   'Close'
            }
        };


})(jQuery);
