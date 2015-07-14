Req(
  'sort_isl',

  function() {
    'use strict';
    var $ = jQuery;

    var $html = $( 'html' );
    var $win =  $( window );
    var $body = $( 'body' );

    var filters = $('.filter');
    var staffTable = $('.deptppl');
    var staffList = staffTable.find('tbody tr').hide();
    staffList.find('td:first-child').addClass('employee');

    //input text filter
    filters.find('#nameinput')
        // .on('focus', function() { this.select(); })
        .on('change keyup', function (e) {
            var val = $(this).val().toLowerCase();
            if (val.length < 3)
            {
              staffList.hide();
              staffTable.removeClass('filter-active');
            }
            else
            {
              staffTable.addClass('filter-active');
              staffList.each(function(i){
                  var text = $(this).text().toLowerCase() || '';
                  if ( text.indexOf(val) >= 0 )
                  {
                    $(this).unhide();
                  }
                  else
                  {
                    $(this).hide();
                  }
                });
            }
          })
        .trigger('keyup');



    // get persona
    staffList
        .on('click', 'td:first-child a', function (e) {
            e.preventDefault();
            var link = $(this),
                row = $(this).closest('tr'),
                dep = row.find('.dept').text();

            if ( row.hasClass('person-open') )
            {
                row.removeClass('person-open').addClass('person-close');
                row.next().find('.persona').slideUp(200, function () {
                    row.next().hide();
                  });

            }
            else if ( row.hasClass('person-close') )
            {
                row.removeClass('person-close').addClass('person-open');
                row.next().unhide().find('.persona').slideDown(200);
            }
            else
            {
                row
                    .addClass('person-open')
                    .after('<tr class="person"><td colspan="5"/></tr>');

                $body.addClass('ajax-wait');
                $.get(
                      link.attr('href'),
                      'justPicPos=lower'
                    )
                  .done(function(data) {
                      data = $.getResultBody( data ).find('.persona').removeClass('box');

                      data.find('.e-mail span').mailtoEnabler();
                      data.find('ul.info').find('.e-mail').after('<li class="department"><b>Deild:</b><span>' + dep + '</span></li>');

                      data.find('.boxbody').append(
                          $('<a href="#" class="close">Loka</a>')
                              .on('click', function (e) {
                                  e.preventDefault();
                                  $(this).closest('.persona').slideUp(200, function () {
                                      $(this).closest('.person').log().hide();
                                    });
                                  $(this).closest('.person').prev().removeClass('person-open').addClass('person-close');
                                })
                        );

                      if ( window.mediaFormat.isSmall )
                      {
                          data.find('.title').prepend(data.find('.imgbox'));
                          data.find('.tel').after(data.find('.e-mail'));
                          data.find('.title').after(data.find('.department'));
                      }
                      else if ( window.mediaFormat.leftSmall )
                      {
                          data.find('.title').after(data.find('.e-mail'));
                          data.find('.e-mail').after(data.find('.tel'));
                          data.find('.tel').after(data.find('.department'));
                      }

                      row.next().find('td').append(
                          data.hide()
                        );
                      data.slideDown(200);
                    })
                  .always(function() {
                      $body.removeClass('ajax-wait');

                    });
            }

      });
  }
);