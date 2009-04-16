// encoding: utf-8
// Requires:
//  - jQuery 1.2.6 (Runs OK in jQuery 1.3)
//  - eutils  (uses: $.inject() & $.setFocus() ) 

(function($){

  $.fn.imgPopper = function ( cfg ) {
      
    cfg = jQuery.extend({
            fadeInSpeed : 250, // set 1 for almost no animation
            fadeOutSpeed : 250, // set 1 for almost no animation
            easeIn : 'swing',
            easeOut : 'swing'
          }, cfg );
    
    var _navSelectors = 'li.next, li.prev',
        _closeSelectors = 'div.ipopup-container li.close a, div.ipopup-curtain, div.ipopup-container',
        _isOpen = false,
        _ypos = 0,
        _hrefElms = this,
        _langIs = $('html').attr('lang') == 'is',
        _nextText = _langIs ? 'Næsta' : 'Next',
        _prevText = _langIs ? 'Fyrri' : 'Previous',
        _closeText = _langIs ? 'Loka' : 'Close',
        _imageText = _langIs ? 'Mynd' : 'Image',
        _curtainTemp = '<div class="ipopup-curtain"></div>',
        _popupTemp = '<div class="ipopup-container">' +
            '<div class="ipopup-container-wrapper">' +
              '<a class="focustarget" style="position:absolute;left:auto;right:9999px;" href="#">.</a>' +
              '<div class="image">' +
                '<span class="img"><img src="%{img}" alt="%{alt}" /></span>' +
                '<strong class="title">%{title}</strong>' +
                '<div class="desc">%{alt}</div>' +
              '</div>' +
              '<div class="paging">' +
                '<div class="status">' +
                  '<strong>' + _imageText + '</strong> ' +
                  '<span><b>%{num}</b> of %{total}</span>' +
                '</div>' +
                '<ul class="stepper">' +
                  '<li class="next"><a href="#">' + _nextText + '</a></li>' +
                  '<li class="prev"><a href="#">' + _prevText + '</a></li>' +
                  '<li class="close"><a href="#">' + _closeText + '</a></small></li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>';
        

    _hrefElms.bind('click', function (e) {
        var i = _hrefElms.index(this),
            _img = $('img', this)[0],

            _makeHTML = $.inject(_popupTemp, /* html to inject into */ {
                img    : $(this).attr('href'),
                title  : _img.title,
                alt    : _img.alt,
                num    : i+1,
                total  : _hrefElms.length
              }),

            _popup = $(_makeHTML),
            _curtain = $(_curtainTemp);

        $('body')
          .append(_curtain)
          .append(_popup);

        if(!_isOpen) {
          _curtain
              .css('opacity', _curtain.css('opacity'))
              .hide();

          _ypos = $(document).scrollTop() + $(_popup).offset().top;

        }

        _popup.css('top', _ypos).hide();

        if(!_isOpen) {
          _curtain.fadeIn(cfg.fadeInSpeed, function(){ 
              _popup
                  .fadeIn(cfg.fadeInSpeed, cfg.easeIn)
                  .find('div.ipopup-container-wrapper')
                      .bind('click', function(e) {
                          e.stopPropagation();
                        })
                  .setFocus();
            }, cfg.easeIn); // animate in
          _isOpen = true;
        } else {
          _curtain.show();
          _popup.show();
        }

        // next/prev buttons
        $(_navSelectors, _popup)
            .each(function(j){
                var idx = i + (j?-1:1);

                if(idx < 0 || idx >= _hrefElms.length)
                {
                  $(this).addClass('nav-end').find('a').removeAttr('href'); // both ends of the popup nav
                }
                else
                {
                  $(this)
                      .bind('click', function (e) {
                          _curtain.remove();
                          _popup.remove();
                          _hrefElms.eq(idx).trigger('click');
                          return false;
                        });
                }
              });
        
        // close popup
        $(_closeSelectors)
            .bind('click', function (e) {
                _popup.fadeOut(cfg.fadeOutSpeed, function(){
                    _curtain.fadeOut(cfg.fadeOutSpeed, function(){
                        _popup.remove();
                        _curtain.remove();
                        _hrefElms.focus();
                    }, cfg.easeOut);
                  }, cfg.easeOut); // animate out
                _isOpen = false;
                return false;
              });
          
        $(window).keypress( function(e) {
            if( e.keyCode == 27 ) {
                _curtain.trigger('click');
            }
        });
          
        return false;

      });
    return this;
  };
  
})(jQuery);