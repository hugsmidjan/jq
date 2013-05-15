(function($){

  $.fn.prettySelect = function ( cfg ) {

      cfg = $.extend({
              selectClass : 'prettysel',
              collapseSpeed : 200
            }, cfg );

    return this.each(function(){
        var selectbox = $(this),
            selTempl = $('<div class="'+ cfg.selectClass +' '+ cfg.selectClass +'-closed"><strong><a href="#"></a></strong><ul></ul></div>'),
            currentOption,
            isOpen = false,
            hovered = false;

        setTimeout(function() { // damn IE timing bug
          selectbox
              .find('option')
                  .each(function(){
                      selTempl
                          .find('ul')
                              .append('<li><a href="#">'+ $(this).text() +'</a></li>');
                    })
                  .filter(':selected').each(function(){
                      currentOption = $(this);

                        selTempl
                            .find('strong a')
                                .text( currentOption.text() )
                            .end()
                            .find('li')
                                .eq( currentOption.index() )
                                    .addClass('selected');

                    });


          selTempl
              .find('ul')
                  .hide()
              .end()
              .find('strong a')
                  .bind('click', function (e) {
                      selTempl
                          .toggleClass(cfg.selectClass +'-open')
                          .toggleClass(cfg.selectClass +'-closed');

                      selTempl
                          .find('ul')
                              [isOpen ? 'slideUp' : 'slideDown' ](cfg.collapseSpeed);

                      isOpen = !isOpen;

                      e.preventDefault();
                    })
              .end()
              .find('li a')
                  .bind('click', function (e) {
                      var currentOption = $(this);

                      selTempl
                          .find('.selected')
                              .removeClass('selected');

                      currentOption.parent().addClass('selected');

                      selTempl
                          .addClass(cfg.selectClass +'-closed')
                          .removeClass(cfg.selectClass +'-open')
                          .find('strong a')
                              .text( currentOption.text() )
                          .end()
                          .find('ul')
                              .slideUp(cfg.collapseSpeed);

                      selectbox
                          .find('option')
                              .eq( currentOption.parent().index() )
                                  .prop('selected', true)
                                  .trigger('change');

                      isOpen = false;

                      e.preventDefault();
                    })
              .end()
              .bind('mouseenter focusin', function (e) {
                  hovered = true;
                })
              .bind('mouseleave focusout', function (e) {
                  hovered = false;
                  setTimeout(function() {
                    if (!hovered && isOpen) {
                      selTempl
                          .find('strong a')
                              .trigger('click');
                    }
                  }, 300);
                });

          selectbox.after(selTempl).hide();
        }, 50);
      });
  }

})(jQuery);